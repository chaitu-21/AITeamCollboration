const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await db.all('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const { title, description, status, assignee } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  try {
    const result = await db.run(
      'INSERT INTO tasks (title, description, status, assignee) VALUES (?, ?, ?, ?)',
      [title, description, status || 'To Do', assignee || null]
    );
    res.status(201).json({ id: result.id, title, description, status: status || 'To Do', assignee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignee } = req.body;
  
  try {
    await db.run(
      'UPDATE tasks SET title = ?, description = ?, status = ?, assignee = ? WHERE id = ?',
      [title, description, status, assignee, id]
    );
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
