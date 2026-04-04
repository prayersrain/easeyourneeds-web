"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Headset, MicVocal, CheckCircle2 } from "lucide-react";

// Mock Product Data
const productsData = {
  zoom: [
     { hours: "1 Hari", users: "100 Peserta", price: "Rp 15.000", badge: "STARTER" },
     { hours: "1 Hari", users: "300 Peserta", price: "Rp 55.000", badge: "POPULAR" },
     { hours: "1 Hari", users: "500 Peserta", price: "Rp 80.000", badge: null },
     { hours: "1 Hari", users: "1000 Peserta", price: "Rp 130.000", badge: "BEST VALUE" },
  ],
  operator: [
     { level: "Bronze", exp: "General Operator", price: "Rp 60.000 / Jam", desc: "Basic Zoom management & recording" },
     { level: "Silver", exp: "Multi-Role Operator", price: "Rp 100.000 / Jam", desc: "Includes co-hosting, breakout rooms & polling", badge: "MOST HIRED" },
  ],
};

const tabs = [
  { id: "zoom", label: "Sewa Zoom", icon: Video },
  { id: "operator", label: "Operator Acara", icon: Headset },
  { id: "mc", label: "MC & Moderator", icon: MicVocal },
];

export default function ProductsShowcase() {
  const [activeTab, setActiveTab] = useState("zoom");

  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Our Services</p>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-4">
            Penuhi Semua Kebutuhan Acaramu
          </h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Mulai dari sewa Zoom hitungan jam otomatis, sampai sewa profesional Host & Operator.
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`relative px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm transition-colors z-10 ${
                 activeTab === tab.id 
                   ? "text-primary-foreground" 
                   : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
               }`}
             >
               {activeTab === tab.id && (
                  <motion.div
                    layoutId="product-tab-bg"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/30"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
               )}
               <tab.icon size={18} /> {tab.label}
             </button>
          ))}
        </div>

        {/* Sub-Components View */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
             {activeTab === "zoom" && (
                <motion.div
                  key="zoom"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                   {productsData.zoom.map((item, i) => (
                      <div key={i} className="glass-card p-6 md:p-8 rounded-3xl border border-border/50 hover:border-primary/50 text-center relative overflow-hidden group">
                         {item.badge && (
                            <div className="absolute top-4 right-[-30px] font-bold text-[10px] bg-primary text-primary-foreground py-1 px-10 rotate-45 z-10">
                               {item.badge}
                            </div>
                         )}
                         <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                             <Video size={32} />
                         </div>
                         <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground">{item.hours}</h3>
                         <p className="text-muted-foreground font-semibold mb-6">{item.users}</p>
                         <p className="font-black text-xl md:text-2xl text-primary mb-8">{item.price}</p>
                         <button className="w-full py-3 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                             Pilih Paket
                         </button>
                      </div>
                   ))}
                </motion.div>
             )}

             {activeTab === "operator" && (
                <motion.div
                  key="operator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                >
                   {productsData.operator.map((item, i) => (
                      <div key={i} className="bg-card p-8 rounded-3xl border-2 border-border relative">
                         {item.badge && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                               {item.badge}
                            </div>
                         )}
                         <h3 className="font-heading font-black text-2xl mb-2">{item.level} Operator</h3>
                         <p className="text-sm font-semibold text-muted-foreground mb-6">Tipe: {item.exp}</p>
                         <p className="font-black text-3xl text-primary mb-8">{item.price}</p>
                         <ul className="mb-8 space-y-3">
                             <li className="flex gap-2 items-start text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>{item.desc}</span>
                             </li>
                             <li className="flex gap-2 items-start text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Dedicated Support Selama Acara</span>
                             </li>
                         </ul>
                         <button className="w-full py-4 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                             Sewa Sekarang
                         </button>
                      </div>
                   ))}
                </motion.div>
             )}

             {activeTab === "mc" && (
                <motion.div
                  key="mc"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-3xl border border-dashed border-border"
                >
                   <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                      <MicVocal size={40} />
                   </div>
                   <h3 className="font-heading font-black text-3xl mb-4">MC & Moderator Library</h3>
                   <p className="text-muted-foreground font-medium max-w-lg mb-8 leading-relaxed">
                      Jelajahi ratusan portofolio profesional MC & Moderator kami. Filter berdasarkan spesialisasi acara, budget, dan rating.
                   </p>
                   <button className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full transition-colors shadow-lg shadow-indigo-500/20">
                      Lihat Talenta Kami
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
