import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

const AUTH_USER_KEY = "project-dashboard-auth-user";
const AUTH_ENABLED_KEY = "project-dashboard-authenticated";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) {
      setError("No account found. Please sign up first.");
      return;
    }

    const user = JSON.parse(rawUser);
    if (user.email !== email || user.password !== password) {
      setError("Incorrect email or password.");
      return;
    }

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
          <h1>Welcome back</h1>
          <p>Sign in to continue managing your projects, tracking hours, and reviewing analytics in one place.</p>
          <div className="auth-highlight">Fast. Secure. Responsive.</div>
        </div>

        <div className="auth-main">
          <div className="auth-header">
            <span>Sign in</span>
            <h2>Secure access</h2>
            <p>Enter your credentials to access the dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
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

            {error && <div className="auth-alert">{error}</div>}

            <button className="primary-button" type="submit">
              Sign In
            </button>

            <div className="auth-footer">
              <span>New here?</span>
              <Link to="/signup">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
