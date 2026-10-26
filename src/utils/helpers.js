// Utility helpers for AICTE CaseConnect (Stitch Obsidian Command Palette)

export function getPriorityConfig(level) {
  switch (level) {
    case "Critical":
      return {
        bg: "bg-red-950/90",
        text: "text-command-crimson",
        border: "border-command-crimson",
        badge: "bg-red-950 border-command-crimson text-command-crimson shadow-[0_0_8px_rgba(255,51,102,0.3)]",
        dot: "bg-command-crimson",
        label: "CRITICAL",
      };
    case "High":
      return {
        bg: "bg-amber-950/90",
        text: "text-command-amber",
        border: "border-command-amber",
        badge: "bg-amber-950 border-command-amber text-command-amber shadow-[0_0_8px_rgba(245,158,11,0.25)]",
        dot: "bg-command-amber",
        label: "HIGH",
      };
    case "Medium":
      return {
        bg: "bg-cyan-950/90",
        text: "text-command-azure",
        border: "border-command-azure/60",
        badge: "bg-cyan-950 border-command-azure/60 text-command-azure",
        dot: "bg-command-azure",
        label: "MEDIUM",
      };
    case "Low":
    default:
      return {
        bg: "bg-obsidian-900",
        text: "text-slate-400",
        border: "border-obsidian-700",
        badge: "bg-obsidian-900 border-obsidian-700 text-slate-400",
        dot: "bg-slate-400",
        label: "LOW",
      };
  }
}

export function getStatusConfig(status) {
  switch (status) {
    case "Pending":
      return { badge: "bg-amber-950/80 text-command-amber border border-amber-700/60", label: "Pending" };
    case "Under process":
      return { badge: "bg-cyan-950/80 text-command-azure border border-command-azure/50", label: "Under Process" };
    case "Action initiated":
      return { badge: "bg-purple-950/80 text-purple-300 border border-purple-700/60", label: "Action Initiated" };
    case "Transferred":
      return { badge: "bg-obsidian-900 text-slate-300 border border-obsidian-700", label: "Transferred" };
    case "Escalated":
      return { badge: "bg-red-950/80 text-command-crimson border border-red-700/60 font-bold", label: "Escalated" };
    case "Disposed":
      return { badge: "bg-emerald-950/80 text-command-emerald border border-emerald-700/60 font-bold", label: "Disposed" };
    default:
      return { badge: "bg-obsidian-900 text-slate-300 border border-obsidian-800", label: status };
  }
}

export function getOverlapConfig(tier) {
  if (tier === "RED_ACTION_OVERLAP")
    return {
      bg: "bg-red-950 border-command-crimson",
      dot: "bg-command-crimson",
      text: "text-command-crimson",
      label: "🔴 Red: Action Overlap",
      badgeClass: "bg-red-950 text-command-crimson border border-command-crimson",
    };
  return {
    bg: "bg-amber-950 border-command-amber",
    dot: "bg-command-amber",
    text: "text-command-amber",
    label: "🟡 Yellow: Institutional Overlap",
    badgeClass: "bg-amber-950 text-command-amber border border-command-amber",
  };
}

export function getRiskConfig(riskLevel) {
  switch (riskLevel) {
    case "Critical Watchlist":
      return { color: "text-command-crimson", bg: "bg-red-950/40", ring: "#ff3366" };
    case "High Risk":
      return { color: "text-command-amber", bg: "bg-amber-950/40", ring: "#f59e0b" };
    case "Moderate Risk":
      return { color: "text-command-azure", bg: "bg-cyan-950/40", ring: "#38bdf8" };
    default:
      return { color: "text-command-emerald", bg: "bg-emerald-950/40", ring: "#10b981" };
  }
}

export function getClusterBadge(clusterType) {
  switch (clusterType) {
    case "SINGLE_COLLEGE_CRITICAL":
      return { label: "🚨 Critical Emergency", cls: "bg-red-950/90 text-command-crimson border-command-crimson font-bold shadow-[0_0_8px_rgba(255,51,102,0.3)]" };
    case "WIDESPREAD_MULTI_COLLEGE":
      return { label: "🌐 Widespread Multi-College", cls: "bg-purple-950/90 text-purple-300 border-purple-700 font-bold shadow-[0_0_8px_rgba(168,85,247,0.25)]" };
    case "SINGLE_COLLEGE_DEDUPLICATED":
      return { label: "🔗 Deduplicated Cluster", cls: "bg-cyan-950/90 text-command-cyan border-command-cyan/60 font-bold" };
    default:
      return { label: "📋 Standard Case", cls: "bg-obsidian-900 text-slate-400 border-obsidian-800" };
  }
}

export function getActionTypeIcon(actionType) {
  if (actionType.includes("Received") || actionType.includes("Created") || actionType.includes("Intake")) return "📥";
  if (actionType.includes("Priority")) return "⚡";
  if (actionType.includes("Notice") || actionType.includes("Issued")) return "📄";
  if (actionType.includes("Overlap") || actionType.includes("Cross-Bureau")) return "🔀";
  if (actionType.includes("Action-Lock")) return "🔒";
  if (actionType.includes("Transfer")) return "↗️";
  if (actionType.includes("Disposed") || actionType.includes("Closed")) return "✅";
  if (actionType.includes("Escalat")) return "🚨";
  if (actionType.includes("Regional")) return "🏢";
  return "📋";
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function getDaysUntilDisposal(expectedDate) {
  if (!expectedDate) return null;
  const diff = Math.ceil((new Date(expectedDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}
