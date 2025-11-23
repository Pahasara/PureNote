namespace PureNote.Api.Models.Entities;

public class DiaryEntry
{
    public int Id { get; init; }
    public string Title { get; set; } = string.Empty;
    public string EncryptedContent { get; set; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public string? Mood { get; set; }

    public required string UserId { get; init; }
    public User User { get; init; } = null!;
    
    public List<Tag> Tags { get; set; } = [];
}
