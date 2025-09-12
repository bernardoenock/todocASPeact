using api.Data;
using api.Models;
using api.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace api.Services
{
  public class UsersService
  {
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    private const int Pbkdf2Iter = 100_000;
    private const int SaltSize = 16; // bytes
    private const int HashSize = 32; // bytes

    public UsersService(AppDbContext context, IConfiguration config)
    {
      _context = context;
      _config = config;
    }

    // Register a new user
    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
      if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        return false;

      var user = new User
      {
        Username = dto.Username,
        PasswordHash = HashPassword(dto.Password),
        CreatedAt = DateTime.UtcNow
      };

      _context.Users.Add(user);
      await _context.SaveChangesAsync();
      return true;
    }

    // Login user and generate JWT
    public async Task<string?> LoginAsync(LoginDto dto)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
      if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
        return null;

      return GenerateJwtToken(user);
    }

    // --- Helpers ---

    private string HashPassword(string password)
    {
      using var rng = RandomNumberGenerator.Create();
      var salt = new byte[SaltSize];
      rng.GetBytes(salt);

      using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Pbkdf2Iter, HashAlgorithmName.SHA256);
      var hash = pbkdf2.GetBytes(HashSize);

      // store as iterations.salt.hash (base64)
      return $"{Pbkdf2Iter}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    private bool VerifyPassword(string password, string storedHash)
    {
      try
      {
        var parts = storedHash.Split('.');
        if (parts.Length != 3) return false;

        var iterations = int.Parse(parts[0]);
        var salt = Convert.FromBase64String(parts[1]);
        var hash = Convert.FromBase64String(parts[2]);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
        var computed = pbkdf2.GetBytes(hash.Length);

        return CryptographicOperations.FixedTimeEquals(computed, hash);
      }
      catch
      {
        return false;
      }
    }

    private string GenerateJwtToken(User user)
    {
      var claims = new[]
      {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

      var secretConfigValue = _config["Jwt:Key"];
      if (string.IsNullOrWhiteSpace(secretConfigValue))
        throw new InvalidOperationException("JWT Key is not configured.");

      byte[] keyBytes;
      try
      {
        keyBytes = Convert.FromBase64String(secretConfigValue);
      }
      catch
      {
        keyBytes = Encoding.UTF8.GetBytes(secretConfigValue);
      }

      if (keyBytes.Length < 32)
        throw new InvalidOperationException($"The JWT secret is too short: {keyBytes.Length * 8} bits. It must be at least 256 bits (32 bytes).");

      var key = new SymmetricSecurityKey(keyBytes);
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: _config["Jwt:Issuer"],
          audience: _config["Jwt:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddHours(2),
          signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
