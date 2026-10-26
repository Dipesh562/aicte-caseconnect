import React, { useState } from "react";
import {
  GitMerge,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Cpu,
  Layers,
  FileText,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";

export default function OverlapDetection() {
  const { relatedCases, complaints, institutions, activateActionLock, openCaseDetail } = useApp();
  const [handshakeSuccess, setHandshakeSuccess] = useState(null);

  const handleLink = (linkId, leadBureau, obsBureau) => {
    activateActionLock(linkId, leadBureau, obsBureau);
    setHandshakeSuccess(linkId);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-headline">
              Cross-Bureau Overlap Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Core USP
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detects concurrent complaints filed across PGRC and Regulation Bureau to eliminate duplication of effort and conflicting directives.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
          <GitMerge className="w-4 h-4 text-amber-600" />
          <span>{relatedCases.length} Overlap Pairs Detected</span>
        </div>
      </div>

      {/* Overlap Pairs Review List */}
      <div className="space-y-6">
        {relatedCases.map((rel) => {
          const caseA = complaints.find((c) => c.caseId === rel.primaryCaseId);
          const caseB = complaints.find((c) => c.caseId === rel.secondaryCaseId);
          const inst = institutions.find((i) => i.id === rel.institutionId);
          const isActionOverlap = rel.overlapTier === "RED_ACTION_OVERLAP";
          const isHandshakeActive = rel.actionLockActive || handshakeSuccess === rel.linkId;

          return (
            <div
              key={rel.linkId}
              className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${
                isActionOverlap ? "border-amber-300" : "border-slate-200"
              }`}
            >
              {/* Alert Header Banner */}
              <div
                className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActionOverlap
                    ? "bg-amber-50/90 border-amber-200 text-amber-950"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActionOverlap
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 border border-amber-300">
                        {isActionOverlap ? "Statutory Overlap Alert" : "Institutional Context Match"}
                      </span>
                      <span className="text-xs font-semibold text-amber-800">
                        {rel.similarityScore}% Semantic &amp; Entity Match
                      </span>
                    </div>
                    <h2 className="text-base font-bold font-headline text-amber-950">
                      {rel.alertBannerText}
                    </h2>
                    <p className="text-xs text-amber-900/80 mt-1 max-w-3xl leading-relaxed">
                      {rel.reasonForAlert}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 ${
                      isHandshakeActive
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {isHandshakeActive ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-emerald-700" />
                        Handshake Active &amp; Locked
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Coordination Pending
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison UI */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Side: PGRC Case */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          PGRC Cell Case
                        </span>
                        <span className="font-mono font-bold text-slate-900">#{caseA?.caseId}</span>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-0.5">
                          Institution
                        </span>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {inst?.name || caseA?.submittedInstitutionName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          PID: {caseA?.institutionId} • Western Region (Pune)
                        </div>
                      </div>

                      <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px] block">Grievance Category</span>
                          <span className="font-semibold text-slate-800">{caseA?.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Reported Particulars</span>
                          <p className="text-slate-600 leading-relaxed mt-0.5">
                            {caseA?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Officer: {caseA?.assignedOfficer}</span>
                      <button
                        onClick={() => openCaseDetail(caseA?.caseId)}
                        className="text-sky-600 font-semibold hover:underline"
                      >
                        Inspect PGRC Dossier &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Right Side: RB Case */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                          Regulation Bureau (RB) Case
                        </span>
                        <span className="font-mono font-bold text-slate-900">#{caseB?.caseId}</span>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-0.5">
                          Institution
                        </span>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {inst?.name || caseB?.submittedInstitutionName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          PID: {caseB?.institutionId} • Western Region (Pune)
                        </div>
                      </div>

                      <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px] block">Regulatory Violation</span>
                          <span className="font-semibold text-slate-800">{caseB?.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Investigation Details</span>
                          <p className="text-slate-600 leading-relaxed mt-0.5">
                            {caseB?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Officer: {caseB?.assignedOfficer}</span>
                      <button
                        onClick={() => openCaseDetail(caseB?.caseId)}
                        className="text-sky-600 font-semibold hover:underline"
                      >
                        Inspect RB Dossier &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Handshake Action Trigger Bar */}
                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Detection Method: <strong>{rel.matchMethod}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    {isHandshakeActive ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Handshake Established • Lead Bureau: RB • Observer: PGRC</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleLink(rel.linkId, "RB", "PGRC")}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                      >
                        <GitMerge className="w-4 h-4 text-amber-400" />
                        <span>Link Related Cases &amp; Initiate Handshake</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirmation Details if active */}
                {isHandshakeActive && isActionOverlap && (
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 animate-fade-in">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-950 block mb-0.5">
                        Statutory Coordination Lock Active
                      </span>
                      <p className="text-emerald-800/90 leading-relaxed">
                        Regulation Bureau has been designated the Lead Bureau for {inst?.name}. Separate conflicting directives and duplicate inspections are automatically blocked by the system.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
