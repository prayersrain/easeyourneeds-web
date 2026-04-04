"use client";

import { motion } from "framer-motion";
import { Download, PlayCircle, Clock, CalendarDays, AlertCircle } from "lucide-react";

export default function RecordingsPage() {
  const recordings = [
    {
      id: "REC-8829",
      topic: "Quarterly Townhall Meeting",
      date: "16 Apr 2026",
      duration: "1h 45m",
      size: "850 MB",
      expiresIn: "6 Days",
      status: "Available"
    },
    {
      id: "REC-8828",
      topic: "Webinar Nasional Pendidikan",
      date: "12 Apr 2026",
      duration: "4h 30m",
      size: "2.1 GB",
      expiresIn: "2 Days",
      status: "Expiring Soon",
      isUrgent: true
    },
    {
      id: "REC-8501",
      topic: "Koordinasi Guru SD",
      date: "01 Mar 2026",
      duration: "2h 00m",
      size: "950 MB",
      expiresIn: "Expired",
      status: "Expired",
      isExpired: true
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Cloud Recordings</h1>
        <p className="text-slate-500 dark:text-slate-400">Download and manage your Zoom recordings. Files auto-delete after 7 days.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recordings.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col rounded-3xl overflow-hidden border ${
              rec.isUrgent 
                ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900" 
                : rec.isExpired 
                  ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 grayscale" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
            }`}
          >
            {/* Thumbnail Header */}
            <div className="h-40 bg-slate-900 relative group overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all backdrop-blur-sm">
                  {!rec.isExpired && <PlayCircle className="w-16 h-16 text-white cursor-pointer hover:scale-110 transition-transform drop-shadow-lg" />}
               </div>
               
               {rec.isUrgent && (
                 <div className="absolute top-4 right-4 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg">
                   <AlertCircle className="w-4 h-4" /> Expiring Soon
                 </div>
               )}

               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 text-white text-xs font-mono">
                    {rec.duration} • {rec.size}
                  </span>
               </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{rec.topic}</h3>
              <p className="text-sm flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-6 font-medium">
                <CalendarDays className="w-4 h-4" /> {rec.date}
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-sm p-3 bg-white/50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Time left:
                  </span>
                  <span className={`font-bold ${rec.isUrgent ? 'text-amber-600 dark:text-amber-400' : rec.isExpired ? 'text-slate-400 text-xs uppercase' : 'text-slate-700 dark:text-slate-300'}`}>
                    {rec.expiresIn}
                  </span>
                </div>

                <button 
                  disabled={rec.isExpired}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-900 hover:text-white dark:text-slate-100 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-800 disabled:hover:text-slate-900 dark:disabled:hover:text-slate-100 disabled:cursor-not-allowed group"
                >
                  {rec.isExpired ? 'File Deleted' : 'Download via R2'}
                  {!rec.isExpired && <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />}
                </button>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
