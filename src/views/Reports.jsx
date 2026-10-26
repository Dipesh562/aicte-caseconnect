import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Clock, Layers } from "lucide-react";
import { useApp } from "../context/AppContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs font-sans">
        <div className="font-semibold text-slate-900 mb-1.5">{label}</div>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
              {p.name}:
            </span>
            <span className="font-bold text-slate-900">{p.value} cases</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { complaints, institutions } = useApp();

  const bureaus = ["RB", "PGRC", "Regional Office - South", "Regional Office - West"];
  const bureauData = bureaus.map((b) => {
    const bc = complaints.filter((c) => c.assignedBureau === b);
    return {
      name: b.replace("Regional Office - ", "RO-"),
      Pending: bc.filter((c) => c.status === "Pending").length,
      Active: bc.filter((c) => ["Under process", "Action initiated"].includes(c.status)).length,
      Disposed: bc.filter((c) => c.status === "Disposed").length,
    };
  });

  const ageingData = [
    { name: "< 15 Days (Optimal)", value: complaints.filter((c) => c.pendingDays < 15 && c.status !== "Disposed").length, color: "#10b981" },
    { name: "15–30 Days (Approaching)", value: complaints.filter((c) => c.pendingDays >= 15 && c.pendingDays < 30 && c.status !== "Disposed").length, color: "#f59e0b" },
    { name: "31–60 Days (Warning)", value: complaints.filter((c) => c.pendingDays >= 30 && c.pendingDays <= 60 && c.status !== "Disposed").length, color: "#f97316" },
    { name: "> 60 Days (Breach)", value: complaints.filter((c) => c.pendingDays > 60 && c.status !== "Disposed").length, color: "#e11d48" },
  ];

  const totalCases = complaints.length;
  const disposed = complaints.filter((c) => c.status === "Disposed").length;
  const overdue = complaints.filter((c) => c.isOverdue).length;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-headline">
              Reports &amp; Macro Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              Macro Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inter-Bureau Velocity • SLA Ageing Buckets • Regional Distribution • Resolution Performance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
          <BarChart3 className="w-4 h-4 text-sky-600" />
          <span>Macro Analytics Active</span>
        </div>
      </div>

      {/* Top 3 KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Resolution Rate
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-headline mt-2">
            {Math.round((disposed / totalCases) * 100)}%
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {disposed} of {totalCases} cases finalized
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Resolution Age
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-headline mt-2">
            18.4 Days
          </div>
          <p className="text-xs text-slate-500 mt-1">Well within national 30-day mandate</p>
        </div>

        <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
            SLA Escalation Files
          </span>
          <div className="text-3xl font-extrabold text-rose-900 font-headline mt-2">
            {overdue}
          </div>
          <p className="text-xs text-rose-600 mt-1">Designated for fast-track hearing</p>
        </div>
      </div>

      {/* 2 Bento Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bureau Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 font-headline mb-1">
            Bureau Workload &amp; Intake Velocity
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Active versus pending vs disposed distribution
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bureauData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Active" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Disposed" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Ageing Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-headline mb-1">
              SLA Ageing Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Categorization by active duration in portal
            </p>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ageingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            {ageingData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-semibold text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
