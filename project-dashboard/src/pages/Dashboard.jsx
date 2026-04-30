import Topbar from "../components/Topbar";
import Ribbon from "../components/Ribbon";
import SummaryCards from "../components/SummaryCards";
import ProjectTable from "../components/ProjectTable";
import DailyTable from "../components/DailyTable";
import YearlyTable from "../components/YearlyTable";
import Modal from "../components/Modal";
import { useAppContext } from "../context/AppContext";

export default function Dashboard() {
  const { activeSheet, switchSheet, chartsVisible, summary } = useAppContext();

  return (
    <div>
      <Topbar />
      <Ribbon />

      <div className="formula-bar">
        <span className="cell-ref">A1</span>
        <span style={{ color: "#999", fontSize: 13 }}>fx</span>
        <span id="cellVal" style={{ color: "#333" }}>
          Project Data Dashboard — A.Y. 2026
        </span>
      </div>

      <div className="sheet-tabs">
        <div className={`sheet-tab ${activeSheet === "projects" ? "active" : ""}`} onClick={() => switchSheet("projects")}>📄 Project Tracking</div>
        <div className={`sheet-tab ${activeSheet === "daily" ? "active" : ""}`} onClick={() => switchSheet("daily")}>📅 Daily Status Report</div>
        <div className={`sheet-tab ${activeSheet === "yearly" ? "active" : ""}`} onClick={() => switchSheet("yearly")}>📈 Yearly Summary</div>
      </div>

      <div className={`page ${activeSheet === "projects" ? "active" : ""}`} id="page-projects">
        <SummaryCards />
        <ProjectTable />
        <div id="chartsArea" style={{ display: chartsVisible ? "block" : "none" }}>
          <div className="chart-area">
            <div className="chart-box">
              <div className="chart-title">📊 Hours by Client</div>
              <div className="chart-wrap" style={{ height: 220 }}>
                <canvas id="chartClients" role="img" aria-label="Bar chart of total hours by client"></canvas>
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-title">📈 Project Status Distribution</div>
              <div className="chart-wrap" style={{ height: 220 }}>
                <canvas id="chartStatus" role="img" aria-label="Doughnut chart of project statuses"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`page ${activeSheet === "daily" ? "active" : ""}`} id="page-daily">
        <DailyTable />
      </div>

      <div className={`page ${activeSheet === "yearly" ? "active" : ""}`} id="page-yearly">
        <YearlyTable />
      </div>

      <Modal />

      <div className="status-bar">
        <span id="sbSheet">Sheet: {activeSheet === "projects" ? "Project Tracking" : activeSheet === "daily" ? "Daily Status Report" : "Yearly Summary"}</span>
        <span id="sbRows">Rows: {summary.total}</span>
        <span>A.Y. 2026</span>
        <span style={{ flex: 1 }}></span>
        <span>👤 Employee Project Data</span>
      </div>
    </div>
  );
}
