/**
 * Loyalty Program Page - Public
 *
 * Displays:
 * - How to earn points
 * - Points earning rates per capacity
 * - Redemption catalog
 * - FAQ about loyalty program
 */

import pool from "@/lib/db";
import { Star, Gift, TrendingUp, Users, Check, HelpCircle, Trophy, Zap, Calendar } from "lucide-react";
import Link from "next/link";

export default async function LoyaltyProgramPage() {
  // Fetch earning rules
  const earningRules = await pool.query(
    `SELECT * FROM points_earning_rules WHERE is_active = true ORDER BY capacity`
  );

  // Fetch loyalty rewards
  const rewards = await pool.query(
    `SELECT * FROM loyalty_rewards WHERE is_active = true ORDER BY points_cost`
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const getDiscountPrice = (capacity: number, points: number) => {
    const basePrices: Record<number, number> = {
      100: 45000,
      300: 130000,
      500: 190000,
      1000: 325000,
    };
    const base = basePrices[capacity] || 0;
    const reward = rewards.rows.find((r) => r.target_capacity === capacity && r.reward_type === "discount");
    if (reward && reward.points_cost === points) {
      return base * (1 - (reward.discount_percent || 0) / 100);
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-current" />
            Loyalty Program
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Ease Your Needs Poin
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Kumpulkan poin dari setiap penyewaan Zoom Pro harian dan tukarkan dengan diskon atau penyewaan gratis!
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="#cara-kerja"
              className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-orange-600 shadow-lg hover:bg-orange-50 transition-all active:scale-95"
            >
              Cara Kerja
            </a>
            <Link
              href="/auth/signin"
              className="rounded-xl border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
            >
              Mulai Kumpulkan Poin
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* HOW IT WORKS */}
        <section id="cara-kerja" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Cara Kerja Program Poin
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              3 langkah mudah untuk mendapatkan dan menukarkan poin
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Sewa Zoom Pro Harian",
                description: "Setiap penyewaan Zoom Pro per hari akan otomatis mendapatkan poin berdasarkan kapasitas peserta.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: <Star className="w-8 h-8 fill-current" />,
                title: "Kumpulkan Poin",
                description: "Semakin besar kapasitas, semakin banyak poin yang didapat. 100P=25pts, 300P=60pts, 500P=90pts, 1000P=120pts.",
                color: "from-amber-500 to-orange-600",
              },
              {
                icon: <Gift className="w-8 h-8" />,
                title: "Tukarkan dengan Reward",
                description: "Gunakan poin Anda untuk mendapatkan diskon atau penyewaan gratis. Pilih reward yang sesuai kebutuhan Anda.",
                color: "from-pink-500 to-rose-600",
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-6`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-bold shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POINTS EARNING TABLE */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Perolehan Poin
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Berapa Poin yang Saya Dapatkan?
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Poin diberikan otomatis untuk penyewaan Zoom Pro per hari (minimal 8 jam)
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Kapasitas Peserta
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Durasi
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        Poin Didapat
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Contoh Harga/ Hari (Full HD)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {earningRules.rows.map((rule, i) => {
                    const basePrices: Record<number, number> = {
                      100: 45000,
                      300: 130000,
                      500: 190000,
                      1000: 325000,
                    };
                    return (
                      <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            {rule.capacity} Peserta ({rule.capacity}P)
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                          Per Hari (≥ 8 jam)
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-lg font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                            {rule.points_earned} Poin
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right text-sm text-slate-600 dark:text-slate-400">
                          {formatCurrency(basePrices[rule.capacity] || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* REDEMPTION CATALOG */}
        <section id="rewards" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" />
              Penukaran Poin
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Katalog Reward
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Tukarkan poin Anda dengan diskon atau penyewaan gratis
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.rows.map((reward) => {
              const isDiscount = reward.reward_type === "discount";
              const isFree = reward.reward_type === "free_rental";

              return (
                <div
                  key={reward.id}
                  className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 ${
                    isFree
                      ? "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800 border-2 border-emerald-300 dark:border-emerald-700"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {/* Badge */}
                  <div className={`px-4 py-2 ${isFree ? "bg-emerald-500" : "bg-blue-500"}`}>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {isFree ? "🎉 GRATIS" : `💰 DISKON ${reward.discount_percent}%`}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Reward Name */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {reward.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {reward.description}
                    </p>

                    {/* Points Cost */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Biaya Poin:</span>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                          {reward.points_cost} Poin
                        </span>
                      </div>
                    </div>

                    {/* Value Comparison */}
                    {isDiscount && reward.target_capacity && (
                      <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Harga Normal:</span>
                          <span className="line-through text-slate-400 dark:text-slate-500">
                            {formatCurrency(
                              ({
                                100: 45000,
                                300: 130000,
                                500: 190000,
                                1000: 325000,
                              } as Record<number, number>)[reward.target_capacity] || 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-slate-600 dark:text-slate-400">Bayar Setelah Diskon:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(
                              (({
                                100: 45000,
                                300: 130000,
                                500: 190000,
                                1000: 325000,
                              } as Record<number, number>)[reward.target_capacity] || 0) *
                                (1 - (reward.discount_percent || 0) / 100)
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-slate-600 dark:text-slate-400">Hemat:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(
                              (({
                                100: 45000,
                                300: 130000,
                                500: 190000,
                                1000: 325000,
                              } as Record<number, number>)[reward.target_capacity] || 0) *
                                (reward.discount_percent || 0) / 100
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {isFree && reward.target_capacity && (
                      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Nilai Gratis:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(
                              ({
                                100: 45000,
                                300: 130000,
                                500: 190000,
                                1000: 325000,
                              } as Record<number, number>)[reward.target_capacity] || 0
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Kapan saya mendapatkan poin?",
                a: "Poin diberikan otomatis setelah Anda melakukan penyewaan Zoom Pro per hari (minimal 8 jam). Poin akan masuk ke akun Anda setelah status booking menjadi 'completed'.",
              },
              {
                q: "Apakah poin ada masa berlakunya?",
                a: "Ya, poin berlaku selama 90 hari sejak pertama kali Anda mendapatkan poin. Pastikan untuk menukarkan poin sebelum masa berlaku habis.",
              },
              {
                q: "Apakah penyewaan per jam mendapatkan poin?",
                a: "Tidak, poin hanya diberikan untuk penyewaan Zoom Pro per hari (minimal 8 jam). Penyewaan per jam tidak mendapatkan poin.",
              },
              {
                q: "Bagaimana cara menukarkan poin?",
                a: "Login ke akun Anda, buka halaman Loyalty Program, pilih reward yang diinginkan, dan klik 'Tukarkan Poin'. Pastikan saldo poin Anda mencukupi.",
              },
              {
                q: "Apakah poin bisa digabungkan dengan promo lain?",
                a: "Poin bisa digunakan bersamaan dengan promo yang sedang berlangsung, kecuali ada ketentuan khusus yang menyatakan sebaliknya.",
              },
              {
                q: "Apakah ada batasan penukaran poin?",
                a: "Anda bisa menukarkan poin berkali-kali selama saldo poin mencukupi dan reward masih tersedia.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Mulai Kumpulkan Poin Sekarang!
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Setiap penyewaan Zoom Pro harian memberi Anda poin yang bisa ditukarkan dengan diskon atau gratis.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signin"
              className="rounded-xl bg-white px-8 py-3 text-base font-semibold text-orange-600 shadow-lg hover:bg-orange-50 transition-all active:scale-95"
            >
              Pesan Zoom Pro
            </Link>
            <a
              href="https://wa.me/6285283142289"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
