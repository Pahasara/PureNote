using Microsoft.EntityFrameworkCore;
using PureNote.Api.Data;
using PureNote.Api.Models.Entities;

namespace PureNote.Api.Services;

public class TagService (AppDbContext dbContext) : ITagService
{
    public async Task<List<Tag>> GetOrCreateTagsAsync(ICollection<string> tagNames, string userId)
    {
        if (tagNames is null || tagNames.Count == 0)
            return [];
        
        var distinctNames = tagNames
            .Where(t => !string.IsNullOrEmpty(t))
            .Select(t => t.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (distinctNames.Count == 0)
            return [];
        
        var existingTags = await dbContext.Tags
            .Where(t => distinctNames.Contains(t.Name) && t.UserId == userId)
            .ToDictionaryAsync(t => t.Name, StringComparer.OrdinalIgnoreCase);
        
        var result = new List<Tag>(distinctNames.Count);

        foreach (var name in distinctNames)
        {
            if (!existingTags.TryGetValue(name, out var tag))
            {
                tag = new Tag {Name = name,  UserId = userId};
                dbContext.Tags.Add(tag);
            }
            result.Add(tag);
        }
        
        await  dbContext.SaveChangesAsync();
        return result;
    }
}
