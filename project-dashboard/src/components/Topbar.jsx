export default function Topbar() {
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
      <div className="topbar-tabs">
        <div className="topbar-tab">File</div>
        <div className="topbar-tab active">Home</div>
        <div className="topbar-tab">Insert</div>
        <div className="topbar-tab">View</div>
        <div className="topbar-tab">Data</div>
      </div>
    </div>
  );
}