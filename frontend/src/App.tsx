import { useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  Paper,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

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
type FilterStatus = "all" | "completed" | "uncompleted";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);

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
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isContinueAdd, setIsContinueAdd] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const handleChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentForm: TodoForm,
    setForm: React.Dispatch<React.SetStateAction<TodoForm>>
  ) => {
    const { name, value } = e.target;
    if (name === "dueDate") {
      if (value === "") {
        setForm({
          ...currentForm,
          [name]: null,
        });
      } else {
        const date = new Date(value);
        setForm({
          ...currentForm,
          [name]: date.toISOString(),
        });
      }
    } else {
      setForm({
        ...currentForm,
        [name]: value,
      });
    }
  };

  const fetchTodos = useCallback(
    async (Status: FilterStatus = filterStatus) => {
      const isCompleteParam =
        Status === "completed"
          ? "?isComplete=true"
          : Status === "uncompleted"
          ? "?isComplete=false"
          : "";

      const response = await fetch(
        `${API_BASE_URL}/api/todo-items${isCompleteParam}`,
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
    },
    [filterStatus]
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (todo: TodoForm) => {
    const response = await fetch(`${API_BASE_URL}/api/todo-items`, {
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
    setIsAddModalOpen(isContinueAdd ? true : false);
  };

  const findTodo = (id: number) => {
    return displayTodos.find((todo) => todo.id === id);
  };

  const handleChangeStatus = async (id: number) => {
    const getTodo = findTodo(id);
    if (!getTodo) return;

    const response = await fetch(`${API_BASE_URL}/api/todo-items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...getTodo,
        isComplete: !getTodo.isComplete,
      }),
    });
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
    setIsEditModalOpen(true);
  };

  const editTodo = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/todo-items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });
    const data = await response.json();
    setDisplayTodos((prev) =>
      prev.map((todo) => (todo.id === id ? data : todo))
    );
  };

  const handleSubmitForEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId === null) return;
    editTodo(editingId);
    setEditingId(null);
    setEditForm({ content: "", dueDate: null });
    setIsEditModalOpen(false);
  };

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

  const handleAddModal = () => setIsAddModalOpen(!isAddModalOpen);
  const handleContinueAdd = () => setIsContinueAdd(!isContinueAdd);

  const handleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

  const TodoItemPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2),
    display: "block",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
  }));

  return (
    <Box>
      <AppBar position="sticky" color="primary" sx={{ height: 56 }}>
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todoアプリ
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Dialog open={isAddModalOpen} onClose={handleAddModal}>
          <DialogTitle sx={{ textAlign: "center", pb: 1, pt: 3 }}>
            <Typography variant="h6" component="div">
              新規登録
            </Typography>
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmitForAdd}>
            <DialogContent sx={{ pt: 1 }}>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isContinueAdd}
                      onChange={handleContinueAdd}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      連続して登録する
                    </Typography>
                  }
                  sx={{ mt: 1, mb: 1 }}
                />
                <DialogActions sx={{ justifyContent: "center", pb: 3, pt: 1 }}>
                  <Button
                    onClick={handleAddModal}
                    variant="outlined"
                    color="primary"
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    登録
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Box>
        </Dialog>

        <Box
          sx={{
            mb: 3,
            // position: "fixed",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(_event, selectedStatus) => {
              if (selectedStatus !== null) {
                fetchTodos(selectedStatus);
              }
              setFilterStatus(selectedStatus);
            }}
            aria-label="todo status filter"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <ToggleButton
              value="all"
              aria-label="all todos"
              sx={{ flex: 1, minWidth: 0, px: 1 }}
            >
              <DoneAllIcon sx={{ mr: 1 }} /> 全て
            </ToggleButton>
            <ToggleButton
              value="completed"
              aria-label="completed todos"
              sx={{ flex: 1, minWidth: 0, px: 1 }}
            >
              <CheckCircleOutlineIcon sx={{ mr: 1 }} /> 完了
            </ToggleButton>
            <ToggleButton
              value="uncompleted"
              aria-label="uncompleted todos"
              sx={{ flex: 1, minWidth: 0, px: 1 }}
            >
              <RadioButtonUncheckedIcon sx={{ mr: 1 }} /> 未完了
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <List
          sx={{
            p: 0,
          }}
        >
          {displayTodos.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center", mt: 2 }}>
              <Typography variant="body1" color="text.secondary">
                該当するtodoがありません
              </Typography>
            </Paper>
          ) : (
            displayTodos.map((todo) => (
              <TodoItemPaper key={todo.id}>
                <Grid
                  container
                  alignItems="center"
                  justifyItems="center"
                  spacing={1}
                >
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
                        textDecoration: todo.isComplete
                          ? "line-through"
                          : "none",
                        color: todo.isComplete
                          ? "text.secondary"
                          : "text.primary",
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
                    <IconButton
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </TodoItemPaper>
            ))
          )}
        </List>

        {editingId !== null && (
          <Dialog open={isEditModalOpen} onClose={handleEditModal}>
            <DialogTitle sx={{ textAlign: "center", pb: 1, pt: 3 }}>
              <Typography variant="h6" component="div">
                編集
              </Typography>
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmitForEdit}>
              <DialogContent sx={{ pt: 1 }}>
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
                  onChange={(e) => handleChangeForm(e, editForm, setEditForm)}
                  fullWidth
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }} //ラベルと初期表示が重なるため、ラベルを常時表示
                />
                <DialogActions sx={{ justifyContent: "center", pb: 3, pt: 1 }}>
                  <Button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({ content: "", dueDate: null });
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    キャンセル
                  </Button>

                  <Button type="submit" variant="contained" color="primary">
                    保存
                  </Button>
                </DialogActions>
              </DialogContent>
            </Box>
          </Dialog>
        )}
      </Container>

      <Button
        onClick={handleAddModal}
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
          borderRadius: "50px",
          px: 3,
          py: 1.5,
        }}
      >
        新規登録
      </Button>
    </Box>
  );
}

export default App;
