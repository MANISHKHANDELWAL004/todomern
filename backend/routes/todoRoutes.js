const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create Todo
router.post("/", auth, async (req, res) => {
  const todo = new Todo({ text: req.body.text, user: req.user });
  await todo.save();
  res.json(todo);
});

// Get Todos
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user });
  res.json(todos);
});

// Delete Todo
router.delete("/:id", auth, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ msg: "Todo Deleted" });
});

// UPDATE TODO (EDIT)
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ msg: "Update failed" });
  }
});

module.exports = router;
