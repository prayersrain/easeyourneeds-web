"use client";

import { motion } from "framer-motion";
import { Search, CalendarDays, ExternalLink, Settings2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BATCH_DATA = [
  { id: "BK-1004", user: "Jaya Subagja", date: "18 Apr 2026", time: "09:00-15:00", type: "Zoom Pro 1000P", status: "Paid", accountAssigned: "z1000@ease.com" },
  { id: "BK-1003", user: "Rina Wahyuni", date: "15 Apr 2026", time: "10:00-12:00", type: "Zoom Pro 300P", status: "Active", accountAssigned: "z300_1@ease.com" },
  { id: "BK-1002", user: "Demo Customer", date: "12 Apr 2026", time: "09:00-15:00", type: "Zoom Pro 500P", status: "Completed", accountAssigned: "z500_1@ease.com" },
  { id: "BK-0992", user: "Toko Abadi", date: "10 Apr 2026", time: "08:00-10:00", type: "Zoom Pro 1000P", status: "Failed", accountAssigned: "Unassigned" },
];

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">All Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all customer bookings across the platform.</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["all", "paid", "active", "completed", "failed"].map((tab) => (
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
                placeholder="Search ID or User..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Zoom Account</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {BATCH_DATA.filter(b => filter === 'all' || b.status.toLowerCase() === filter).map((bk, i) => (
                <motion.tr 
                  key={bk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/20 group"
                >
                  <td className="px-6 py-5 font-mono font-bold text-blue-600 dark:text-blue-400">
                     <Link href={`/admin/bookings/${bk.id}`} className="hover:underline flex items-center gap-1">
                       {bk.id} <ExternalLink className="w-3 h-3" />
                     </Link>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-900 dark:text-white">{bk.user}</td>
                  <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                       <CalendarDays className="w-4 h-4 text-slate-400" />
                       <span>{bk.date} <br/> <span className="text-xs">{bk.time}</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-700 dark:text-slate-300">{bk.type}</td>
                  <td className="px-6 py-5">
                     {bk.accountAssigned === 'Unassigned' ? (
                        <span className="text-rose-500 font-medium text-xs bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded">
                          Unassigned
                        </span>
                     ) : (
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          {bk.accountAssigned}
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 font-bold uppercase tracking-widest text-[10px] rounded border ${
                      bk.status === 'Paid' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/50' :
                      bk.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/10 dark:text-blue-500 dark:border-blue-900/50' :
                      bk.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-900/50' :
                      'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/10 dark:text-rose-500 dark:border-rose-900/50'
                    }`}>
                      {bk.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
