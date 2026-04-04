"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Video, CreditCard, ShieldPlus } from "lucide-react";

export default function BookingPreview() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");

  const stepsInfo = [
    { num: 1, label: "Layanan" },
    { num: 2, label: "Jadwal" },
    { num: 3, label: "Tambahan" },
    { num: 4, label: "Pembayaran" },
    { num: 5, label: "Sukses" },
  ];

  return (
    <section id="booking" className="py-24 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Live Booking Simulator</p>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-foreground mb-4">
            Coba Pesan Sekarang
          </h2>
          <p className="text-muted-foreground font-medium">Lakukan simulasi pemesanan Zoom 1 Jam dengan 5 langkah mudah kami.</p>
        </div>

        <div className="glass-card rounded-4xl border border-border/60 overflow-hidden shadow-xl shadow-primary/5">
          {/* Header Steps */}
          <div className="bg-muted/50 p-6 sm:px-10 border-b border-border/50 flex flex-nowrap items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-2 sm:gap-4 w-full min-w-[500px]">
              {stepsInfo.map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className={`flex flex-col items-center gap-2 relative z-10 ${step >= s.num ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ${
                      step > s.num ? "bg-primary text-primary-foreground" : 
                      step === s.num ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : 
                      "bg-card border-2 border-border"
                    }`}>
                      {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                    </div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{s.label}</span>
                  </div>
                  {i < stepsInfo.length - 1 && (
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden mt-[-20px]">
                       <motion.div 
                         className="h-full bg-primary"
                         initial={{ width: 0 }}
                         animate={{ width: step > s.num ? "100%" : "0%" }}
                         transition={{ duration: 0.5 }}
                       />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Body View */}
          <div className="p-6 sm:p-10 min-h-[350px] flex flex-col justify-center bg-background">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-heading font-black text-2xl">Layanan Utama</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelectedProduct("zoom_1h")}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        selectedProduct === "zoom_1h" 
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                          : "border-border hover:border-border/80 bg-card"
                      }`}
                    >
                      <Video className={`w-8 h-8 mb-4 ${selectedProduct === "zoom_1h" ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-bold text-lg">Zoom 1 Hari</p>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">Bebas durasi, up to 1000P</p>
                    </button>
                    <button 
                      onClick={() => setSelectedProduct("operator")}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        selectedProduct === "operator" 
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                          : "border-border hover:border-border/80 bg-card"
                      }`}
                    >
                      <Video className={`w-8 h-8 mb-4 ${selectedProduct === "operator" ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-bold text-lg">Hanya Operator</p>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">Bawa link Zoom sendiri</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-heading font-black text-2xl">Penjadwalan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pilih Tanggal</label>
                      <input type="date" className="w-full bg-card border-2 border-border rounded-xl p-3 outline-none focus:border-primary font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Waktu</label>
                      <input type="time" className="w-full bg-card border-2 border-border rounded-xl p-3 outline-none focus:border-primary font-medium" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-heading font-black text-2xl">Opsional Add-ons</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-2xl flex items-center justify-between">
                       <div className="flex gap-4 items-center">
                          <ShieldPlus className="text-primary w-6 h-6"/>
                          <div>
                            <p className="font-bold">Operator Acara (Bronze)</p>
                            <p className="text-sm text-muted-foreground">Basic streaming 3 jam</p>
                          </div>
                       </div>
                       <input type="checkbox" className="w-5 h-5 accent-primary" />
                    </div>
                    <div className="p-4 border border-border rounded-2xl flex items-center justify-between">
                       <div className="flex gap-4 items-center">
                          <ShieldPlus className="text-primary w-6 h-6"/>
                          <div>
                            <p className="font-bold">Professional MC</p>
                            <p className="text-sm text-muted-foreground">Moderator formal bilingual</p>
                          </div>
                       </div>
                       <input type="checkbox" className="w-5 h-5 accent-primary" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                   <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50"/>
                   <h3 className="font-heading font-black text-2xl">Pembayaran Instan</h3>
                   <p className="text-muted-foreground">Pilih metode pembayaran dan selesaikan transaksi Rp 15.000 (Simulasi).</p>
                   <div className="bg-primary/10 text-primary p-4 rounded-xl inline-block font-bold">Saldo: Rp 1.000.000</div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 size={40} strokeWidth={2.5} className="drop-shadow-lg" />
                  </div>
                  <h3 className="font-heading font-black text-4xl mb-4 text-foreground">Selesai!</h3>
                  <p className="text-muted-foreground font-medium max-w-md mx-auto mb-8 text-base">
                    Pembayaran berhasil dan link Zoom telah otomatis dibuat.
                  </p>
                  
                  <div className="border border-primary/30 border-dashed rounded-2xl bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto">
                    <p className="font-mono text-primary font-bold overflow-hidden text-ellipsis truncate w-full sm:w-auto text-sm">https://zoom.us/j/123456</p>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold shadow-md hover:bg-primary/90 text-sm whitespace-nowrap">
                      Copy Link
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Actions */}
          {step < 5 && (
            <div className="bg-muted/30 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border/50">
              <button 
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="w-full sm:w-auto px-6 py-3 font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors order-2 sm:order-1"
              >
                Kembali
              </button>
              <button 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedProduct}
                className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-md shadow-primary/20 order-1 sm:order-2"
              >
                {step === 4 ? "Bayar Rp 15.000" : "Selanjutnya"} <ChevronRight size={18} />
              </button>
            </div>
          )}
          {step === 5 && (
            <div className="bg-muted/30 p-6 flex items-center justify-center border-t border-border/50">
               <button onClick={() => { setStep(1); setSelectedProduct(""); }} className="font-bold text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                 Ulangi Simulasi
               </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
