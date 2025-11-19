using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PureNote.Api.Models.Entities;

namespace PureNote.Api.Data.Configurations;

public class UserConfiguration: IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Properties
        builder.Property(u => u.Id)
            .HasMaxLength(128);
            
        builder.Property(u => u.FirstName)
            .HasMaxLength(100);
        
        builder.Property(u => u.LastName)
            .HasMaxLength(100);
        
        builder.Property(u => u.CreatedAt)
            .HasDefaultValueSql("NOW()");
    }
}
