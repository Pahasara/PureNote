using PureNote.Api.Models.DTOs.Common;
using PureNote.Api.Models.DTOs.Diary;

namespace PureNote.Api.Endpoints;

public static class DiaryEndpoints
{
    public static void MapDiaryEndpoint(this WebApplication app)
    {
        var diaryGroup = app.MapGroup("/api/diaries")
            .WithTags("Diary")
            .RequireAuthorization();

        diaryGroup.MapPost("/", DiaryHandlers.CreateEntry)
            .WithName("CreateEntry")
            .WithSummary("Creates a new diary entry")
            .Produces<EntryResponseDto>(StatusCodes.Status201Created)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .ProducesValidationProblem()
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status500InternalServerError);

        diaryGroup.MapGet("/search", DiaryHandlers.SearchEntries)
            .WithName("SearchEntries")
            .WithSummary("Searches diary entries with filters")
            .Produces<List<EntryListItemDto>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        diaryGroup.MapGet("/", DiaryHandlers.ListEntries)
            .WithName("ListEntries")
            .WithSummary("Get list of all diary entries")
            .Produces<List<EntryListItemDto>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        diaryGroup.MapPost("/{id}/decrypt", DiaryHandlers.GetDecryptedEntry)
            .RequireRateLimiting("DecryptionLimiter")
            .WithName("GetDecryptedEntry")
            .WithSummary("Decrypt and retrieve a specific diary entry")
            .Produces<EntryResponseDto>(StatusCodes.Status200OK)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ErrorResponse>(StatusCodes.Status404NotFound)
            .ProducesValidationProblem()
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status500InternalServerError);

        diaryGroup.MapPut("/{id}", DiaryHandlers.UpdateEntry)
            .WithName("UpdateEntry")
            .WithSummary("Updates an existing diary entry")
            .Produces<EntryResponseDto>(StatusCodes.Status200OK)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces<ErrorResponse>(StatusCodes.Status404NotFound)
            .ProducesValidationProblem()
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status500InternalServerError);

        diaryGroup.MapDelete("/{id}", DiaryHandlers.DeleteEntry)
            .WithName("DeleteEntry")
            .WithSummary("Deletes an existing diary entry")
            .Produces(StatusCodes.Status204NoContent)
            .Produces<ErrorResponse>(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);
    }
}
