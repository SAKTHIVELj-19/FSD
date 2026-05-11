import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      console.log("Attempting login...");
      const response = await api.post("/auth/login", { username, password });
      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      if (typeof onLogin === "function") {
        onLogin(response.data.role);
      }
      console.log("Navigating to:", response.data.role === "MANAGER" ? "/manager" : "/member");
      navigate(response.data.role === "MANAGER" ? "/manager" : "/member");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="page-card">
      <div className="page-heading">
        <h1>Task Management System</h1>
        <p className="section-note">Secure access to your team workspace and task pipeline.</p>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p className="form-footer">
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
