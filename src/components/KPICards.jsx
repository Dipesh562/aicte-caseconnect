import React from "react";
import {
  FileText,
  Activity,
  AlertTriangle,
  GitMerge,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function KPICards() {
  const { kpis, relatedCases } = useApp();

  const activeOverlaps = relatedCases.filter(
    (r) => r.coordinationStatus !== "Resolved"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Total Cases */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Cases
          </span>
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileText className="w-4 h-4 text-slate-700" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">
            {kpis.total}
          </span>
          <span className="text-xs font-medium text-emerald-600 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +2 this week
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Tracked across RB, PGRC &amp; Regional Offices
        </p>
      </div>

      {/* 2. Pending */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Cases
          </span>
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">
            {kpis.pending}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            Intake Review
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Awaiting initial bureau assignment &amp; triage
        </p>
      </div>

      {/* 3. Overdue (Highlighted in Red / Rose) */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
            Overdue Cases
          </span>
          <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-rose-900 tracking-tight font-headline">
            {kpis.overdue}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            Action Required
          </span>
        </div>
        <p className="text-xs text-rose-600/90 mt-2 font-medium">
          Exceeded standard 30-day disposal SLA
        </p>
      </div>

      {/* 4. Active Overlaps (Highlighted in Amber) */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Active Overlaps
          </span>
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <GitMerge className="w-4 h-4 text-amber-700" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-amber-900 tracking-tight font-headline">
            {activeOverlaps}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            USP Active
          </span>
        </div>
        <p className="text-xs text-amber-700/90 mt-2 font-medium">
          Potential duplication across RB &amp; PGRC
        </p>
      </div>
    </div>
  );
}
