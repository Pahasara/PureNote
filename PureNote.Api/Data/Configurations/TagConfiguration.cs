using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureNote.Api.Models.Entities;

namespace PureNote.Api.Data.Configurations;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.HasKey(t => t.Id);
        
        // Properties
        builder.Property(t => t.Name)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(t => t.UserId)
            .IsRequired();

        builder.HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Unique constraint: users can't have dupilcate tag names
        builder.HasIndex(t => new { t.UserId, t.Name })
            .IsUnique();
    }
}
