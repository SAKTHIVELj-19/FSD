import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import MemberDashboard from "./pages/MemberDashboard.jsx";

function App() {
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [location.pathname]);

  const handleLogin = (newRole) => {
    setRole(newRole);
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to={role === "MANAGER" ? "/manager" : role === "MEMBER" ? "/member" : "/login"} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager" element={role === "MANAGER" ? <ManagerDashboard /> : <Navigate to="/login" />} />
        <Route path="/member" element={role === "MEMBER" ? <MemberDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
