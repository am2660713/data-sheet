import { useAppContext } from "../context/AppContext";

export default function Topbar() {
  const { authUser, logout } = useAppContext();

  return (
    <div className="topbar">
      <div className="topbar-logo">
        <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
        Project Data 2026
      </div>
      <div className="topbar-user">
        👤 {authUser?.name || "Guest"}
        {authUser && (
          <button className="logout-btn" onClick={logout} title="Logout">
            🚪
          </button>
        )}
      </div>
    </div>
  );
}
