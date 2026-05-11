import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });
}

export default app;
