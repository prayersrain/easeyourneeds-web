/**
 * Forgot Password Page
 * 
 * User enters email → receives reset link via email
 * Reset link goes to /reset-password?token=xxx
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim email reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Email Terkirim! 📧
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Kami telah mengirim link reset password ke:
          </p>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 mb-6">
            <p className="font-semibold text-blue-700 dark:text-blue-400">
              {email}
            </p>
          </div>

          <div className="space-y-4 text-left p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-6">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Langkah selanjutnya:
            </p>
            <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li>Buka email Anda</li>
              <li>Klik link "Reset Password" di email</li>
              <li>Masukkan password baru</li>
              <li>Login dengan password baru</li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/signin"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Sign In
            </Link>

            <button
              onClick={() => setSuccess(false)}
              className="w-full py-3 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              Tidak menerima email? Coba lagi
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-8">
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Sign In
        </Link>

        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Lupa Password? 🔑
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Masukkan email Anda dan kami akan mengirim link untuk reset password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Kirim Link Reset Password
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-400 font-medium mb-2">
          💡 Tips:
        </p>
        <ul className="text-xs text-amber-700 dark:text-amber-500 space-y-1">
          <li>• Pastikan email yang Anda masukkan benar</li>
          <li>• Cek folder spam/junk jika email tidak muncul</li>
          <li>• Link reset password akan kadaluarsa dalam 1 jam</li>
        </ul>
      </div>
    </motion.div>
  );
}
