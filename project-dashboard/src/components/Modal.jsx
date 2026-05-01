import { useAppContext } from "../context/AppContext";

export default function Modal() {
  const { modalOpen, closeModal, modalValues, setModalValues, saveProject } = useAppContext();
  if (!modalOpen) return null;

  return (
    <div id="modal" className="modal" role="dialog" aria-hidden={!modalOpen} style={{ display: "flex" }}>
      <div className="panel" role="document">
        <h3 id="modalTitle">{modalValues.name ? "Edit Project" : "Add Project"}</h3>
<div className="grid">
<input placeholder="Project name *" required value={modalValues.name} onChange={(e) => setModalValues((prev) => ({ ...prev, name: e.target.value.replace(/[0-9]/g, "") }))} pattern="[^0-9]*" />
          <input placeholder="Client *" required value={modalValues.client} onChange={(e) => setModalValues((prev) => ({ ...prev, client: e.target.value.replace(/[0-9]/g, "") }))} pattern="[^0-9]*" />
          <input placeholder="Product line *" required value={modalValues.product} onChange={(e) => setModalValues((prev) => ({ ...prev, product: e.target.value.replace(/[0-9]/g, "") }))} pattern="[^0-9]*" />
          <input placeholder="Job type" value={modalValues.jobType} onChange={(e) => setModalValues((prev) => ({ ...prev, jobType: e.target.value }))} />
          <input placeholder="Total hours" type="number" step="0.1" value={modalValues.hours} onChange={(e) => setModalValues((prev) => ({ ...prev, hours: e.target.value }))} />
          <input placeholder="Web Version" value={modalValues.web} onChange={(e) => setModalValues((prev) => ({ ...prev, web: e.target.value }))} />
          <select value={modalValues.status} onChange={(e) => setModalValues((prev) => ({ ...prev, status: e.target.value }))}>
            <option>Delivered</option>
            <option>In Progress</option>
            <option>Pending Approval</option>
            <option>Blocked</option>
          </select>
          <select value={modalValues.timesheet} onChange={(e) => setModalValues((prev) => ({ ...prev, timesheet: e.target.value }))}>
            <option>Delivered</option>
            <option>—</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="actions">
          <button className="ribbon-btn" onClick={closeModal}>Cancel</button>
          <button className="ribbon-btn active" onClick={saveProject}>Save</button>
        </div>
      </div>
    </div>
  );
}
