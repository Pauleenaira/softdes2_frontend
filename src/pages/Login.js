import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  // Note: We don't strictly need to track the role dropdown anymore because
  // the backend tells us what role they are when they log in!
  const [role, setRole] = useState("admin"); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent any default form submission behavior

    try {
      // 1. Send the data to your Python backend
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      // 2. Wait for the database to reply
      const data = await response.json();

      if (response.ok) {
        // SUCCESS: The backend verified them!
        // Save their token and name so the rest of the app knows who is logged in
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("full_name", data.full_name);

        alert(`Welcome back, ${data.full_name}!`);

        // Navigate based on their REAL role from the database
        if (data.role === "Admin" || data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/employee");
        }
      } else {
        // FAILED: The backend rejected them
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to connect to the server. Is Flask running?");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="login-brand">
          <div>
            <div className="logo-circle">CAF</div>
            <div className="brand-title">
              <h1>Cafe Management POS</h1>
              <p>
                Fast, automated order processing and inventory tracking for your cafe staff.
              </p>
            </div>
          </div>
          <div className="brand-footer">
            Designed for <span>Admins</span> and <span>Employees</span> in your cafe.
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-form">
          <h2>Sign in to continue</h2>
          <p>Select your role and enter your credentials to access the system.</p>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
            <div className="helper-text">
              Admin → full access (Dashboard, Orders, Inventory, Reports). 
              Employee → limited access (Dashboard, Orders only).
            </div>
          </div>

          <div className="form-group">
            <label>Username / ID</label>
            <input
              type="text"
              placeholder="Enter your ID or Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="actions">
            <div className="remember">
              <input type="checkbox" />
              <label>Remember this device</label>
            </div>

            <button className="btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
