import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let dbFile = process.env.DB_FILE || path.join(__dirname, "../data/fsd18.db");

if (process.env.VERCEL) {
  const tmpDbPath = "/tmp/fsd18.db";
  if (!fs.existsSync(tmpDbPath)) {
    try {
      fs.copyFileSync(dbFile, tmpDbPath);
      console.log("Copied SQLite DB to /tmp for Vercel");
    } catch (err) {
      console.error("Failed to copy DB to /tmp", err);
    }
  }
  dbFile = tmpDbPath;
}

export async function openDb() {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('MANAGER', 'MEMBER'))
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      assignedTo INTEGER NOT NULL,
      startDate TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (assignedTo) REFERENCES users(id)
    );
  `);

  return db;
}
