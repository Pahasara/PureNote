using PureNote.Api.Models.Entities;

namespace PureNote.Api.Models.DTOs.Diary;

public record CreateEntryDto
(
    string Title,
    string Content,
    string? Mood,
    ICollection<Tag>? Tags
);
