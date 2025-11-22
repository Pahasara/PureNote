using Microsoft.AspNetCore.Identity;

namespace PureNote.Api.Models.Entities;

public sealed class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? EncryptionSalt { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    public ICollection<DiaryEntry> DiaryEntries { get; init; } = [];
}
