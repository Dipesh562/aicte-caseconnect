import React, { useState } from "react";
import KPICards from "../components/KPICards";
import CaseTable from "../components/CaseTable";
import {
  Activity,
  GitMerge,
  AlertTriangle,
  Building,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useApp, VIEWS } from "../context/AppContext";

export default function Dashboard() {
  const {
    complaints,
    institutions,
    relatedCases,
    setCurrentView,
    openCaseDetail,
  } = useApp();

  // Find the critical active overlap
  const topOverlap = relatedCases.find((r) => r.linkId === "OVL-901") || relatedCases[0];
  const college = institutions.find((i) => i.id === topOverlap?.institutionId) || institutions[0];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner: Core USP Highlight (Cross-Bureau Overlap Alert) */}
      {topOverlap && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 border border-amber-300">
                    Core USP • Cross-Bureau Alert
                  </span>
                  <span className="text-xs font-semibold text-amber-800">
                    89% Semantic Similarity Match
                  </span>
                </div>
                <h2 className="text-base font-bold text-amber-950 font-headline">
                  Potential Overlapping Cases – Coordination Required
                </h2>
                <p className="text-xs text-amber-900/80 mt-1 max-w-3xl leading-relaxed">
                  Both <strong>Public Grievances Redressal Cell (PGRC)</strong> and <strong>Regulation Bureau (RB)</strong> are handling parallel complaints for <strong>{college.name}</strong> (PID: {college.id}). Coordination is recommended to avoid conflicting directives.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView(VIEWS.OVERLAP_DETECTION)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 self-start md:self-center shrink-0"
            >
              <span>Review Overlap &amp; Handshake</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4 Clean Metric Cards */}
      <section>
        <KPICards />
      </section>

      {/* Bureau Distribution Overview Strip */}
      <section className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-headline">
              Bureau Workload Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active case volume across AICTE operating cells
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Conflicting Directives Enforced</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">Regulation Bureau (RB)</span>
            <div className="text-xl font-bold text-slate-900 font-headline mt-1">2 Cases</div>
            <span className="text-[11px] text-sky-600 font-medium">Show-Cause &amp; APH Norms</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">PGRC Cell</span>
            <div className="text-xl font-bold text-slate-900 font-headline mt-1">3 Cases</div>
            <span className="text-[11px] text-purple-600 font-medium">Student &amp; Faculty Grievances</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">Regional Offices</span>
            <div className="text-xl font-bold text-slate-900 font-headline mt-1">2 Cases</div>
            <span className="text-[11px] text-slate-500 font-medium">South &amp; West Jurisdictions</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">Average Resolution Age</span>
            <div className="text-xl font-bold text-slate-900 font-headline mt-1">18.4 Days</div>
            <span className="text-[11px] text-emerald-600 font-medium">Well within 30-day SLA</span>
          </div>
        </div>
      </section>

      {/* Master Case Table (Click Row to Open Timeline Drawer) */}
      <section>
        <CaseTable />
      </section>
    </div>
  );
}
