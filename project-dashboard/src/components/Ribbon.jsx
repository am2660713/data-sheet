import { useAppContext } from "../context/AppContext";

export default function Ribbon() {
  const { exportCSV, toggleFilters, toggleCharts, filtersVisible, searchQuery, setSearchQuery, openAddProject, clearFilters, summary } = useAppContext();

  return (
    <div className="ribbon">
      <button className="ribbon-btn" onClick={exportCSV}>
        💾 Export CSV
      </button>
      <div className="ribbon-sep"></div>
      <button className="ribbon-btn active" id="btnAdd" onClick={openAddProject}>
        ➕ Add Project
      </button>
      <div className="ribbon-sep"></div>
      <button className={`ribbon-btn ${filtersVisible ? "active" : ""}`} id="btnFilters" onClick={toggleFilters}>
        ⬇ Filters
      </button>
      <button className="ribbon-btn" onClick={clearFilters}>
        ❌ Clear Filters
      </button>
      <div className="ribbon-sep"></div>
      <button className="ribbon-btn" onClick={toggleCharts}>
        📊 Charts
      </button>
      <div className="ribbon-sep"></div>
      <input
        className="search-box"
        type="text"
        id="searchBox"
        placeholder="🔎 Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="ribbon-sep"></div>
      <span style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>
        Rows: <b id="rowCount">{summary.total}</b>
      </span>
    </div>
  );
}
