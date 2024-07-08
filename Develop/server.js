const express = require('express');
const path = require('path');
const fs = require('fs');
const notesRouter = require('./routes/notes'); // Import the notes router

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
      return;
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
      return;
    }
    const notes = JSON.parse(data);
    newNote.id = generateUniqueId(); // Implement a function to generate unique IDs
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to save note' });
        return;
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
      return;
    }
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to delete note' });
        return;
      }
      res.json({ msg: 'Note deleted' });
    });
  });
});

// HTML Routes
app.use('/', notesRouter); // Use the notes router

// Catch-all route to serve index.html for any undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to generate unique IDs (placeholder implementation)
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
