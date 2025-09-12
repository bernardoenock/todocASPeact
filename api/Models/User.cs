using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
  public class User
  {
    public int Id { get; set; }

    [Required(ErrorMessage = "Username is required")]
    [MaxLength(50, ErrorMessage = "Username can have max 50 characters")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "PasswordHash is required")]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
  }
}
