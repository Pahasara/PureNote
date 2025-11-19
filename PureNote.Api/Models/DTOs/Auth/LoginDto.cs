namespace PureNote.Api.Models.DTOs.Auth;

public record LoginDto(
    string Identifier,
    string Password
);
