import express from "express";
import { openDb } from "../db.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", requireRole("MANAGER"), async (req, res) => {
  const { title, description, assignedTo, startDate, deadline } = req.body;
  if (!title || !assignedTo || !startDate || !deadline) {
    return res.status(400).json({ error: "title, assignedTo, startDate, and deadline are required" });
  }

  const assignmentDate = new Date();
  const start = new Date(startDate);
  const due = new Date(deadline);

  if (Number.isNaN(start.getTime()) || Number.isNaN(due.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  if (due < assignmentDate) {
    return res.status(400).json({ error: "Deadline must not be earlier than assignment date" });
  }

  if (due < start) {
    return res.status(400).json({ error: "Deadline must not be earlier than start date" });
  }

  const db = await openDb();

  const member = await db.get("SELECT id FROM users WHERE id = ? AND role = 'MEMBER'", assignedTo);
  if (!member) {
    return res.status(400).json({ error: "Assigned user must be a MEMBER" });
  }

  const result = await db.run(
    "INSERT INTO tasks (title, description, assignedTo, startDate, deadline, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    title,
    description || "",
    assignedTo,
    start.toISOString(),
    due.toISOString(),
    assignmentDate.toISOString()
  );

  res.status(201).json({ id: result.lastID, title, description, assignedTo, startDate, deadline, status: "Pending" });
});

router.get("/", async (req, res) => {
  const db = await openDb();
  if (req.user.role === "MANAGER") {
    const tasks = await db.all(
      `SELECT t.*, u.username as assignee FROM tasks t JOIN users u ON t.assignedTo = u.id ORDER BY t.createdAt DESC`
    );
    return res.json({ tasks });
  }

  const tasks = await db.all(
    `SELECT t.*, u.username as assignee FROM tasks t JOIN users u ON t.assignedTo = u.id WHERE t.assignedTo = ? ORDER BY t.createdAt DESC`,
    req.user.id
  );
  res.json({ tasks });
});

router.get("/members", requireRole("MANAGER"), async (req, res) => {
  const db = await openDb();
  const members = await db.all("SELECT id, username FROM users WHERE role = 'MEMBER' ORDER BY username ASC");
  res.json({ members });
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !["Pending", "In Progress", "Completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const db = await openDb();
  const task = await db.get("SELECT * FROM tasks WHERE id = ?", id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (task.assignedTo !== req.user.id) {
    return res.status(403).json({ error: "Not authorized to update this task" });
  }

  await db.run("UPDATE tasks SET status = ? WHERE id = ?", status, id);
  res.json({ message: "Task status updated" });
});

export default router;
