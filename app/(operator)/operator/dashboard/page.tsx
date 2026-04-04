"use client";


import { 
  CheckSquare, 
  ArrowRight,
  AlertTriangle,
  CalendarCheck,
  Send
} from "lucide-react";
import Link from "next/link";

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Operator Activity Desk 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back! Here are the items requiring your approval today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Bookings Pending Action</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">12</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
          <Link href="/operator/bookings" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center">
             Review Bookings <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500 shadow-md shadow-amber-500/10 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pending Withdrawals</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">5</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
              <Send className="w-6 h-6" />
            </div>
          </div>
          <Link href="/operator/withdrawals" className="text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-600 flex items-center">
             Process Withdrawals <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Zoom Pool Issues</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">1</h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <Link href="/operator/zoom-accounts" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center">
             Check Pool Status <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <CheckSquare className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Daily Tasks Summary
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 relative z-10 max-w-2xl">
          As a Platform Staff, your main responsibility is to review and approve booking requests, handle withdrawal processing, and manually assign Zoom accounts when auto-assign fails. Note that you do not have permission to delete critical system data or create new operators.
        </p>
        <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all relative z-10 shadow-sm">
          Start Managing Queue
        </button>
      </div>

    </div>
  );
}
