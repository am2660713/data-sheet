import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "project_data_2026_v1";

const defaultProjects = [
  { sr: 1, name: "Lancaster High School", client: "AES", product: "Honeywell", jobType: "Software", hours: 35, web: "4.15", status: "Delivered", timesheet: "Delivered" },
  { sr: 2, name: "EBR - Professional Development Center (PDC)", client: "Synergy Building Solutions", product: "Reliable Controls", jobType: "Software", hours: 30, web: "—", status: "Delivered", timesheet: "Delivered" },
  { sr: 3, name: "DPR Roche Molecular Pluto", client: "AME", product: "Honeywell", jobType: "Software", hours: 12, web: "4.15", status: "Delivered", timesheet: "Delivered" },
  { sr: 4, name: "NVCC - ManassasH&Creno", client: "ACES/Havtech", product: "Honeywell", jobType: "Software", hours: 90, web: "4.15", status: "Delivered", timesheet: "Delivered" },
  { sr: 5, name: "EH Wesley Chapel", client: "MechTrend", product: "Honeywell", jobType: "Software", hours: 76, web: "4.15", status: "Delivered", timesheet: "Delivered" },
  { sr: 6, name: "Jackson-Milton ES RTU Upgrade", client: "CCO", product: "Reliable Controls", jobType: "Software", hours: 5, web: "—", status: "Delivered", timesheet: "Delivered" },
  { sr: 7, name: "York Middle School", client: "AES", product: "Honeywell", jobType: "Software", hours: 38, web: "4.15", status: "Delivered", timesheet: "Delivered" },
  { sr: 8, name: "Rankin Family Recreation Center", client: "AES", product: "Honeywell", jobType: "Software", hours: 42, web: "4.15", status: "Delivered", timesheet: "Delivered" },
  { sr: 9, name: "Xavier South Central Plant", client: "Synergy Building Solutions", product: "Reliable Controls", jobType: "Software", hours: 12, web: "—", status: "Delivered", timesheet: "Delivered" },
  { sr: 10, name: "Chalmette High CAC Library", client: "Synergy Building Solutions", product: "Reliable Controls", jobType: "Software", hours: 6, web: "—", status: "Delivered", timesheet: "—" },
  { sr: 11, name: "Optimizer Standard Programs", client: "ACES", product: "Honeywell", jobType: "Software", hours: 0, web: "4.15", status: "In Progress", timesheet: "—" },
];

const initialDaily = {
  January: [],
  February: [],
  March: [],
  April: [],
  May: [],
  June: [],
  July: [],
  August: [],
  September: [],
  October: [],
  November: [],
  December: [],
};

const initialMonthly = [
  { month: "January", total: 0, billable: 0, nonBillable: 0 },
  { month: "February", total: 0, billable: 0, nonBillable: 0 },
  { month: "March", total: 0, billable: 0, nonBillable: 0 },
  { month: "April", total: 0, billable: 0, nonBillable: 0 },
  { month: "May", total: 0, billable: 0, nonBillable: 0 },
  { month: "June", total: 0, billable: 0, nonBillable: 0 },
  { month: "July", total: 0, billable: 0, nonBillable: 0 },
  { month: "August", total: 0, billable: 0, nonBillable: 0 },
  { month: "September", total: 0, billable: 0, nonBillable: 0 },
  { month: "October", total: 0, billable: 0, nonBillable: 0 },
  { month: "November", total: 0, billable: 0, nonBillable: 0 },
  { month: "December", total: 0, billable: 0, nonBillable: 0 },
];

