using PureNote.Api.Models.Entities;

namespace PureNote.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}
