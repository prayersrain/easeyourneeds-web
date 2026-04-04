"use client";


import { User, Mail, Phone, Camera, ShieldCheck, LogOut } from "lucide-react";
import { useState } from "react";

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    name: "Demo Customer",
    email: "customer@demo.com",
    phone: "+6281234567899"
  });

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Col - Avatar & Security */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center shadow-sm">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center overflow-hidden shadow-xl shadow-blue-500/20">
                 <span className="text-4xl text-white font-bold tracking-widest">DC</span>
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:scale-110 transition-transform shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h3>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-lg mt-2">
               Verified User
            </span>
          </div>

          <button className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 text-rose-600 dark:bg-rose-900/10 dark:text-rose-400 font-bold rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

        {/* Right Col - Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold font-heading mb-6 text-slate-900 dark:text-white flex items-center gap-2">
               <User className="w-5 h-5 text-blue-500" /> General Information
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address (Magic Link via Resend)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      disabled
                      value={formData.email}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold justify-center rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-slate-900 dark:text-white">Enhanced Security</h4>
               <p className="text-sm text-slate-500">Your account relies on passwordless Magic Links. There&apos;s zero risk of your password being stolen!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