const defaultModalValues = {
  name: "",
  client: "",
  product: "",
  jobType: "",
  hours: "",
  web: "",
  status: "Delivered",
  timesheet: "Delivered",
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [projects, setProjects] = useState(defaultProjects);
  const [daily, setDaily] = useState(initialDaily);
  const [monthly, setMonthly] = useState(initialMonthly);
  const [filteredProjects, setFilteredProjects] = useState(defaultProjects);
  const [activeSheet, setActiveSheet] = useState("projects");
  const [activeMonth, setActiveMonth] = useState("January");
  const [chartsVisible, setChartsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [modalValues, setModalValues] = useState(defaultModalValues);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ f0: "", f1: "", f2: "", f3: "", f4: "", f6: "", f7: "", f8: "" });
  const [sortDir, setSortDir] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      if (Array.isArray(obj.projects) && obj.projects.length) {
        setProjects(obj.projects);
        setFilteredProjects(obj.projects);
      }
      if (obj.daily && typeof obj.daily === "object") {
        setDaily({ ...initialDaily, ...obj.daily });
      }
      if (Array.isArray(obj.monthly) && obj.monthly.length) {
        setMonthly(obj.monthly);
      }
    } catch (error) {
      console.warn("Invalid stored data", error);
    }
  }, []);

  useEffect(() => {
    saveToStorage();
  }, [projects, daily, monthly]);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, filters]);

  useEffect(() => {
    recalcMonthlyTotals();
  }, [daily]);

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, daily, monthly }));
  }

  function recalcMonthlyTotals() {
    setMonthly((prev) =>
      prev.map((entry) => {
        const rows = daily[entry.month] || [];
        const billable = rows.reduce((sum, row) => sum + (Number(row.b) || 0), 0);
        const nonBillable = rows.reduce((sum, row) => sum + (Number(row.nb) || 0), 0);
        return {
          ...entry,
          total: billable + nonBillable,
          billable,
          nonBillable,
        };
      })
    );
  }

  function exportCSV() {
    const headers = ["Sr", "Project Name", "Client", "Product Line", "Job Type", "Hours", "WEB Version", "Status", "Timesheet"];
    const rows = filteredProjects.map((project) => [
      project.sr,
      `"${project.name}"`,
      `"${project.client}"`,
      project.product,
      project.jobType,
      project.hours || 0,
      project.web,
      project.status,
      project.timesheet,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Project_Data_2026.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function applyFilters() {
    const query = searchQuery.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const rowValues = [project.sr, project.name, project.client, project.product, project.jobType, project.hours, project.web, project.status, project.timesheet];
      if (query && !rowValues.some((value) => String(value || "").toLowerCase().includes(query))) {
        return false;
      }
      if (filters.f0 && !String(project.sr).includes(filters.f0)) return false;
      if (filters.f1 && !project.name.toLowerCase().includes(filters.f1.toLowerCase())) return false;
      if (filters.f2 && project.client !== filters.f2) return false;
      if (filters.f3 && project.product !== filters.f3) return false;
      if (filters.f4 && project.jobType !== filters.f4) return false;
      if (filters.f6 && project.web !== filters.f6) return false;
      if (filters.f7 && project.status !== filters.f7) return false;
      if (filters.f8 && project.timesheet !== filters.f8) return false;
      return true;
    });
    setFilteredProjects(filtered);
  }

  function clearFilters() {
    setSearchQuery("");
    setFilters({ f0: "", f1: "", f2: "", f3: "", f4: "", f6: "", f7: "", f8: "" });
  }

  function sortTable(columnIndex) {
    const keys = ["sr", "name", "client", "product", "jobType", "hours", "web", "status", "timesheet"];
    const key = keys[columnIndex];
    if (!key) return;
    const direction = !sortDir[columnIndex];
    setSortDir({ ...sortDir, [columnIndex]: direction });
    const sorted = [...filteredProjects].sort((a, b) => {
      const va = String(a[key] || "").toLowerCase();
      const vb = String(b[key] || "").toLowerCase();
      if (va < vb) return direction ? -1 : 1;
      if (va > vb) return direction ? 1 : -1;
      return 0;
    });
    setFilteredProjects(sorted);
  }

  function deleteProject(index) {
    const project = filteredProjects[index];
    if (!project) return;
    const next = projects.filter((item) => item.sr !== project.sr);
    next.forEach((item, idx) => {
      item.sr = idx + 1;
    });
    setProjects(next);
  }

  function openAddProject() {
    setEditingIndex(-1);
    setModalValues(defaultModalValues);
    setModalOpen(true);
  }

  function editProject(index) {
    const project = filteredProjects[index];
    if (!project) return;
    const realIndex = projects.findIndex((item) => item.sr === project.sr);
    setEditingIndex(realIndex);
    setModalValues({
      name: project.name,
      client: project.client,
      product: project.product,
      jobType: project.jobType,
      hours: project.hours || "",
      web: project.web || "",
      status: project.status || "Delivered",
      timesheet: project.timesheet || "Delivered",
    });
    setModalOpen(true);
  }

  function saveProject() {
    const nextList = [...projects];
    const item = {
      sr: editingIndex >= 0 ? nextList[editingIndex]?.sr : nextList.length + 1,
      name: modalValues.name.trim(),
      client: modalValues.client.trim(),
      product: modalValues.product.trim(),
      jobType: modalValues.jobType.trim(),
      hours: Number(modalValues.hours) || 0,
      web: modalValues.web.trim() || "—",
      status: modalValues.status,
      timesheet: modalValues.timesheet,
    };
    if (!item.name) return;
    if (editingIndex >= 0 && nextList[editingIndex]) {
      nextList[editingIndex] = item;
    } else {
      nextList.push(item);
    }
    nextList.forEach((project, idx) => { project.sr = idx + 1; });
    setProjects(nextList);
    setModalOpen(false);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function calculateProjectUsage(projectName, exclude = null) {
    const projectKey = projectName.trim();
    return Object.entries(daily).reduce((sum, [month, rows]) => {
      return (
        sum +
        rows.reduce((rowSum, row, index) => {
          if (row.project !== projectKey) return rowSum;
          if (exclude && exclude.month === month && exclude.index === index) return rowSum;
          return rowSum + (Number(row.b) || 0) + (Number(row.nb) || 0);
        }, 0)
      );
    }, 0);
  }

  function getProjectTotalHours(projectName) {
    const project = projects.find((item) => item.name === projectName.trim());
    return Number(project?.hours) || 0;
  }

  function validateDailyEntry(entry, exclude = null) {
    const projectName = entry.project.trim();
    if (!projectName) return { valid: true };
    const totalHours = getProjectTotalHours(projectName);
    if (!totalHours) return { valid: true };
    const currentUsage = calculateProjectUsage(projectName, exclude);
    const newEntryHours = (Number(entry.b) || 0) + (Number(entry.nb) || 0);
    const remaining = totalHours - currentUsage;
    if (newEntryHours > remaining) {
      return {
        valid: false,
        message: `Project '${projectName}' only has ${remaining.toFixed(1)}h remaining. This entry requires ${newEntryHours.toFixed(1)}h.`,
      };
    }
    return { valid: true };
  }

  function addDailyEntry(entry) {
    const date = entry.date.trim();
    if (!date) return false;
    const validation = validateDailyEntry(entry);
    if (!validation.valid) {
      alert(validation.message);
      return false;
    }
    const parsed = new Date(date);
    const monthName = parsed.toLocaleString("en-US", { month: "long" }) || activeMonth;
    const dayName = entry.day.trim() || parsed.toLocaleString("en-US", { weekday: "long" });
    const nextDaily = { ...daily };
    nextDaily[monthName] = nextDaily[monthName] ? [...nextDaily[monthName]] : [];
    nextDaily[monthName].push({
      date,
      day: dayName,
      client: entry.client.trim(),
      project: entry.project.trim(),
      jobType: entry.jobType.trim() || "Work",
      b: Number(entry.b) || 0,
      nb: Number(entry.nb) || 0,
    });
    setDaily(nextDaily);
    setActiveMonth(monthName);
    return true;
  }

  function updateDailyEntry(month, index, entry) {
    const date = entry.date.trim();
    if (!date) return false;
    const validation = validateDailyEntry(entry, { month, index });
    if (!validation.valid) {
      alert(validation.message);
      return false;
    }
    const parsed = new Date(date);
    const monthName = parsed.toLocaleString("en-US", { month: "long" }) || month;
    const dayName = entry.day.trim() || parsed.toLocaleString("en-US", { weekday: "long" });
    const nextDaily = { ...daily };
    if (!nextDaily[monthName]) nextDaily[monthName] = [];
    const updatedEntry = {
      date,
      day: dayName,
      client: entry.client.trim(),
      project: entry.project.trim(),
      jobType: entry.jobType.trim() || "Work",
      b: Number(entry.b) || 0,
      nb: Number(entry.nb) || 0,
    };
    if (monthName === month) {
      nextDaily[monthName] = nextDaily[monthName].map((row, rowIndex) =>
        rowIndex === index ? updatedEntry : row
      );
    } else {
      nextDaily[month] = nextDaily[month]?.filter((_, rowIndex) => rowIndex !== index) || [];
      nextDaily[monthName] = [...(nextDaily[monthName] || []), updatedEntry];
    }
    setDaily(nextDaily);
    setActiveMonth(monthName);
    return true;
  }

  function deleteDailyEntry(month, index) {
    const nextDaily = { ...daily };
    nextDaily[month] = nextDaily[month]?.filter((_, rowIndex) => rowIndex !== index) || [];
    setDaily(nextDaily);
  }

  function setMonth(month) {
    setActiveMonth(month);
  }

  function switchSheet(name) {
    setActiveSheet(name);
  }

  function toggleFilters() {
    setFiltersVisible((value) => !value);
  }

  function toggleCharts() {
    setChartsVisible((value) => !value);
  }

  const summary = useMemo(() => {
    return {
      total: filteredProjects.length,
      delivered: filteredProjects.filter((project) => project.status === "Delivered").length,
      inProgress: filteredProjects.filter((project) => project.status === "In Progress").length,
      hours: filteredProjects.reduce((sum, project) => sum + (Number(project.hours) || 0), 0),
      clients: new Set(filteredProjects.map((project) => project.client)).size,
    };
  }, [filteredProjects]);

  const dailySummary = useMemo(() => {
    const rows = daily[activeMonth] || [];
    const billable = rows.reduce((sum, row) => sum + (Number(row.b) || 0), 0);
    const nonBillable = rows.reduce((sum, row) => sum + (Number(row.nb) || 0), 0);
    const total = billable + nonBillable;
    return {
      days: rows.length,
      billable,
      nonBillable,
      total,
      billablePct: total > 0 ? ((billable / total) * 100).toFixed(1) : 0,
    };
  }, [daily, activeMonth]);

  const yearlySummary = useMemo(() => {
    const total = monthly.reduce((sum, item) => sum + item.total, 0);
    const billable = monthly.reduce((sum, item) => sum + item.billable, 0);
    return {
      total,
      billable,
      nonBillable: total - billable,
      billablePct: total > 0 ? ((billable / total) * 100).toFixed(1) : 0,
    };
  }, [monthly]);

  return (
    <AppContext.Provider
      value={{
        projects,
        daily,
        monthly,
        filteredProjects,
        activeSheet,
        activeMonth,
        chartsVisible,
        filtersVisible,
        modalOpen,
        editingIndex,
        modalValues,
        searchQuery,
        filters,
        summary,
        dailySummary,
        yearlySummary,
        setSearchQuery,
        setFilters,
        switchSheet,
        toggleFilters,
        toggleCharts,
        applyFilters,
        clearFilters,
        sortTable,
        deleteProject,
        openAddProject,
        editProject,
        saveProject,
        closeModal,
        setModalValues,
        addDailyEntry,
        updateDailyEntry,
        deleteDailyEntry,
        setMonth,
        exportCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
