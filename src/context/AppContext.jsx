import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_USER_KEY = "project-dashboard-auth-user";
const AUTH_ENABLED_KEY = "project-dashboard-authenticated";
const STORAGE_KEY_BASE = "project_data_2026_v1_";

const defaultProjects = [];

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
  const [authUser, setAuthUser] = useState(null);
  const [storageKey, setStorageKey] = useState(STORAGE_KEY_BASE + "guest");
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
    const loadUser = () => {
      const rawUser = localStorage.getItem(AUTH_USER_KEY);
      const isAuthenticated = localStorage.getItem(AUTH_ENABLED_KEY) === "true";
      if (!rawUser || !isAuthenticated) return;
      try {
        const user = JSON.parse(rawUser);
        const key = STORAGE_KEY_BASE + encodeURIComponent(user.email);
        setAuthUser(user);
        setStorageKey(key);
        const raw = localStorage.getItem(key);
        if (!raw) return;
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
    };

    loadUser();
    const handleAuthChange = () => loadUser();
    window.addEventListener("app-auth-updated", handleAuthChange);
    return () => window.removeEventListener("app-auth-updated", handleAuthChange);
  }, []);

  useEffect(() => {
    saveToStorage();
  }, [projects, daily, monthly, authUser, storageKey]);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, filters]);

  useEffect(() => {
    recalcMonthlyTotals();
  }, [daily]);

  function saveToStorage() {
    if (!authUser || !storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ projects, daily, monthly }));
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
      project.name,
      project.client,
      project.product,
      project.jobType,
      project.hours,
      project.web,
      project.status,
      project.timesheet,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "projects.csv";
    link.click();
  }

  function applyFilters() {
    let results = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((project) =>
        project.name.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.product.toLowerCase().includes(q)
      );
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (!value.trim()) return;
      const idx = parseInt(key.replace("f", ""));
      const fields = ["sr", "name", "client", "product", "jobType", , "web", "status", "timesheet"];
      const field = fields[idx];
      if (!field) return;
      results = results.filter((p) => String(p[field]).toLowerCase().includes(value.toLowerCase()));
    });
    setFilteredProjects(results);
  }

  function clearFilters() {
    setSearchQuery("");
    setFilters({ f0: "", f1: "", f2: "", f3: "", f4: "", f6: "", f7: "", f8: "" });
  }

  function sortTable(field) {
    const direction = sortDir[field] === "asc" ? "desc" : "asc";
    const sorted = [...filteredProjects].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    setFilteredProjects(sorted);
    setSortDir({ ...sortDir, [field]: direction });
  }

  function deleteProject(sr) {
    setProjects((prev) => prev.filter((p) => p.sr !== sr));
  }

  function openAddProject() {
    setEditingIndex(-1);
    setModalValues(defaultModalValues);
    setModalOpen(true);
  }

  function editProject(sr) {
    const project = projects.find((p) => p.sr === sr);
    if (!project) return;
    setEditingIndex(sr);
    setModalValues(project);
    setModalOpen(true);
  }

  function saveProject() {
    const { name, client, product, jobType, hours, web, status, timesheet } = modalValues;
    if (!name.trim() || !client.trim()) {
      alert("Project name and client are required.");
      return;
    }
    if (editingIndex >= 0) {
      setProjects((prev) =>
        prev.map((p) =>
          p.sr === editingIndex
            ? { ...p, name: name.trim(), client: client.trim(), product: product.trim(), jobType: jobType.trim(), hours: Number(hours) || 0, web: web.trim(), status, timesheet }
            : p
        )
      );
    } else {
      const newSr = projects.length > 0 ? Math.max(...projects.map((p) => p.sr)) + 1 : 1;
      setProjects((prev) => [
        ...prev,
        { sr: newSr, name: name.trim(), client: client.trim(), product: product.trim(), jobType: jobType.trim(), hours: Number(hours) || 0, web: web.trim(), status, timesheet },
      ]);
    }
    closeModal();
  }

  function closeModal() {
    setModalOpen(false);
    setEditingIndex(-1);
    setModalValues(defaultModalValues);
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

  function logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_ENABLED_KEY);
    localStorage.removeItem(storageKey);
    setAuthUser(null);
    setStorageKey(STORAGE_KEY_BASE + "guest");
    setProjects(defaultProjects);
    setDaily(initialDaily);
    setMonthly(initialMonthly);
    setFilteredProjects(defaultProjects);
  }

  function toggleFilters() {
    setFiltersVisible(!filtersVisible);
  }

  function toggleCharts() {
    setChartsVisible(!chartsVisible);
  }

  const summary = useMemo(() => {
    const total = filteredProjects.length;
    const billable = filteredProjects.reduce((sum, p) => sum + (Number(p.hours) || 0), 0);
    const clients = new Set(filteredProjects.map((p) => p.client)).size;
    return { total, billable, clients };
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
        authUser,
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
        logout,
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
