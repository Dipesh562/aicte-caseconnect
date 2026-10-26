import React, { useState } from "react";
import {
  Flame,
  Globe,
  Link2,
  AlertTriangle,
  X,
  Layers,
  Sparkles,
  Edit3,
  Building,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";

const TABS = [
  "All Ranked Priorities",
  "Widespread Multi-College Issues",
  "Single-College Deduplicated Clusters",
  "Critical Safety Emergencies",
];

export default function PriorityQueue() {
  const {
    complaints,
    institutions,
    setPriorityOverrideModal,
    priorityOverrideModal,
    overridePriority,
    currentRole,
    openCaseDetail,
  } = useApp();

  const [activeTab, setActiveTab] = useState(0);

  const sorted = [...complaints].sort((a, b) => {
    const levelOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const lvl = levelOrder[a.priorityLevel] - levelOrder[b.priorityLevel];
    return lvl !== 0 ? lvl : b.priorityScore - a.priorityScore;
  });

  const filtered = sorted.filter((c) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return c.clusterType === "WIDESPREAD_MULTI_COLLEGE";
    if (activeTab === 2) return c.clusterType === "SINGLE_COLLEGE_DEDUPLICATED";
    if (activeTab === 3) return c.clusterType === "SINGLE_COLLEGE_CRITICAL";
    return true;
  });

  // Summary counts
  const critical = complaints.filter((c) => c.priorityLevel === "Critical").length;
  const high = complaints.filter((c) => c.priorityLevel === "High").length;
  const widespread = complaints.filter((c) => c.clusterType === "WIDESPREAD_MULTI_COLLEGE").length;
  const totalLinkedDuplicates = complaints.reduce((s, c) => s + (c.totalSubmissions - 1), 0);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-headline">
              Smart Priority &amp; Issue Clustering Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Severity Ranking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AI-Weighted Multi-Factor Ranking • Single-College Deduplication • Human-in-the-Loop Override
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
          <Layers className="w-4 h-4 text-sky-600" />
          <span>{filtered.length} Ranked Cases</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700 uppercase">
            <span>Critical Emergencies</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-900 font-headline mt-2">{critical}</div>
          <p className="text-xs text-rose-600 mt-1">Immediate Safety / Sanctions</p>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 uppercase">
            <span>High Priority</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 font-headline mt-2">{high}</div>
          <p className="text-xs text-amber-600 mt-1">Multi-College / SLA Breaches</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Widespread Clusters</span>
            <Globe className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-headline mt-2">{widespread}</div>
          <p className="text-xs text-slate-500 mt-1">Cross-Institution Systemic Anomaly</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Deduped Submissions</span>
            <Link2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-headline mt-2">
            {totalLinkedDuplicates}+
          </div>
          <p className="text-xs text-slate-500 mt-1">Consolidated Under Master Files</p>
        </div>
      </div>

      {/* Deduplication Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-headline">
              Smart Deduplication Engine Active
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              <strong>{totalLinkedDuplicates}+ duplicate student submissions</strong> automatically grouped into master cases, preventing parallel clutter.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shrink-0 hidden sm:inline">
          94% Overhead Reduced
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap text-xs font-semibold">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === i
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Rank &amp; Priority</th>
                <th className="py-3 px-4">Case ID &amp; Category</th>
                <th className="py-3 px-4">Colleges Affected</th>
                <th className="py-3 px-4">Submissions</th>
                <th className="py-3 px-4">Pending Duration</th>
                <th className="py-3 px-4">Bureau</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, idx) => {
                const inst = institutions.find((i) => i.id === c.institutionId);
                const isCritical = c.priorityLevel === "Critical";

                return (
                  <tr
                    key={c.caseId}
                    onClick={() => openCaseDetail(c.caseId)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                          {idx + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCritical
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : c.priorityLevel === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.priorityLevel} ({c.priorityScore}/100)
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900">#{c.caseId}</div>
                      <div className="text-slate-600 truncate mt-0.5">{c.category}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {inst?.name || c.submittedInstitutionName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {c.uniqueCollegesAffected} college{c.uniqueCollegesAffected > 1 ? "s" : ""}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{c.totalSubmissions}</span>
                      {c.totalSubmissions > 1 && (
                        <span className="text-[10px] text-sky-600 font-medium block">
                          Deduplicated
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={c.isOverdue ? "text-rose-600 font-bold" : "text-slate-700"}>
                        {c.pendingDays} days
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {c.assignedBureau}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCaseDetail(c.caseId);
                        }}
                        className="text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
