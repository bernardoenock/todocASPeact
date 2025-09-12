using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<User>()
          .HasMany(u => u.Tasks)
          .WithOne(t => t.User)
          .HasForeignKey(t => t.UserId)
          .OnDelete(DeleteBehavior.Cascade);

      base.OnModelCreating(modelBuilder);
    }
  }
}
