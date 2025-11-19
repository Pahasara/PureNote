namespace PureNote.Api.Models.Entities;

public class Tag
{
    public int Id { get; init; }
    public required string Name { get; set; }
    
    public required string UserId { get; init; }
    public User User { get; init; } = null!;
    
    public List<DiaryEntry> DiaryEntries { get; set; } = [];
}
