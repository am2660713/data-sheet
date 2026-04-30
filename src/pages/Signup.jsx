import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

const AUTH_USER_KEY = "project-dashboard-auth-user";
const AUTH_ENABLED_KEY = "project-dashboard-authenticated";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUser = localStorage.getItem(AUTH_USER_KEY);
    if (existingUser) {
      setError("An account already exists. Please sign in.");
      return;
    }

    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ name: name.trim(), email: email.trim(), password })
    );
    localStorage.setItem(AUTH_ENABLED_KEY, "true");
    window.dispatchEvent(new Event("app-auth-updated"));
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-split">
        <div className="auth-side">
          <img className="auth-logo" src={heroImage} alt="ICT Solutions logo" />
          <div className="auth-tag">Project Data 2026</div>
          <h1>Create your account</h1>
          <p>Register quickly and securely to keep your project data, timesheet entries, and reports in sync.</p>
          <div className="auth-highlight">Secure onboarding with friendly UI.</div>
        </div>

        <div className="auth-main">
          <div className="auth-header">
            <span>Sign up</span>
            <h2>Get started</h2>
            <p>Enter your details to create a new dashboard account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <div className="auth-alert">{error}</div>}

            <button className="primary-button" type="submit">
              Create Account
            </button>

            <div className="auth-footer">
              <span>Already registered?</span>
              <Link to="/">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
