"use client";

import { motion } from "framer-motion";
import { Search, Video, Mail } from "lucide-react";

const ZOOM_ACCOUNTS = [
  { id: "z1000_1", email: "z1000@ease.com", tier: "1000P", isBackup: false, usage: 100, status: "Active" },
  { id: "z500_1", email: "z500_1@ease.com", tier: "500P", isBackup: false, usage: 80, status: "Active" },
  { id: "z300_1", email: "z300_1@ease.com", tier: "300P", isBackup: false, usage: 95, status: "Daily Limit Reached" },
];

export default function OperatorZoomAccountsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Pool Monitor (Read-Only)</h1>
        <p className="text-slate-500 dark:text-slate-400">View Zoom Server-to-Server account limits to help with manual assignment.</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search email..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ZOOM_ACCOUNTS.map((acc, i) => (
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
                      <Video className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white leading-tight">{acc.tier}</p>
                     <p className="text-xs font-mono text-slate-500">{acc.id}</p>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                   <Mail className="w-4 h-4 text-slate-400" /> {acc.email}
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                     <span>Daily Usage Limit</span>
                     <span className={acc.usage > 90 ? 'text-amber-500' : ''}>{acc.usage}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${acc.usage > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                       style={{ width: `${acc.usage}%` }} 
                     />
                   </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border inline-flex items-center gap-1 ${
                       acc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-900/50' :
                       'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/50'
                    }`}>
                      {acc.status}
                    </span>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
