import React, { useState } from "react";
import {
  Bell,
  Plus,
  ChevronDown,
  Shield,
  Search,
  Check,
  UserCheck,
  Building,
  Activity,
} from "lucide-react";
import { useApp, ROLES } from "../context/AppContext";

const ROLE_CONFIGS = [
  {
    value: ROLES.SENIOR_MANAGEMENT,
    label: "Senior Management",
    roleName: "Member Secretary / Competent Authority",
    badge: "Apex Oversight",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    value: ROLES.RB_OFFICER,
    label: "RB Officer",
    roleName: "Regulation Bureau Hearing Desk",
    badge: "Statutory Bureau",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    value: ROLES.PGRC_OFFICER,
    label: "PGRC Officer",
    roleName: "Public Grievance Redressal Cell",
    badge: "Grievance Desk",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export default function TopBar() {
  const {
    currentRole,
    setCurrentRole,
    setNewCaseModalOpen,
    filters,
    setFilters,
    relatedCases,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const activeRole = ROLE_CONFIGS.find((r) => r.value === currentRole) || ROLE_CONFIGS[0];

  const activeOverlapCount = relatedCases.filter(
    (r) => r.coordinationStatus !== "Resolved"
  ).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Section Context & Global Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AICTE
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-none">
              CaseConnect Portal
            </h1>
            <span className="text-[11px] text-slate-500 font-mono">
              Problem Statement PS 26264
            </span>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search cases, colleges, PID..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right: Role Switcher & Actions */}
      <div className="flex items-center gap-3.5">
        {/* Live sync badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-Time Monitoring</span>
        </div>

        {/* Interactive Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <UserCheck className="w-4 h-4 text-slate-500" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 leading-none uppercase font-semibold">Active Role</div>
              <div className="text-xs font-semibold text-slate-900">{activeRole.label}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-fade-in">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Switch Perspective
              </div>
              {ROLE_CONFIGS.map((role) => (
                <button
                  key={role.value}
                  onClick={() => {
                    setCurrentRole(role.value);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    currentRole === role.value
                      ? "bg-slate-50 font-semibold text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">{role.label}</div>
                    <div className="text-[11px] text-slate-500">{role.roleName}</div>
                  </div>
                  {currentRole === role.value && (
                    <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Log Case Button */}
        <button
          onClick={() => setNewCaseModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Register Case</span>
        </button>
      </div>
    </header>
  );
}
