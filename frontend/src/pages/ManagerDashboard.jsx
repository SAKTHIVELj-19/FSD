import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", startDate: "", deadline: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Manager";
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tasksResponse, membersResponse] = await Promise.all([api.get("/tasks"), api.get("/tasks/members")]);
      setTasks(tasksResponse.data.tasks);
      setMembers(membersResponse.data.members);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    }
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/tasks", form);
      setMessage("Task created and assigned successfully.");
      setForm({ title: "", description: "", assignedTo: "", startDate: "", deadline: "" });
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to create task");
    }
  };

  return (
    <div className="page-card">
      <div className="header-row">
        <div>
          <h1>Task Management System</h1>
          <h2>Manager Dashboard</h2>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      <p className="section-note">Welcome back, {username}. Manage your team, create priorities, and keep deadlines on track.</p>
      <div className="dashboard-summary">
        <div className="stat-card">
          <span className="stat-label">Team Members</span>
          <strong>{members.length}</strong>
          <p>Active contributors</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tasks Assigned</span>
          <strong>{totalTasks}</strong>
          <p>Open and in progress</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>{pendingTasks}</strong>
          <p>Needs action</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <strong>{completedTasks}</strong>
          <p>Closed tasks</p>
        </div>
      </div>

      <section>
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <label>Assign To</label>
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required>
            <option value="">Select member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.username}
              </option>
            ))}
          </select>

          <label>Start Date</label>
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />

          <label>Deadline</label>
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />

          <button type="submit">Create Task</button>
        </form>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </section>

      <section>
        <h2>All Tasks</h2>
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  <strong>Assigned To:</strong> {task.assignee}
                </p>
                <p>
                  <strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()} - <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> <span className={`status-indicator status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ManagerDashboard;
