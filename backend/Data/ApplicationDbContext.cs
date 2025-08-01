using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;


public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> TodoItems { get; set; } = null!; // TodoItemsテーブルにアクセスするために必要

    protected override void OnModelCreating(ModelBuilder modelBuilder) //データベースの構造を定義するメソッド
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TodoItem>()
        .Property(t => t.CreatedAt)
        .HasDefaultValueSql("NOW()");
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    // エンティティの状態を追跡し、タイムスタンプを更新するプライベートメソッド
    private void UpdateTimestamps()
    {
        // 変更または追加されたエンティティを追跡
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is TodoItem && 
                        (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            // エンティティがTodoItemであることを確認
            var todoItem = (TodoItem)entityEntry.Entity;

            // 新規追加 (Added) の場合、作成日時と更新日時を設定
            if (entityEntry.State == EntityState.Added)
            {
                todoItem.CreatedAt = DateTime.UtcNow;
                todoItem.UpdatedAt = DateTime.UtcNow;
            }

            // 既存レコードの更新 (Modified) の場合、更新日時のみを設定
            if (entityEntry.State == EntityState.Modified)
            {
                todoItem.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
        
}
