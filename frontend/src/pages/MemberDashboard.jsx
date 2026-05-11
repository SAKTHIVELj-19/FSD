import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Member";
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Unable to load tasks");
      }
    }
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  async function updateStatus(taskId, newStatus) {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
    } catch (err) {
      setError("Unable to update task status");
    }
  }

  return (
    <div className="page-card">
      <div className="header-row">
        <div>
          <h1>Task Management System</h1>
          <h2>Member Dashboard</h2>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      <p className="section-note">Welcome back, {username}. Review your assigned work and update progress instantly.</p>
      <div className="dashboard-summary">
        <div className="stat-card">
          <span className="stat-label">Assigned Tasks</span>
          <strong>{totalTasks}</strong>
          <p>Current workload</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>{pendingTasks}</strong>
          <p>Needs your attention</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <strong>{completedTasks}</strong>
          <p>Closed items</p>
        </div>
      </div>
      <section>
        <h2>Assigned Tasks</h2>
        {error && <div className="error">{error}</div>}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks assigned.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  <strong>Manager Assigned:</strong> {task.assignee}
                </p>
                <p>
                  <strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()} - <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                </p>
                <div style={{ marginTop: "12px" }}>
                  <label><strong>Status:</strong></label>
                  <select
                  className="status-select"
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <span className={`status-indicator status-${task.status.toLowerCase().replace(' ', '-')}`} style={{ marginLeft: "12px" }}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default MemberDashboard;
