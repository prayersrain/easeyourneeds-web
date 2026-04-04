"use client";


import { Wallet, CreditCard, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export default function TopUpPage() {
  const nominals = [50000, 100000, 250000, 500000, 1000000, 2000000];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Top Up Balance</h1>
        <p className="text-slate-500 dark:text-slate-400">Add funds to your account for faster, seamless bookings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Col - Balance & Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20"><Wallet className="w-32 h-32" /></div>
            <p className="text-blue-100 font-medium mb-1 relative z-10">Current Balance</p>
            <h2 className="text-4xl font-black font-mono tracking-tight relative z-10">Rp 1.000.000</h2>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <CreditCard className="w-6 h-6 text-blue-500" /> Select Amount
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {nominals.map((amount) => (
                <button
                  key={amount}
                  className="p-3 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-95 text-center"
                >
                  {amount.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Or input custom amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                <input 
                  type="text" 
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Minimum top up amount is Rp 10.000</p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25">
              Proceed to Payment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Col - Info */}
        <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Secure Payment</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              All transactions are verified and secured via Xendit payment gateway. Balance will be updated instantly.
            </p>
            <div className="flex gap-2 opacity-50 grayscale">
              {/* Mock payment logos */}
              <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded text-[8px] flex justify-center items-center font-bold">QRIS</div>
              <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded text-[8px] flex justify-center items-center font-bold">BCA</div>
              <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded text-[8px] flex justify-center items-center font-bold">BNI</div>
            </div>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <h4 className="font-bold text-amber-900 dark:text-amber-500">Wait, why top up?</h4>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
              Toop-up allows you to book immediately without waiting for payment verification each time. Extremely useful for urgent Meeting needs!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
