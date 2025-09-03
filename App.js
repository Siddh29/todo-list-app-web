import React, { useState, useEffect } from "react";

const DARK_MODE_KEY = "todo-dark-mode";
const TASKS_STORAGE_KEY = "todo-tasks";

const FILTERS = {
  ALL: "All",
  COMPLETED: "Completed",
  PENDING: "Pending",
};

export default function ToDoApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [taskText, setTaskText] = useState("");
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const addTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;
    setTasks([...tasks, { text: trimmed, completed: false, id: Date.now() }]);
    setTaskText("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS.COMPLETED) return task.completed;
    if (filter === FILTERS.PENDING) return !task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <div className="toggle-container">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filter-container">
        {Object.values(FILTERS).map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="task-list">
        {filteredTasks.length ? (
          filteredTasks.map(({ id, text, completed }) => (
            <li key={id} className={completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleComplete(id)}
              />
              <span>{text}</span>
              <button onClick={() => deleteTask(id)}>Delete</button>
            </li>
          ))
        ) : (
          <li className="empty">No tasks to show.</li>
        )}
      </ul>
    </div>
  );
}
