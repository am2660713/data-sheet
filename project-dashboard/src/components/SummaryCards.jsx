import { useAppContext } from "../context/AppContext";

export default function SummaryCards() {
  const { summary } = useAppContext();

  return (
    <div className="summary-bar">
      <div className="stat-card">
        <div className="stat-val">{summary.total}</div>
        <div className="stat-lbl">Total Projects</div>
      </div>
      <div className="stat-card">
        <div className="stat-val">{summary.delivered}</div>
        <div className="stat-lbl">Delivered</div>
      </div>
      <div className="stat-card">
        <div className="stat-val">{summary.inProgress}</div>
        <div className="stat-lbl">In Progress</div>
      </div>
      <div className="stat-card">
        <div className="stat-val">{summary.hours}</div>
        <div className="stat-lbl">Total Hours</div>
      </div>
      <div className="stat-card">
        <div className="stat-val">{summary.clients}</div>
        <div className="stat-lbl">Clients</div>
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ fontSize: 11, color: "#555", fontWeight: 600 }}>
        👤 Employee Project Dashboard
      </div>
    </div>
  );
}
