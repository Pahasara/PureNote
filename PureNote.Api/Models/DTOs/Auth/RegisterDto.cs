namespace PureNote.Api.Models.DTOs.Auth;

public record RegisterDto(
    string Email,
    string Username,
    string Password,
    string? FirstName,
    string? LastName
);
