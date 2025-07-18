import { useState } from "react";
import "./App.css";

type Todo = {
  content: string;
  dueDate: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState<Todo>({ content: "", dueDate: "" });

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

  const addTodo = async (todo: Todo) => {
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
    </div>
  );
}

export default App;
