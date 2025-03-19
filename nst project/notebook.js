const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const progressRing = document.getElementById("progress-ring-circle");

// Calculate circle circumference (2 * PI * radius)
const CIRCUMFERENCE = 2 * Math.PI * 145;
progressRing.style.strokeDasharray = `${CIRCUMFERENCE}`;
progressRing.style.strokeDashoffset = CIRCUMFERENCE;

// Timer variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let totalSeconds = 0;

// Add event listeners
hoursInput.addEventListener("input", updateTotalSeconds);
minutesInput.addEventListener("input", updateTotalSeconds);
secondsInput.addEventListener("input", updateTotalSeconds);
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Update progress ring based on remaining time
function updateProgress(remainingSeconds) {
    const progress = remainingSeconds / totalSeconds;
    const offset = CIRCUMFERENCE * (1 - progress);
    progressRing.style.strokeDashoffset = offset;
}

function startTimer() {
    if (!isRunning && totalSeconds > 0) {
        // Calculate start time and begin interval
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        isRunning = true;

        // Disable inputs while running
        hoursInput.readOnly = true;
        minutesInput.readOnly = true;
        secondsInput.readOnly = true;

        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    }
}

function pauseTimer() {
    if (isRunning) {
        // Stop timer and update states
        clearInterval(timerInterval);
        isRunning = false;

        // Enable inputs
        hoursInput.readOnly = false;
        minutesInput.readOnly = false;
        secondsInput.readOnly = false;

        // Update button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    // Stop timer and reset all values
    clearInterval(timerInterval);
    elapsedTime = 0;
    hoursInput.value = "00";
    minutesInput.value = "00";
    secondsInput.value = "00";
    updateTotalSeconds();
    progressRing.style.strokeDashoffset = CIRCUMFERENCE;
    isRunning = false;

    // Enable inputs
    hoursInput.readOnly = false;
    minutesInput.readOnly = false;
    secondsInput.readOnly = false;

    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function updateTimer() {
    // Calculate remaining time
    elapsedTime = Date.now() - startTime;
    let remainingSeconds = totalSeconds - Math.round(elapsedTime / 1000);

    if (remainingSeconds < 0) {
        // Timer finished
        remainingSeconds = 0;
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        // Enable inputs
        hoursInput.readOnly = false;
        minutesInput.readOnly = false;
        secondsInput.readOnly = false;
    }

    // Update display
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    hoursInput.value = hours.toString().padStart(2, '0');
    minutesInput.value = minutes.toString().padStart(2, '0');
    secondsInput.value = seconds.toString().padStart(2, '0');
    
    // Update progress ring
    updateProgress(remainingSeconds);
}

function updateTotalSeconds() {
    // Calculate total seconds from inputs
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    // Reset progress ring to match input time
    updateProgress(totalSeconds);
}

updateTotalSeconds();


//test

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const habitList = document.getElementById("habit_list");
    
    habitList.style.maxHeight = "300px";
    habitList.style.overflowY = "auto";
    habitList.style.border = "1px solid #ccc";
    habitList.style.padding = "5px";
    habitList.style.minHeight = "50px";
    habitList.style.display = "none";

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".habit_box").forEach(box => {
            tasks.push({
                text: box.querySelector("li").textContent,
                completed: box.classList.contains("completed"),
                addedAt: box.dataset.addedAt
            });
        });
        localStorage.setItem("habitTasks", JSON.stringify(tasks));
        localStorage.setItem("lastSavedDate", new Date().toDateString());
    }

    function resetTasksDaily() {
        const lastResetDate = localStorage.getItem("lastResetDate");
        const lastSavedDate = localStorage.getItem("lastSavedDate");
        const todayDate = new Date().toDateString();
    
        if (lastResetDate !== todayDate && lastSavedDate !== todayDate) {
            let tasks = JSON.parse(localStorage.getItem("habitTasks")) || [];
            tasks = tasks.map(task => ({ ...task, completed: false }));
            localStorage.setItem("habitTasks", JSON.stringify(tasks));
            localStorage.setItem("lastResetDate", todayDate);
        }
    }
    
    

    function loadTasks() {
        resetTasksDaily();
        const tasks = JSON.parse(localStorage.getItem("habitTasks")) || [];
        tasks.forEach(task => addTask(task.text, task.completed, task.addedAt));
    }

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText, false, Date.now());
            taskInput.value = "";
            saveTasks();
        }
    });

    function addTask(taskText, completed = false, addedAt = Date.now()) {
        if (habitList.style.display === "none") {
            habitList.style.display = "block";
        }

        const habitBox = document.createElement("div");
        habitBox.classList.add("habit_box");
        habitBox.dataset.addedAt = addedAt;
        habitBox.style.display = "flex";
        habitBox.style.justifyContent = "space-between";
        habitBox.style.alignItems = "center";
        habitBox.style.padding = "12px";
        habitBox.style.margin = "10px";
        habitBox.style.borderBottom = "1px solid gainsboro";
        habitBox.style.boxShadow = "1px 1px 5px rgba(78, 77, 77, 0.491)";
        habitBox.style.backgroundColor = completed ? "rgba(176, 218, 255, 0.46)" : "rgba(210, 210, 210, 0.117)";
        habitBox.style.transition = "background-color 0.3s ease";
        habitBox.style.height = "50px";

        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;
        taskItem.style.flexGrow = "1";
        taskItem.style.cursor = "pointer";
        taskItem.style.fontSize = "1rem";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "⛌";
        deleteBtn.style.display = completed ? "inline" : "none";
        deleteBtn.style.color = "gray";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", function () {
            habitBox.remove();
            if (habitList.children.length === 0) {
                habitList.style.display = "none";
            }
            saveTasks();
        });

        taskItem.addEventListener("click", function () {
            habitBox.classList.toggle("completed");
            if (habitBox.classList.contains("completed")) {
                habitBox.style.backgroundColor = "rgba(176, 218, 255, 0.46)";
                deleteBtn.style.display = "inline";
            } else {
                habitBox.style.backgroundColor = "rgba(210, 210, 210, 0.117)";
                deleteBtn.style.display = "none";
            }
            saveTasks();
        });

        habitBox.appendChild(taskItem);
        habitBox.appendChild(deleteBtn);
        habitList.appendChild(habitBox);
        saveTasks();
    }

    loadTasks();
});


