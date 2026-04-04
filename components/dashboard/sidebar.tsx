"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Video,
  Wallet,
  ArrowDownToLine,
  User,
  Star,
  BarChart3,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Bookings", icon: CalendarDays, href: "/bookings" },
  { name: "Meeting Summary", icon: BarChart3, href: "/meeting-summary" },
  { name: "Meeting Reports", icon: FileText, href: "/meeting-reports" },
  { name: "Recordings", icon: Video, href: "/recordings" },
  { name: "Top-Up Balance", icon: Wallet, href: "/topup" },
  { name: "Withdrawals", icon: ArrowDownToLine, href: "/withdrawals" },
  { name: "Loyalty Points", icon: Star, href: "/loyalty" },
  { name: "Profile Settings", icon: User, href: "/profile/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 rounded-none glass-card border-r border-border/60 overflow-hidden shadow-sm">
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="text-gradient font-heading font-bold text-2xl tracking-tight">
          Ease Your Needs
        </Link>
        <p className="text-muted-foreground mt-2 text-xs font-semibold uppercase tracking-wider">Client Portal</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm group ${
                isActive ? "text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              {isActive && (
                 <div
                   className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-lg shadow-primary"
                 />
              )}
              <link.icon className={`z-10 w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "opacity-80"}`} />
              <span className="z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-linear-to-br from-primary/10 to-indigo-500/10 p-5 rounded-2xl border border-primary/20 shadow-inner">
          <h4 className="font-heading font-semibold text-foreground text-sm">Need Help?</h4>
          <p className="text-xs text-muted-foreground mt-1.5 mb-4 leading-relaxed">
            Contact support or create a ticket for any inquiries.
          </p>
          <button className="w-full bg-background hover:bg-muted text-foreground text-xs font-semibold py-2.5 rounded-xl transition-all border border-border shadow-sm hover:shadow-md">
            Support Center
          </button>
        </div>
      </div>
    </aside>
  );
}
