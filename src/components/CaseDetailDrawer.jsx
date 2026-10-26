import React, { useState } from "react";
import {
  X,
  FileText,
  Building,
  AlertTriangle,
  Clock,
  Send,
  CheckCircle2,
  Lock,
  GitMerge,
  Paperclip,
  Activity,
  User,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";

export default function CaseDetailDrawer() {
  const {
    caseDetailOpen,
    closeCaseDetail,
    selectedCaseId,
    complaints,
    institutions,
    relatedCases,
    caseActions,
    addCaseAction,
    updateCaseStatus,
    currentRole,
  } = useApp();

  const [newRemark, setNewRemark] = useState("");
  const [newActionType, setNewActionType] = useState("Status Update");

  const c = complaints.find((x) => x.caseId === selectedCaseId);
  if (!caseDetailOpen || !c) return null;

  const inst = institutions.find((i) => i.id === c.institutionId);
  const auditTrail = caseActions.filter((a) => a.caseId === selectedCaseId);
  const overlapLink = relatedCases.find(
    (r) => r.primaryCaseId === selectedCaseId || r.secondaryCaseId === selectedCaseId
  );

  const handleAddAction = (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;
    addCaseAction(selectedCaseId, newActionType, newRemark, null, currentRole);
    setNewRemark("");
  };

  const handleDispose = () => {
    updateCaseStatus(selectedCaseId, "Disposed", "Case formally marked disposed by authorized official.");
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in transition-opacity"
        onClick={closeCaseDetail}
      />

      {/* Slide-over Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white border-l border-slate-200 z-50 overflow-y-auto animate-slide-in-right flex flex-col shadow-2xl">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900">
                #{c.caseId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {c.status}
              </span>
              {c.isOverdue && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  Overdue SLA
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">
              Case Dossier &amp; Chronological Action History
            </div>
          </div>

          <button
            onClick={closeCaseDetail}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Overlap Alert If Present */}
          {overlapLink && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="flex items-center gap-2 font-semibold text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Potential Overlapping Cases – Coordination Required</span>
              </div>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                {overlapLink.reasonForAlert}
              </p>
              <div className="text-[11px] font-medium text-amber-800/80 mt-2">
                Status: {overlapLink.coordinationStatus} • Lead Bureau: {overlapLink.leadBureau || "Under Handshake"}
              </div>
            </div>
          )}

          {/* Case Attributes Card */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Case Information
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700">
                PID: {c.institutionId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Institution</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {inst?.name || c.submittedInstitutionName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Assigned Bureau</span>
                <span className="font-semibold text-slate-900">{c.assignedBureau}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Investigating Officer</span>
                <span className="font-medium text-slate-700">{c.assignedOfficer}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Receipt Date</span>
                <span className="font-mono text-slate-700">{formatDate(c.receiptDate)}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Expected Disposal</span>
                <span
                  className={`font-mono font-medium ${
                    c.isOverdue ? "text-rose-600 font-bold" : "text-slate-700"
                  }`}
                >
                  {formatDate(c.expectedDisposalDate)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Pending Duration</span>
                <span className="text-slate-700">{c.pendingDays} days in system</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 block text-[11px] mb-0.5">Violation Category</span>
              <span className="text-xs font-semibold text-slate-900">{c.category}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Official Description</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200/80 rounded-lg p-3">
                {c.description}
              </p>
            </div>
          </div>

          {/* Workflow & Action History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Workflow and Action History
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {auditTrail.length} Logged Action{auditTrail.length === 1 ? "" : "s"}
              </span>
            </div>

            {auditTrail.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                No prior actions logged for this case.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {auditTrail.map((action, idx) => (
                  <div key={action.actionId || idx} className="relative group">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    </div>

                    {/* Timeline content */}
                    <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900">
                          {action.actionType}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {action.timestamp}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{action.actorName}</span>
                        {action.actorBureau && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700">
                            {action.actorBureau}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {action.remarks}
                      </p>

                      {action.attachmentName && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-sky-700 font-medium">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{action.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Officer Action Dispatch Form */}
          <form onSubmit={handleAddAction} className="border-t border-slate-200 pt-5 space-y-3">
            <div className="text-xs font-semibold text-slate-800">
              Record Official Progression Note
            </div>

            <div className="flex gap-2">
              <select
                value={newActionType}
                onChange={(e) => setNewActionType(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Status Update">Status Update</option>
                <option value="Explanation Sought">Explanation Sought</option>
                <option value="Show-Cause Notice Issued">Show-Cause Notice Issued</option>
                <option value="Inspection Ordered">Inspection Ordered</option>
                <option value="Handshake Coordination Note">Handshake Coordination Note</option>
              </select>

              {c.status !== "Disposed" && (
                <button
                  type="button"
                  onClick={handleDispose}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  Mark Disposed
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder="Enter official action details, instructions or hearing notes..."
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newRemark.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:opacity-40 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Append Note to History
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
