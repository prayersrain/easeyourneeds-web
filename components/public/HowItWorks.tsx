"use client";

import { motion, Variants } from "framer-motion";
import { MousePointerClick, CalendarClock, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Pilih Produk",
    desc: "Cari durasi Zoom atau layanan Event Organizer yang pas dengan kebutuhan acaramu.",
    icon: MousePointerClick
  },
  {
    num: "02",
    title: "Tentukan Jadwal",
    desc: "Pilih tanggal dan jam acara. Sistem kami akan memastikan ketersediaan kuota secara real-time.",
    icon: CalendarClock
  },
  {
    num: "03",
    title: "Checkout & Selesai",
    desc: "Lakukan pembayaran. Link Zoom dan akses kontrol akan terkirim otomatis via WhatsApp & Email.",
    icon: ShieldCheck
  }
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Workflow</p>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-4">
            Gimana Cara Kerjanya?
          </h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Hanya butuh 3 langkah mudah untuk mendapatkan link meeting premium atau booking dedicated operator kami.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div 
              key={step.num} 
              variants={itemVariants}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-border/50"
            >
              {/* Background Number */}
              <div className="absolute -top-6 -right-4 font-heading font-black text-9xl text-primary/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                {step.num}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <step.icon strokeWidth={2} size={32} />
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-2xl text-foreground mb-3 relative z-10">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
