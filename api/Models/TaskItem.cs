using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
  public class TaskItem
  {
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [MaxLength(100, ErrorMessage = "Title can have max 100 characters")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description can have max 500 characters")]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false;

    [Required(ErrorMessage = "Category is required")]
    [MaxLength(50, ErrorMessage = "Category can have max 50 characters")]
    public string Category { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
  }
}
