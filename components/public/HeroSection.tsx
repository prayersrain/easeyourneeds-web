"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_20%,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="text-xs font-bold tracking-widest uppercase text-foreground">Digital Event Partner for Enterprises</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-heading font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight text-foreground mb-6"
        >
          SEWA ZOOM,<br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-indigo-500">
            AUTO LINK.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Platform No. 1 di Indonesia untuk otomatisasi sewa platform meeting, profesional MC, dan live broadcasting tingkat enterprise.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
          >
            Mulai Gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#booking"
            className="w-full sm:w-auto px-8 py-4 bg-card border-2 border-border text-foreground font-bold rounded-full text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-muted hover:border-primary/50 transition-all duration-300"
          >
            <PlayCircle className="w-5 h-5 text-primary" /> Lihat Demo
          </Link>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20 pt-10 border-t border-border/50"
        >
          <div className="flex flex-col items-center">
            <h4 className="font-heading font-black text-4xl sm:text-5xl text-foreground">1M+</h4>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground tracking-wider uppercase mt-1">Total Peserta</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-heading font-black text-4xl sm:text-5xl text-foreground">12K</h4>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground tracking-wider uppercase mt-1">Jam Meeting</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-heading font-black text-4xl sm:text-5xl text-foreground">500+</h4>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground tracking-wider uppercase mt-1">Company Klien</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-heading font-black text-4xl sm:text-5xl text-foreground">24/7</h4>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground tracking-wider uppercase mt-1">Sistem Otomatis</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
