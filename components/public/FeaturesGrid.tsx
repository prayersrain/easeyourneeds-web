"use client";

import { Handshake, CalendarRange, Clock, ShieldCheck, Video, Headset } from "lucide-react";

const features = [
  {
    title: "Dedicated Support 24/7",
    desc: "Tim teknis kami selalu standby memastikan acaramu berjalan lancar tanpa kendala.",
    icon: Headset,
    tag: "PRIORITY"
  },
  {
    title: "Otomatisasi Zoom API",
    desc: "Tidak perlu copas link manual. Sistem men-generate link seketika setelah payment.",
    icon: Video,
    tag: "TECH"
  },
  {
    title: "Anti-Double Booking",
    desc: "Kalender real-time menjaga stok kuota sewa dan talenta dengan akurasi 100%.",
    icon: CalendarRange,
    tag: "RELIABLE"
  },
  {
    title: "Top-Tier Security",
    desc: "Booking terverifikasi, riwayat aman, transaksi terenkripsi penuh oleh Xendit.",
    icon: ShieldCheck,
    tag: "SECURE"
  },
  {
    title: "Fleksibilitas Waktu",
    desc: "Sewa mulai dari 1 jam hingga langganan korporat bulanan sesuai budget.",
    icon: Clock,
    tag: "FLEXIBLE"
  },
  {
    title: "Kemitraan Jangka Panjang",
    desc: "Bergabung bersama 500+ perusahaan lain yang memercayakan eventnya kepada Ease.",
    icon: Handshake,
    tag: "B2B"
  }
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Enterprise Features</p>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-muted-foreground text-lg font-medium">Bukan sekadar penyewaan Zoom. Kami adalah command center andalah untuk segala event digitalmu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
             <div key={i} className="bg-background border border-border p-8 rounded-3xl hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-3 group-hover:opacity-10 transition-opacity">
                   <feat.icon size={80} />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <feat.icon size={28} />
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">{feat.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed mb-6">{feat.desc}</p>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider">
                   {feat.tag}
                </span>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
