import type { TodoForm } from "../types/todo";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const handleChangeForm = (
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

export const validateContent = (inputContent: string) => {
  if (!inputContent) {
    return "内容を入力してください";
  }
  if (inputContent.length > 100) {
    return "100文字以内で入力してください";
  }
  return null;
};
