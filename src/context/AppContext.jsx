import React, { createContext, useContext, useState, useCallback } from "react";
import {
  institutions as initialInstitutions,
  complaints as initialComplaints,
  relatedCases as initialRelatedCases,
  caseActions as initialCaseActions,
} from "../data/mockData";

const AppContext = createContext(null);

export const ROLES = {
  RB_OFFICER: "RB Officer",
  PGRC_OFFICER: "PGRC Officer",
  REGIONAL_OFFICE: "Regional Office (West)",
  SENIOR_MANAGEMENT: "Senior Management / Competent Authority",
};

export const VIEWS = {
  DASHBOARD: "dashboard",
  PRIORITY_QUEUE: "priority_queue",
  OVERLAP_DETECTION: "overlap_detection",
  INSTITUTION_PROFILE: "institution_profile",
  CASE_DETAIL: "case_detail",
  REPORTS: "reports",
};

export function AppProvider({ children }) {
  const [institutions, setInstitutions] = useState(initialInstitutions);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [relatedCases, setRelatedCases] = useState(initialRelatedCases);
  const [caseActions, setCaseActions] = useState(initialCaseActions);

  const [currentRole, setCurrentRole] = useState(ROLES.SENIOR_MANAGEMENT);
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const [caseDetailOpen, setCaseDetailOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [priorityOverrideModal, setPriorityOverrideModal] = useState(null); // caseId
  const [executiveBriefModal, setExecutiveBriefModal] = useState(null); // institutionId
  const [actionLockWarning, setActionLockWarning] = useState(null); // caseId

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    bureau: "All",
    region: "All",
    category: "All",
    status: "All",
    priority: "All",
    dateFrom: "",
    dateTo: "",
  });

  // Derived KPIs
  const kpis = React.useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const underProcess = complaints.filter((c) => c.status === "Under process").length;
    const disposed = complaints.filter((c) => c.status === "Disposed").length;
    const transferred = complaints.filter((c) => c.status === "Transferred").length;
    const overdue = complaints.filter((c) => c.isOverdue).length;
    const activeOverlaps = relatedCases.filter((r) => r.coordinationStatus !== "Resolved").length;
    const criticalHigh = complaints.filter(
      (c) => c.priorityLevel === "Critical" || c.priorityLevel === "High"
    ).length;
    return { total, pending, underProcess, disposed, transferred, overdue, activeOverlaps, criticalHigh };
  }, [complaints, relatedCases]);

  // Filtered complaints
  const filteredComplaints = React.useMemo(() => {
    return complaints.filter((c) => {
      const inst = institutions.find((i) => i.id === c.institutionId);
      const searchLower = filters.search.toLowerCase();
      if (
        filters.search &&
        !c.caseId.toLowerCase().includes(searchLower) &&
        !inst?.name.toLowerCase().includes(searchLower) &&
        !inst?.id.toLowerCase().includes(searchLower) &&
        !c.category.toLowerCase().includes(searchLower)
      )
        return false;
      if (filters.bureau !== "All" && c.assignedBureau !== filters.bureau) return false;
      if (filters.region !== "All" && inst?.region !== filters.region) return false;
      if (filters.status !== "All" && c.status !== filters.status) return false;
      if (filters.priority !== "All" && c.priorityLevel !== filters.priority) return false;
      if (filters.dateFrom && c.receiptDate < filters.dateFrom) return false;
      if (filters.dateTo && c.receiptDate > filters.dateTo) return false;
      return true;
    });
  }, [complaints, institutions, filters]);

  // Open case detail drawer
  const openCaseDetail = useCallback((caseId) => {
    setSelectedCaseId(caseId);
    setCaseDetailOpen(true);
  }, []);

  const closeCaseDetail = useCallback(() => {
    setCaseDetailOpen(false);
    setSelectedCaseId(null);
  }, []);

  // Override priority
  const overridePriority = useCallback(
    (caseId, newPriority, reason, actorName) => {
      setComplaints((prev) =>
        prev.map((c) =>
          c.caseId === caseId
            ? {
                ...c,
                priorityLevel: newPriority,
                isPriorityOverridden: true,
                overrideReason: reason,
              }
            : c
        )
      );
      // Append to audit trail
      const newAction = {
        actionId: `ACT-${Date.now()}`,
        caseId,
        timestamp: new Date().toLocaleString("en-IN"),
        actorName: actorName,
        actorBureau: currentRole,
        actionType: "Priority Overridden by Official",
        remarks: `Priority manually changed to ${newPriority}. Reason: ${reason}`,
        attachmentName: null,
      };
      setCaseActions((prev) => [...prev, newAction]);
      setPriorityOverrideModal(null);
    },
    [currentRole]
  );

  // Add new action to case
  const addCaseAction = useCallback(
    (caseId, actionType, remarks, attachment, actorName) => {
      const newAction = {
        actionId: `ACT-${Date.now()}`,
        caseId,
        timestamp: new Date().toLocaleString("en-IN"),
        actorName: actorName || currentRole,
        actorBureau: currentRole,
        actionType,
        remarks,
        attachmentName: attachment || null,
      };
      setCaseActions((prev) => [...prev, newAction]);
      // Update lastAction on complaint
      setComplaints((prev) =>
        prev.map((c) =>
          c.caseId === caseId
            ? { ...c, lastAction: remarks, lastActionDate: new Date().toISOString().split("T")[0] }
            : c
        )
      );
    },
    [currentRole]
  );

  // Update case status
  const updateCaseStatus = useCallback(
    (caseId, newStatus, remarks) => {
      // Check action lock
      const overlap = relatedCases.find(
        (r) =>
          (r.primaryCaseId === caseId || r.secondaryCaseId === caseId) &&
          r.actionLockActive &&
          newStatus === "Disposed"
      );
      if (overlap) {
        setActionLockWarning(caseId);
        return;
      }
      setComplaints((prev) =>
        prev.map((c) => (c.caseId === caseId ? { ...c, status: newStatus } : c))
      );
      addCaseAction(caseId, `Status Updated to ${newStatus}`, remarks);
    },
    [relatedCases, addCaseAction]
  );

  // Link cases
  const linkCases = useCallback((linkId) => {
    setRelatedCases((prev) =>
      prev.map((r) =>
        r.linkId === linkId ? { ...r, coordinationStatus: "Linked & Action-Locked" } : r
      )
    );
  }, []);

  // Assign lead bureau & activate action lock
  const activateActionLock = useCallback((linkId, leadBureau, observerBureau) => {
    setRelatedCases((prev) =>
      prev.map((r) =>
        r.linkId === linkId
          ? {
              ...r,
              leadBureau,
              observerBureau,
              actionLockActive: true,
              coordinationStatus: "Linked & Action-Locked",
            }
          : r
      )
    );
  }, []);

  // Log new case
  const logNewCase = useCallback((newCase) => {
    setComplaints((prev) => [newCase, ...prev]);
    setNewCaseModalOpen(false);
  }, []);

  const notifications = React.useMemo(() => {
    const items = [];
    complaints
      .filter((c) => c.isOverdue)
      .forEach((c) =>
        items.push({
          type: "SLA_BREACH",
          title: `SLA Breach — ${c.caseId}`,
          message: `${c.pendingDays} days pending beyond expected disposal date`,
          severity: "critical",
        })
      );
    complaints
      .filter((c) => c.priorityLevel === "Critical")
      .forEach((c) =>
        items.push({
          type: "CRITICAL_PRIORITY",
          title: `Critical Priority Alert — ${c.caseId}`,
          message: c.category,
          severity: "critical",
        })
      );
    relatedCases
      .filter((r) => r.overlapTier === "RED_ACTION_OVERLAP")
      .forEach((r) =>
        items.push({
          type: "OVERLAP",
          title: `Cross-Bureau Overlap — ${r.primaryCaseId} & ${r.secondaryCaseId}`,
          message: r.alertBannerText,
          severity: "warning",
        })
      );
    return items;
  }, [complaints, relatedCases]);

  const value = {
    // State
    institutions,
    complaints,
    relatedCases,
    caseActions,
    currentRole,
    currentView,
    selectedCaseId,
    selectedInstitutionId,
    caseDetailOpen,
    notificationOpen,
    newCaseModalOpen,
    priorityOverrideModal,
    executiveBriefModal,
    actionLockWarning,
    filters,
    kpis,
    filteredComplaints,
    notifications,
    // Actions
    setCurrentRole,
    setCurrentView,
    setSelectedInstitutionId,
    openCaseDetail,
    closeCaseDetail,
    setNotificationOpen,
    setNewCaseModalOpen,
    setPriorityOverrideModal,
    setExecutiveBriefModal,
    setActionLockWarning,
    setFilters,
    overridePriority,
    addCaseAction,
    updateCaseStatus,
    linkCases,
    activateActionLock,
    logNewCase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
