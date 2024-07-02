const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const uuid = require('uuid');

const dbFilePath = path.join(__dirname, '../db/db.json');

const readNotes = () => {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
};

const writeNotes = (notes) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
};

router.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

router.post('/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required' });
  }

  const newNote = { id: uuid.v4(), title, text };
  const notes = readNotes();
  notes.push(newNote);
  writeNotes(notes);

  res.json(newNote);
});

router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = readNotes();
  notes = notes.filter(note => note.id !== noteId);
  writeNotes(notes);

  res.json({ message: 'Note deleted' });
});

module.exports = router;
