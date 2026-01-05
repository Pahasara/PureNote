using FluentValidation;
using Microsoft.AspNetCore.Identity;
using PureNote.Api.Models.DTOs.Auth;
using PureNote.Api.Models.DTOs.Common;
using PureNote.Api.Models.Entities;
using PureNote.Api.Services;

namespace PureNote.Api.Endpoints;

public static class AuthHandlers
{
    private const string EndpointUsers = "/api/users";
    
    public static async Task<IResult> Register(
        RegisterDto dto,
        IValidator<RegisterDto> validator,
        UserManager<User> userManager,
        IJwtService jwtService)
    {
        var validationResult = await validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var encryptionSalt = EncryptionService.GenerateUserSalt();
        
        var user = new User
        {
            UserName = dto.Username,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            CreatedAt = DateTime.UtcNow,
            EncryptionSalt = encryptionSalt,
        };

        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var duplicateError = result.Errors.FirstOrDefault(e => 
                e.Code == "DuplicateUserName" || e.Code == "DuplicateEmail");
            
            if (duplicateError != null)
                return Results.BadRequest(new ErrorResponse(duplicateError.Description));
            
            var errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
            return Results.BadRequest(new ErrorResponse($"User creation failed: {errorMessage}"));
        }
        
        var token = jwtService.GenerateToken(user);
        return Results.Created($"{EndpointUsers}/{user.Id}", new AuthResponseDto(
            token,
            user.Email,
            user.UserName,
            user.FirstName,
            user.LastName
        ));
    }

    public static async Task<IResult> Login(
        LoginDto dto,
        IValidator<LoginDto> validator,
        UserManager<User> userManager,
        IJwtService jwtService)
    {
        var validationResult = await validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var user = await userManager.FindByEmailAsync(dto.Identifier) ?? 
                   await userManager.FindByNameAsync(dto.Identifier);

        if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password))
            return Results.BadRequest(new ErrorResponse("Invalid credentials."));
        
        var token = jwtService.GenerateToken(user);
        
        return Results.Ok(new AuthResponseDto(
            token, 
            user.Email!, 
            user.UserName!, 
            user.FirstName, 
            user.LastName
        ));
    }
}
