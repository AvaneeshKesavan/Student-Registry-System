// Importing required modules
const express = require('express'); // Framework for building the server
const sqlite3 = require('sqlite3').verbose(); // For SQLite database management
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const path = require('path'); // Utility for working with file paths

const app = express(); // Initialize the Express app
const PORT = process.env.PORT || 3000; // Server port (default: 3000)

// Database setup
const db = new sqlite3.Database('student-registry.db', (err) => {
    if (err) {
        console.error('Database opening error: ', err);
    } else {
        // Create a "students" table if it doesn't already exist
        db.run(`
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table: ', err);
            }
        });
    }
});

// Middleware setup
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g., CSS, JS) from the "public" folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data from POST requests

// Routes

// Home route - display the student registration form and list of students
app.get('/', (req, res) => {
    // Retrieve all students from the database to display them on the webpage
    db.all('SELECT * FROM students', (err, students) => {
        if (err) {
            console.error('Error fetching students: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Render the main page with the student data
            res.render('layout', {
                formTitle: 'Student Registry', // Form title
                btntxt: 'Add Student', // Button text
                students // Pass the list of students to the template
            });
        }
    });
});

// Handle form submission - add a student to the database
app.post('/add-student', (req, res) => {
    const { name } = req.body; // Extract "name" from the form submission
    if (!name) {
        return res.status(400).send('Name is required'); // Return error if name is empty
    }

    // Insert the new student into the database
    db.run('INSERT INTO students (name) VALUES (?)', [name], function (err) {
        if (err) {
            console.error('Error inserting student: ', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/'); // Redirect to the home page after successful insertion
    });
});

// Route to handle deleting a student by ID
app.post('/delete-student', (req, res) => {
    const { id } = req.body; // Extract the student's ID from the request body

    if (!id) {
        return res.status(400).send('Student ID is required'); // Ensure the ID is provided
    }

    // Delete the student with the given ID from the database
    db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting student: ', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/'); // Redirect back to the main page after deletion
    });
});

// Handle invalid routes - 404 Page Not Found
app.get('*', (req, res) => {
    res.status(404).send('404: Page Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
