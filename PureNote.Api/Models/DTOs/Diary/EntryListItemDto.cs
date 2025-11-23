namespace PureNote.Api.Models.DTOs.Diary;

public record EntryListItemDto(
    int Id,
    string Title,
    string? Mood,
    List<string> Tags,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
