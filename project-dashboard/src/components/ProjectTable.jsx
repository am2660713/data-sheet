import { useAppContext } from "../context/AppContext";

export default function ProjectTable() {
  const { filteredProjects, sortTable, deleteProject, editProject, filtersVisible, filters, setFilters } = useAppContext();

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="table-container" id="projectTableContainer">
      <table id="projectTable">
        <thead>
          <tr>
            <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 8px", minWidth: 36 }}>#</th>
            <th onClick={() => sortTable(0)}>Sr. No <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(1)}>Project Name <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(2)}>Client <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(3)}>Product Line <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(4)}>Job Type <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(5)}>Total Hours <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(6)}>WEB Version <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(7)}>Current Status <span className="sort-icon">▼</span></th>
            <th onClick={() => sortTable(8)}>Timesheet <span className="sort-icon">▼</span></th>
            <th>Actions</th>
          </tr>
          <tr className="filter-row" id="filterRow" style={{ display: filtersVisible ? "table-row" : "none" }}>
            <th></th>
            <th><input type="text" value={filters.f0} onChange={(e) => updateFilter("f0", e.target.value)} placeholder="" /></th>
            <th><input type="text" value={filters.f1} onChange={(e) => updateFilter("f1", e.target.value)} placeholder="Search..." /></th>
            <th><input type="text" value={filters.f2} onChange={(e) => updateFilter("f2", e.target.value)} placeholder="Client" /></th>
            <th><input type="text" value={filters.f3} onChange={(e) => updateFilter("f3", e.target.value)} placeholder="Product" /></th>
            <th><input type="text" value={filters.f4} onChange={(e) => updateFilter("f4", e.target.value)} placeholder="Job type" /></th>
            <th></th>
            <th><input type="text" value={filters.f6} onChange={(e) => updateFilter("f6", e.target.value)} placeholder="WEB" /></th>
            <th><input type="text" value={filters.f7} onChange={(e) => updateFilter("f7", e.target.value)} placeholder="Status" /></th>
            <th><input type="text" value={filters.f8} onChange={(e) => updateFilter("f8", e.target.value)} placeholder="Timesheet" /></th>
            <th></th>
          </tr>
        </thead>
        <tbody id="projectBody">
          {filteredProjects.map((project, index) => (
            <tr key={project.sr}>
              <td className="row-num">{index + 1}</td>
              <td style={{ textAlign: "center" }}>{project.sr}</td>
              <td style={{ minWidth: 200 }}><b style={{ color: "#1f5c99" }}>{project.name}</b></td>
              <td>{project.client}</td>
              <td>{project.product}</td>
              <td>{project.jobType}</td>
              <td style={{ textAlign: "right" }}>{project.hours || "—"}</td>
              <td style={{ textAlign: "center" }}>{project.web}</td>
              <td>{project.status}</td>
              <td>{project.timesheet}</td>
              <td style={{ textAlign: "center" }}>
                <button className="action-btn" onClick={() => editProject(index)}>Edit</button>
                <button className="action-btn del" onClick={() => deleteProject(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
