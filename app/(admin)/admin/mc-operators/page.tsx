/**
 * Admin MC/Operators Management
 * 
 * Full CRUD for operators:
 * - View all operators with real data from database
 * - Add new operator account (creates user + profile)
 * - Edit operator details
 * - View operator status and bookings
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import {
  Users,
  Plus,
  Edit,
  Eye,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Briefcase
} from "lucide-react";
import Link from "next/link";

export default async function AdminOperatorsPage() {
  await requireRole(["admin", "super_admin"]);

  // Fetch all operators with user info and stats
  const operators = await pool.query(
    `SELECT 
       op.id,
       op.name,
       op.tier,
       op.hourly_rate,
       op.is_available,
       op.rating,
       op.total_sessions,
       op.bio,
       op.created_at,
       u.id as user_id,
       u.email,
       u.phone,
       u.password IS NOT NULL as has_account,
       u.last_login_at,
       COUNT(b.id) as total_bookings,
       COUNT(b.id) FILTER (WHERE b.status = 'upcoming') as upcoming_bookings,
       COUNT(b.id) FILTER (WHERE b.status = 'completed') as completed_bookings
     FROM operator_profiles op
     LEFT JOIN users u ON op.user_id = u.id
     LEFT JOIN booking_addons ba ON op.id::text = ba.addon_name AND ba.addon_type = 'operator'
     LEFT JOIN bookings b ON ba.booking_id = b.id
     GROUP BY op.id, u.id
     ORDER BY op.tier, op.name`
  );

  // Fetch operator stats
  const stats = await pool.query(
    `SELECT 
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE is_available = TRUE) as available,
       COUNT(*) FILTER (WHERE is_available = FALSE) as unavailable,
       COUNT(*) FILTER (WHERE tier = 'bronze') as bronze,
       COUNT(*) FILTER (WHERE tier = 'silver') as silver,
       COUNT(*) FILTER (WHERE tier = 'gold') as gold,
       COALESCE(AVG(rating), 0) as avg_rating
     FROM operator_profiles`
  );

  const s = stats.rows[0];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Never";

  const getTierBadge = (tier: string) => {
    const badges = {
      bronze: {
        color: "text-amber-700 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-500/20",
        label: "Bronze",
      },
      silver: {
        color: "text-slate-700 dark:text-slate-300",
        bg: "bg-slate-200 dark:bg-slate-600/30",
        label: "Silver",
      },
      gold: {
        color: "text-yellow-700 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-500/20",
        label: "Gold",
      },
    };
    return badges[tier as keyof typeof badges] || badges.bronze;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            MC & Operators 🎤
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage MC talents and technical operators. Add new accounts and track performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/operators/new">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
              <Plus className="w-5 h-5" />
              Add Operator
            </button>
          </Link>
          <Link href="/admin/operators/new?type=mc">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-700">
              <Users className="w-5 h-5" />
              Add MC
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.total}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Available
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.available}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Avg Rating
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {parseFloat(s.avg_rating).toFixed(1)} ⭐
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Sessions
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.bronze + s.silver + s.gold}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {s.bronze} Bronze · {s.silver} Silver · {s.gold} Gold
          </p>
        </div>
      </div>

      {/* Operators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operators.rows.map((op: any) => {
          const tierBadge = getTierBadge(op.tier);
          return (
            <div
              key={op.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {op.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {op.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${tierBadge.bg} ${tierBadge.color}`}
                      >
                        {tierBadge.label}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      op.is_available
                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {op.is_available ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {op.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>

                {op.bio && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                    {op.bio}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="p-6 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Rating</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {op.rating} ⭐
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span>Sessions</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {op.total_sessions}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Rate</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(op.hourly_rate)}/jam
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Upcoming</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {op.upcoming_bookings} bookings
                  </span>
                </div>

                {/* Account Status */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Account Status
                    </span>
                    <span
                      className={`font-semibold ${
                        op.has_account
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {op.has_account ? "✅ Has Account" : "❌ No Account"}
                    </span>
                  </div>
                  {op.email && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {op.email}
                    </p>
                  )}
                  {op.last_login_at && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Last login: {formatDate(op.last_login_at)}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 flex gap-2">
                <Link
                  href={`/admin/operators/${op.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <Link
                  href={`/admin/operators/${op.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {operators.rows.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No operators found
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-4">
            Add your first operator to get started
          </p>
          <Link href="/admin/operators/new">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
              <Plus className="w-5 h-5" />
              Add Operator
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
