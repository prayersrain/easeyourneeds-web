"use client";

import { motion } from "framer-motion";
import { Copy, Plus, Activity, CalendarDays, Wallet, UserCheck } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-10 left-[-200px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
             <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Client Area</p>
             <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground">
               Semua Kendali di Tanganmu
             </h2>
             <p className="text-muted-foreground text-lg font-medium mt-4 max-w-xl">
               Dashboard inovatif kami memberi kamu akses penuh untuk riwayat acara, kontrol panel operator, hingga pencairan loyalitas.
             </p>
          </div>
          <button className="px-6 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors shrink-0 shadow-sm">
             Jelajahi Fitur
          </button>
        </div>

        {/* Dashboard Mockup Border & Frame */}
        <div className="glass-card rounded-4xl border border-border p-4 sm:p-8 bg-muted/20 relative shadow-2xl">
          {/* Mock Window Topbar */}
          <div className="flex gap-2 mb-6 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <motion.div whileHover={{ y: -5 }} className="bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><UserCheck size={64} /></div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Peserta</p>
               <h4 className="font-heading font-black text-4xl mt-2 text-foreground">14,200</h4>
               <p className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1">+2.4% (30 hari)</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CalendarDays size={64} /></div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Upcoming</p>
               <h4 className="font-heading font-black text-4xl mt-2 text-primary">3 Sesi</h4>
               <p className="text-xs font-bold text-muted-foreground mt-2">Menunggu konfirmasi</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet size={64} /></div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Balance</p>
               <h4 className="font-heading font-black text-4xl mt-2 text-foreground">Rp 1.5Jt</h4>
               <p className="text-xs font-bold text-muted-foreground mt-2 flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"><Plus size={14} /> Top Up Saldo</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={64} /></div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Loyalty Points</p>
               <h4 className="font-heading font-black text-4xl mt-2 text-indigo-500">72,500</h4>
               <div className="w-full bg-muted rounded-full h-1.5 mt-3"><div className="bg-indigo-500 h-1.5 rounded-full w-2/3"></div></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table Mockup */}
            <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="font-heading font-bold text-xl">Sesi Aktif</h4>
                  <button className="text-xs font-bold text-primary hover:underline">Lihat Semua</button>
               </div>
               <div className="space-y-4">
                  {[1,2,3].map((v) => (
                    <div key={v} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">Z</div>
                          <div>
                            <p className="font-bold text-sm">Meeting Bulanan Q3</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Berlangsung . 250 Peserta</p>
                          </div>
                       </div>
                       <button className="hidden sm:flex items-center gap-2 text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                          <Copy size={12} /> Link
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* Support / Quick Action */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden relative">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
               <div>
                  <h4 className="font-heading font-bold text-xl mb-2">Dedicated Support</h4>
                  <p className="text-sm font-medium text-muted-foreground">Butuh bantuan teknis seputar platform atau kendala payment?</p>
               </div>
               <button className="w-full mt-8 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
                  Buat Tiket Bantuan
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
