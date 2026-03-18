const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos with pagination
router.get('/', async (req, res) => {
  const guestToken = req.headers['x-guest-token'];
  if (!guestToken) return res.status(401).json({ message: 'Guest Token required' });

  try {
    const todos = await Todo.find({ guestToken }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create todo
router.post('/', async (req, res) => {
  const guestToken = req.headers['x-guest-token'];
  if (!guestToken) return res.status(401).json({ message: 'Guest Token required' });

  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    guestToken: guestToken
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  const guestToken = req.headers['x-guest-token'];
  if (!guestToken) return res.status(401).json({ message: 'Guest Token required' });

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, guestToken },
      req.body,
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found or unauthorized' });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  const guestToken = req.headers['x-guest-token'];
  if (!guestToken) return res.status(401).json({ message: 'Guest Token required' });

  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, guestToken });
    if (!deletedTodo) return res.status(404).json({ message: 'Todo not found or unauthorized' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
