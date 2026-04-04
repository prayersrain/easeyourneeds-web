"use client";

import { motion } from "framer-motion";
import { Search, Filter, CalendarDays, Clock, Video, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BATCH_DATA = [
  { id: "BK-1002", topic: "Quarterly Townhall Meeting", date: "16 Apr 2026", time: "10:00 - 12:00", type: "Zoom Pro 300P (Per Jam)", status: "Upcoming" },
  { id: "BK-1001", topic: "Webinar Nasional Pendidikan", date: "12 Apr 2026", time: "09:00 - 15:00", type: "Zoom Pro 500P (Per Hari)", status: "Completed" },
  { id: "BK-0988", topic: "Koordinasi Guru SD", date: "01 Mar 2026", time: "13:00 - 15:00", type: "Zoom Pro 100P (Per Jam)", status: "Completed" },
  { id: "BK-0985", topic: "Live Streaming Talkshow", date: "24 Feb 2026", time: "19:00 - 21:00", type: "Zoom Webinar 300P HD", status: "Cancelled" },
];

export default function BookingsPage() {
  const [filter, setFilter] = useState("all");

  const filteredData = BATCH_DATA.filter(b => 
    filter === "all" ? true : b.status.toLowerCase() === filter
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage all your Zoom rentals and add-ons.</p>
        </div>
        <Link href="/bookings/create">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25">
            <Plus className="w-5 h-5" />
            Book a Zoom
          </button>
        </Link>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["all", "upcoming", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 capitalize font-medium text-sm rounded-xl transition-all whitespace-nowrap ${
                  filter === tab 
                    ? "bg-blue-500 dark:bg-blue-600 text-white shadow-md shadow-blue-500/20" 
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
                placeholder="Search topic or ID..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No bookings found</h3>
              <p className="text-slate-500">You don&apos;t have any bookings matching this filter.</p>
            </div>
          ) : (
            filteredData.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/bookings/${booking.id}`} className="block group">
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-active transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-slate-200/50 dark:group-hover:shadow-none flex flex-col md:flex-row gap-5 items-start md:items-center">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                          {booking.id}
                        </span>
                        
                        {booking.status === "Upcoming" && <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 uppercase tracking-widest">Upcoming</span>}
                        {booking.status === "Completed" && <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Completed</span>}
                        {booking.status === "Cancelled" && <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 uppercase tracking-widest">Cancelled</span>}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-2">
                        {booking.topic}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> {booking.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {booking.time} WIB</span>
                        <span className="flex items-center gap-1.5"><Video className="w-4 h-4"/> {booking.type}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-between w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 dark:border-slate-800">
                      <div className="text-sm font-medium text-slate-500 md:hidden">View Details</div>
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
