"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Filter } from "lucide-react";

interface MonthOption {
  month_str: string;
  month_label: string;
  count: string;
}

export default function MeetingReportsFilters({
  availableMonths,
}: {
  availableMonths: MonthOption[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusFilter = searchParams.get("status") || "all";
  const monthFilter = searchParams.get("month") || "all";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/meeting-reports?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/meeting-reports");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      {/* Status Filter */}
      <select
        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
        value={statusFilter}
        onChange={(e) => updateFilter("status", e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="upcoming">Upcoming</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="overtime">Overtime</option>
      </select>

      {/* Month Filter */}
      <select
        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
        value={monthFilter}
        onChange={(e) => updateFilter("month", e.target.value)}
      >
        <option value="all">All Months</option>
        {availableMonths.map((row) => (
          <option key={row.month_str} value={row.month_str}>
            {row.month_label.trim()} ({row.count})
          </option>
        ))}
      </select>

      {(statusFilter !== "all" || monthFilter !== "all") && (
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
