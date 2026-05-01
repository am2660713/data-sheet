/* global Chart */
import { useAppContext } from "../context/AppContext";
import { useEffect, useRef } from "react";

export default function YearlyTable() {
  const { monthly, yearlySummary } = useAppContext();
  const yearlyRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    if (typeof Chart === "undefined") return;
    if (yearlyRef.current) {
      const labels = monthly.map((item) => item.month.substring(0, 3));
      const existing = yearlyRef.current.chart;
      if (existing) existing.destroy();
      yearlyRef.current.chart = new Chart(yearlyRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Billable", data: monthly.map((item) => item.billable), backgroundColor: "#70ad47", borderRadius: 2 },
            { label: "Non-Billable", data: monthly.map((item) => item.nonBillable), backgroundColor: "#9dc3e6", borderRadius: 2 },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true } } },
      });
    }
    if (typeof Chart !== "undefined" && pieRef.current) {
      const existingPie = pieRef.current.chart;
      if (existingPie) existingPie.destroy();
      const billable = monthly.reduce((sum, item) => sum + item.billable, 0);
      const nonBillable = monthly.reduce((sum, item) => sum + item.nonBillable, 0);
      pieRef.current.chart = new Chart(pieRef.current, {
        type: "doughnut",
        data: {
          labels: ["Billable", "Non-Billable"],
          datasets: [{ data: [billable, nonBillable], backgroundColor: ["#70ad47", "#9dc3e6"], borderWidth: 2 }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
      });
    }
  }, [monthly]);

  return (
    <>
      <div className="summary-bar">
        <div className="stat-card"><div className="stat-val">{yearlySummary.total.toFixed(1)}</div><div className="stat-lbl">Total Hours (Year)</div></div>
        <div className="stat-card"><div className="stat-val">{yearlySummary.billable.toFixed(1)}</div><div className="stat-lbl">Billable Hours</div></div>
        <div className="stat-card"><div className="stat-val">{yearlySummary.nonBillable.toFixed(1)}</div><div className="stat-lbl">Non-Billable Hours</div></div>
        <div className="stat-card"><div className="stat-val">{yearlySummary.billablePct}%</div><div className="stat-lbl">Billable % (Year)</div></div>
        <div style={{ flex: 1 }}></div>
      </div>

      <div className="chart-area" style={{ gridTemplateColumns: "1.4fr 1fr", padding: 12 }}>
        <div className="chart-box">
          <div className="chart-title">📊 Monthly Hours Overview</div>
          <div className="chart-wrap" style={{ height: 300 }}>
            <canvas ref={yearlyRef} id="chartYearly" role="img" aria-label="Grouped bar chart of monthly billable and non-billable hours"></canvas>
          </div>
        </div>
        <div className="chart-box">
          <div className="chart-title">📈 Billable vs Non-Billable (Selected Months)</div>
          <div className="chart-wrap" style={{ height: 300 }}>
            <canvas ref={pieRef} id="chartPie" role="img" aria-label="Doughnut chart of billable vs non-billable hours"></canvas>
          </div>
        </div>
      </div>

      <div style={{ padding: 12, background: "white", borderTop: "1px solid #ddd" }}>
        <div className="chart-title" style={{ marginBottom: 10 }}>📅 Monthly Billing Details</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 12px", textAlign: "left", color: "#1f5c99" }}>Month</th>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 12px", textAlign: "right", color: "#1f5c99" }}>Total Hrs</th>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 12px", textAlign: "right", color: "#375623" }}>Billable</th>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 12px", textAlign: "right", color: "#843c0c" }}>Non-Billable</th>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 12px", textAlign: "right", color: "#1f5c99" }}>Billable %</th>
              <th style={{ background: "#dce6f1", border: "1px solid #9bc2e6", padding: "5px 12px", textAlign: "left", color: "#1f5c99" }}>Progress</th>
            </tr>
          </thead>
          <tbody id="yearlyBody">
            {monthly.map((month, index) => {
              const pct = month.total > 0 ? ((month.billable / month.total) * 100).toFixed(1) : 0;
              const barW = Math.round(pct);
              const rowBg = index % 2 === 0 ? "#ffffff" : "#f9fbfd";
              return (
                <tr key={month.month} style={{ background: rowBg }}>
                  <td style={{ border: "1px solid #d9d9d9", padding: "4px 12px", fontWeight: 600 }}>{month.month}</td>
                  <td style={{ border: "1px solid #d9d9d9", padding: "4px 12px", textAlign: "right" }}>{month.total.toFixed(1)}</td>
                  <td style={{ border: "1px solid #d9d9d9", padding: "4px 12px", textAlign: "right", color: "#375623", fontWeight: 600 }}>{month.billable.toFixed(1)}</td>
                  <td style={{ border: "1px solid #d9d9d9", padding: "4px 12px", textAlign: "right", color: "#843c0c" }}>{month.nonBillable.toFixed(1)}</td>
                  <td style={{ border: "1px solid #d9d9d9", padding: "4px 12px", textAlign: "right", fontWeight: 600 }}>{pct}%</td>
                  <td style={{ border: "1px solid #d9d9d9", padding: "4px 12px" }}>
                    <div style={{ background: "#e9ecef", borderRadius: 2, height: 12, width: "100%", minWidth: 80 }}>
                      <div style={{ background: pct > 50 ? "#70ad47" : "#ffc000", height: 12, width: `${barW}%`, borderRadius: 2, transition: "width 0.3s" }}></div>
                    </div>
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
