using PureNote.Api.Endpoints;
using PureNote.Api.Extensions;
using PureNote.Api.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services
    // Infrastructure
    .AddDatabase(builder.Configuration)
    .AddIdentityServices()
    .AddJwtAuthentication(builder.Configuration)
    .AddCorsPolicy(builder.Configuration)
    .AddRateLimiters()

    // Application Services
    .AddScoped<ITagService, TagService>()

    // Cross-cutting
    .AddValidation()
    .AddApiDocumentation();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Scalar API documentation UI
    app.MapScalarApiReference(options =>
        options.WithTitle("PureNote API")
            .WithTheme(ScalarTheme.Kepler)
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
    );
}

app.UseHttpsRedirection();

app.UseCors();

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

// Map Endpoints
app.MapAuthEndpoints();
app.MapDiaryEndpoint();

app.Run();
