import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Todo = {
  id: number;
  content: string;
  dueDate: string | null;
  isComplete: boolean;
};
type TodoForm = {
  content: string;
  dueDate: string | null;
};

function App() {
  const [displayTodos, setDisplayTodos] = useState<Todo[]>([]);
  const [addForm, setAddForm] = useState<TodoForm>({
    content: "",
    dueDate: null,
  });
  const [editForm, setEditForm] = useState<TodoForm>({
    content: "",
    dueDate: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentForm: TodoForm,
    setForm: React.Dispatch<React.SetStateAction<TodoForm>>
  ) => {
    const { name, value } = e.target;
    if (name === "dueDate" && value) {
      if (value) {
        const date = new Date(value);
        setForm({
          ...currentForm,
          [name]: date.toISOString(),
        });
      } else {
        setForm({
          ...currentForm,
          [name]: null,
        });
      }
    } else {
      setForm({
        ...currentForm,
        [name]: value,
      });
    }
  };

  const fetchTodos = async (isComplete?: boolean) => {
    const isCompleteParam =
      isComplete !== undefined ? `?isComplete=${isComplete}` : "";

    const response = await fetch(
      `https://localhost:7027/api/todo-items${isCompleteParam}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("network error");
    }
    const data: Todo[] = await response.json();
    setDisplayTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo: TodoForm) => {
    const response = await fetch("https://localhost:7027/api/todo-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error("network error");
    }
    const data: Todo = await response.json();
    setDisplayTodos((prev) => [...prev, data]);

    setAddForm({ content: "", dueDate: null });
  };

  const handleSubmitForAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(addForm);
  };

  const findTodo = (id: number) => {
    return displayTodos.find((todo) => todo.id === id);
  };

  const handleChangeStatus = async (id: number) => {
    const getTodo = findTodo(id);
    if (!getTodo) return;

    const response = await fetch(
      `https://localhost:7027/api/todo-items/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...getTodo,
          isComplete: !getTodo.isComplete,
        }),
      }
    );
    const data = await response.json();
    setDisplayTodos((prev) =>
      prev.map((todo) => (todo.id === id ? data : todo))
    );
  };

  const handleSetEditTodo = async (id: number) => {
    const getTodo = findTodo(id);
    if (!getTodo) return;
    setEditingId(id);
    setEditForm(getTodo);
  };

  const editTodo = async (id: number) => {
    const response = await fetch(
      `https://localhost:7027/api/todo-items/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      }
    );
    const data = await response.json();
    setDisplayTodos((prev) =>
      prev.map((todo) => (todo.id === id ? data : todo))
    );
  };

  const handleSubmitForEdit = (
    e: React.FormEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();
    editTodo(id);
    setEditingId(0);
    setEditForm({ content: "", dueDate: null });
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(
      `https://localhost:7027/api/todo-items/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("network error");
    } else {
      setDisplayTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todoアプリ
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmitForAdd}
          sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}
        >
          <Typography variant="h6" gutterBottom>
            新規登録
          </Typography>

          <TextField
            label="内容"
            name="content"
            value={addForm.content}
            onChange={(e) => handleChangeForm(e, addForm, setAddForm)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="期日"
            type="date"
            name="dueDate"
            value={addForm.dueDate ? addForm.dueDate.slice(0, 10) : ""} //UTCの形式だとvalueに表示ができないため、Dateの部分だけを切り出す
            onChange={(e) => handleChangeForm(e, addForm, setAddForm)}
            fullWidth
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }} //ラベルと初期表示が重なるため、ラベルを常時表示
          />

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            確定
          </Button>
        </Box>

        <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={() => fetchTodos()}>
            全件
          </Button>
          <Button variant="outlined" onClick={() => fetchTodos(true)}>
            完了
          </Button>
          <Button variant="outlined" onClick={() => fetchTodos(false)}>
            未完了
          </Button>
        </Box>
        <List
          sx={{
            border: "1px solid #eee",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {displayTodos.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", p: 2 }}>
              todoが登録されていません
            </Typography>
          ) : (
            displayTodos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  borderBottom: "1px solid #eee",
                  "&:last-child": { borderBottom: "none" },
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Checkbox
                  onChange={() => handleChangeStatus(todo.id)}
                  checked={todo.isComplete}
                  color="primary"
                />
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: todo.isComplete
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {todo.content}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      期日：{" "}
                      {todo.dueDate
                        ? new Date(todo.dueDate).toLocaleDateString()
                        : " "}
                    </Typography>
                  }
                />
                <Box sx={{ ml: "auto" }}>
                  <IconButton></IconButton>
                  <IconButton onClick={() => handleSetEditTodo(todo.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          )}
        </List>

        {editingId !== null && (
          <Box
            component="form"
            onSubmit={(e) => handleSubmitForEdit(e, editingId)}
            sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <Typography variant="h6" gutterBottom>
              編集
            </Typography>
            <TextField
              label="内容"
              name="content"
              value={editForm?.content}
              onChange={(e) => handleChangeForm(e, editForm, setEditForm)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="締切"
              type="date"
              name="dueDate"
              value={editForm.dueDate ? editForm.dueDate.slice(0, 10) : ""} //UTCの形式だとvalueに表示ができないため、Dateの部分だけを切り出す
              onChange={(e) => handleChangeForm(e, addForm, setAddForm)}
              fullWidth
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }} //ラベルと初期表示が重なるため、ラベルを常時表示
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 1 }}
            >
              保存
            </Button>
            <Button
              onClick={() => {
                setEditingId(null);
                setEditForm({ content: "", dueDate: null });
              }}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              キャンセル
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
