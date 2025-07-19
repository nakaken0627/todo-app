using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("ToDoItems")]
    public class TodoItem
        {
            public int Id { get; set; }

            [Required]
            [MaxLength(100)]
            public string? Content { get; set; } = string.Empty;

            public DateTimeOffset? DueDate { get; set; }

            public bool IsComplete { get; set; } = false;

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        }    
  
}
