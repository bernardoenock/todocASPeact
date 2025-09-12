using api.Data;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// DB Config
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<UsersService>();
builder.Services.AddScoped<TasksService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "Enter the JWT token in the input below. Example: \"Bearer eyJhbGci...\"",
        Reference = new OpenApiReference
        {
            Id = "Bearer",
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

var secret = configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(secret))
    throw new InvalidOperationException("JWT Key is not configured in configuration (Jwt:Key).");

byte[] keyBytes;
try
{
    keyBytes = Convert.FromBase64String(secret);
}
catch
{
    keyBytes = Encoding.UTF8.GetBytes(secret);
}

if (keyBytes.Length < 32)
    throw new InvalidOperationException($"JWT Key is too short ({keyBytes.Length * 8} bits). It must be at least 256 bits (32 bytes).");

var signingKey = new SymmetricSecurityKey(keyBytes);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2),
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    int maxAttempts = 12;
    TimeSpan delay = TimeSpan.FromSeconds(3);

    for (int attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            logger.LogInformation("Attempt {Attempt}: checking DB connectivity...", attempt);

            var canConnect = await db.Database.CanConnectAsync();
            if (!canConnect)
            {
                throw new InvalidOperationException("Database is not reachable (CanConnectAsync returned false).");
            }

            logger.LogInformation("Database reachable. Applying migrations...");
            db.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully.");
            break;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Attempt {Attempt} failed to migrate database.", attempt);
            if (attempt == maxAttempts)
            {
                logger.LogError("Max migration attempts reached, rethrowing exception.");
                throw;
            }

            await Task.Delay(delay);
            delay = delay * 2;
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = "docs";
    });
}

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
