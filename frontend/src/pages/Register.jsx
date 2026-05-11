import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { username, password, role });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="page-card">
      <div className="page-heading">
        <h1>Task Management System</h1>
        <p className="section-note">Create an account to join the task management workflow.</p>
      </div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="MANAGER">MANAGER</option>
          <option value="MEMBER">MEMBER</option>
        </select>
        <button type="submit">Create Account</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p className="form-footer">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
