import React, { useState } from "react";
import "../styles/login.css";
import avatar from "../pages/avatar.png";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);
        // Llamar a la función onLogin con el token
        onLogin(data.token);
      } else {
        setError(data.message || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="avatar">
          <img src={avatar} alt="Avatar" className="avatar-img" />
        </div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="icon">&#128100;</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">&#128274;</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="login-actions">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
