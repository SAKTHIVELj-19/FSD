# Task Assignment Management System

## Project Overview
A full-stack Task Assignment Management System built for `FSD-18`. Managers can register, log in, create tasks, and assign tasks to members. Members can register, log in, and view their assigned tasks.

## Tech Stack
- Backend: Node.js, Express, SQLite, JWT
- Frontend: React, Vite, Axios
- Authentication: JWT-based token flow
- Database: SQLite file persistence

## User Roles and Permissions
- `MANAGER`
  - Register and log in
  - Create tasks with start date and deadline
  - Assign tasks to members
  - View all tasks and assignments
- `MEMBER`
  - Register and log in
  - View assigned tasks

## Setup Instructions
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend` based on `.env.example`.
3. Start backend:
   ```bash
   npm start
   ```
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
5. Start frontend:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` — register a new manager or member
- `POST /api/auth/login` — authenticate and receive JWT
- `POST /api/tasks` — manager creates a task and assigns it to a member
- `GET /api/tasks` — manager views all tasks; member views tasks assigned to them
- `GET /api/tasks/members` — manager retrieves available members for assignment
- `PUT /api/tasks/:id/status` — member updates status of their assigned task
- `GET /api/health` — health check endpoint

## Database Schema
- `users` table
  - `id` INTEGER PRIMARY KEY
  - `username` TEXT UNIQUE
  - `password` TEXT
  - `role` TEXT (`MANAGER` or `MEMBER`)
- `tasks` table
  - `id` INTEGER PRIMARY KEY
  - `title` TEXT
  - `description` TEXT
  - `assignedTo` INTEGER FK -> `users.id`
  - `startDate` TEXT
  - `deadline` TEXT
  - `status` TEXT
  - `createdAt` TEXT

## Business Rule Enforcement
- The backend validates that task deadlines are not earlier than the assignment date.
- The backend also enforces that manager-only actions require the `MANAGER` role.

## Deployment
- Live frontend deployment: [Add frontend deployment link here]
- Live backend deployment: [Add backend deployment link here]
- Health check: [backend-url]/api/health
