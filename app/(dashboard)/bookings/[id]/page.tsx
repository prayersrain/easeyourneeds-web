"use client";

import { ArrowLeft, Copy, ExternalLink, CalendarDays, Clock, Users, ShieldCheck, Download, Video } from "lucide-react";
import Link from "next/link";

export default function BookingDetailPage() {
  // Mock data for BK-1001
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Link href="/bookings" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-1">Webinar Nasional Pendidikan</h1>
              <span className="px-2.5 py-0.5 mt-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                Completed
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 rounded">BK-1001</span>
              • Created 10 Apr 2026
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors">
             <Download className="w-4 h-4" /> Invoice
           </button>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl transition-colors opacity-50 cursor-not-allowed" disabled>
             Cancel Order
           </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
               <Video className="w-5 h-5 text-blue-500" /> Event Details
             </h3>
             <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Package</p>
                  <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    Zoom Pro 500P <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">Per Hari</span>
                  </p>
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Schedule</p>
                  <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" /> Mon, 12 Apr 2026
                  </p>
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Time (WIB)</p>
                  <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" /> 09:00 - 15:00
                  </p>
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Participants</p>
                  <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" /> Up to 500
                  </p>
               </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
               <h4 className="font-bold text-slate-900 dark:text-white mb-4">Add-ons</h4>
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                     <span className="text-indigo-600 dark:text-indigo-400 font-bold">BP</span>
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white">Bima Pratama</p>
                     <p className="text-xs text-slate-500">Pro Operator Assigned</p>
                   </div>
                 </div>
                 <a href="https://wa.me/6281234567890" target="_blank" className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 font-bold text-xs rounded-lg transition-colors">
                   Chat WA
                 </a>
               </div>
             </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
               <ShieldCheck className="w-5 h-5 text-blue-500" /> Meeting Credentials
             </h3>
             <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner">
               <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
                 <div className="p-5 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meeting ID</p>
                    <p className="text-xl font-mono text-slate-900 dark:text-white tracking-widest bg-white dark:bg-slate-900 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm cursor-text selection:bg-blue-200 selection:text-blue-900">
                      893 281 9901
                    </p>
                 </div>
                 <div className="p-5 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</p>
                    <p className="text-xl font-mono text-slate-900 dark:text-white tracking-widest bg-white dark:bg-slate-900 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm cursor-text selection:bg-blue-200 selection:text-blue-900">
                      EASE99
                    </p>
                 </div>
                 <div className="p-5 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Host Key</p>
                    <p className="text-xl font-mono text-slate-900 dark:text-white tracking-widest bg-white dark:bg-slate-900 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm cursor-text selection:bg-blue-200 selection:text-blue-900">
                      105234
                    </p>
                 </div>
               </div>
               
               <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800">
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono truncate text-slate-500 selection:bg-blue-200 selection:text-blue-900">
                     https://zoom.us/j/8932819901?pwd=...
                   </div>
                   <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex justify-center items-center gap-2">
                     <Copy className="w-4 h-4" /> Copy
                   </button>
                 </div>
               </div>
             </div>
             <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> Credentials are automatically revoked after your booking ends.</p>
          </div>
        </div>

        {/* Right Column - Join Links & Billing */}
        <div className="space-y-6">
           <div className="p-6 bg-linear-to-b from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl shadow-blue-500/20 relative overflow-hidden">
             {/* Decorative abstract */}
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
               <p className="text-blue-100 text-sm mb-6 leading-relaxed">Ensure you have logged in to your Zoom Desktop client before joining as host.</p>
               
               <a href="https://zoom.us" target="_blank" className="w-full py-4 bg-white hover:bg-slate-50 text-blue-700 font-bold rounded-xl shadow-xl flex justify-center items-center gap-2 transition-all active:scale-95">
                 Join Meeting <ExternalLink className="w-4 h-4" />
               </a>
               <div className="w-full py-3 mt-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl flex justify-center items-center transition-all cursor-pointer backdrop-blur-md">
                 Claim Host Role
               </div>
             </div>
           </div>

           <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="font-bold text-slate-900 dark:text-white mb-4">Payment Summary</h3>
             <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium dark:text-white">Rp 195.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Fee</span>
                  <span className="font-medium dark:text-white">Rp 2.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Loyalty Points Earned</span>
                  <span className="font-medium text-amber-500 text-right">+90 pts<br/><span className="text-xs opacity-70">Credited</span></span>
                </div>
             </div>
             <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-slate-400 text-sm">Total</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">Rp 197.000</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
