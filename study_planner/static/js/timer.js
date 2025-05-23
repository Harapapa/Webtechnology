/**
 * Timer script for a Pomodoro study planner application.
 * Handles timer functionality, subject management, and statistics display.
 */

// Global variables
/**
 * @type {number | null} timer - Interval ID for the timer.
 * @type {number} seconds - Remaining seconds for the current timer.
 * @type {number} totalSeconds - Total seconds for the timer.
 * @type {Object} subjectData - Object storing Pomodoro counts for each subject.
 * @type {string} currentSubject - Currently selected subject.
 * @type {number} pomodoroCount - Total number of completed Pomodoro cycles.
 */

// Event listener for DOMContentLoaded
/**
 * Initializes the timer script, sets up event listeners, and restores previous state.
 * - Populates the subject dropdown.
 * - Restores previously selected subject.
 * - Updates the timer display and Pomodoro statistics.
 */

// Function: updatePomodoroStats
/**
 * Updates the Pomodoro statistics display.
 * - Displays a message if no Pomodoro cycles are completed.
 * - Sorts subjects by Pomodoro count and displays percentages.
 * - Creates badges for each subject with a color-coded percentage.
 */

// Function: populateSubjectDropdown
/**
 * Populates the subject dropdown with unique subjects from tasks and existing Pomodoro data.
 * - Clears existing options in the dropdown.
 * - Adds subjects from tasks stored in localStorage.
 * - Adds subjects from existing Pomodoro statistics.
 * - Sorts subjects alphabetically and appends them to the dropdown.
 */

// Function: updateTimerDisplay
/**
 * Updates the timer display on the page.
 * - Formats the remaining time as MM:SS.
 * - Updates the progress circle to reflect the remaining time.
 */

// Function: updateProgressCircle
/**
 * Updates the progress circle's stroke offset to visually represent the timer's progress.
 * @param {number} percentage - The percentage of time remaining (0 to 1).
 */

// Function: startTimer
/**
 * Starts the Pomodoro timer.
 * - Validates that a subject is selected before starting.
 * - Decrements the timer every second and updates the display.
 * - Handles the end of the timer by updating statistics and prompting for a break.
 * - Adds a visual marker for the completed Pomodoro cycle.
 */

// Function: getSubjectColors
/**
 * Generates a consistent color mapping for subjects.
 * @returns {Object} - An object mapping subjects to color classes.
 */

// Function: addPomodoroMarker
/**
 * Adds a visual marker for a completed Pomodoro cycle.
 * - Assigns a color based on the subject.
 * - Animates the marker's entrance.
 * @param {string} subject - The subject associated with the completed Pomodoro.
 */

// Function: pauseTimer
/**
 * Pauses the Pomodoro timer by clearing the interval.
 */

// Function: resetTimer
/**
 * Resets the Pomodoro timer to its initial state.
 * - Pauses the timer.
 * - Resets the remaining time to the default value.
 * - Updates the timer display.
 */
let timer;
let seconds = 1500;
let totalSeconds = 1500;
let subjectData = JSON.parse(localStorage.getItem('pomodoroSubjects')) || {};
let currentSubject = localStorage.getItem('currentSubject') || '';
let pomodoroCount = parseInt(localStorage.getItem('pomodoroCount')) || 0;
// Add debug logging
console.log("Timer script initialized");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, looking for elements");
  
  const countdownEl = document.getElementById("countdown");
  const pomodoroDisplay = document.getElementById("pomodoro-count");
  const subjectSelect = document.getElementById("pomodoro-subject");

  console.log("countdown element:", countdownEl);
  console.log("pomodoro-count element:", pomodoroDisplay);
  console.log("pomodoro-subject element:", subjectSelect);

  // Populate the subject dropdown from tasks
  populateSubjectDropdown();

    // Restore previously selected subject if available
    if (subjectSelect && currentSubject) {
      console.log("Attempting to restore subject selection:", currentSubject);
      // Wait a moment to ensure dropdown is populated
      setTimeout(() => {
        subjectSelect.value = currentSubject;
        console.log("Restored selection to:", currentSubject);
      }, 100);
    }

  // Add this function or replace your existing updatePomodoroStats
