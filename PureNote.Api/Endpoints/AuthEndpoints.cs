using PureNote.Api.Models.DTOs;
using PureNote.Api.Models.DTOs.Auth;
using PureNote.Api.Models.DTOs.Common;

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
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .ProducesValidationProblem();

        authGroup.MapPost("/login", AuthHandlers.Login)
            .RequireRateLimiting("LoginLimiter")
            .WithName("Login")
            .WithSummary("Login with username/email and password")
            .Produces<AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .ProducesValidationProblem();
    }
}
