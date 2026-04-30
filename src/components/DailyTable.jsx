import { useAppContext } from "../context/AppContext";
import { useState } from "react";

export default function DailyTable() {
  const { activeMonth, setMonth, daily, dailySummary, addDailyEntry, updateDailyEntry, deleteDailyEntry, projects } = useAppContext();
  const [form, setForm] = useState({ date: "", day: "", client: "", project: "", jobType: "", b: "", nb: "" });
  const [editIndex, setEditIndex] = useState(-1);
  const [error, setError] = useState("");

  const rows = daily[activeMonth] || [];

  const updateProjectSelection = (projectName) => {
    const selected = projects.find((item) => item.name === projectName);
    setForm((prev) => ({
      ...prev,
      project: projectName,
      client: selected ? selected.client : prev.client,
      jobType: selected ? selected.jobType : prev.jobType,
    }));
  };

  const handleSubmit = () => {
    if (!form.date || !form.project) {
      setError("Please choose a date and project before saving.");
      return;
    }

    const entry = {
      ...form,
      day: form.day.trim() || new Date(form.date).toLocaleString("en-US", { weekday: "long" }),
    };

    const success = editIndex >= 0
      ? updateDailyEntry(activeMonth, editIndex, entry)
      : addDailyEntry(entry);

    if (!success) return;

    setForm({ date: "", day: "", client: "", project: "", jobType: "", b: "", nb: "" });
    setEditIndex(-1);
    setError("");
  };

  const handleEdit = (index) => {
    const row = rows[index];
    if (!row) return;
    setForm({
      date: row.date,
      day: row.day,
      client: row.client,
      project: row.project,
      jobType: row.jobType,
      b: row.b,
      nb: row.nb,
    });
    setEditIndex(index);
    setError("");
  };

  const handleDelete = (index) => {
    deleteDailyEntry(activeMonth, index);
    if (editIndex === index) {
      setForm({ date: "", day: "", client: "", project: "", jobType: "", b: "", nb: "" });
      setEditIndex(-1);
      setError("");
    }
  };

  const handleCancelEdit = () => {
    setForm({ date: "", day: "", client: "", project: "", jobType: "", b: "", nb: "" });
    setEditIndex(-1);
    setError("");
  };

  return (
    <>
      <div className="month-filter">
        {Object.keys(daily).map((month) => (
          <button
            key={month}
            className={`month-btn ${activeMonth === month ? "active" : ""}`}
            onClick={() => setMonth(month)}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="daily-entry-row">
        <label className="daily-field">
          <span>Date</span>
          <input
            className="small-input"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </label>

        <label className="daily-field">
          <span>Day</span>
          <input
            className="small-input"
            type="text"
            placeholder="Optional"
            value={form.day}
            onChange={(e) => setForm((prev) => ({ ...prev, day: e.target.value }))}
          />
        </label>

        <label className="daily-field">
          <span>Project</span>
          <select
            className="small-input"
            value={form.project}
            onChange={(e) => updateProjectSelection(e.target.value)}
          >
            <option value="">Select project...</option>
            {projects.map((project) => (
              <option key={project.sr} value={project.name}>{project.name}</option>
            ))}
          </select>
        </label>

        <label className="daily-field">
          <span>Client</span>
          <input
            className="small-input"
            type="text"
            placeholder="Client"
            value={form.client}
            onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
          />
        </label>

        <label className="daily-field">
          <span>Job Type</span>
          <input
            className="small-input"
            type="text"
            placeholder="Job Type"
            value={form.jobType}
            onChange={(e) => setForm((prev) => ({ ...prev, jobType: e.target.value }))}
          />
        </label>

        <label className="daily-field">
          <span>Billable</span>
          <input
            className="small-input"
            type="number"
            step="0.1"
            placeholder="Billable"
            value={form.b}
            onChange={(e) => {
              const value = e.target.value;
              const billable = Number(value);
              let nonBillable = form.nb;
              if (value !== "" && nonBillable === "" && !Number.isNaN(billable)) {
                nonBillable = Math.max(0, Number((8.5 - billable).toFixed(1))).toString();
              }
              setForm((prev) => ({ ...prev, b: value, nb: nonBillable }));
            }}
          />
        </label>

        <label className="daily-field">
          <span>Non-Billable</span>
          <input
            className="small-input"
            type="number"
            step="0.1"
            placeholder="Non-Billable"
            value={form.nb}
            onChange={(e) => setForm((prev) => ({ ...prev, nb: e.target.value }))}
          />
        </label>

        <button className="ribbon-btn active" style={{ minWidth: 120 }} onClick={handleSubmit}>
          {editIndex >= 0 ? "Update Entry" : "Add Entry"}
        </button>
        {editIndex >= 0 && (
          <button className="ribbon-btn" style={{ minWidth: 120, borderColor: "#bbb" }} onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      {error && (
        <div style={{ margin: "6px 12px", padding: "10px 12px", background: "#fdecea", color: "#912d2b", borderRadius: 8, border: "1px solid #f5c6cb" }}>
          {error}
        </div>
      )}

      <div className="summary-bar" id="dailySummary">
        <div className="stat-card"><div className="stat-val">{dailySummary.days}</div><div className="stat-lbl">Working Days</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: "#375623" }}>{dailySummary.billable.toFixed(1)}</div><div className="stat-lbl">Billable Hrs</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: "#843c0c" }}>{dailySummary.nonBillable.toFixed(1)}</div><div className="stat-lbl">Non-Billable Hrs</div></div>
        <div className="stat-card"><div className="stat-val">{dailySummary.total.toFixed(1)}</div><div className="stat-lbl">Total Hours</div></div>
        <div className="stat-card"><div className="stat-val">{dailySummary.billablePct}%</div><div className="stat-lbl">Billable %</div></div>
      </div>

      <div className="table-container" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <table id="dailyTable">
          <thead>
            <tr>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 10px", minWidth: 36 }}>#</th>
              <th>Date</th>
              <th>Day</th>
              <th>Client</th>
              <th>Project Name</th>
              <th>Job Type</th>
              <th>Billable Hrs</th>
              <th>Non-Billable Hrs</th>
              <th>Total Hrs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="dailyBody">
            {rows.map((row, index) => {
              const total = (Number(row.b) || 0) + (Number(row.nb) || 0);
              const cls = row.jobType === "Holiday" ? "holiday-row" : ["Saturday", "Sunday"].includes(row.day) ? "weekend-row" : "";
              return (
                <tr key={`${row.date}-${index}`} className={cls}>
                  <td className="row-num">{index + 1}</td>
                  <td>{row.date}</td>
                  <td>{row.day}</td>
                  <td>{row.client}</td>
                  <td>{row.project}</td>
                  <td>{row.jobType}</td>
                  <td style={{ textAlign: "right" }}>{row.b || "—"}</td>
                  <td style={{ textAlign: "right" }}>{row.nb || "—"}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{total || "—"}</td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <button className="action-btn" type="button" onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                    <button className="action-btn del" type="button" onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
