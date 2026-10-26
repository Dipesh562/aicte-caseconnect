import React from "react";
import { Search, Filter, X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext";

const BUREAUS = ["All", "RB", "PGRC", "Regional Office - West", "Regional Office - South", "Approval Bureau"];
const REGIONS = ["All", "North", "South", "East", "West", "Central"];
const STATUSES = ["All", "Pending", "Under process", "Action initiated", "Transferred", "Escalated", "Disposed"];
const PRIORITIES = ["All", "Critical", "High", "Medium", "Low"];

export default function FilterBar() {
  const { filters, setFilters } = useApp();

  const update = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const hasActiveFilters =
    filters.search ||
    filters.bureau !== "All" ||
    filters.region !== "All" ||
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.dateFrom ||
    filters.dateTo;

  const resetFilters = () =>
    setFilters({
      search: "",
      bureau: "All",
      region: "All",
      category: "All",
      status: "All",
      priority: "All",
      dateFrom: "",
      dateTo: "",
    });

  return (
    <div className="glass-panel rounded-lg p-3.5 space-y-3">
      {/* Search Input Bar + Filter Reset */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Case ID (#CASE-205), Institution Name, AICTE Permanent ID (1-3324551201), Category..."
            className="w-full bg-obsidian-950/90 border border-obsidian-700/80 focus:border-command-cyan focus:ring-1 focus:ring-command-cyan rounded-md pl-9 pr-9 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />
          {filters.search && (
            <button
              onClick={() => update("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-mono text-command-crimson hover:bg-red-950/40 border border-red-800/60 px-3 py-2 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Multi-Dimensional Matrix Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Select
          label="BUREAU / CELL"
          value={filters.bureau}
          options={BUREAUS}
          onChange={(v) => update("bureau", v)}
        />
        <Select
          label="REGIONAL OFFICE"
          value={filters.region}
          options={REGIONS}
          onChange={(v) => update("region", v)}
        />
        <Select
          label="CASE STATUS"
          value={filters.status}
          options={STATUSES}
          onChange={(v) => update("status", v)}
        />
        <Select
          label="PRIORITY TIER"
          value={filters.priority}
          options={PRIORITIES}
          onChange={(v) => update("priority", v)}
        />
        <div>
          <label className="block text-slate-400 text-[9px] font-mono mb-1 uppercase tracking-wider font-semibold">
            DATE FROM
          </label>
          <input
            type="date"
            className="w-full bg-obsidian-950/90 border border-obsidian-700/80 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:border-command-cyan focus:outline-none"
            value={filters.dateFrom}
            onChange={(e) => update("dateFrom", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-slate-400 text-[9px] font-mono mb-1 uppercase tracking-wider font-semibold">
            DATE TO
          </label>
          <input
            type="date"
            className="w-full bg-obsidian-950/90 border border-obsidian-700/80 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:border-command-cyan focus:outline-none"
            value={filters.dateTo}
            onChange={(e) => update("dateTo", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-slate-400 text-[9px] font-mono mb-1 uppercase tracking-wider font-semibold">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-obsidian-950/90 border border-obsidian-700/80 rounded px-2 py-1.5 text-slate-200 text-xs font-mono focus:border-command-cyan focus:outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-obsidian-900 text-slate-200">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
