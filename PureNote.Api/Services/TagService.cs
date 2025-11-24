using Microsoft.EntityFrameworkCore;
using PureNote.Api.Data;
using PureNote.Api.Models.Entities;

namespace PureNote.Api.Services;

public class TagService (AppDbContext dbContext) : ITagService
{
    public async Task<List<Tag>> GetOrCreateTagsAsync(ICollection<string> tagNames, string userId)
    {
        if (tagNames is null || !tagNames.Any())
            return new List<Tag>();

        var tags = new List<Tag>();

        foreach (var tagName in tagNames.Distinct())
        {
            var tag = await dbContext.Tags
                .FirstOrDefaultAsync(t=> t.Name == tagName && t.UserId == userId);

            if (tag is null)
            {
                tag = new Tag
                {
                    Name = tagName,
                    UserId = userId
                };
                dbContext.Tags.Add(tag);
            }
            
            tags.Add(tag);
        }
        
        await  dbContext.SaveChangesAsync();
        return tags;
    }
}
