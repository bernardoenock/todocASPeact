using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DTOs
{
  public class TaskCreateDto
  {
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;
  }

  public class TaskUpdateDto
  {
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;
  }

  public class TaskReadDto
  {
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
  }
}
