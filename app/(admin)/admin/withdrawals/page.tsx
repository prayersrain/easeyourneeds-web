"use client";

import { motion } from "framer-motion";
import { Search, Filter, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";

const WITHDRAWALS_DATA = [
  { id: "WD-1093", user: "MC Budi", email: "budi@mc.com", amount: "Rp 1.000.000", bank: "BCA", acc: "018283949", date: "15 Apr 2026", status: "Pending" },
  { id: "WD-1092", user: "Operator Clara", email: "clara@op.com", amount: "Rp 500.000", bank: "GoPay", acc: "0812345678", date: "14 Apr 2026", status: "Pending" },
  { id: "WD-1091", user: "MC Sarah", email: "sarah@mc.com", amount: "Rp 250.000", bank: "Mandiri", acc: "141009988223", date: "10 Apr 2026", status: "Completed" },
  { id: "WD-1088", user: "System Admin", email: "admin@ease.com", amount: "Rp 50.000", bank: "BCA", acc: "12312312", date: "05 Apr 2026", status: "Rejected" },
];

export default function AdminWithdrawalsPage() {
  const [filter, setFilter] = useState("pending");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Withdrawal Requests</h1>
          <p className="text-slate-500 dark:text-slate-400">Review and approve balance withdrawal requests from staff and customers.</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["all", "pending", "completed", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 capitalize font-medium text-sm rounded-xl transition-all whitespace-nowrap ${
                  filter === tab 
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search Name or ID..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {WITHDRAWALS_DATA.filter(w => filter === "all" || w.status.toLowerCase() === filter).map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center justify-between group hover:border-blue-500/30 transition-colors"
            >
              <div className="flex-1 grid md:grid-cols-4 gap-4 items-center">
                <div>
                   <p className="text-xs font-bold font-mono text-slate-500 mb-1">{w.id}</p>
                   <p className="font-bold text-slate-900 dark:text-white capitalize">{w.user}</p>
                   <p className="text-xs text-slate-500">{w.email}</p>
                </div>
                <div>
                   <p className="text-xs font-bold font-mono text-slate-500 mb-1">Amount</p>
                   <p className="font-bold font-mono text-slate-900 dark:text-white text-lg">{w.amount}</p>
                </div>
                <div>
                   <p className="text-xs font-bold font-mono text-slate-500 mb-1">Bank Detail</p>
                   <p className="font-bold text-slate-900 dark:text-white uppercase">{w.bank}</p>
                   <p className="text-xs font-mono text-slate-500 flex items-center gap-1">
                     {w.acc}
                     <button className="text-blue-500 hover:text-blue-600"><ExternalLink className="w-3 h-3" /></button>
                   </p>
                </div>
                <div>
                   <span className={`px-2.5 py-1 font-bold uppercase tracking-widest text-xs rounded border inline-flex items-center gap-1.5 ${
                      w.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/50' :
                      w.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-900/50' :
                      'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/10 dark:text-rose-500 dark:border-rose-900/50'
                   }`}>
                      {w.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {w.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                      {w.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {w.status}
                   </span>
                   <p className="text-xs text-slate-500 mt-2">{w.date}</p>
                </div>
              </div>

              {w.status === "Pending" && (
                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-0 border-slate-200 dark:border-slate-800 shrink-0">
                  <button className="px-5 py-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 font-bold rounded-xl transition-colors">
                    Reject
                  </button>
                  <button className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95">
                    Approve & Transfer
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
