import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    alert("Signup successful");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span>Create your account</span>
          <h2>Join Project Data</h2>
          <p>Start tracking your projects instantly with a polished analytics dashboard.</p>
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
            placeholder="Choose a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-button" onClick={handleSignup}>
            Create Account
          </button>

          <div className="auth-footer">
            <span>Already registered?</span>
            <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
