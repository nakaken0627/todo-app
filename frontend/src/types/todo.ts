export type Todo = {
  id: number;
  content: string;
  dueDate: string | null;
  isComplete: boolean;
};

export type TodoForm = {
  content: string;
  dueDate: string | null;
};

export type FilterStatus = "all" | "completed" | "uncompleted";
