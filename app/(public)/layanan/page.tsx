/**
 * Services / Layanan Page - Public
 *
 * Displays overview of all services offered:
 * - Zoom Rental
 * - Operator Packages
 * - MC Services
 * - Add-ons (OBS, Livestream)
 */

import { Video, Users, Mic, Monitor, Zap, Shield, CheckCircle2, ArrowRight, Clock, Globe, Star } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "zoom-rental",
    icon: <Video className="w-8 h-8" />,
    title: "Zoom Rental",
    subtitle: "Ruang meeting & webinar berkualitas tinggi",
    description: "Sewa akun Zoom Pro dan Webinar dengan kapasitas hingga 5.000 peserta. Tersedia kualitas HD dan Full HD dengan harga terjangkau.",
    features: [
      "Zoom Pro: 100, 300, 500, 1.000 peserta",
      "Zoom Webinar: 300 - 5.000 peserta",
      "Kualitas HD 720P & Full HD 1080P",
      "Durasi per jam atau per hari",
      "Auto recording cloud",
      "Waiting room & security",
    ],
    priceStart: "Rp 6.000",
    priceUnit: "/jam",
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    link: "/produk-dan-harga#zoom-rental",
  },
  {
    id: "operator",
    icon: <Users className="w-8 h-8" />,
    title: "Operator Zoom",
    subtitle: "Operator profesional untuk jalankan acara Anda",
    description: "Tim operator berpengalaman yang akan membantu menjalankan acara Zoom Anda dengan lancar dari awal hingga selesai.",
    features: [
      "Admit/Remove peserta",
      "Sharescreen PPT/Materi",
      "Record/Rekam acara",
      "Setting Host/Co-Host & Spotlight",
      "Pre-event: Gladi resik, quiz Slido/Kahoot",
      "Post-event: Link recording & report",
    ],
    priceStart: "Rp 60.000",
    priceUnit: "/sesi",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    link: "/produk-dan-harga#operator",
  },
  {
    id: "mc",
    icon: <Mic className="w-8 h-8" />,
    title: "Master of Ceremony",
    subtitle: "MC berpengalaman untuk acara formal & informal",
    description: "Pilih MC profesional sesuai vibes dan area event Anda. 9 MC tersedia dengan pengalaman di perusahaan terkemuka.",
    features: [
      "9 MC profesional tersedia",
      "Formal & Informal events",
      "Area: Jabodetabek, Seluruh Indonesia",
      "Vibes: Professional, Energetic, Fun",
      "Pengalaman: Pertamina, Telkomsel, BCA, dll",
      "Full day & half day rates",
    ],
    priceStart: "Rp 600.000",
    priceUnit: "/half day",
    color: "from-pink-500 to-purple-600",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    link: "/produk-dan-harga#mc",
  },
  {
    id: "addons",
    icon: <Monitor className="w-8 h-8" />,
    title: "Add-on Services",
    subtitle: "Layanan tambahan untuk pengalaman lebih baik",
    description: "Tingkatkan kualitas acara Anda dengan layanan tambahan seperti OBS streaming, livestreaming, dan lainnya.",
    features: [
      "OBS Studio Setup & Streaming",
      "Livestreaming ke YouTube/Facebook",
      "Custom overlay & branding",
      "Multi-platform streaming",
      "Technical support during event",
      "Post-event deliverables",
    ],
    priceStart: "Hubungi Kami",
    priceUnit: "",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    link: "/contact",
  },
];

const whyChooseUs = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Setup Instan",
    description: "Meeting Zoom dibuat otomatis dalam hitungan detik setelah pembayaran berhasil.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Keamanan Terjamin",
    description: "Waiting room, passcode, dan security features untuk mencegah zoom-bombing.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Support 24/7",
    description: "Tim support siap membantu Anda sebelum, selama, dan setelah acara.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Jangkauan Nasional",
    description: "MC dan operator tersedia untuk area Jabodetabek hingga seluruh Indonesia.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Loyalty Program",
    description: "Kumpulkan poin dari setiap transaksi dan tukarkan dengan diskon atau gratis.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Terpercaya",
    description: "Digunakan oleh perusahaan terkemuka: Pertamina, Telkomsel, BCA, Xiaomi, dll.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
            <Monitor className="w-4 h-4" />
            Layanan Kami
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Solusi Lengkap untuk Event Digital Anda
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Dari Zoom rental berkualitas, operator profesional, hingga MC berpengalaman. Semua dalam satu platform.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="#services"
              className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
            >
              Lihat Layanan
            </a>
            <Link
              href="/auth/signin"
              className="rounded-xl border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* SERVICES GRID */}
        <section id="services" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Layanan yang Tersedia
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Pilih layanan sesuai kebutuhan event Anda
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {/* Header */}
                <div className={`px-6 py-6 bg-gradient-to-br ${service.color} relative`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      <p className="text-sm text-white/80 mt-1">{service.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <p className="text-slate-600 dark:text-slate-400">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      Fitur Utama:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mulai dari</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {service.priceStart}
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                          {service.priceUnit}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={service.link}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${service.color} text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95`}
                    >
                      Lihat Detail
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Mengapa Memilih Ease Your Needs?
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Keunggulan yang membuat kami berbeda
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Cara Memesan Layanan
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              4 langkah mudah untuk memulai event Anda
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Daftar Akun",
                description: "Buat akun gratis di Ease Your Needs dengan email atau Google.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                step: "2",
                title: "Pilih Layanan",
                description: "Pilih Zoom rental, operator, MC, atau paket lengkap sesuai kebutuhan.",
                color: "from-amber-500 to-orange-600",
              },
              {
                step: "3",
                title: "Top Up Saldo",
                description: "Isi saldo via Virtual Account, QRIS, atau e-wallet untuk pembayaran instan.",
                color: "from-emerald-500 to-teal-600",
              },
              {
                step: "4",
                title: "Booking & Event",
                description: "Booking otomatis, meeting Zoom langsung aktif, dan event siap berjalan.",
                color: "from-pink-500 to-purple-600",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white text-2xl font-bold shadow-lg mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Siap Memulai Event Anda?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan dapatkan pengalaman event digital yang profesional dengan layanan terbaik.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signin"
              className="rounded-xl bg-white px-8 py-3 text-base font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
            >
              Daftar & Mulai
            </Link>
            <a
              href="https://wa.me/6285283142289"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all active:scale-95"
            >
              Konsultasi via WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
