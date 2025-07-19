using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace backend.Controllers;

[Route("[controller]")]
[ApiController]
public class ErrorController : ControllerBase
{
  private readonly ILogger<ErrorController> _logger; //_loggerというフィールドを作成
  public ErrorController(ILogger<ErrorController> logger) //新しいインスタンスを作るためにILogger<ErrorController>をコンストラクタに注入
  {
    _logger = logger;
  }

[Route("/error")] 
public IActionResult HandleError() 
{
    // ミドルウェアで検知したサーバサイドの例外をログに記録するための処理
    var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
    var exception = exceptionHandlerFeature?.Error;

    _logger.LogError(exception, "An unhandled error occurred: {Message}", exception?.Message);

   //
    var problemDetails = new ProblemDetails
    {
        Status = StatusCodes.Status500InternalServerError, 
        Title = "An error occurred while processing your request.",
        Detail = "Please try again later. If the problem persists, contact support.",
        Instance = HttpContext.Request.Path 
    };

    // DB更新時にコンフリクトが検知かつTodoItemsControllerからグローバルにエラーがthrowされた場合にエラーを処理
    if (exception is DbUpdateConcurrencyException)
    {
      problemDetails.Status = StatusCodes.Status409Conflict;
      problemDetails.Title = "Conflict";
      problemDetails.Detail = "The item you tried to update was modified or deleted by another user.";
    }

    return StatusCode(problemDetails.Status.Value, problemDetails);
}

}