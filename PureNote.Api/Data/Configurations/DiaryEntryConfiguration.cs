using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureNote.Api.Models.Entities;

namespace PureNote.Api.Data.Configurations;

public class DiaryEntryConfiguration : IEntityTypeConfiguration<DiaryEntry>
{
    public void Configure(EntityTypeBuilder<DiaryEntry> builder)
    {
        // Properties
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Title)
            .HasMaxLength(200)
            .IsRequired();
        
        builder.Property(e => e.EncryptedContent)
            .IsRequired();

        builder.Property(e => e.Mood)
            .HasMaxLength(50);
        
        builder.Property(e => e.UserId)
            .HasMaxLength(128);

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(e => e.UpdatedAt)
            .HasDefaultValueSql("NOW()");
        
        // Relationships
        builder.HasOne(e => e.User)
            .WithMany(u => u.DiaryEntries)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Tags)
            .WithMany(e => e.DiaryEntries);

        // Indexes
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.CreatedAt);
    }
}
