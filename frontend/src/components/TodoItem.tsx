import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Checkbox,
  Grid,
  IconButton,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { API_BASE_URL } from "../hooks/useTodo";
import type { Todo } from "../types/todo";

type Props = {
  todo: Todo;
  setDisplayTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleChangeStatus: (id: number) => void;
  handleSetEditTodo: (id: number) => void;
};

export const TodoItem = ({
  todo,
  setDisplayTodos,
  handleChangeStatus,
  handleSetEditTodo,
}: Props) => {
  const deleteTodo = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/todo-items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("network error");
    } else {
      setDisplayTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  const TodoItemPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2),
    display: "block",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
  }));

  return (
    <TodoItemPaper key={todo.id}>
      <Grid container alignItems="center" justifyItems="center" spacing={1}>
        <Grid size={1}>
          <Checkbox
            onChange={() => handleChangeStatus(todo.id)}
            checked={todo.isComplete}
            color="primary"
          />
        </Grid>
        <Grid size={8} sx={{ pl: 1 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: todo.isComplete ? "line-through" : "none",
              color: todo.isComplete ? "text.secondary" : "text.primary",
            }}
          >
            {todo.content}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            期日：
            {todo.dueDate
              ? new Date(todo.dueDate).toLocaleDateString()
              : "未設定"}{" "}
          </Typography>
        </Grid>
        <Grid size={3} sx={{ textAlign: "right" }}>
          <IconButton
            onClick={() => handleSetEditTodo(todo.id)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteTodo(todo.id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </TodoItemPaper>
  );
};
