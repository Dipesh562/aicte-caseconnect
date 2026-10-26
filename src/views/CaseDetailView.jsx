import React from "react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";
import { FileText, Clock, ChevronRight, Building } from "lucide-react";

export default function CaseDetailView() {
  const { filteredComplaints, institutions, openCaseDetail } = useApp();

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-headline">
              Case Movement &amp; Chronological Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              Audit Logs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click any active or archived complaint to open the complete sliding drawer timeline and transfer history.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
          <FileText className="w-4 h-4 text-sky-600" />
          <span>{filteredComplaints.length} Dossiers</span>
        </div>
      </div>

      {/* Case Directory List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider font-headline">
            Select a Case to Inspect Action History
          </span>
          <span className="text-slate-500">{filteredComplaints.length} files available</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredComplaints.map((c) => {
            const inst = institutions.find((i) => i.id === c.institutionId);

            return (
              <div
                key={c.caseId}
                onClick={() => openCaseDetail(c.caseId)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="font-mono font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                    #{c.caseId}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {c.category}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{inst?.name || c.submittedInstitutionName}</span>
                      <span>•</span>
                      <span>{c.assignedBureau}</span>
                      <span>•</span>
                      <span>Officer: {c.assignedOfficer}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {c.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
