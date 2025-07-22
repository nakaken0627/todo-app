import { useEffect, useState } from "react";
import "./App.css";

type Todo = {
  id: number;
  content: string;
  dueDate: string;
  isComplete: boolean;
};
type TodoForm = {
  content: string;
  dueDate: string | null;
};

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
  const [editingId, setEditingId] = useState<number>(0);

  const handleChangeForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentForm: TodoForm,
    setForm: React.Dispatch<React.SetStateAction<TodoForm>>
  ) => {
    const { name, value } = e.target;
    if (name === "dueDate" && value) {
      if (value) {
        const date = new Date(value);
        setForm({
          ...currentForm,
          [name]: date.toISOString(),
        });
      } else {
        setForm({
          ...currentForm,
          [name]: null,
        });
      }
    } else {
      setForm({
        ...currentForm,
        [name]: value,
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
    setDisplayTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
    setDisplayTodos((prev) => [...prev, data]);

    setAddForm({ content: "", dueDate: null });
  };

  const handleSubmitForAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(addForm);
  };

  const findTodo = (id: number) => {
    return displayTodos.find((todo) => todo.id === id);
  };

  const handleChangeStatus = async (id: number) => {
    const getTodo = findTodo(id);
    if (!getTodo) return;

    const response = await fetch(
      `https://localhost:7027/api/todo-items/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...getTodo,
          isComplete: !getTodo.isComplete,
        }),
      }
    );
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
  };

  const editTodo = async (id: number) => {
    const response = await fetch(
      `https://localhost:7027/api/todo-items/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      }
    );
    const data = await response.json();
    setDisplayTodos((prev) =>
      prev.map((todo) => (todo.id === id ? data : todo))
    );
  };

  const handleSubmitForEdit = (
    e: React.FormEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();
    editTodo(id);
    setEditingId(0);
    setEditForm({ content: "", dueDate: null });
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(
      `https://localhost:7027/api/todo-items/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("network error");
    } else {
      setDisplayTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitForAdd}>
        <div>
          <label htmlFor="content">内容：</label>
          <input
            type="text"
            id="content"
            name="content"
            value={addForm.content}
            onChange={(e) => handleChangeForm(e, addForm, setAddForm)}
            required
          />
        </div>
        <div>
          <label htmlFor="deuDate">締切：</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={addForm.dueDate ? addForm.dueDate.slice(0, 10) : ""} //UTCの形式だとvalueに表示ができないため、Dateの部分だけを切り出す
            onChange={(e) => handleChangeForm(e, addForm, setAddForm)}
          />
        </div>
        <div>
          <button type="submit">確定</button>
        </div>
      </form>

      <button onClick={() => fetchTodos()}>全件</button>
      <button onClick={() => fetchTodos(true)}>完了</button>
      <button onClick={() => fetchTodos(false)}>未完了</button>
      <div>
        {displayTodos.length === 0 ? (
          <div>todoが登録されていません</div>
        ) : (
          displayTodos.map((todo) => (
            <div key={todo.id}>
              <input
                type="checkbox"
                onChange={() => handleChangeStatus(todo.id)}
                checked={todo.isComplete}
              />
              <p>内容：{todo.content}</p>
              <p>
                締切：
                {todo.dueDate
                  ? new Date(todo.dueDate).toLocaleDateString()
                  : "未設定"}
              </p>
              <button onClick={() => handleSetEditTodo(todo.id)}>編集</button>
              <button onClick={() => deleteTodo(todo.id)}>削除</button>
            </div>
          ))
        )}
      </div>
      <div>
        <form onSubmit={(e) => handleSubmitForEdit(e, editingId)}>
          <div>
            <label htmlFor="content">内容：</label>
            <input
              type="text"
              id="content"
              name="content"
              value={editForm?.content}
              onChange={(e) => handleChangeForm(e, editForm, setEditForm)}
              required
            />
          </div>
          <div>
            <label htmlFor="deuDate">締切：</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={editForm.dueDate ? editForm.dueDate.slice(0, 10) : ""} //UTCの形式だとvalueに表示ができないため、Dateの部分だけを切り出す
              onChange={(e) => handleChangeForm(e, editForm, setEditForm)}
            />
          </div>
          <div>
            <button type="submit">確定</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
