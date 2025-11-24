using PureNote.Api.Models.DTOs.Auth;

namespace PureNote.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var authGroup = app.MapGroup("/api/auth")
            .WithTags("Authentication")
            .AllowAnonymous();

        authGroup.MapPost("/register", AuthHandlers.Register)
            .RequireRateLimiting("RegisterLimiter")
            .WithName("Register")
            .WithSummary("Register new user")
            .Produces<AuthResponseDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem();

        authGroup.MapPost("/login", AuthHandlers.Login)
            .RequireRateLimiting("LoginLimiter")
            .WithName("Login")
            .WithSummary("Login with username/email and password")
            .Produces<AuthResponseDto>()
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesValidationProblem();
    }
}
