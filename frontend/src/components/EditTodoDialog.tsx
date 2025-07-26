import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { API_BASE_URL, handleChangeForm } from "../hooks/useTodo";
import type { Todo, TodoForm } from "../types/todo";

type Props = {
  open: boolean;
  onClose: () => void;
  setDisplayTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  editingId: number;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editForm: TodoForm;
  setEditForm: React.Dispatch<
    React.SetStateAction<{ content: string; dueDate: string | null }>
  >;
};

export const EditTodoDialog = ({
  open,
  onClose,
  setDisplayTodos,
  editingId,
  setEditingId,
  setIsEditModalOpen,
  editForm,
  setEditForm,
}: Props) => {
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

  return (
    <Dialog open={open} onClose={onClose}>
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
  );
};
