using System.Security.Claims;
using System.Security.Cryptography;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PureNote.Api.Data;
using PureNote.Api.Models.DTOs.Diary;
using PureNote.Api.Models.Entities;
using PureNote.Api.Services;

namespace PureNote.Api.Endpoints;

public static class DiaryHandlers
{
    private const string EndpointDiary = "/api/diaries";
    
    public static async Task<IResult> CreateEntry(
        AppDbContext dbContext,
        CreateEntryDto dto,
        IValidator<CreateEntryDto> validator,
        ClaimsPrincipal user,
        UserManager<User> userManager,
        IEncryptionService encryptionService,
        ITagService tagService)
    {
        var validationResult = await validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();
        
        var currentUser = await userManager.FindByIdAsync(userId);
        if (currentUser?.EncryptionSalt is null)
        {
            return Results.BadRequest("User encryption not configured");
        }

        try
        {
            var encryptedContent = encryptionService.Encrypt(
                dto.Content,
                dto.Password,
                currentUser.EncryptionSalt
            );

            var tags = await tagService.GetOrCreateTagsAsync(dto.Tags ?? new List<string>(), userId);

            var entry = new DiaryEntry
            {
                UserId = userId,
                Title = dto.Title,
                EncryptedContent = encryptedContent,
                Mood = dto.Mood,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Tags = tags
            };

            dbContext.DiaryEntries.Add(entry);
            await dbContext.SaveChangesAsync();

            var response = new EntryResponseDto(
                Id: entry.Id,
                Title: entry.Title,
                Content: dto.Content,
                Mood: entry.Mood,
                Tags: tags.Select(t => t.Name).ToList(),
                CreatedAt: entry.CreatedAt,
                UpdatedAt: entry.UpdatedAt
            );

            return Results.Created($"{EndpointDiary}/{entry.Id}", response);
        }
        catch (Exception ex)
        {
            return Results.Problem(
                detail: "Failed to create diary entry",
                statusCode: StatusCodes.Status500InternalServerError
            );
        }
    }

