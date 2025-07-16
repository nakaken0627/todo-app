using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers;

[Route("api/todo-items")]
[ApiController]
public class TodoItemsController : ControllerBase
{
  private readonly ApplicationDbContext _context;

  public TodoItemsController(ApplicationDbContext context)
  {
    _context = context;
  }

  // Todoのデータを条件に応じて取得するエンドポイント（全件/完了/未完）
  // クエリパラメータ isComplete を使用して、ステータスに合わせてフィルタリング可能
  [HttpGet]
  public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems([FromQuery] bool? isComplete = null)
  {
    IQueryable<TodoItem> query = _context.TodoItems;
    if (isComplete.HasValue)
    {
      query = query.Where(t => t.IsComplete == isComplete.Value);
    }
    return await query.ToListAsync();
  }

  // Todoのidを指定して、特定のTodoアイテムを取得するエンドポイント
  // POSTメソッドで新規作成した際に追加したアイテムデータをクライアントに返すために利用可能
  [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodoItem(int id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null) return NotFound();
        return todoItem;
    }


  // Todoアイテムを新規作成するエンドポイント
  // レスポンスを返す際にCreatedAtActionを使用して登録されたデータを返す
  [HttpPost]
  public async Task<ActionResult<TodoItem>> PostTodoItem([FromBody] TodoItem todoItem)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    _context.TodoItems.Add(todoItem);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
  }
    
}