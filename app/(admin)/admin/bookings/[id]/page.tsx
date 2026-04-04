"use client";

import { ArrowLeft, User, Clock, CalendarDays, Laptop, XCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminBookingDetailPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-1">BK-0992</h1>
              <span className="px-2.5 py-0.5 mt-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-widest border border-rose-200 dark:border-rose-800">
                Failed Assignment
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
           <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
             Assign Account manually
           </button>
           <button className="flex items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:hover:bg-rose-900/30 font-bold rounded-xl transition-colors">
             Cancel Order & Refund
           </button>
        </div>
      </div>

      {/* System Warning */}
      <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-3">
        <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-500 shrink-0" />
        <div>
          <h4 className="font-bold text-rose-900 dark:text-rose-500 mb-1">System Error: Capacity Reached</h4>
          <p className="text-sm text-rose-800 dark:text-rose-400">The Cron job could not assign a Zoom 1000P account to this booking due to schedule conflicts. Please manually assign an account or upgrade a smaller account temporarily.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Detail Cards */}
        <div className="space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
               Customer Profile
             </h3>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Toko Abadi</h4>
                  <p className="text-sm text-slate-500 font-mono">user_abadi@gmail.com • +628129938822</p>
                </div>
             </div>
             <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
               <span className="text-sm text-slate-500">Member Status</span>
               <span className="text-sm font-bold text-slate-900 dark:text-white">Active (2,500 pts)</span>
             </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
               Order Details
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Package required</span>
                  <span className="font-bold text-slate-900 dark:text-white">Zoom Pro 1000P</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Schedule</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> 10 Apr 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Time (WIB)</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Clock className="w-4 h-4"/> 08:00 - 10:00</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
               Account Assignment Status
             </h3>
             <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-center shadow-sm">
                <Laptop className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">No Account Assigned</h4>
                <p className="text-sm text-slate-500 mb-6">You must link a Zoom account to this booking for the credentials to be generated.</p>
                <button className="px-6 py-2 border-2 border-dashed border-blue-500 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                  Open Pool Selector
                </button>
             </div>
          </div>
          
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
               Payment Data
             </h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-4 h-4"/> Paid via Balance</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-slate-900 dark:text-white">TRX-99812</span>
               </div>
               <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold uppercase tracking-widest text-slate-400">Total Price</span>
                  <span className="font-black font-mono text-lg text-slate-900 dark:text-white">Rp 185.000</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
