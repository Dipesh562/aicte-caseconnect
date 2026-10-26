import React from "react";
import {
  Activity,
  GitMerge,
  Building,
  Shield,
  Layers,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useApp, VIEWS } from "../context/AppContext";

const NAV_ITEMS = [
  {
    id: VIEWS.DASHBOARD,
    label: "Command Dashboard",
    icon: Activity,
    subtitle: "Real-time case registry & KPIs",
    badge: null,
  },
  {
    id: VIEWS.OVERLAP_DETECTION,
    label: "Overlap Engine",
    icon: GitMerge,
    subtitle: "Cross-Bureau coordination (USP)",
    badge: "Action Required",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300 font-bold",
  },
  {
    id: VIEWS.INSTITUTION_PROFILE,
    label: "Institution 360°",
    icon: Building,
    subtitle: "Consolidated college dossiers",
    badge: null,
  },
];

export default function Sidebar() {
  const { currentView, setCurrentView, relatedCases } = useApp();

  const activeOverlapCount = relatedCases.filter(
    (r) => r.coordinationStatus !== "Resolved"
  ).length;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none z-30 shrink-0">
      <div>
        {/* Emblem & Title */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-sm shadow-md">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
                AICTE CaseConnect
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Govt. of India • PS 26264
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Screens Navigation */}
        <div className="p-3.5 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Core Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 ${
                  isActive
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-sky-400" : "text-slate-400"
                      }`}
                    />
                    <span className="text-xs font-semibold text-white">
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 pl-6.5">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Status Indicator */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/70 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Cross-Bureau Link
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            PGRC &amp; Regulation Bureau synchronization active.
          </p>
        </div>
        <div className="text-[10px] text-slate-500 text-center font-mono">
          AICTE Central Portal (PS 26264)
        </div>
      </div>
    </aside>
  );
}
