using FluentValidation;
using Microsoft.AspNetCore.Identity;
using PureNote.Api.Models.DTOs.Auth;
using PureNote.Api.Models.Entities;
using PureNote.Api.Services;

namespace PureNote.Api.Endpoints;

public static  class AuthHandlers
{
    private const string EndpointUsers = "/api/users";
    
    public static async Task<IResult> Register(
        RegisterDto dto,
        IValidator<RegisterDto> validator,
        UserManager<User> userManager,
        IJwtService jwtService)
    {
        // Validate dto
        var validationResult = await validator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        // Check email
        var userByEmail = await userManager.FindByEmailAsync(dto.Email);
        if (userByEmail is not null)
        {
            return Results.BadRequest(new { message = "Email is already registered." });
        }
        
        // Check username
        var userByUsername = await userManager.FindByNameAsync(dto.Username);
        if (userByUsername is not null)
        {
            return Results.BadRequest(new {message="Username is already taken." });
        }
        
        // Create user
        var user = new User
        {
            UserName = dto.Username,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            CreatedAt = DateTime.UtcNow,
        };

        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return Results.BadRequest(new
            {
                mesage = "User creation failed.",
                errors = result.Errors.Select(e => e.Description)
            });
        }
        
        // Generate token
        var token = jwtService.GenerateToken(user);

        return Results.Created($"{EndpointUsers}/{user.Id}", new AuthResponseDto(
            token,
            user.Email,
            user.UserName,
            user.FirstName,
            user.LastName
        ));
    }

    public static async Task<IResult> Login(
        LoginDto dto,
        IValidator<LoginDto> validator,
        UserManager<User> userManager,
        IJwtService jwtService)
    {
        // Validate dto
        var validationResult = await validator.ValidateAsync(dto);

        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        // Find user
        var user = await userManager.FindByEmailAsync(dto.Identifier) ?? 
                   await userManager.FindByNameAsync(dto.Identifier);

        // Check user & password
        if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password))
            return Results.BadRequest(new { message = "Invalid credentials." });
        
        var token = jwtService.GenerateToken(user);
        
        return Results.Ok(new AuthResponseDto(
            token, 
            user.Email!, 
            user.UserName!, 
            user.FirstName, 
            user.LastName
        ));
    }
}
