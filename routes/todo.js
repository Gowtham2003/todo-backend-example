const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all todos for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Error fetching todos" });
  }
});

// Create a new todo
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;

  try {
    const todo = new Todo({
      userId: req.userId,
      title,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Error creating todo" });
  }
});

// Update a todo
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Error updating todo" });
  }
});

// Delete a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting todo" });
  }
});

module.exports = router;
