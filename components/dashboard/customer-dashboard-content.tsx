"use client";

import { motion } from "framer-motion";
import { 
  Wallet, 
  CalendarDays, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Video,
  Plus
} from "lucide-react";
import Link from "next/link";

interface Stat {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
  href: string;
  action: string;
}

export default function CustomerDashboardContent({
  userName,
  balance,
  upcomingCount = 0,
  loyaltyPoints = 0,
}: {
  userName: string;
  balance: string;
  upcomingCount?: number;
  loyaltyPoints?: number;
}) {
  const stats: Stat[] = [
    {
      label: "Available Balance",
      value: balance,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/topup",
      action: "Top Up"
    },
    {
      label: "Upcoming Bookings",
      value: `${upcomingCount} Events`,
      icon: CalendarDays,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/bookings",
      action: "View All"
    },
    {
      label: "Loyalty Points",
      value: `${loyaltyPoints.toLocaleString()} pts`,
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/loyalty",
      action: "Redeem"
    }
  ];

  const upcomingBookings = [
    {
      id: "BK-1001",
      topic: "Webinar Nasional Pendidikan",
      date: "Mon, 12 Apr 2026",
      time: "09:00 - 15:00 WIB",
      type: "Zoom Pro 500P (Per Hari)",
      status: "Upcoming"
    },
    {
      id: "BK-1002",
      topic: "Quarterly Townhall Meeting",
      date: "Fri, 16 Apr 2026",
      time: "10:00 - 12:00 WIB",
      type: "Zoom Pro 300P (Per Jam)",
      status: "Upcoming"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Here's what's happening with your events today.
          </p>
        </div>
        <Link href="/bookings/create" className="shrink-0">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group"
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
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors relative z-10"
            >
              {stat.action} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
            <div className="flex items-center gap-4">
              <Link href="/meeting-summary" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Summary
              </Link>
              <Link href="/meeting-reports" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Reports
              </Link>
              <Link href="/bookings" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col sm:flex-row gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                      {booking.id}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="w-4 h-4" /> {booking.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {booking.topic}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 shadow-sm px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <CalendarDays className="w-4 h-4 text-slate-400" /> {booking.date}
                    </span>
                    <span className="flex items-center gap-1.5 shadow-sm px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Video className="w-4 h-4 text-slate-400" /> {booking.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center justify-end gap-2 shrink-0">
                  <Link href={`/bookings/${booking.id}`} className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl transition-colors text-center">
                    Manage
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Need an Operator?</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Make your event stress-free. Hire a professional operator to handle admit, screenshare, and breakout rooms starting at just Rp 60.000/jam.
              </p>
              <Link href="/bookings/create">
                <button className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                  Add to booking
                </button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
             <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Recent Activity
             </h3>
             <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                {[
                  { text: "Successfully topped up Rp 500.000", time: "2 hours ago", type: "success" },
                  { text: "Booked 'Webinar Nasional' for 12 Apr", time: "1 day ago", type: "info" },
                  { text: "Downloaded recording BK-0988", time: "3 days ago", type: "default" }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 relative z-10">
                    <div className={`w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 flex shrink-0 ${
                      log.type === "success" ? "bg-emerald-500" :
                      log.type === "info" ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                    }`} />
                    <div className="flex-1 pb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{log.text}</p>
                      <p className="text-xs text-slate-500">{log.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
