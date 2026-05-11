import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { openDb } from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET || "default_secret";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: "username, password, and role are required" });
  }

  if (!["MANAGER", "MEMBER"].includes(role)) {
    return res.status(400).json({ error: "Role must be MANAGER or MEMBER" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const db = await openDb();

  try {
    const result = await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      username,
      hashedPassword,
      role
    );
    res.status(201).json({ id: result.lastID, username, role });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "Username already exists" });
    }
    return res.status(500).json({ error: "Could not register user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const db = await openDb();
  const user = await db.get("SELECT * FROM users WHERE username = ?", username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secret, {
    expiresIn: "8h",
  });

  res.json({ token, role: user.role, username: user.username });
});

export default router;
