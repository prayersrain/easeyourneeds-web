"use client";

import { motion } from "framer-motion";
import { Banknote, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const history = [
    { id: "WD-1092", amount: "Rp 150.000", bank: "BCA", acc: "****1234", date: "01 Mar 2026", status: "Success" },
    { id: "WD-1011", amount: "Rp 50.000", bank: "GoPay", acc: "****8829", date: "15 Feb 2026", status: "Success" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Withdraw Balance</h1>
        <p className="text-slate-500 dark:text-slate-400">Withdraw your Ease Your Needs balance to your bank account or e-wallet.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Col - Withdraw Form */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
           <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
             <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
               <Banknote className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-bold text-emerald-800 dark:text-emerald-500 mb-1">Withdrawable Balance</p>
               <p className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">Rp 1.000.000</p>
             </div>
           </div>

           <form className="space-y-5" onSubmit={e => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Min. Rp 50.000</span>
                  <button type="button" onClick={() => setAmount("1000000")} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Withdraw All</button>
                </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank / E-Wallet</label>
                  <select 
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="" disabled>Select Bank</option>
                    <option value="bca">BCA</option>
                    <option value="mandiri">Mandiri</option>
                    <option value="gopay">GoPay</option>
                    <option value="dana">DANA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Number</label>
                  <input 
                    type="text" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 081234567890"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
             </div>

             <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 opacity-50 cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
                Submit Request <ArrowRight className="w-5 h-5" />
             </button>
           </form>
        </div>

        {/* Right Col - History */}
        <div className="p-8 bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
           <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
             <Clock className="w-5 h-5 text-slate-400" /> Recent Withdrawals
           </h3>
           
           <div className="space-y-3">
             {history.map((item, i) => (
               <motion.div 
                 key={item.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between"
               >
                 <div>
                   <p className="font-bold text-slate-900 dark:text-white">{item.amount}</p>
                   <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                     <span className="uppercase text-blue-600 dark:text-blue-400 font-bold">{item.bank}</span> 
                     {item.acc}
                   </p>
                 </div>
                 <div className="text-right">
                   <span className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded mb-1">
                     {item.status}
                   </span>
                   <p className="text-xs text-slate-400 block">{item.date}</p>
                 </div>
               </motion.div>
             ))}
           </div>
           
           <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-xl">
             <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Withdrawals are processed manually by our admin team within 1x24 hours on working days.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
