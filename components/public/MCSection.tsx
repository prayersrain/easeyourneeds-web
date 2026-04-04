"use client";

import { Star, Verified } from "lucide-react";

const mcData = [
  { name: "Andi R.", type: "KORPORAT", rating: "4.9", projects: "120+" },
  { name: "Siska P.", type: "CASUAL", rating: "4.8", projects: "85+" },
  { name: "Kevin L.", type: "FORMAL", rating: "5.0", projects: "210+" },
  { name: "Wina C.", type: "KORPORAT", rating: "4.9", projects: "90+" }
];

export default function MCSection() {
  return (
    <section id="mc" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-3">Talent Pool</p>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-4">
            MC & Moderator Terkurasi
          </h2>
          <p className="text-muted-foreground text-lg font-medium">Bawa nyawa ke dalam audiens seminarmu dengan talenta terbaik di kelasnya.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
           {mcData.map((mc, i) => (
             <div key={i} className="bg-card border border-border/50 rounded-4xl p-6 text-center hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all cursor-pointer group">
                <div className="relative w-24 h-24 mx-auto bg-muted rounded-full overflow-hidden border-4 border-card group-hover:border-indigo-500/30 transition-colors mb-4 flex items-center justify-center shadow-inner">
                   <span className="text-2xl font-black text-muted-foreground/30">{mc.name.charAt(0)}</span>
                </div>
                <h4 className="font-heading font-bold text-xl flex items-center justify-center gap-1.5">{mc.name} <Verified className="w-5 h-5 text-indigo-500" /></h4>
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-2 mb-4">{mc.type}</p>
                <div className="flex items-center justify-center gap-4 text-sm font-semibold text-foreground bg-muted/50 py-2 rounded-xl">
                   <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {mc.rating}</div>
                   <div className="w-px h-4 bg-border/80"></div>
                   <div>{mc.projects} Sesi</div>
                </div>
             </div>
           ))}
        </div>

        <button className="mt-12 px-8 py-3 bg-card border-2 border-indigo-500 text-indigo-500 font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-all shadow-md shadow-indigo-500/20">
           Lihat Semua Koleksi Talenta
        </button>
      </div>
    </section>
  );
}
