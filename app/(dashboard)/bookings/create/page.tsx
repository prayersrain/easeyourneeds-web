"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, Video, Calendar, PlusCircle, CreditCard, Laptop, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateBookingPage() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    { id: "pro-100", title: "Zoom Pro 100P", price: "Rp 30.000", desc: "Per Hari • Max 100 Peserta", icon: Video },
    { id: "pro-300", title: "Zoom Pro 300P", price: "Rp 70.000", desc: "Per Hari • Max 300 Peserta", icon: Video },
    { id: "pro-500", title: "Zoom Pro 500P", price: "Rp 110.000", desc: "Per Hari • Max 500 Peserta", icon: Video },
    { id: "pro-1000", title: "Zoom Pro 1000P", price: "Rp 185.000", desc: "Per Hari • Max 1000 Peserta", icon: Video },
  ];

  const addons = [
    { id: "operator-basic", title: "Basic Operator", price: "Rp 60.000", desc: "Admit, mute/unmute, screenshare", icon: Laptop },
    { id: "operator-pro", title: "Pro Operator", price: "Rp 85.000", desc: "Basic + Breakout rooms + Polling", icon: PlusCircle },
  ];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleBook = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = "/bookings/BK-1003";
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-1">Create Booking</h1>
          <p className="text-slate-500 dark:text-slate-400">Schedule your next successful event.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-slate-200 dark:before:bg-slate-800 z-0 px-2">
        {["Package", "Details", "Addons", "Review", "Payment"].map((label, index) => {
           const num = index + 1;
           return (
           <div key={num} className="relative flex flex-col items-center">
             <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm relative z-10 transition-colors duration-300 ${
               step >= num ? "bg-blue-600 border-4 border-blue-100 dark:border-blue-900/50 text-white" : "bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 text-slate-400"
             }`}>
                {step > num ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : num}
             </div>
             <span className={`absolute top-12 text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block ${step >= num ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
               {label}
             </span>
           </div>
        )})}
        {/* Progress Fill */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500" style={{ width: `calc(${(step - 1) * 25}% - ${(step - 1) === 0 ? 0 : 4}px)` }} />
      </div>

      {/* Step 1: Package */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Select a Zoom Package</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
             {packages.map(pkg => (
               <div 
                 key={pkg.id} 
                 onClick={() => setSelectedPackage(pkg.id)}
                 className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                   selectedPackage === pkg.id 
                     ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md shadow-blue-500/10" 
                     : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl ${selectedPackage === pkg.id ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                     <pkg.icon className="w-6 h-6" />
                   </div>
                   {selectedPackage === pkg.id && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{pkg.title}</h3>
                 <p className="text-sm text-slate-500 font-medium mb-4">{pkg.desc}</p>
                 <div className="font-heading font-black text-xl text-slate-900 dark:text-white">{pkg.price}</div>
               </div>
             ))}
          </div>
          <div className="flex justify-end">
            <button 
              disabled={!selectedPackage} 
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-blue-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Date & Topic */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-blue-500" /> Date & Topic
             </h2>
             <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Topic / Event Name</label>
                  <input type="text" placeholder="e.g. Weekly All Hands" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Time</label>
                  <input type="time" defaultValue="09:00" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Time</label>
                  <input type="time" defaultValue="15:00" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                </div>
             </div>
          </div>
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <button onClick={() => setStep(1)} className="px-6 py-3 font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              Back
            </button>
            <button onClick={() => setStep(3)} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95">
              Continue to Addons <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Addons */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <Laptop className="w-5 h-5 text-blue-500" /> Need Operators? <span className="text-xs font-normal px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">Optional</span>
             </h2>
             <div className="grid sm:grid-cols-2 gap-4">
                {addons.map(addon => (
                  <div 
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                       selectedAddons.includes(addon.id) ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                     <div className={`w-6 h-6 rounded flex items-center justify-center border ${selectedAddons.includes(addon.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'}`}>
                        {selectedAddons.includes(addon.id) && <CheckCircle2 className="w-4 h-4" />}
                     </div>
                     <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white">{addon.title}</p>
                        <p className="text-xs text-slate-500">{addon.desc}</p>
                     </div>
                     <span className="font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm text-sm dark:text-slate-300">{addon.price}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <button onClick={() => setStep(2)} className="px-6 py-3 font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              Back
            </button>
            <button onClick={() => setStep(4)} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95">
              Review Order <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Review Order */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none text-center">
             <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
               <CreditCard className="w-10 h-10 text-blue-600 dark:text-blue-400" />
             </div>
             <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">Order Summary</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8">Please review your booking details before paying.</p>

             <div className="text-left space-y-4 mb-8">
               <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Zoom Pro 300P</p>
                    <p className="text-xs text-slate-500">12 Apr 2026 (09:00 - 15:00)</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">Rp 70.000</span>
               </div>
               
               {selectedAddons.length > 0 && (
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Basic Operator</p>
                      <p className="text-xs text-slate-500">Add-on service</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">Rp 60.000</span>
                 </div>
               )}

               <div className="p-4 rounded-xl border-t-2 border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">Total</p>
                  <span className="text-2xl font-black font-heading text-blue-600 dark:text-blue-400">Rp 130.000</span>
               </div>
             </div>

             <button onClick={() => setStep(5)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl uppercase tracking-widest flex justify-center items-center transition-all shadow-lg active:scale-95">
                Proceed to Payment
             </button>
             <button onClick={() => setStep(3)} className="w-full mt-4 py-4 text-slate-500 font-bold uppercase text-sm hover:underline">
                Back to Edit
             </button>
          </div>
        </motion.div>
      )}

      {/* Step 5: Payment */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none text-center">
             <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
               <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
             </div>
             <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">Secure Checkout</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8">Pay securely using Xendit Gateway.</p>

             <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8">
               <p className="text-sm text-slate-500 mb-2">Amount to Pay</p>
               <h3 className="text-4xl font-black font-mono text-slate-900 dark:text-white">Rp 130.000</h3>
             </div>

             <button 
               onClick={handleBook}
               disabled={isSubmitting}
               className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl uppercase tracking-widest flex justify-center items-center transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
             >
                {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Pay Now via Xendit'}
             </button>
             <button onClick={() => setStep(4)} className="w-full mt-4 py-4 text-slate-500 font-bold uppercase text-sm hover:underline" disabled={isSubmitting}>
                Cancel
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
