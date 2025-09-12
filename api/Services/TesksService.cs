using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using api.Models.DTOs;
using System;

namespace api.Services
{
  public class TasksService
  {
    private readonly AppDbContext _db;

    public TasksService(AppDbContext db)
    {
      _db = db;
    }

    public async Task<List<TaskItem>> GetTasksAsync(int userId, string? category, bool? isCompleted)
    {
      var query = _db.Tasks.AsQueryable().Where(t => t.UserId == userId);

      if (!string.IsNullOrWhiteSpace(category))
        query = query.Where(t => t.Category.ToLower() == category.ToLower());

      if (isCompleted.HasValue)
        query = query.Where(t => t.IsCompleted == isCompleted.Value);

      return await query.ToListAsync();
    }

    public async Task<TaskItem?> GetTaskAsync(int userId, int id)
    {
      return await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskCreateDto dto, int userId)
    {
      var entity = new TaskItem
      {
        Title = dto.Title,
        Description = dto.Description,
        IsCompleted = dto.IsCompleted,
        Category = dto.Category,
        CreatedAt = DateTime.UtcNow,
        UserId = userId
      };

      _db.Tasks.Add(entity);
      await _db.SaveChangesAsync();
      return entity;
    }

    public async Task<bool> UpdateTaskAsync(int userId, int id, TaskUpdateDto dto)
    {
      var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
      if (existing == null) return false;

      existing.Title = dto.Title;
      existing.Description = dto.Description;
      existing.IsCompleted = dto.IsCompleted;
      existing.Category = dto.Category;
      existing.UpdatedAt = DateTime.UtcNow;

      await _db.SaveChangesAsync();
      return true;
    }

    public async Task<bool> DeleteTaskAsync(int userId, int id)
    {
      var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
      if (existing == null) return false;

      _db.Tasks.Remove(existing);
      await _db.SaveChangesAsync();
      return true;
    }
  }
}
