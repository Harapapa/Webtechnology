
const taskList = document.getElementById("task-list");
const doneCount = document.getElementById("done-count");
const activeCount = document.getElementById("active-count");
const pomodoroDisplay = document.getElementById("pomodoro-count");
const statsContainer = document.getElementById("subject-stats");

function updateStatsUI(tasks) {
  const completed = tasks.filter(t => t.completed);
  const subjectMap = {};

  completed.forEach(t => {
    subjectMap[t.subject] = (subjectMap[t.subject] || 0) + 1;
  });

  const total = completed.length;
  statsContainer.innerHTML = "";

  for (let subj in subjectMap) {
    const count = subjectMap[subj];
    const percent = ((count / total) * 100).toFixed(1);
    const p = document.createElement("p");
    p.textContent = `${subj}: ${percent}% (${count} db)`;
    statsContainer.appendChild(p);
  }
}

console.log("Added task with subject:", subject);

// Add this function to tasks.js
function syncSubjectsWithPomodoro() {
  // Get all unique subjects from tasks
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const subjects = new Set(tasks.map(task => task.subject).filter(Boolean));
  
  // Get Pomodoro subjects
  const pomodoroSubjects = JSON.parse(localStorage.getItem('pomodoroSubjects')) || {};
  
  // Make sure all task subjects exist in Pomodoro subjects
  subjects.forEach(subject => {
    if (!pomodoroSubjects[subject]) {
      pomodoroSubjects[subject] = 0;  // Initialize count to 0
    }
  });
  
  // Save back to localStorage
  localStorage.setItem('pomodoroSubjects', JSON.stringify(pomodoroSubjects));
  
  console.log("Synchronized subjects between tasks and Pomodoro");
}

function addTask() {
  const input = document.getElementById("new-task");
  const subject = document.getElementById("subject").value.trim();
  const text = input.value.trim();
  if (!text || !subject) return;

  fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: text, subject })
  })
  .then(res => res.json())
  .then(task => {
    addTaskToUI(task);
    input.value = "";
    document.getElementById("subject").value = "";
    loadTasks();
  });
}
function loadTasks() {
  fetch("/api/tasks")
    .then(res => res.json())
    .then(tasks => {
      // Update UI
      taskList.innerHTML = "";
      tasks.forEach(task => addTaskToUI(task));
      
      // Store tasks in localStorage for Pomodoro access
      localStorage.setItem('tasks', JSON.stringify(tasks));
      
      // Update statistics
      updateStats();
      updateStatsUI(tasks);
      
      // Sync with Pomodoro system
      syncSubjectsWithPomodoro();
    })
    .catch(err => {
      console.error("Error loading tasks:", err);
    });
}
// Update the addTaskToUI function for better visual consistency
function addTaskToUI(task) {
  const li = document.createElement("li");
  li.className = "flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-lg transition-all hover:shadow-sm";
  
  // Get subject color from Pomodoro (if available)
  let subjectColor = "bg-gray-200";
  const pomodoroSubjects = JSON.parse(localStorage.getItem('pomodoroSubjects')) || {};
  if (typeof getSubjectColors === 'function' && task.subject) {
    const colors = getSubjectColors();
    if (colors[task.subject]) {
      subjectColor = colors[task.subject].replace('bg-', 'bg-opacity-20 ');
    }
  }
  
  li.innerHTML = `
    <label class="flex items-center gap-2 py-1">
      <input type="checkbox" class="w-5 h-5" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id}, this.checked)">
      <span>${task.title}</span>
      <span class="ml-2 px-2 py-1 text-xs rounded-full ${subjectColor}">${task.subject || "No subject"}</span>
    </label>
    <button onclick="deleteTask(${task.id}, this)" class="text-red-500 hover:text-red-700">✖</button>
  `;
  taskList.appendChild(li);
}

function toggleComplete(id, completed) {
  fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  }).then(() => {
    loadTasks();
  });
}

function deleteTask(id, btn) {
  fetch(`/api/tasks/${id}`, { method: "DELETE" })
    .then(() => {
      btn.closest("li").remove();
      loadTasks();
    });
}

function updateStats() {
  const all = taskList.querySelectorAll("li"); 
  const done = taskList.querySelectorAll("input:checked");
  doneCount.textContent = done.length;
  activeCount.textContent = all.length - done.length;
}