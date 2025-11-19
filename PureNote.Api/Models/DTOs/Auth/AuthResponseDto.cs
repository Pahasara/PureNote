namespace PureNote.Api.Models.DTOs.Auth;

public record AuthResponseDto
(
    string Token,
    string Email,
    string Username,
    string? FirstName,
    string? LastName,
    DateTime ExpiresAt
);
