import React, { useState } from "react";
import { X, Plus, AlertTriangle, Scan, CheckCircle2, Shield, Activity, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

function generateCaseId() {
  return `CASE-${Math.floor(Math.random() * 900) + 100}`;
}

export default function NewCaseModal() {
  const { newCaseModalOpen, setNewCaseModalOpen, logNewCase, institutions, currentRole } = useApp();

  const [form, setForm] = useState({
    institutionId: "",
    category: "",
    description: "",
    ocrText: "",
    assignedBureau: "PGRC",
    assignedOfficer: "",
  });
  const [ocrSimulating, setOcrSimulating] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [overlapSimulated, setOverlapSimulated] = useState(false);
  const [prioritySimulated, setPrioritySimulated] = useState(null);

  if (!newCaseModalOpen) return null;

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const simulateOCR = () => {
    setOcrSimulating(true);
    setTimeout(() => {
      setOcrSimulating(false);
      setOcrResult(
        "AICTE Permanent ID: INST-001 extracted from uploaded letterhead PDF. Institution identified as ABC Institute of Technology, Pune."
      );
      setTimeout(() => setOverlapSimulated(true), 600);
      setTimeout(() => setPrioritySimulated({ level: "High", score: 78 }), 1000);
    }, 1200);
  };

  const handleSubmit = () => {
    if (!form.institutionId || !form.category) return;
    const now = new Date().toISOString().split("T")[0];
    const newCase = {
      caseId: generateCaseId(),
      institutionId: form.institutionId,
      submittedInstitutionName:
        institutions.find((i) => i.id === form.institutionId)?.name || "Unknown",
      receiptDate: now,
      category: form.category,
      description: form.description,
      status: "Pending",
      assignedBureau: form.assignedBureau,
      assignedOfficer: form.assignedOfficer || currentRole,
      lastAction: "Official Case Intake & Registry Logging",
      lastActionDate: now,
      nextActionRequired: "Initial review and cross-bureau triage",
      expectedDisposalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      isOverdue: false,
      pendingDays: 0,
      ocrExtractedText: ocrResult || null,
      priorityLevel: prioritySimulated?.level || "Medium",
      priorityScore: prioritySimulated?.score || 65,
      severity: "Medium Priority Grievance",
      uniqueCollegesAffected: 1,
      totalSubmissions: 1,
      linkedDuplicateIds: [],
      clusterType: "STANDARD",
      priorityReason: "Auto-computed via scoring pipeline pending official triage.",
      isPriorityOverridden: false,
      overrideReason: null,
    };
    logNewCase(newCase);
    setForm({
      institutionId: "",
      category: "",
      description: "",
      ocrText: "",
      assignedBureau: "PGRC",
      assignedOfficer: "",
    });
    setOcrResult(null);
    setOverlapSimulated(false);
    setPrioritySimulated(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-xl w-full max-w-lg border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div>
            <div className="font-bold text-sm text-slate-900 font-headline">
              Official Case Registration &amp; Intake
            </div>
            <div className="text-xs text-slate-500">
              Triggers OCR Extraction, Overlap Detection &amp; Priority Triage
            </div>
          </div>
          <button
            onClick={() => setNewCaseModalOpen(false)}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Target Institution */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">
              Target Institution <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:outline-none"
              value={form.institutionId}
              onChange={(e) => update("institutionId", e.target.value)}
            >
              <option value="">Select AICTE Approved Institution...</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} (PID: {i.id})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">
              Complaint / Violation Category <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:outline-none"
              placeholder="e.g. Faculty Shortfall, Document Withholding, Safety Hazard..."
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">
              Formal Case Synopsis
            </label>
            <textarea
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:outline-none resize-none font-sans"
              placeholder="Describe complaint particulars and statutory violation context..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          {/* Simulated OCR Scanner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-900 text-xs font-semibold">
                <Scan className="w-4 h-4 text-sky-600" />
                <span>Simulate PDF Attachment OCR</span>
              </div>
              <button
                type="button"
                onClick={simulateOCR}
                disabled={ocrSimulating}
                className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-all shadow-sm disabled:opacity-50"
              >
                {ocrSimulating ? "Extracting..." : "Simulate Document Scan"}
              </button>
            </div>
            <div className="text-slate-400 text-[11px]">
              Sample Attachment: Formal_Complaint_Dossier_Affidavit.pdf
            </div>

            {ocrResult && (
              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 animate-fade-in text-xs">
                <div className="text-sky-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Extracted Permanent ID &amp; Match:
                </div>
                <div className="text-slate-600 leading-relaxed">{ocrResult}</div>
              </div>
            )}
          </div>

          {/* Overlap Alert If Simulated */}
          {overlapSimulated && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 animate-fade-in text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Potential Overlapping Cases – Coordination Required</span>
              </div>
              <p className="mt-1 text-amber-700 leading-relaxed text-[11px]">
                INST-001 has active parallel inquiries across Regulation Bureau and PGRC.
                Handshake coordination is recommended prior to formal notice issuance.
              </p>
            </div>
          )}

          {/* Bureau & Officer Assignment */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Assign Bureau
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:outline-none"
                value={form.assignedBureau}
                onChange={(e) => update("assignedBureau", e.target.value)}
              >
                {["RB", "PGRC", "Regional Office - West", "Regional Office - South"].map(
                  (b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Assign Officer
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:outline-none"
                placeholder="Designated officer..."
                value={form.assignedOfficer}
                onChange={(e) => update("assignedOfficer", e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.institutionId || !form.category}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-sm mt-3"
          >
            <Plus className="w-4 h-4" />
            <span>Register Case &amp; Initiate Tracking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
