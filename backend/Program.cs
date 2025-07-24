using Microsoft.EntityFrameworkCore;
using backend.Data; 
using NSwag.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy => policy.WithOrigins("http://localhost:5173") 
                        .AllowAnyHeader()
                        .AllowAnyMethod());

});

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Npgsql (PostgreSQL用プロバイダー) を使用して接続
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApiDocument(options =>
{
    options.Title = "ToDo API";
    options.Version = "v1";
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    // 保留中のマイグレーションがある場合のみ実行
    if (dbContext.Database.GetPendingMigrations().Any())
    {
        try
        {
            Console.WriteLine("Applying database migrations...");
            dbContext.Database.Migrate(); // マイグレーションを実行
            Console.WriteLine("Database migrations applied successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error applying migrations: {ex.Message}");
        }
    }
    else
    {
        Console.WriteLine("No pending database migrations found.");
    }
}

app.UseCors();

// Swagger/OpenAPIなどのミドルウェアを開発環境でのみ有効化
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();    
    app.UseOpenApi();
    app.UseSwaggerUi();
}
else
{
    app.UseExceptionHandler("/error"); // 本番環境では/errorにリダイレクトする
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
