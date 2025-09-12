using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Data;
using System.Security.Claims;
using api.Services;
using api.Models.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class TasksController : ControllerBase
  {
    private readonly TasksService _tasksService;

    public TasksController(TasksService tasksService)
    {
      _tasksService = tasksService;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetTasks(
        [FromQuery] string? category,
        [FromQuery] bool? isCompleted)
    {
      var userId = GetUserId();
      var tasks = await _tasksService.GetTasksAsync(userId, category, isCompleted);

      var dtos = tasks.Select(t => new TaskReadDto
      {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        IsCompleted = t.IsCompleted,
        Category = t.Category,
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt
      }).ToList();

      return Ok(dtos);
    }

    // GET: api/tasks/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskReadDto>> GetTask(int id)
    {
      var userId = GetUserId();
      var task = await _tasksService.GetTaskAsync(userId, id);

      if (task == null) return NotFound();

      var dto = new TaskReadDto
      {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        IsCompleted = task.IsCompleted,
        Category = task.Category,
        CreatedAt = task.CreatedAt,
        UpdatedAt = task.UpdatedAt
      };

      return Ok(dto);
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<TaskReadDto>> CreateTask([FromBody] TaskCreateDto dto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var userId = GetUserId();
      var created = await _tasksService.CreateTaskAsync(dto, userId);

      var readDto = new TaskReadDto
      {
        Id = created.Id,
        Title = created.Title,
        Description = created.Description,
        IsCompleted = created.IsCompleted,
        Category = created.Category,
        CreatedAt = created.CreatedAt,
        UpdatedAt = created.UpdatedAt
      };

      return CreatedAtAction(nameof(GetTask), new { id = readDto.Id }, readDto);
    }

    // PUT: api/tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskUpdateDto dto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var userId = GetUserId();
      var ok = await _tasksService.UpdateTaskAsync(userId, id, dto);

      if (!ok) return NotFound();

      return NoContent();
    }

    // DELETE: api/tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
      var userId = GetUserId();
      var ok = await _tasksService.DeleteTaskAsync(userId, id);

      if (!ok) return NotFound();

      return NoContent();
    }
  }
}
