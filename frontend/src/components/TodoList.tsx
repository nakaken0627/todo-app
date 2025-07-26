import { List, Paper, Typography } from "@mui/material";
import { TodoItem } from "./TodoItem";
import type { Todo } from "../types/todo";

type Props = {
  displayTodos: Todo[];
  setDisplayTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleSetEditTodo: (id: number) => void;
  handleChangeStatus: (id: number) => void;
};

export const TodoList = ({
  displayTodos,
  setDisplayTodos,
  handleChangeStatus,
  handleSetEditTodo,
}: Props) => {
  return (
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
          <TodoItem
            todo={todo}
            setDisplayTodos={setDisplayTodos}
            handleChangeStatus={handleChangeStatus}
            handleSetEditTodo={handleSetEditTodo}
          />
        ))
      )}
    </List>
  );
};
