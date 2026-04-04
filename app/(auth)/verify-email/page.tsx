"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full text-center"
    >
      <div className="w-24 h-24 mx-auto mb-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
        <MailCheck className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>

      <h1 className="text-3xl font-bold font-heading mb-4 text-slate-900 dark:text-white">
        Check your email
      </h1>
      
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
        We&apos;ve sent a magic link to your email address. Click the link in the email to automatically sign in to your accounts.
      </p>

      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 mb-8 text-sm text-amber-800 dark:text-amber-400 text-left">
        <strong>Can&apos;t find it?</strong> Please check your spam folder or wait a few minutes before requesting another link.
      </div>

      <Link 
        href="/signin" 
        className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
    </motion.div>
  );
}
