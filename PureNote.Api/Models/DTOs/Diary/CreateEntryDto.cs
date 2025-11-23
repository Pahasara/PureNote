using PureNote.Api.Models.Entities;

namespace PureNote.Api.Models.DTOs.Diary;

public record CreateEntryDto
(
    string Title,
    string Content,
    string Password,
    string? Mood,
    ICollection<string>? Tags
);
