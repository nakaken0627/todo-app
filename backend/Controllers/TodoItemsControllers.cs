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

  // Todoのデータを条件に応じてデータ取得するエンドポイント（全件/完了/未完）
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
    if (!ModelState.IsValid) return BadRequest(ModelState); // モデルのバリデーションチェックを行い、無効な場合はBadRequestを返す
    _context.TodoItems.Add(todoItem);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem); 
  }

  //　Todoアイテムを更新する際にアイテムの存在を確認し、エラーハンドリングを分岐させるために必要
  private bool TodoItemExists(int id) { return _context.TodoItems.Any(e => e.Id == id); }

  // Todoアイテムを更新し、最新版のデータを返すエンドポイント
  // コンフリクト発生時はエラーハンドリンで対応可能
  [HttpPut("{id}")]
  public async Task<IActionResult> PutTodoItem(int id, [FromBody] TodoItem todoItem)
  {
    if (id != todoItem.Id || !ModelState.IsValid) return BadRequest();
    _context.Entry(todoItem).State = EntityState.Modified; // DB更新の際にEntryでtodoItemの追跡対象を捕捉して、そのステータスをModifiedに設定することで更新対象を明示する
    try
    {
      await _context.SaveChangesAsync();
      return Ok(todoItem);
    }
    // DB更新時に競合発生をキャッチ。削除されて存在しないのか、同時に変更されて競合しているのかに分けてエラーハンドリング
    catch (DbUpdateConcurrencyException)
    {
      if (!TodoItemExists(id)) return NotFound();
      else throw;
    }
  }

  // Todoアイテムを削除するエンドポイント
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteTodoItem(int id)
  {
    var todoItem = await _context.TodoItems.FindAsync(id);
    if (todoItem == null) return NotFound();
    _context.TodoItems.Remove(todoItem);
    await _context.SaveChangesAsync();
    return NoContent();
  }
}
