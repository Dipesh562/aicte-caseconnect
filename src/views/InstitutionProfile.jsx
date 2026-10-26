import React, { useState } from "react";
import {
  Printer,
  Building,
  AlertTriangle,
  Shield,
  Clock,
  FileText,
  GitMerge,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";

function RiskGauge({ score, riskLevel }) {
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    riskLevel === "Critical Watchlist"
      ? "#e11d48"
      : riskLevel === "High Risk"
      ? "#d97706"
      : riskLevel === "Moderate Risk"
      ? "#0284c7"
      : "#059669";

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
          <div className="text-xl font-headline font-extrabold text-slate-900 leading-none">
            {score}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">/100</div>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-slate-700">
        {riskLevel}
      </span>
    </div>
  );
}

export default function InstitutionProfile() {
  const {
    institutions,
    complaints,
    relatedCases,
    selectedInstitutionId,
    setSelectedInstitutionId,
    openCaseDetail,
  } = useApp();

  const [searchInst, setSearchInst] = useState("");

  const displayInst = selectedInstitutionId
    ? institutions.find((i) => i.id === selectedInstitutionId)
    : institutions[0];

  const filteredInsts = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(searchInst.toLowerCase()) ||
      i.id.toLowerCase().includes(searchInst.toLowerCase())
  );

  const instCases = complaints.filter((c) => c.institutionId === displayInst?.id);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-headline">
              Institution Dossiers &amp; Compliance Radar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              360° Profile
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Permanent ID Registry • Risk Scorecard • Consolidated Hearing History
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
          <Building className="w-4 h-4 text-sky-600" />
          <span>{institutions.length} Monitored Colleges</span>
        </div>
      </div>

      {/* College Selector Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by college name, AICTE Permanent ID (INST-001)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            value={searchInst}
            onChange={(e) => setSearchInst(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredInsts.map((inst) => {
            const isSelected = inst.id === displayInst?.id;
            const casesCount = complaints.filter((c) => c.institutionId === inst.id).length;
            return (
              <button
                key={inst.id}
                onClick={() => setSelectedInstitutionId(inst.id)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-slate-50 border-slate-900 shadow-sm"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="text-xs font-bold text-slate-900 truncate">{inst.name}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">PID: {inst.id}</div>
                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-500">{inst.region} Region</span>
                  <span className="font-semibold text-slate-800">{casesCount} Active Files</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Institution 360° Profile View */}
      {displayInst && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-headline">
                  {displayInst.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-700">
                  PID: {displayInst.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{displayInst.address}</p>
            </div>

            <RiskGauge score={displayInst.riskScore} riskLevel={displayInst.riskLevel} />
          </div>

          {/* Academic & Affiliation Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Affiliating University</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{displayInst.affiliation}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Accreditation Status</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{displayInst.accreditation}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Approved Intake</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{displayInst.totalIntake} Seats</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Regional Office</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{displayInst.region} Region</span>
            </div>
          </div>

          {/* Connected Cases Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-headline">
              Consolidated Case History Under PID ({instCases.length} records)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="table-auto w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                    <th className="py-2.5 px-4">Case ID</th>
                    <th className="py-2.5 px-4">Bureau</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Officer</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {instCases.map((c) => (
                    <tr
                      key={c.caseId}
                      onClick={() => openCaseDetail(c.caseId)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        #{c.caseId}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{c.assignedBureau}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{c.category}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{c.assignedOfficer}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sky-600 font-semibold hover:underline">
                          View Dossier &rarr;
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
