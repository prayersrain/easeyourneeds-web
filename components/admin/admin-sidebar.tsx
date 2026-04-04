"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Building,
  Users,
  Briefcase,
  AlertTriangle,
  ArrowRightLeft,
  Activity,
  DollarSign,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

const adminLinks = [
  { name: "Overview", icon: Activity, href: "/admin/dashboard" },
  { name: "All Bookings", icon: CalendarCheck, href: "/admin/bookings" },
  { name: "Pricing", icon: DollarSign, href: "/admin/pricing" },
  { name: "Loyalty Program", icon: Star, href: "/admin/loyalty" },
  { name: "Withdrawals", icon: ArrowRightLeft, href: "/admin/withdrawals" },
  { name: "Zoom Pool", icon: Building, href: "/admin/zoom-accounts" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "MC/Operators", icon: Briefcase, href: "/admin/mc-operators" },
  { name: "Failed Ops", icon: AlertTriangle, href: "/admin/failed-ops" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 rounded-none glass-card border-r border-border/60 overflow-hidden shadow-sm z-20">
      <div className="p-8 pb-4 border-b border-border/50">
        <Link href="/admin/dashboard" className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 font-heading font-bold text-2xl tracking-tight">
          System Admin
        </Link>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs font-semibold uppercase tracking-wider">Control Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {adminLinks.map((link) => {
           const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
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
                  layoutId="admin-sidebar-active"
                  className="absolute inset-0 bg-blue-100 dark:bg-blue-500/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              {isActive && (
                 <div
                   className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50"
                 />
              )}
              <link.icon className={`z-10 w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-blue-600 dark:text-blue-400" : "opacity-80"}`} />
              <span className="z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto" />
    </aside>
  );
}
