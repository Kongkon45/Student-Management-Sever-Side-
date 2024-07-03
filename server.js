const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "students"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID: ' + db.threadId);
});

// Home route 
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is ready" });
});

// Get all users
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error retrieving users: " + err.message);
            res.status(500).json({ message: "Server error" });
        } else {
            res.json(result);
        }
    });
});

// Add user API
app.post('/users', (req, res) => {
    const sql = "INSERT INTO users (Name, Email, Age, Gender) VALUES (?, ?, ?, ?)";
    const { name, email, age, gender } = req.body;
    const values = [name, email, age, gender];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding student: " + err.message);
            res.status(500).json({ message: "Server error" });
        } else {
            res.json({ success: "Student added successfully" });
        }
    });
});

// Update user API
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age, gender } = req.body;
    const sql = "UPDATE users SET Name = ?, Email = ?, Age = ?, Gender = ? WHERE Id = ?";
    const values = [name, email, age, gender, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating student: " + err.message);
            res.status(500).json({ message: "Server error" });
        } else {
            res.json({ success: "Student updated successfully" });
        }
    });
});

// Delete user API
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE Id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting student: " + err.message);
            res.status(500).json({ message: "Server error" });
        } else {
            res.json({ success: "Student deleted successfully" });
        }
    });
});

// Not found route 
app.use((req, res, next) => {
    res.status(404).json({ message: "This url is not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error: " + err.message);
    res.status(500).json({ message: "Something broke!" });
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running successfully at http://localhost:${port}`);
});
