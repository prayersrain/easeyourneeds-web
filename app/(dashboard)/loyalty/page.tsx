"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Gift, Tag, Infinity } from "lucide-react";

export default function LoyaltyPage() {
  const catalogs = [
    { title: "50% Disc 1 Hari 100P", cost: 200, type: "discount", tag: "50%" },
    { title: "GRATIS 1 Hari 100P", cost: 300, type: "free", tag: "FREE" },
    { title: "50% Disc 1 Hari 300P", cost: 400, type: "discount", tag: "50%" },
    { title: "50% Disc 1 Hari 500P", cost: 700, type: "discount", tag: "50%" },
    { title: "GRATIS 1 Hari 300P", cost: 700, type: "free", tag: "FREE" },
    { title: "GRATIS 1 Hari 500P", cost: 1200, type: "free", tag: "FREE" },
    { title: "50% Disc 1 Hari 1000P", cost: 1250, type: "discount", tag: "50%" },
    { title: "GRATIS 1 Hari 1000P", cost: 2400, type: "free", tag: "FREE" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Balance Card */}
        <div className="flex-1 p-8 bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl shadow-xl shadow-orange-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full mb-6 text-sm font-bold backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Member Loyalty
            </div>
            
            <p className="text-orange-100 font-medium mb-1">Your Points</p>
            <h2 className="text-5xl font-black font-heading mb-6 drop-shadow-md">
              <span className="text-7xl">250</span> <span className="text-2xl opacity-80">pts</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex-1">
                <p className="text-xs text-orange-200 uppercase font-bold tracking-wider mb-1">How to earn</p>
                <p className="text-sm font-medium">Rent Zoom Pro per day to get up to 120 pts / booking.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex-1">
                <p className="text-xs text-orange-200 uppercase font-bold tracking-wider mb-1">Expires in</p>
                <p className="text-sm font-medium flex items-center gap-2"><Infinity className="w-4 h-4"/> No Expiry Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-orange-500" /> Rewards Catalog
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {catalogs.map((item, i) => {
            const isAffordable = 250 >= item.cost;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-1 rounded-3xl ${
                  isAffordable ? 'bg-linear-to-b from-orange-400 to-orange-600 p-[2px]' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <div className="h-full bg-white dark:bg-slate-900 rounded-[22px] p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity ${item.type === 'free' ? 'bg-emerald-500' : 'bg-blue-500'} group-hover:opacity-40`} />
                  
                  <div className="relative z-10">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 ${
                      item.type === 'free' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    }`}>
                      <Tag className="w-3 h-3" /> {item.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">
                      {item.title.replace(item.tag, '')}
                    </h3>
                  </div>

                  <div className="mt-8 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Sparkles className={`w-5 h-5 ${isAffordable ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span className={`text-xl font-black ${isAffordable ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {item.cost}
                        </span>
                      </div>
                      
                      <button 
                        disabled={!isAffordable}
                        className={`p-2 rounded-xl transition-all ${
                          isAffordable 
                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
