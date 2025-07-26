using Microsoft.EntityFrameworkCore;
using backend.Data;
using NSwag.AspNetCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

//　Azureの環境変数やappsettings.jsonからCORSの設定を取得する
var corsOriginsString = builder.Configuration.GetValue<string>("CorsOrigins");
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
    {
        if (!string.IsNullOrEmpty(corsOriginsString))
        {
            policy.WithOrigins(corsOriginsString.Split(',', StringSplitOptions.RemoveEmptyEntries))
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")); // Npgsql (PostgreSQL用プロバイダー) を使用して接続
});

// Swagger/OpenAPIの設定
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(options =>
{
    options.Title = "ToDo API";
    options.Version = "v1";
});

var app = builder.Build();

//データベースのマイグレーションを自動実行するためのコード
//新規作成時に自動作成し、更新があった場合はその差分を適用する
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        logger.LogInformation("データベースマイグレーションの適用を開始します。");

        if (dbContext.Database.GetPendingMigrations().Any())
        {
            dbContext.Database.Migrate(); // マイグレーションを実行
            logger.LogInformation("データベースマイグレーションが正常に適用されました。");
        }
        else
        {
            logger.LogInformation("保留中のデータベースマイグレーションは見つかりませんでした。");
        }
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "データベースマイグレーションの適用中に致命的なエラーが発生しました。アプリケーションは起動できません。");
    }
}

app.UseRouting();
app.UseCors();

// Swagger/OpenAPIなどのミドルウェアを開発環境でのみ有効化
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();  // 開発環境では例外を詳細に表示する
    app.UseOpenApi(); // Swagger/OpenAPIドキュメントを生成
    app.UseSwaggerUi(); // ブラウザで表示するためのUIを生成する
}
else
{
    app.UseExceptionHandler("/error"); // 本番環境では/errorにリダイレクトする
}

app.UseHttpsRedirection(); //HTTPでリクエストが来た場合、HTTPSにリダイレクトすることでセキュリティを強化
app.MapControllers(); //受信したHTTPリクエストをコントローラーにルーティングする
app.Run();
