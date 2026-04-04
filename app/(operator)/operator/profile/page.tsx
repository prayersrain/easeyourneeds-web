"use client";


import { User, Mail, ShieldAlert, Key } from "lucide-react";

export default function OperatorProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">View your staff information and system credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-linear-to-tr from-emerald-500 to-indigo-500 rounded-full p-1 shadow-lg shadow-emerald-500/20 mb-4">
             <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
               <User className="w-10 h-10 text-emerald-500" />
             </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Platform Staff</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">staff@ease.com</p>
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded shadow-sm border border-emerald-200 dark:border-emerald-800/50">
            Operator Level
          </span>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Account Information</h3>
             
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" readOnly value="Platform Staff" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none text-slate-700 dark:text-slate-300" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" readOnly value="staff@ease.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none text-slate-700 dark:text-slate-300" />
                  </div>
               </div>
             </div>

             <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-start gap-3">
               <ShieldAlert className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
               <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium">As a staff member, your account profile is managed by the Super Admin. Please contact them if you need to update your email or name.</p>
             </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Security</h3>
                <Key className="w-5 h-5 text-slate-400" />
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your password and security settings.</p>

             <button className="px-5 py-2.5 text-sm font-bold bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm">
                Request Password Reset
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
