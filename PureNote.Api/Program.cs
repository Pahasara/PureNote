using PureNote.Api.Endpoints;
using PureNote.Api.Extensions;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services
    .AddDatabase(builder.Configuration)
    .AddIdentityServices()
    .AddJwtAuthentication(builder.Configuration)
    .AddCorsPolicy(builder.Configuration)
    .AddValidation()
    .AddApiDocumentation();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    // Scalar API documnetation UI
    app.MapScalarApiReference(options =>
        options.WithTitle("PureNote API")
            .WithTheme(ScalarTheme.Kepler)
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
    );
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map Endpoints
app.MapAuthEndpoints();

app.Run();
