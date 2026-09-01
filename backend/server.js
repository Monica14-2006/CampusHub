require("dotenv").config();
const express = require("express");
const cors=require("cors");
const mysql=require("mysql2");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: require("fs").readFileSync(__dirname + "/ca.pem")
    }
});
db.connect(function(err) {
    if(err) {
        console.error("Mysql connection failed:",err);
    } else {
        console.log("Mysql connected successfully!")
    }
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

//Home route
app.get("/", function(req, res) {
    res.send("CampusHub backend is running!");
});
    app.get("/tasks", function(req, res) {
    db.query("SELECT * FROM tasks", function(err, results) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch tasks" });
            return;
        }

        res.json(results);
    });
});

//Get all notes
app.get("/notes", function(req, res) {
    db.query("SELECT * FROM notes", function(err, results) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch notes" });
            return;
        }

        res.json(results);
    });
});

//Add a new note
app.post("/notes", function(req, res) {
    const newNote = req.body.note;

    db.query(
        "INSERT INTO notes (note) VALUES (?)",
        [newNote],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to add note" });
                return;
            }

            res.json({
                message: "Note added successfully!",
                note: newNote,
                id: result.insertId
            });
        }
    );
});

// Delete a note
app.delete("/notes/:id", function(req, res) {
    const noteId = req.params.id;

    db.query(
        "DELETE FROM notes WHERE id = ?",
        [noteId],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to delete note" });
                return;
            }

            res.json({
                message: "Note deleted successfully!"
            });
        }
    );
});

//Get all events
app.get("/events", function(req, res) {
    db.query("SELECT * FROM events", function(err, results) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch events" });
            return;
        }

        res.json(results);
    });
});

//Add a new task
app.post("/tasks", function(req, res) {
    const newTask = req.body.task;
    db.query(
        "INSERT INTO tasks (task) VALUES (?)",
        [newTask],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to add task" });
                return;
            }

            res.json({
                message: "Task added successfully!",
                task: newTask,
                id:result.insertId
            });
        }
    );
});

//Add a new event
app.post("/events", function(req, res) {
    const eventText = req.body.eventText;
    const date = req.body.date;

    db.query(
        "INSERT INTO events (eventText, date) VALUES (?, ?)",
        [eventText, date],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to add event" });
                return;
            }

            res.json({
                message: "Event added successfully!",
                eventText: eventText,
                date: date,
                id: result.insertId
            });
        }
    );
});
// Delete an event
app.delete("/events/:id", function(req, res) {
    const eventId = req.params.id;

    db.query(
        "DELETE FROM events WHERE id = ?",
        [eventId],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to delete event" });
                return;
            }

            res.json({
                message: "Event deleted successfully!"
            });
        }
    );
});
// Delete a task
app.delete("/tasks/:id", function(req, res) {
    const taskId = req.params.id;

    db.query(
        "DELETE FROM tasks WHERE id = ?",
        [taskId],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to delete task" });
                return;
            }

            res.json({
                message: "Task deleted successfully!"
            });
        }
    );
});

//Update task completion
app.put("/tasks/:id", function(req, res) {
    const taskId = req.params.id;
    const completed = req.body.completed;

    db.query(
        "UPDATE tasks SET completed = ? WHERE id = ?",
        [completed, taskId],
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to update task" });
                return;
            }

            res.json({
                message: "Task updated successfully!"
            });
        }
    );
});
// Start the server
app.listen(PORT, function() {
    console.log(`CampusHub server is running on http://localhost:${PORT}`);
});