function updatePomodoroStats() {
  const statsContainer = document.getElementById("pomodoro-stats");
  if (!statsContainer) return;
  
  // Clear existing stats
  statsContainer.innerHTML = '';
  
  // Get total count
  const totalCount = Object.values(subjectData).reduce((sum, count) => sum + count, 0);
  
  if (totalCount === 0) {
    statsContainer.innerHTML = '<p class="text-sm text-gray-500 text-center">Még nem végeztél el egy Pomodoro ciklust sem.</p>';
    return;
  }
  
  // Sort subjects by count (descending)
  const sortedSubjects = Object.keys(subjectData).sort((a, b) => 
    subjectData[b] - subjectData[a]
  );
  
  // Create minimal percentage display
  const percentagesContainer = document.createElement('div');
  percentagesContainer.className = 'flex flex-wrap gap-2 justify-center';
  
  sortedSubjects.forEach(subject => {
    if (subjectData[subject] === 0) return;
    
    const percentage = Math.round((subjectData[subject] / totalCount) * 100);
    if (percentage === 0) return;
    
    const badge = document.createElement('div');
    badge.className = 'px-3 py-1.5 rounded-full text-white text-sm font-medium';
    
    // Simple color assignment
    const index = sortedSubjects.indexOf(subject);
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    
    badge.className = `${colors[index % colors.length]} px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-1`;
    badge.innerHTML = `<span>${subject}:</span> <span class="font-bold">${percentage}%</span>`;
    
    percentagesContainer.appendChild(badge);
  });
  
  statsContainer.appendChild(percentagesContainer);
}
  
 // Listen for subject changes
  if (subjectSelect) {
    subjectSelect.addEventListener('change', function() {
      currentSubject = this.value;
      // IMPORTANT: Save to localStorage
      localStorage.setItem('currentSubject', currentSubject);
      console.log("Subject selected and saved:", currentSubject);
    });
  }

  updateTimerDisplay();
  updatePomodoroStats();
});

// Function to populate subject dropdown from tasks and existing data
function populateSubjectDropdown() {
  const subjectSelect = document.getElementById("pomodoro-subject");
  if (!subjectSelect) return;
  
  // Clear existing options (except the default)
  while (subjectSelect.options.length > 1) {
    subjectSelect.remove(1);
  }
  
  // Get unique subjects
  const subjects = new Set();
  
  // Add from tasks
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      if (task.subject && task.subject.trim()) {
        subjects.add(task.subject.trim());
      }
    });
  } catch (e) {
    console.error("Error loading tasks:", e);
  }
  
  // Add from existing pomodoro data
  Object.keys(subjectData).forEach(subject => subjects.add(subject));
  
  // Sort subjects alphabetically
  const sortedSubjects = Array.from(subjects).sort();
  
  // Add to dropdown
  sortedSubjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
}

function updateTimerDisplay() {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) {
    console.error("countdown element not found!");
    return;
  }
  
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  countdownEl.textContent = `${min}:${sec}`;
  
  // Update progress circle
  updateProgressCircle(seconds / totalSeconds);
  
  console.log("Timer updated:", `${min}:${sec}`);
}

function updateProgressCircle(percentage) {
  const progressCircle = document.getElementById("timer-progress");
  if (progressCircle) {
    const circumference = 2 * Math.PI * 45; // Based on r=45
    const offset = circumference * (1 - percentage);
    progressCircle.style.strokeDashoffset = offset;
  }
}

// Update resetTimer to reset the progress circle too
function startTimer() {
  console.log("startTimer called");
  
  // Validate subject selection
  if (!currentSubject) {
    alert("Please select a subject before starting the timer.");
    return;
  }
  
  if (timer) return;
  timer = setInterval(() => {
    if (seconds > 0) {
      seconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      pomodoroCount++;

      localStorage.setItem('pomodoroCount', pomodoroCount);

      // Update subject statistics
      if (currentSubject) {
        if (!subjectData[currentSubject]) {
          subjectData[currentSubject] = 0;
        }
        subjectData[currentSubject]++;
        localStorage.setItem('pomodoroSubjects', JSON.stringify(subjectData));
        updatePomodoroStats();
      }

      const pomodoroDisplay = document.getElementById("pomodoro-count");
      if (pomodoroDisplay) {
        pomodoroDisplay.textContent = pomodoroCount;
      }
      alert("Pomodoro vége! Jöhet a szünet?");
    }
  }, 1000);
  
  // Pass the current subject to the marker function
  addPomodoroMarker(currentSubject);
}
// Function to get subject colors consistently
function getSubjectColors() {
  const subjects = Object.keys(subjectData);
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];
  
  const subjectColors = {};
  subjects.forEach((subject, index) => {
    subjectColors[subject] = colors[index % colors.length];
  });
  
  return subjectColors;
}

// Add this function to create visual markers for completed pomodoros
function addPomodoroMarker(subject) {
  const historyContainer = document.getElementById("pomodoro-history");
  if (!historyContainer) return;
  // Create a new marker element
  const marker = document.createElement("div");

  // Assign color based on subject for visual differentiation
  const subjectColors = getSubjectColors();
  const color = subjectColors[subject] || 'bg-red-500';
  marker.className = "w-4 h-4 rounded-full bg-red-500 animate-pulse";
  marker.title = subject; // Show subject name on hover
  marker.textContent = subject.substring(0, 1).toUpperCase(); // First letter as label

  historyContainer.appendChild(marker);
    
    // Animate entrance
    setTimeout(() => marker.classList.remove("animate-pulse"), 1000);
  
}


// Rest of your functions with added logging
function pauseTimer() {
  console.log("pauseTimer called");
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  console.log("resetTimer called");
  pauseTimer();
  seconds = 1500;
  updateTimerDisplay();
}

console.log("Pomodoro completed!");
console.log("New count:", pomodoroCount);
console.log("Element found:", document.getElementById("pomodoro-count") !== null);
console.log("LocalStorage value:", localStorage.getItem('pomodoroCount'));

