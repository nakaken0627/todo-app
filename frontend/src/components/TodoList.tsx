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
          // <TodoItemPaper key={todo.id}>
          //   <Grid
          //     container
          //     alignItems="center"
          //     justifyItems="center"
          //     spacing={1}
          //   >
          //     <Grid size={1}>
          //       <Checkbox
          //         onChange={() => handleChangeStatus(todo.id)}
          //         checked={todo.isComplete}
          //         color="primary"
          //       />
          //     </Grid>
          //     <Grid size={8} sx={{ pl: 1 }}>
          //       <Typography
          //         variant="body1"
          //         sx={{
          //           textDecoration: todo.isComplete ? "line-through" : "none",
          //           color: todo.isComplete ? "text.secondary" : "text.primary",
          //         }}
          //       >
          //         {todo.content}
          //       </Typography>
          //       <Typography
          //         variant="body2"
          //         sx={{
          //           color: "text.secondary",
          //           mt: 0.5,
          //         }}
          //       >
          //         期日：
          //         {todo.dueDate
          //           ? new Date(todo.dueDate).toLocaleDateString()
          //           : "未設定"}{" "}
          //       </Typography>
          //     </Grid>
          //     <Grid size={3} sx={{ textAlign: "right" }}>
          //       <IconButton
          //         onClick={() => handleSetEditTodo(todo.id)}
          //         aria-label="edit"
          //       >
          //         <EditIcon />
          //       </IconButton>
          //       <IconButton
          //         onClick={() => deleteTodo(todo.id)}
          //         aria-label="delete"
          //       >
          //         <DeleteIcon />
          //       </IconButton>
          //     </Grid>
          //   </Grid>
          // </TodoItemPaper>
        ))
      )}
    </List>
  );
};
