namespace PureNote.Api.Models.DTOs.Diary;

public record EntryResponseDto(
    int Id,
    string Title,
    string Content, 
    string? Mood,
    List<string> Tags,
    DateTime CreatedAt,
    DateTime UpdatedAt
);