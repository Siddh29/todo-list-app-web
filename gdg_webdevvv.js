// script.js
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.getElementById("numbers");
  let isEditing = false;

  function toggleEmptyState() {
    emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
  }

  function saveTasksToLocalStorage() {
    const tasks = Array.from(taskList.children).map(li => ({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task.text, task.completed, false));
    updateProgress();
    toggleEmptyState();
  }

  function addTask(text, completed = false, checkCompletion = true) {
    if (!text.trim()) return;

    const li = document.createElement("li");
    li.className = completed ? "completed" : "";

    li.innerHTML = `
      <input type="checkbox" ${completed ? "checked" : ""}>
      <span>${text}</span>
      <div class="task-buttons">
        <button class="edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
        <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector("input[type='checkbox']");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed", checkbox.checked);
      editBtn.disabled = checkbox.checked;
      editBtn.style.opacity = checkbox.checked ? "0.5" : "1";
      editBtn.style.pointerEvents = checkbox.checked ? "none" : "auto";
      updateProgress();
      saveTasksToLocalStorage();
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTasksToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        isEditing = true;
        toggleEmptyState();
        updateProgress(false);
        saveTasksToLocalStorage();
      }
    });

    taskList.appendChild(li);
    toggleEmptyState();
    if (checkCompletion) updateProgress();
    saveTasksToLocalStorage();
  }

  function updateProgress(checkCompletion = true) {
    const totalTasks = taskList.children.length;
    const completedTasks = Array.from(taskList.querySelectorAll("input[type='checkbox']:checked")).length;
    progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : "0%";
    progressNumbers.textContent = `${completedTasks}/${totalTasks}`;
    if (completedTasks === totalTasks && totalTasks > 0 && checkCompletion) {
      if (typeof confetti === "function") confetti();
    }
  }

  addTaskBtn.addEventListener("click", e => {
    e.preventDefault();
    addTask(taskInput.value, false, true);
    taskInput.value = "";
    isEditing = false;
  });

  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTaskBtn.click();
    }
  });

  loadTasksFromLocalStorage();
});
