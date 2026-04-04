"use client";

import { motion } from "framer-motion";
import { Search, CalendarDays } from "lucide-react";
import { useState } from "react";

const DATA = [
  { id: "BK-1004", user: "Jaya Subagja", date: "18 Apr 2026", type: "Zoom 1000P", status: "Paid", action: "Approve" },
  { id: "BK-1003", user: "Rini WA", date: "15 Apr 2026", type: "Zoom 300P", status: "Paid", action: "Approve" },
  { id: "BK-1002", user: "Demo Cust", date: "12 Apr 2026", type: "Zoom 500P", status: "Completed", action: "View" },
];

export default function OperatorBookingsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Booking Approvals</h1>
        <p className="text-slate-500 dark:text-slate-400">Review schedule conflicts and manually approve bookings if required.</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
           <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-bold rounded-xl ${filter === 'all' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>All</button>
              <button onClick={() => setFilter('paid')} className={`px-4 py-2 text-sm font-bold rounded-xl ${filter === 'paid' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Needs Approval</button>
           </div>
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search Bookings" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
               {DATA.filter(b => filter === 'all' || b.status.toLowerCase() === filter).map(b => (
                 <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{b.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{b.user}</td>
                    <td className="px-6 py-4 text-slate-500"><CalendarDays className="w-4 h-4 inline mr-2"/>{b.date}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{b.type}</td>
                    <td className="px-6 py-4">
                       {b.action === 'Approve' ? (
                         <button className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors">
                           Approve & Assign
                         </button>
                       ) : (
                         <span className="text-slate-400 font-medium ml-2">Completed</span>
                       )}
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
