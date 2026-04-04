"use client";

import { motion } from "framer-motion";
import { Search, Filter, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const WITHDRAWALS_DATA = [
  { id: "WD-1093", user: "MC Budi", email: "budi@mc.com", amount: "Rp 1.000.000", bank: "BCA", acc: "018283949", date: "15 Apr 2026", status: "Pending" },
  { id: "WD-1092", user: "Operator Clara", email: "clara@op.com", amount: "Rp 500.000", bank: "GoPay", acc: "0812345678", date: "14 Apr 2026", status: "Pending" },
  { id: "WD-1091", user: "MC Sarah", email: "sarah@mc.com", amount: "Rp 250.000", bank: "Mandiri", acc: "141009988223", date: "10 Apr 2026", status: "Completed" },
];

export default function OperatorWithdrawalsPage() {
  const [filter, setFilter] = useState("pending");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Process Withdrawals</h1>
        <p className="text-slate-500 dark:text-slate-400">Review pending withdrawal requests and process bank transfers.</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2">
            {["pending", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 capitalize font-medium text-sm rounded-xl transition-all whitespace-nowrap ${
                  filter === tab ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search ID..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {WITHDRAWALS_DATA.filter(w => filter === "all" || w.status.toLowerCase() === filter).map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center justify-between"
            >
              <div className="flex-1 grid md:grid-cols-4 gap-4 items-center">
                <div>
                   <p className="text-xs font-bold font-mono text-slate-500 mb-1">{w.id}</p>
                   <p className="font-bold text-slate-900 dark:text-white capitalize">{w.user}</p>
                </div>
                <div>
                   <p className="text-xs font-bold font-mono text-slate-500 mb-1">Amount</p>
                   <p className="font-bold font-mono text-slate-900 dark:text-white text-lg">{w.amount}</p>
                </div>
                <div>
                   <p className="text-xs font-bold font-mono text-slate-500 mb-1">Bank Detail</p>
                   <p className="font-bold text-slate-900 dark:text-white uppercase">{w.bank}</p>
                   <p className="text-xs text-slate-500">{w.acc}</p>
                </div>
                <div>
                   <span className={`px-2.5 py-1 font-bold uppercase tracking-widest text-xs rounded border inline-flex items-center gap-1.5 ${
                      w.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/50' :
                      'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-900/50'
                   }`}>
                      {w.status === 'Pending' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {w.status}
                   </span>
                   <p className="text-xs text-slate-500 mt-2">{w.date}</p>
                </div>
              </div>

              {w.status === "Pending" && (
                <div className="flex shrink-0">
                  <button className="px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95">
                    Mark as Transferred
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
