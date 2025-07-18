import { useEffect, useState } from "react";
import "./App.css";

type Todo = {
  id: string;
  content: string;
  dueDate: string;
};
type TodoForm = {
  content: string;
  dueDate: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState<TodoForm>({ content: "", dueDate: "" });

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "dueDate" && e.target.value) {
      const date = new Date(e.target.value);
      setForm({
        ...form,
        [e.target.name]: date.toISOString(),
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
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
    setTodos(data);
  };

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
    setTodos((prev) => [...prev, data]);

    setForm({ content: "", dueDate: "" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(form);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">内容：</label>
          <input
            type="text"
            id="content"
            name="content"
            value={form.content}
            onChange={handleForm}
          />
        </div>
        <div>
          <label htmlFor="deuDate">締切：</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={form.dueDate ? form.dueDate.slice(0, 10) : ""} //UTCの形式だとvalueに表示ができないため、Dateの部分だけを切り出す
            onChange={handleForm}
          />
        </div>
        <div>
          <button type="submit">確定</button>
        </div>
      </form>
      <div>
        {todos.length === 0 ? (
          <div>todoが登録されていません</div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id}>
              <p>内容：{todo.content}</p>
              <p>
                締切：
                {todo.dueDate
                  ? new Date(todo.dueDate).toLocaleDateString()
                  : "未設定"}
              </p>
            </div>
          ))
        )}
      </div>
      <div>
        <button onClick={() => fetchTodos(true)}>完了</button>
        <button onClick={() => fetchTodos(false)}>未完了</button>
      </div>
    </div>
  );
}

export default App;
