namespace PureNote.Api.Models.DTOs.Diary;

public record EntrySearchDto(
    DateTime? FromDate,
    DateTime? ToDate,
    string? Mood,
    List<string>? Tags,
    string? SearchText
);