    public static async Task<IResult> ListEntries(
        AppDbContext dbContext,
        ClaimsPrincipal user
    )
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var entries = await dbContext.DiaryEntries
            .Include(e => e.Tags)
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EntryListItemDto(
                Id: e.Id,
                Title: e.Title,
                Mood: e.Mood,
                Tags: e.Tags.Select(t => t.Name).ToList(),
                CreatedAt: e.CreatedAt,
                UpdatedAt: e.UpdatedAt
            ))
            .ToListAsync();
        
        return Results.Ok(entries);
    }

    public static async Task<IResult> SearchEntries(
        AppDbContext dbContext,
        ClaimsPrincipal user,
        DateTime? fromDate,
        DateTime? toDate,
        string? mood,
        string? tags,
        string? searchText)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var query = dbContext.DiaryEntries
            .Include(e => e.Tags)
            .Where(e => e.UserId == userId);
        
        if(fromDate.HasValue)
            query = query.Where(e => e.CreatedAt >= fromDate.Value);
        
        if(toDate.HasValue)
            query = query.Where(e => e.CreatedAt <= toDate.Value);
        
        if(!string.IsNullOrEmpty(mood))
            query = query.Where(e => e.Mood == mood);

        if (!string.IsNullOrEmpty(tags))
        {
            IEnumerable<string> tagList = tags.Split(',', StringSplitOptions.RemoveEmptyEntries);
            query = query.Where(e => e.Tags.Any(t => tagList.Contains(t.Name)));
        }
        
        if (!string.IsNullOrEmpty(searchText))
            query = query.Where(e => e.Title.ToLower().Contains(searchText.ToLower()));

        var entries = await query
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EntryListItemDto(
                Id: e.Id,
                Title: e.Title,
                Mood: e.Mood,
                Tags: e.Tags.Select(t => t.Name).ToList(),
                CreatedAt: e.CreatedAt,
                UpdatedAt: e.UpdatedAt
            ))
            .ToListAsync();

        return Results.Ok(entries);
    }
    
    public static async Task<IResult> GetDecryptedEntry(
        int id,
        AppDbContext dbContext,
        DecryptedEntryDto dto,
        IValidator<DecryptedEntryDto> validator,
        ClaimsPrincipal user,
        UserManager<User> userManager,
        IEncryptionService encryptionService
        )
    {
        
        var validationResult = await validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();
        
        var entry = await dbContext.DiaryEntries
            .Include(e => e.Tags)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entry is null)
            return Results.NotFound(new { message = "Diary entry not found" });

        if (entry.UserId != userId)
            return Results.Forbid();

        var currentUser = await userManager.FindByIdAsync(userId);
        if (currentUser?.EncryptionSalt is null)
        {
            return Results.BadRequest(new { message = "User encryption not configured" });
        }

        try
        {
            var decryptedContent = encryptionService.Decrypt(
                cipherText: entry.EncryptedContent,
                password: dto.Password,
                saltBase64: currentUser.EncryptionSalt
            );

            var response = new EntryResponseDto(
                Id: entry.Id,
                Title: entry.Title,
                Content: decryptedContent,
                Mood: entry.Mood,
                Tags: entry.Tags.Select(t => t.Name).ToList(),
                CreatedAt: entry.CreatedAt,
                UpdatedAt: entry.UpdatedAt
            );

            return Results.Ok(response);
        }
        catch (CryptographicException ex)
        {
            return Results.BadRequest(new { message = "Invalid encryption password" });
        }
        catch (Exception ex)
        {
            return Results.Problem(
                detail: "Failed to decrypt diary entry",
                statusCode: StatusCodes.Status500InternalServerError
            );
        }
    }

    public static async Task<IResult> UpdateEntry(
        int id,
        UpdateEntryDto dto,
        IValidator<UpdateEntryDto> validator,
        ClaimsPrincipal user,
        AppDbContext dbContext,
        UserManager<User> userManager,
        IEncryptionService encryptionService,
        ITagService tagService)
    {
        var validationResult = await validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();
        
        var entry = await dbContext.DiaryEntries
            .Include(e => e.Tags)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entry is null)
            return Results.NotFound(new { message = "Diary entry not found" });

        if (entry.UserId != userId)
            return Results.Forbid();
        
        var currentUser = await userManager.FindByIdAsync(userId);
        if (currentUser?.EncryptionSalt is null)
        {
            return Results.BadRequest(new { message = "User encryption not configured" });
        }

        try
        {
            var encryptedContent = encryptionService.Encrypt(
                plainText: dto.Content,
                password: dto.Password,
                saltBase64: currentUser.EncryptionSalt
            );

            var tags = await tagService.GetOrCreateTagsAsync(dto.Tags ?? new List<string>(), userId);
            
            entry.Title = dto.Title;
            entry.EncryptedContent = encryptedContent;
            entry.Mood = dto.Mood;
            entry.Tags = tags;
            entry.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();

            var response = new EntryResponseDto(
                Id: entry.Id,
                Title: entry.Title,
                Content: dto.Content,
                Mood: entry.Mood,
                Tags: tags.Select(t => t.Name).ToList(),
                CreatedAt: entry.CreatedAt,
                UpdatedAt: entry.UpdatedAt
            );

            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.Problem(
                detail: "Failed to update diary entry",
                statusCode: StatusCodes.Status500InternalServerError
            );
        }
    }

    public static async Task<IResult> DeleteEntry(
        int id,
        ClaimsPrincipal user,
        AppDbContext dbContext)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();
        
        var entry = await dbContext.DiaryEntries
            .FirstOrDefaultAsync(e => e.Id == id);

        if (entry is null)
            return Results.NotFound(new { message = "Diary entry not found" });

        if (entry.UserId != userId)
           return Results.Forbid();

        dbContext.DiaryEntries.Remove(entry);
        await dbContext.SaveChangesAsync();
        
        return Results.NoContent();
    }
}
