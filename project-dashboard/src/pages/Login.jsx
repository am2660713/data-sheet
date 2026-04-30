import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span>Welcome Back</span>
          <h2>Sign in to Project Data</h2>
          <p>Access your dashboard, track tasks, and explore performance metrics.</p>
        </div>

        <div className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-button" onClick={handleLogin}>
            Sign In
          </button>

          <div className="auth-footer">
            <span>New here?</span>
            <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
