"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Building,
  ArrowRightLeft,
  Activity,
  User
} from "lucide-react";
import { motion } from "framer-motion";

const operatorLinks = [
  { name: "Activity Desk", icon: Activity, href: "/operator/dashboard" },
  { name: "Manage Bookings", icon: CalendarCheck, href: "/operator/bookings" },
  { name: "Withdrawals", icon: ArrowRightLeft, href: "/operator/withdrawals" },
  { name: "Zoom Pool Status", icon: Building, href: "/operator/zoom-accounts" },
  { name: "My Profile", icon: User, href: "/operator/profile" },
];

export default function OperatorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 rounded-none glass-card border-r border-border/60 overflow-hidden shadow-sm z-20">
      <div className="p-8 pb-4 border-b border-border/50">
        <Link href="/operator/dashboard" className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-indigo-500 dark:from-emerald-400 dark:to-indigo-300 font-heading font-bold text-2xl tracking-tight">
          Operator Desk
        </Link>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs font-semibold uppercase tracking-wider">Staff Portal</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {operatorLinks.map((link) => {
           const isActive = pathname === link.href || (link.href !== '/operator/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
               className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm group ${
                isActive ? "text-slate-900 dark:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="op-sidebar-active"
                  className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              {isActive && (
                 <div
                   className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/50"
                 />
              )}
              <link.icon className={`z-10 w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "opacity-80"}`} />
              <span className="z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto" />
    </aside>
  );
}
