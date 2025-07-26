import { useCallback, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { TodoAppBar } from "./components/TodoAppBar";
import { AddTodoDialog } from "./components/AddTodoDialog";
import type { FilterStatus, Todo, TodoForm } from "./types/todo";
import { API_BASE_URL } from "./hooks/useTodo";
import { EditTodoDialog } from "./components/EditTodoDialog";
import { ToggleTodoButton } from "./components/ToggleTodoButton";
import { TodoList } from "./components/TodoList";
import { AddTodoButton } from "./components/AddTodoButton";

function App() {
  const [displayTodos, setDisplayTodos] = useState<Todo[]>([]);
  const [editForm, setEditForm] = useState<TodoForm>({
    content: "",
    dueDate: null,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

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

  return (
    <Box>
      <TodoAppBar />

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <AddTodoDialog
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          setDisplayTodos={setDisplayTodos}
          setIsAddModalOpen={setIsAddModalOpen}
        />

        <ToggleTodoButton
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          fetchTodos={fetchTodos}
        />

        <TodoList
          displayTodos={displayTodos}
          setDisplayTodos={setDisplayTodos}
          handleSetEditTodo={handleSetEditTodo}
          handleChangeStatus={handleChangeStatus}
        />

        {editingId !== null && (
          <EditTodoDialog
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            setDisplayTodos={setDisplayTodos}
            editingId={editingId}
            setEditingId={setEditingId}
            setIsEditModalOpen={setIsEditModalOpen}
            editForm={editForm}
            setEditForm={setEditForm}
          />
        )}
      </Container>

      <AddTodoButton onClick={() => setIsAddModalOpen(true)} />
    </Box>
  );
}

export default App;
