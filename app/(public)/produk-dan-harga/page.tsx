/**
 * Products & Pricing Page - Public
 *
 * Displays all services:
 * - Zoom Rental (Pro & Webinar)
 * - Operator Packages (Bronze & Silver)
 * - MC Services (All MCs)
 */

import pool from "@/lib/db";
import { Check, Users, Video, Mic, Star, MapPin, Clock, Award } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  // Fetch all active pricing
  const pricing = await pool.query(
    `SELECT * FROM pricing_config WHERE is_active = true ORDER BY service_type, sort_order`
  );

  // Fetch all MC profiles
  const mcs = await pool.query(
    `SELECT * FROM mc_profiles WHERE is_available = true ORDER BY name`
  );

  // Group pricing by service type
  const zoomProHourly = pricing.rows.filter(
    (p) => p.service_type === "zoom_rental" && p.unit === "per_hour"
  );
  const zoomProDaily = pricing.rows.filter(
    (p) => p.service_type === "zoom_rental" && p.unit === "per_day" && p.metadata?.meeting_type === "pro"
  );
  const zoomWebinar = pricing.rows.filter(
    (p) => p.service_type === "zoom_rental" && p.metadata?.meeting_type === "webinar"
  );
  const operatorBronze = pricing.rows.filter(
    (p) => p.service_type === "operator" && p.tier === "bronze"
  );
  const operatorSilver = pricing.rows.filter(
    (p) => p.service_type === "operator" && p.tier === "silver"
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const parseMetadata = (metadata: any) => {
    if (typeof metadata === "string") {
      try {
        return JSON.parse(metadata);
      } catch {
        return {};
      }
    }
    return metadata || {};
  };

  const getQualityLabel = (tier: string) => (tier === "full_hd" ? "Full HD 1080P" : "HD 720P");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Layanan & Harga
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Solusi lengkap untuk webinar, meeting, dan event Anda. Zoom rental berkualitas, operator profesional, dan MC berpengalaman.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="#zoom-rental"
              className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg hover:bg-blue-50 transition-all active:scale-95"
            >
              Lihat Produk
            </a>
            <Link
              href="/auth/signin"
              className="rounded-xl border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* ZOOM RENTAL SECTION */}
        <section id="zoom-rental" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
              <Video className="w-4 h-4" />
              Zoom Rental
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Zoom Pro & Webinar
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Pilih kapasitas dan kualitas sesuai kebutuhan Anda
            </p>
          </div>

          {/* Zoom Pro Per Jam */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Zoom Pro - Per Jam
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {zoomProHourly.map((item) => {
                const meta = parseMetadata(item.metadata);
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                        <Users className="w-6 h-6" />
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {meta.capacity || item.capacity} Peserta
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getQualityLabel(meta.quality || item.tier)}
                      </p>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                        {formatCurrency(item.base_price)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">per jam</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zoom Pro Per Hari */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-emerald-600" />
              Zoom Pro - Per Hari
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {zoomProDaily.map((item) => {
                const meta = parseMetadata(item.metadata);
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-3">
                        <Users className="w-6 h-6" />
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {meta.capacity || item.capacity} Peserta
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getQualityLabel(meta.quality || item.tier)}
                      </p>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.base_price)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">per hari</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zoom Webinar */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Video className="w-6 h-6 text-purple-600" />
              Zoom Webinar - Per Hari
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {zoomWebinar.map((item) => {
                const meta = parseMetadata(item.metadata);
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800 border border-purple-200 dark:border-purple-800/50 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-3">
                        <Users className="w-6 h-6" />
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {meta.capacity || item.capacity} Peserta
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getQualityLabel(meta.quality || item.tier)}
                      </p>
                    </div>
                    <div className="border-t border-purple-200 dark:border-purple-800/50 pt-4">
                      <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                        {formatCurrency(item.base_price)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">per hari</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OPERATOR PACKAGES SECTION */}
        <section id="operator" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Operator Zoom
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Paket Operator Profesional
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Operator berpengalaman untuk menjalankan acara Zoom Anda dengan lancar
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Bronze Package */}
            <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🥉 Paket Bronze
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Operator standar untuk event Anda
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Fitur:</h4>
                  <ul className="space-y-2">
                    {[
                      "Admit/Remove Peserta",
                      "Sharescreen PPT/Materi",
                      "Record/Rekam Acara",
                      "Setting Host/Co-Host",
                      "Setting Spotlight",
                      "Membantu kendala lain di Zoom",
                      "Link Recording (Post-Event)",
                      "Report Zoom (Post-Event)",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Harga:</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {operatorBronze.map((pkg) => {
                      const meta = parseMetadata(pkg.metadata);
                      return (
                        <div key={pkg.id} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-3">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {meta.hours} Jam
                          </span>
                          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {formatCurrency(pkg.base_price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Package */}
            <div className="rounded-3xl bg-white dark:bg-slate-800 border-2 border-blue-500 shadow-lg overflow-hidden relative">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg">
                  Best Choice ⭐
                </span>
              </div>
              <div className="px-6 py-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🥈 Paket Silver
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Semua fitur Bronze + layanan premium
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Fitur Tambahan:</h4>
                  <ul className="space-y-2">
                    {[
                      "Kirim Link Peserta by Email (Pre-Event)",
                      "Sistem Quiz Slido/Kahoot (Pre-Event)",
                      "Gladi Resik/Technical Meeting (Pre-Event)",
                      "Rekomendasi Rundown & Struktur Acara (Pre-Event)",
                      "Lobby Acara & Diputar Lagu (Hari H)",
                      "Semua fitur Bronze termasuk Post-Event",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Harga:</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {operatorSilver.map((pkg) => {
                      const meta = parseMetadata(pkg.metadata);
                      return (
                        <div key={pkg.id} className="flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {meta.hours} Jam
                          </span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(pkg.base_price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MC SERVICES SECTION */}
        <section id="mc" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-semibold mb-4">
              <Mic className="w-4 h-4" />
              Master of Ceremony
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              MC Profesional Berpengalaman
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Pilih MC yang sesuai dengan vibes dan area event Anda
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mcs.rows.map((mc) => (
              <div
                key={mc.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* MC Photo Placeholder */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center text-4xl font-bold text-pink-600 dark:text-pink-400">
                    {mc.name.charAt(0)}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Name & Rating */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{mc.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{mc.rating}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Usia: {mc.bio?.match(/Usia (\d+)/)?.[1] || "-"} tahun</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {mc.bio?.match(/Area: (.+?)\./)?.[1] || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>
                        {mc.bio?.match(/Vibes: (.+?)\./)?.[1] || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">Pengalaman:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {mc.bio?.match(/Pengalaman: (.+)/)?.[1] || "-"}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Full Day</span>
                      <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                        {formatCurrency(mc.daily_rate || 1000000)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Half Day</span>
                      <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                        {formatCurrency(mc.half_day_rate || 600000)}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/auth/signin"
                    className="mt-4 block w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all active:scale-95"
                  >
                    Pesan MC Ini
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Siap Memulai Event Anda?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan dapatkan pengalaman Zoom yang profesional dengan layanan terbaik.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signin"
              className="rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-lg hover:bg-blue-50 transition-all active:scale-95"
            >
              Mulai Sekarang
            </Link>
            <a
              href="https://wa.me/6285283142289"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
            >
              Hubungi Kami via WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
