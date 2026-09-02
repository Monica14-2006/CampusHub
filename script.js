console.log("JavaScript is connected!");
const API_URL = "https://campushub-7ql7.onrender.com";
const addTask=document.getElementById("addTask");
const taskInput=document.getElementById("taskInput");
const taskList=document.getElementById("taskList");
const noteInput=document.getElementById("noteInput");
const addNote=document.getElementById("addNote");
const noteList=document.getElementById("noteList");
const eventInput=document.getElementById("eventInput");
const addEvent=document.getElementById("addEvent");
const eventList=document.getElementById("eventList");
const eventDate=document.getElementById("eventDate");
let notes = [];

async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);

        if (!response.ok) {
            throw new Error("Failed to load notes");
        }

        notes = await response.json();

        noteList.innerHTML = "";

        notes.forEach(function(note) {
            const li = document.createElement("li");

            const noteSpan = document.createElement("span");
            noteSpan.textContent = note.note;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener("click", async function() {
    try {
        const response = await fetch(`${API_URL}/notes/${note.id}`, {
            method: "DELETE"
    });

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        li.remove();

        console.log("Note deleted successfully!");

    } catch (error) {
        console.error("Error deleting note:", error);
    }
});

            li.appendChild(noteSpan);
            li.appendChild(deleteButton);
            noteList.appendChild(li);
        });

    } catch (error) {
        console.error("Failed to load notes:", error);
    }
}

loadNotes();
addNote.addEventListener("click", async function() {
    const noteText = noteInput.value.trim();

    if (noteText === "") {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                note: noteText
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add note");
        }

        const data = await response.json();

        console.log(data);

const li = document.createElement("li");

const noteSpan = document.createElement("span");
noteSpan.textContent = data.note;

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.className = "deleteButton";

deleteButton.addEventListener("click", async function() {
    try {
        const response = await fetch(`${API_URL}/notes/${data.id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        li.remove();

        console.log("Note deleted successfully!");

    } catch (error) {
        console.error("Error deleting note:", error);
    }
});

li.appendChild(noteSpan);
li.appendChild(deleteButton);
noteList.appendChild(li);

noteInput.value = "";

    } catch (error) {
        console.error("Error adding note:", error);
    }
});
let events = [];
function createEvent(eventText, date, eventId) {
    const li = document.createElement("li");

    const eventSpan = document.createElement("span");
    eventSpan.textContent = eventText + " - " + date;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";

    deleteButton.addEventListener("click", async function() {

        try {
            const response = await fetch(`${API_URL}/events/${eventId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete event");
            }

            li.remove();

            console.log("Event deleted successfully!");

        } catch (error) {
            console.error("Error deleting event:", error);
        }
    });

    li.appendChild(eventSpan);
    li.appendChild(deleteButton);
    eventList.appendChild(li);
}
async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);

        if (!response.ok) {
            throw new Error("Failed to load events");
        }

        events = await response.json();

        eventList.innerHTML = "";

        events.forEach(function(event) {
            createEvent(event.eventText, event.date,event.id);
        });

    } catch (error) {
        console.error("Failed to load events:", error);
    }
}

loadEvents();
addEvent.addEventListener("click", async function() {

    const eventText = eventInput.value.trim();
    const date = eventDate.value;

    if (eventText === "" || date === "") {
        return;
    }

    const formatDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    try {

        const response = await fetch(`${API_URL}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eventText: eventText,
                date: formatDate
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add event");
        }

        const data = await response.json();

        console.log(data);

        createEvent(data.eventText, data.date,data.id);

        eventInput.value = "";
        eventDate.value = "";

    } catch (error) {
        console.error("Error adding event:", error);
    }
});
    
            
let tasks = [];

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(function(task) {
            createTask(task.task, task.id,task.completed);
        });

    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

loadTasks();
    function createTask(task,taskId,completed){
    const listItem=document.createElement("li");
    const taskText=document.createElement("span");
    taskText.textContent=task;
    taskText.className="taskText";
    const checkBox=document.createElement("input");
    checkBox.type="checkBox";
    const completeButton =document.createElement("button");
    completeButton.textContent=" Complete";
    completeButton.className="completeButton";
    if (Number(completed) === 1) {
    checkBox.checked = true;
    taskText.style.textDecoration = "line-through";
    completeButton.textContent = "Completed";
    completeButton.className = "completedButton";
}
checkBox.addEventListener("change", async function() {

    const completed = checkBox.checked ? 1 : 0;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: completed
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        if (checkBox.checked) {
            taskText.style.textDecoration = "line-through";
            completeButton.textContent = "Completed";
            completeButton.className = "completedButton";
        } else {
            taskText.style.textDecoration = "none";
            completeButton.textContent = "Complete";
            completeButton.className = "completeButton";
        }

        console.log("Task completion updated!");

    } catch (error) {
        console.error("Error updating task:", error);
        checkBox.checked = !checkBox.checked;
    }
});
    completeButton.addEventListener("click", async function() {

    const completed = checkBox.checked ? 0 : 1;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: completed
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        checkBox.checked = completed === 1;

        if (completed === 1) {
            taskText.style.textDecoration = "line-through";
            completeButton.textContent = "Completed";
            completeButton.className = "completedButton";
        } else {
            taskText.style.textDecoration = "none";
            completeButton.textContent = "Complete";
            completeButton.className = "completeButton";
        }

        console.log("Task completion updated!");

    } catch (error) {
        console.error("Error updating task:", error);
    }
});
    const deleteButton=document.createElement("button");
    deleteButton.textContent=" Delete";
    deleteButton.className="deleteButton";
    deleteButton.addEventListener("click", async function() {

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        listItem.remove();

        console.log("Task deleted successfully!");

    } catch (error) {
        console.error("Failed to delete task:", error);
    }

});
    listItem.appendChild(checkBox);
    listItem.appendChild(taskText);
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}
addTask.addEventListener("click", function() {
    const task = taskInput.value.trim();

    if (task === "") {
        return;
    }

    fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: task
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);

        createTask(data.task,data.id);
        taskInput.value = "";
    })
    .catch(function(error) {
        console.log("Error adding task:", error);
    });
});