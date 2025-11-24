using PureNote.Api.Models.Entities;

namespace PureNote.Api.Services;

public interface ITagService
{
    Task<List<Tag>> GetOrCreateTagsAsync(ICollection<string> tagNames, string userId);
}
