using System.ComponentModel.DataAnnotations;

namespace api.Models.DTOs
{
  public class RegisterDto
  {
    [Required]
    [MinLength(3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
  }

  public class LoginDto
  {
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
  }
}
