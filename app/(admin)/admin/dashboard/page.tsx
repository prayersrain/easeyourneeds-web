"use client";

import { motion } from "framer-motion";
import { 
  Building, 
  Users, 
  Wallet,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Video
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Revenue (This Month)",
      value: "Rp 24.500.000",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/transactions",
      action: "View Finances"
    },
    {
      label: "Active Zoom Accounts",
      value: "28 / 30",
      icon: Building,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/zoom-accounts",
      action: "Manage Pool"
    },
    {
      label: "Pending Withdrawals",
      value: "5 Requests",
      icon: Wallet,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/withdrawals",
      action: "Process Now",
      alert: true
    }
  ];

  const recentBookings = [
    { id: "BK-1004", user: "Jaya Subagja", topic: "Simposium Nasional", date: "18 Apr 2026", type: "Zoom Pro 1000P", status: "Paid" },
    { id: "BK-1003", user: "Rina Wahyuni", topic: "Kelas Online Batch 4", date: "15 Apr 2026", type: "Zoom Pro 300P + Operator", status: "Paid" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            System Overview ⚡
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time insights and system health status.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${stat.alert ? 'border-amber-500 shadow-md shadow-amber-500/10' : 'border-slate-200 dark:border-slate-800 shadow-sm'} relative overflow-hidden group`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            
            <Link 
              href={stat.href}
              className={`inline-flex items-center text-sm font-semibold transition-colors relative z-10 ${stat.alert ? 'text-amber-600 hover:text-amber-700' : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'}`}
            >
              {stat.action} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - System Health */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl text-slate-900 dark:text-white shadow-xl relative overflow-hidden border border-slate-200 dark:border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Video className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Zoom S2S Capacity
               </h3>
               
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-slate-500 dark:text-slate-400">Pro 100P Accounts in use</span>
                     <span className="font-bold">12 / 15 (80%)</span>
                   </div>
                   <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[80%] rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-slate-500 dark:text-slate-400">Pro 300P Accounts in use</span>
                     <span className="font-bold">4 / 10 (40%)</span>
                   </div>
                   <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[40%] rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-slate-500 dark:text-slate-400">Pro 500P Accounts in use</span>
                     <span className="font-bold">4 / 5 (80%)</span>
                   </div>
                   <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-[80%] rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                   </div>
                 </div>
               </div>

             </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
             </div>
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Package</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{bk.id}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{bk.user}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{bk.type}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs rounded border border-emerald-200 dark:border-emerald-800">
                            {bk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Right Column - Action Items */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900">
             <h3 className="text-base font-bold text-rose-900 dark:text-rose-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" /> Action Required
             </h3>
             <div className="space-y-4">
               <div className="p-4 bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/50 rounded-2xl shadow-sm">
                 <p className="font-bold text-slate-900 dark:text-white mb-1">Failed Assignment: BK-0992</p>
                 <p className="text-sm text-slate-500 mb-3 leading-relaxed">System failed to auto-assign a Zoom 1000P account. All 1000P accounts in use.</p>
                 <button className="w-full text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 py-2 rounded-lg transition-colors">
                   Resolve Manually
                 </button>
               </div>
               <div className="p-4 bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/50 rounded-2xl shadow-sm">
                 <p className="font-bold text-slate-900 dark:text-white mb-1">5 Withdrawals Pending</p>
                 <p className="text-sm text-slate-500 mb-3 leading-relaxed">You have pending balance withdrawal requests waiting for approval.</p>
                 <Link href="/admin/withdrawals">
                   <button className="w-full text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400 py-2 rounded-lg transition-colors">
                     Review Now
                   </button>
                 </Link>
               </div>
             </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
             <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Platform Stats
             </h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Users</span>
                 <span className="font-bold text-slate-900 dark:text-white">1,245</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Operators</span>
                 <span className="font-bold text-slate-900 dark:text-white">24</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <span className="text-sm font-medium text-slate-600 dark:text-slate-300">System Balance</span>
                 <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">Rp 122M</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
