import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config"; // Matches your modular deployment setup
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  // State management for role-based selection and input fields [cite: 1185, 1186, 1187]
  const [role, setRole] = useState("admin"); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior [cite: 1189]

    try {
      // Sends credentials to the Python backend via a RESTful API POST request [cite: 1191, 1192, 1193]
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Required for JSON data exchange [cite: 1196]
        },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      // Wait for the backend database to verify the credentials [cite: 1202, 1203]
      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Store the JSON Web Token and user details locally for persistence [cite: 1204, 1205, 1206]
        localStorage.setItem("token", data.token); [cite: 1207]
        localStorage.setItem("role", data.role); [cite: 1208]
        localStorage.setItem("username", data.username); [cite: 1209]
        localStorage.setItem("full_name", data.full_name); [cite: 1210]

        alert(`Welcome back, ${data.full_name}!`); [cite: 1211]

        // Redirect based on the authenticated role returned by the database [cite: 1212]
        if (data.role === "Admin" || data.role === "admin") {
          navigate("/admin"); [cite: 1213]
        } else {
          navigate("/employee"); [cite: 1216]
        }
      } else {
        // FAILED: Display specific error from the backend (e.g., account disabled or wrong password) [cite: 1219, 1220]
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      // Handles network failures or cases where the Flask server is unreachable [cite: 1221, 1222]
      console.error("Login error:", error);
      alert("Failed to connect to the server. Is Flask running?"); [cite: 1223]
    }
  };

  return (
    <div className="login-container"> {/* Main container for the login view [cite: 1227] */}
      <div className="login-wrapper">
        
        {/* BRANDING SECTION: Defines the Café POS identity [cite: 1230, 1233] */}
        <div className="login-brand">
          <div>
            <div className="logo-circle">CAF</div>
            <div className="brand-title">
              <h1>Cafe Management POS</h1>
              <p>Fast, automated order processing and inventory tracking for your cafe staff.</p> [cite: 1234, 1235, 1236]
            </div>
          </div>
          <div className="brand-footer">
            Designed for <span>Admins</span> and <span>Employees</span> in your cafe. [cite: 1240, 1241]
          </div>
        </div>

        {/* LOGIN FORM SECTION: Role selection and credential inputs [cite: 1245] */}
        <div className="login-form">
          <h2>Sign in to continue</h2> [cite: 1246]
          <p>Select your role and enter your credentials to access the system.</p> [cite: 1247]

          <div className="form-group">
            <label>Role</label> [cite: 1249]
            <select value={role} onChange={(e) => setRole(e.target.value)}> [cite: 1250]
              <option value="admin">Admin</option> [cite: 1251]
              <option value="employee">Employee</option> [cite: 1252]
            </select>
            <div className="helper-text">
              Admin → full access (Dashboard, Orders, Inventory, Reports). 
              Employee → limited access (Dashboard, Orders only). [cite: 1254, 1255, 1256]
            </div>
          </div>

          <div className="form-group">
            <label>Username / ID</label> [cite: 1260]
            <input
              type="text"
              placeholder="Enter your ID or Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /> [cite: 1261, 1262, 1263, 1264]
          </div>

          <div className="form-group">
            <label>Password</label> [cite: 1269]
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /> [cite: 1270, 1271, 1273, 1274, 1275]
          </div>

          <div className="actions">
            <div className="remember">
              <input type="checkbox" />
              <label>Remember this device</label> [cite: 1279, 1280, 1281]
            </div>
            <button className="btn-primary" onClick={handleLogin}>Login</button> [cite: 1283, 1284]
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;