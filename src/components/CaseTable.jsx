import React, { useState } from "react";
import {
  FileText,
  Building,
  AlertTriangle,
  GitMerge,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";

export default function CaseTable() {
  const {
    filteredComplaints,
    institutions,
    relatedCases,
    openCaseDetail,
  } = useApp();

  const [activeFilterTab, setActiveFilterTab] = useState("all");

  const displayedCases = filteredComplaints.filter((c) => {
    if (activeFilterTab === "rb") return c.assignedBureau === "RB";
    if (activeFilterTab === "pgrc") return c.assignedBureau === "PGRC";
    if (activeFilterTab === "overdue") return c.isOverdue;
    if (activeFilterTab === "overlap") {
      return relatedCases.some(
        (r) => r.primaryCaseId === c.caseId || r.secondaryCaseId === c.caseId
      );
    }
    return true;
  });

  const getStatusBadge = (status, isOverdue) => {
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Overdue ({status})
        </span>
      );
    }

    switch (status) {
      case "Under process":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Under Process
          </span>
        );
      case "Action initiated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Action Initiated
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Pending Review
          </span>
        );
      case "Disposed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Disposed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getBureauBadge = (bureau) => {
    if (bureau === "RB") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
          Regulation Bureau (RB)
        </span>
      );
    }
    if (bureau === "PGRC") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
          PGRC Cell
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        {bureau}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight font-headline flex items-center gap-2">
            Master Case Registry
            <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-600">
              {displayedCases.length} records
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Click any row to open the complete workflow and chronological action history.
          </p>
        </div>

        {/* Quick filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {[
            { id: "all", label: "All Cases" },
            { id: "rb", label: "Regulation Bureau" },
            { id: "pgrc", label: "PGRC" },
            { id: "overdue", label: "Overdue Only", alert: true },
            { id: "overlap", label: "Overlapping Cases", alert: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeFilterTab === tab.id
                  ? tab.alert
                    ? "bg-rose-50 text-rose-700 border border-rose-200 font-semibold"
                    : "bg-slate-900 text-white font-semibold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/70 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Case ID</th>
              <th className="py-3.5 px-6">Institution (AICTE PID)</th>
              <th className="py-3.5 px-6">Assigned Bureau</th>
              <th className="py-3.5 px-6">Violation Category</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Expected Disposal</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayedCases.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  No cases found matching the selected filter.
                </td>
              </tr>
            ) : (
              displayedCases.map((c) => {
                const inst = institutions.find((i) => i.id === c.institutionId);
                const hasOverlap = relatedCases.some(
                  (r) => r.primaryCaseId === c.caseId || r.secondaryCaseId === c.caseId
                );

                return (
                  <tr
                    key={c.caseId}
                    onClick={() => openCaseDetail(c.caseId)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Case ID */}
                    <td className="py-4 px-6 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 group-hover:text-sky-600 transition-colors">
                          {c.caseId}
                        </span>
                        {hasOverlap && (
                          <span
                            title="Cross-Bureau Overlap Detected"
                            className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                          />
                        )}
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">
                        {inst?.name || c.submittedInstitutionName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>PID: {c.institutionId}</span>
                        <span>•</span>
                        <span>{inst?.region || "Region N/A"}</span>
                      </div>
                    </td>

                    {/* Assigned Bureau */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getBureauBadge(c.assignedBureau)}
                    </td>

                    {/* Violation Category */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-slate-700 truncate" title={c.category}>
                        {c.category}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {c.assignedOfficer}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(c.status, c.isOverdue)}
                    </td>

                    {/* Expected Disposal */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div
                        className={`font-mono text-xs ${
                          c.isOverdue ? "text-rose-600 font-semibold" : "text-slate-600"
                        }`}
                      >
                        {formatDate(c.expectedDisposalDate)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {c.pendingDays} days active
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span className="inline-flex items-center text-xs font-semibold text-sky-600 group-hover:text-sky-700">
                        View History
                        <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
