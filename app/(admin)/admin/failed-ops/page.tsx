"use client";

import { motion } from "framer-motion";
import { AlertOctagon, ArrowRight, Laptop, CalendarDays, CheckCircle } from "lucide-react";

const FAILED_JOBS = [
  { id: "BK-0992", user: "Toko Abadi", date: "10 Apr 2026 (08:00 - 10:00)", req: "Zoom Pro 1000P", error: "Capacity reached. No 1000P accounts available for this slot." },
  { id: "BK-0985", user: "PT Sukses Makmur", date: "08 Apr 2026 (13:00 - 16:00)", req: "Zoom Pro 300P", error: "Cron auto-delete recordings failed. Storage at 95% capacity." },
];

export default function AdminFailedOpsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3 text-slate-900 dark:text-white mb-2">
            <AlertOctagon className="w-8 h-8 text-rose-500" />
            Failed Operations
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Review system logic failures, API errors, and capacity issues requiring manual intervention.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {FAILED_JOBS.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white dark:bg-slate-900 border-l-4 border border-l-rose-500 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
          >
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-widest rounded border border-rose-200 dark:border-rose-900/50">
                  CRITICAL
                </span>
                <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-white">{job.id}</h3>
                <span className="text-slate-500 text-sm">• {job.user}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                   <CalendarDays className="w-4 h-4 text-slate-400"/> {job.date}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                   <Laptop className="w-4 h-4 text-slate-400"/> {job.req}
                </div>
              </div>

              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/50 text-rose-800 dark:text-rose-400 text-sm font-medium">
                 Error: {job.error}
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-3 w-full md:w-48 shrink-0">
               <button className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                  Resolve Manually <ArrowRight className="w-4 h-4"/>
               </button>
               <button className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                  Dismiss
               </button>
            </div>
          </motion.div>
        ))}

        {FAILED_JOBS.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
               <CheckCircle className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Healthy</h3>
             <p className="text-slate-500">No failed operations detected in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
