"use client";

import { useTheme } from "next-themes";
import { Bell, Search, Sun, Moon, User, Menu, LogOut, Settings, X, LayoutDashboard, CalendarDays, Video, Wallet, ArrowDownToLine, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignOut } from "@/lib/actions/auth";

const customerLinks = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Bookings", icon: CalendarDays, href: "/bookings" },
  { name: "Meeting Summary", icon: CalendarDays, href: "/meeting-summary" },
  { name: "Meeting Reports", icon: CalendarDays, href: "/meeting-reports" },
  { name: "Recordings", icon: Video, href: "/recordings" },
  { name: "Top-Up Balance", icon: Wallet, href: "/topup" },
  { name: "Withdrawals", icon: ArrowDownToLine, href: "/withdrawals" },
  { name: "Loyalty Points", icon: Star, href: "/loyalty" },
  { name: "Profile Settings", icon: Settings, href: "/profile/settings" },
];

const adminLinks = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "All Bookings", icon: CalendarDays, href: "/admin/bookings" },
  { name: "Pricing", icon: Wallet, href: "/admin/pricing" },
  { name: "Loyalty Program", icon: Star, href: "/admin/loyalty" },
  { name: "Withdrawals", icon: ArrowDownToLine, href: "/admin/withdrawals" },
  { name: "Zoom Pool", icon: LayoutDashboard, href: "/admin/zoom-accounts" },
  { name: "Users", icon: User, href: "/admin/users" },
  { name: "MC/Operators", icon: User, href: "/admin/mc-operators" },
];

const operatorLinks = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/operator/dashboard" },
  { name: "My Schedule", icon: CalendarDays, href: "/operator/schedule" },
  { name: "Profile", icon: User, href: "/operator/profile" },
];

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStaff = pathname.startsWith('/admin') || pathname.startsWith('/operator');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await handleSignOut();
  };

  return (
    <>
      <header className="sticky top-4 z-40 mx-4 lg:ml-0 h-20 rounded-3xl glass-card border border-border/60 shadow-sm flex items-center justify-between px-4 lg:px-6 mb-8">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-xl transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      {/* Search Bar - hidden on mobile */}
      <div className="hidden md:flex items-center gap-3 bg-muted/40 border border-border/50 rounded-full px-4 py-2.5 w-72 focus-within:w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
        <Search className="text-muted-foreground w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search bookings or recordings..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 ml-auto">
        {/* Balance Pill - Hidden for Admins & Operators */}
        {!isStaff && (
          <div className="hidden sm:flex items-center gap-2 bg-linear-to-r from-primary/10 to-indigo-500/10 border border-primary/20 rounded-full px-5 py-2 shadow-inner">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance</span>
            <span className="text-sm font-bold tracking-tight text-foreground">Rp 2.500.000</span>
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2 border-l border-border/50 pl-3 sm:pl-4">
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-300 hover:rotate-12"
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500/50 ring-2 ring-card animate-pulse" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-indigo-500 p-[2px] cursor-pointer shadow-sm shadow-primary/20 transition-transform active:scale-95"
            >
               <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
               </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-card border border-border shadow-xl rounded-2xl overflow-hidden z-50 origin-top-right"
                >
                  <div className="p-4 border-b border-border/50 bg-muted/30">
                     <p className="font-bold text-sm text-foreground truncate">{isStaff ? "Platform Staff" : "Jaya Subagja"}</p>
                     <p className="text-xs text-muted-foreground truncate">{isStaff ? "staff@ease.com" : "jaya@gmail.com"}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {!isStaff && (
                      <Link 
                        href="/profile/settings" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Account Settings
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <Link
                  href="/dashboard"
                  className="text-gradient font-heading font-bold text-2xl tracking-tight"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ease Your Needs
                </Link>
                <p className="text-muted-foreground mt-2 text-xs font-semibold uppercase tracking-wider">
                  {isStaff ? "Staff Portal" : "Client Portal"}
                </p>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1.5">
                {(isStaff && pathname.startsWith('/admin') ? adminLinks : isStaff ? operatorLinks : customerLinks).map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 font-medium text-sm transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
