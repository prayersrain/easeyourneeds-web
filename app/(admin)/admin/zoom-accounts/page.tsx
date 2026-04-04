"use client";

import { motion } from "framer-motion";
import { Plus, Search, Video, Lock, Unlock, Mail, PieChart } from "lucide-react";
import { useState } from "react";

const ZOOM_ACCOUNTS = [
  { id: "z1000_1", email: "z1000@ease.com", tier: "1000P", isBackup: false, usage: 100, status: "Active" },
  { id: "z500_1", email: "z500_1@ease.com", tier: "500P", isBackup: false, usage: 80, status: "Active" },
  { id: "z500_2", email: "z500_2@ease.com", tier: "500P", isBackup: true, usage: 0, status: "Available" },
  { id: "z300_1", email: "z300_1@ease.com", tier: "300P", isBackup: false, usage: 95, status: "Daily Limit Reached" },
  { id: "z100_1", email: "z100_1@ease.com", tier: "100P", isBackup: false, usage: 50, status: "Active" },
  { id: "z100_2", email: "z100_2@ease.com", tier: "100P", isBackup: false, usage: 0, status: "Banned" },
];

export default function AdminZoomAccountsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Zoom Accounts Pool</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage 30 connected Zoom S2S OAuth Accounts for automated bookings.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 shrink-0">
          <Plus className="w-5 h-5" />
          Connect Acc
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         {['1000P', '500P', '300P', '100P'].map(tier => (
           <div key={tier} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex justify-between items-center group cursor-pointer hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <Video className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 dark:text-white">Tier {tier}</p>
                   <p className="text-xs text-slate-500">2 Accounts Active</p>
                 </div>
              </div>
              <PieChart className="w-5 h-5 text-slate-300" />
           </div>
         ))}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["all", "active", "available", "limit reached", "banned"].map((tab) => (
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

          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Search email..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ZOOM_ACCOUNTS.filter(z => filter === "all" || z.status.toLowerCase().includes(filter === "limit reached" ? "limit" : filter)).map((acc, i) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between"
            >
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                      <Video className="w-5 h-5 text-blue-500" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white leading-tight">{acc.tier}</p>
                     <p className="text-xs font-mono text-slate-500">{acc.id}</p>
                   </div>
                 </div>
                 
                 {acc.isBackup && (
                   <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] uppercase font-bold tracking-widest rounded-md">
                     Backup
                   </span>
                 )}
               </div>

               <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                   <Mail className="w-4 h-4 text-slate-400" /> {acc.email}
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                     <span>Daily Usage Limit</span>
                     <span className={acc.usage > 90 ? 'text-rose-500' : ''}>{acc.usage}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${acc.usage > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                       style={{ width: `${acc.usage}%` }} 
                     />
                   </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border inline-flex items-center gap-1 ${
                       acc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-900/50' :
                       acc.status === 'Available' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/10 dark:text-blue-500 dark:border-blue-900/50' :
                       acc.status === 'Banned' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/10 dark:text-rose-500 dark:border-rose-900/50' :
                       'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/50'
                    }`}>
                      {acc.status === 'Banned' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {acc.status}
                    </span>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Edit Config</button>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
