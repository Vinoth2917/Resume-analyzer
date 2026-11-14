import { Router } from "express";
import Todo from "../models/Todo.js";

const router = Router();

// Express 4 does not catch errors thrown inside async handlers, so each
// handler wraps its work in try/catch and passes errors to next().

// GET /api/todos - list all todos, newest first
router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// POST /api/todos - create a todo: { "title": "..." }
router.post("/", async (req, res, next) => {
  try {
    const title = (req.body?.title ?? "").trim();
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/todos/:id - update completed: { "completed": true }
router.patch("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: Boolean(req.body?.completed) },
      { new: true } // return the updated document
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/todos/:id - remove a todo
router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
