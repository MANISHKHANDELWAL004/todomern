import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
const [editId, setEditId] = useState(null);
const [editText, setEditText] = useState("");


  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: token }
      });
      setTodos(res.data);
    } catch {
      navigate("/");
    }
  };

  const addTodo = async () => {
    if (!text) return;
    await axios.post(
      "http://localhost:5000/api/todos",
      { text },
      { headers: { Authorization: token } }
    );
    setText("");
    fetchTodos();
  };




  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`, {
      headers: { Authorization: token }
    });
    fetchTodos();
  };
  const startEdit = (todo) => {
  setEditId(todo._id);
  setEditText(todo.text);
};

const updateTodo = async (id) => {
  await axios.put(
    `http://localhost:5000/api/todos/${id}`,
    { text: editText },
    { headers: { Authorization: token } }
  );
  setEditId(null);
  setEditText("");
  fetchTodos();
};


  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container">
      <h2>My Todos</h2>

      <div className="todo-box">
        <input value={text} placeholder="Enter todo" onChange={e => setText(e.target.value)} />
        <button onClick={addTodo}>Add</button>
      </div>

      <button className="logout-btn" onClick={logout}>Logout</button>

      <div className="todo-list">
       <div className="todo-list">
  {todos.map((todo) => (
    <div className="todo-item" key={todo._id}>

      {editId === todo._id ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={() => updateTodo(todo._id)}>Save</button>
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          <div>
            <button onClick={() => startEdit(todo)}>✏️</button>
            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo._id)}
            >
              ❌
            </button>
          </div>
        </>
      )}

    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default Todo;
