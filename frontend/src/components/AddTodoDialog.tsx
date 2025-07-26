import { useState } from "react";
import type { Todo, TodoForm } from "../types/todo";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { API_BASE_URL, handleChangeForm } from "../hooks/useTodo";

type Props = {
  open: boolean;
  onClose: () => void;
  setDisplayTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddTodoDialog = ({
  open,
  onClose,
  setDisplayTodos,
  setIsAddModalOpen,
}: Props) => {
  const [addForm, setAddForm] = useState<TodoForm>({
    content: "",
    dueDate: null,
  });
  const [isContinueAdd, setIsContinueAdd] = useState<boolean>(false);

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

  return (
    <Dialog open={open} onClose={onClose}>
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
                  onChange={() => setIsContinueAdd(!isContinueAdd)}
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
                onClick={() => setIsAddModalOpen(false)}
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
  );
};
