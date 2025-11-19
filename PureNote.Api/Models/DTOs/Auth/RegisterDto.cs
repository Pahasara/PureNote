namespace PureNote.Api.Models.DTOs.Auth;

public record RegisterDto(
    string Email,
    string Username,
    string ConfirmPassword,
    string? FirstName,
    string? LastName
);
