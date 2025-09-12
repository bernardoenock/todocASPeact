using api.Models.DTOs;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UsersController : ControllerBase
  {
    private readonly UsersService _usersService;

    public UsersController(UsersService usersService)
    {
      _usersService = usersService;
    }

    // POST: api/users/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
      var success = await _usersService.RegisterAsync(dto);
      if (!success)
        return BadRequest(new { message = "Username already exists" });

      return Ok(new { message = "User registered successfully" });
    }

    // POST: api/users/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
      var token = await _usersService.LoginAsync(dto);
      if (token == null)
        return Unauthorized(new { message = "Invalid credentials" });

      return Ok(new { token });
    }
  }
}