//test 2

document.addEventListener("DOMContentLoaded", function () {
    const inputBox = document.getElementById("input-box");
    const addButton = document.getElementById("task_add");
    const tasksList = document.getElementById("tasks");

    // Make tasks list scrollable
    tasksList.style.maxHeight = "300px";
    tasksList.style.overflowY = "auto";

    // Load saved tasks when page loads
    loadSavedTasks();

    addButton.addEventListener("click", addTask);

    function addTask() {
        const taskText = inputBox.value.trim();
        if (taskText === "") return;

        createTaskElement({
            text: taskText,
            description: "description",
            completed: false,
            id: Date.now()
        });

        saveTasks();
        inputBox.value = "";
    }

    function createTaskElement(taskData) {
        const task = document.createElement("div");
        task.classList.add("task");
        task.dataset.id = taskData.id;

        const box = document.createElement("div");
        box.classList.add("box");

        const taskDetails = document.createElement("div");
        taskDetails.style.display = "flex";
        taskDetails.style.flexDirection = "column";
        taskDetails.style.maxWidth = "200px";
        taskDetails.style.wordBreak = "break-word";
        
        const taskItem = document.createElement("li");
        taskItem.textContent = taskData.text;
        
        const description = document.createElement("span");
        description.classList.add("description");
        description.textContent = taskData.description;
        description.style.wordBreak = "break-word";
        description.style.maxWidth = "200px";
        description.style.whiteSpace = "normal";
        description.style.overflowWrap = "break-word";
        description.addEventListener("click", function () {
            const newDescription = prompt("Enter task description:", description.textContent);
            if (newDescription !== null) {
                description.textContent = newDescription;
                taskData.description = newDescription;
                saveTasks();
            }
        });

        // Create container for tick and delete icons
        const iconContainer = document.createElement("div");
        iconContainer.style.display = "flex";
        iconContainer.style.alignItems = "center";
        iconContainer.style.gap = "5px";

        // Add tick icon
        const tickIcon = document.createElement("span");
        tickIcon.innerHTML = "✓";
        tickIcon.style.cursor = "pointer";
        tickIcon.style.fontSize = "20px";
        tickIcon.style.color = taskData.completed ? "green" : "#ccc";
        tickIcon.style.display = "inline-block";
        tickIcon.style.width = "24px";
        tickIcon.style.height = "24px";
        tickIcon.style.textAlign = "center";
        tickIcon.style.lineHeight = "24px";
        tickIcon.style.transition = "color 0.3s ease";

        // Add delete icon
        const deleteIcon = document.createElement("span");
        deleteIcon.innerHTML = "×";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.fontSize = "24px";
        deleteIcon.style.color = "#666";
        deleteIcon.style.display = taskData.completed ? "inline-block" : "none";
        deleteIcon.style.width = "24px";
        deleteIcon.style.height = "24px";
        deleteIcon.style.textAlign = "center";
        deleteIcon.style.lineHeight = "24px";

        if (taskData.completed) {
            taskItem.style.textDecoration = "line-through";
            description.remove();
            tickIcon.style.color = "green";
        }

        tickIcon.addEventListener("click", function () {
            taskData.completed = !taskData.completed;
            if (taskData.completed) {
                taskItem.style.textDecoration = "line-through";
                description.remove();
                tickIcon.style.color = "green";
                deleteIcon.style.display = "inline-block";
            } else {
                taskItem.style.textDecoration = "none";
                taskDetails.appendChild(description);
                tickIcon.style.color = "#ccc";
                deleteIcon.style.display = "none";
            }
            saveTasks();
        });

        deleteIcon.addEventListener("click", function () {
            task.remove();
            removeTask(taskData.id);
            saveTasks();
        });

        iconContainer.appendChild(tickIcon);
        iconContainer.appendChild(deleteIcon);

        taskDetails.appendChild(taskItem);
        if (!taskData.completed) {
            taskDetails.appendChild(description);
        }
        box.appendChild(taskDetails);
        box.appendChild(iconContainer);
        task.appendChild(box);
        tasksList.appendChild(task);
    }

    function loadSavedTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('todaysTasks')) || [];
        savedTasks.forEach(taskData => createTaskElement(taskData));
    }

    function saveTasks() {
        const tasks = Array.from(tasksList.getElementsByClassName('task')).map(task => {
            const id = parseInt(task.dataset.id);
            const text = task.querySelector('li').textContent;
            const description = task.querySelector('.description')?.textContent || "description";
            const completed = task.querySelector('span').style.color === "green";
            
            return { id, text, description, completed };
        });
        
        localStorage.setItem('todaysTasks', JSON.stringify(tasks));
    }

    function removeTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('todaysTasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('todaysTasks', JSON.stringify(updatedTasks));
    }
});