/**
 * Admin Loyalty Management
 * 
 * CRUD for:
 * - points_earning_rules (how users earn points)
 * - loyalty_rewards (what users can redeem)
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Pencil, Trash2, Plus, Star, Gift, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function AdminLoyaltyPage() {
  await requireRole(["admin", "super_admin"]);

  // Fetch earning rules
  const earningRules = await pool.query(
    `SELECT * FROM points_earning_rules ORDER BY capacity`
  );

  // Fetch rewards
  const rewards = await pool.query(
    `SELECT * FROM loyalty_rewards ORDER BY points_cost`
  );

  const formatPoints = (points: number) =>
    new Intl.NumberFormat("id-ID").format(points);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Loyalty Program ⭐
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage point earning rules and redeemable rewards.
        </p>
      </div>

      {/* Earning Rules Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Point Earning Rules
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How users earn points from bookings
              </p>
            </div>
          </div>
          <Link href="/admin/loyalty/rules/new">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Points Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {earningRules.rows.map((rule: any) => (
                <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-sm font-bold">
                      {rule.capacity}P
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {formatPoints(rule.points_earned)} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {rule.description}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        rule.is_active
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {rule.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/loyalty/rules/${rule.id}/edit`}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Rewards Catalog
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Redeemable rewards for loyalty points
              </p>
            </div>
          </div>
          <Link href="/admin/loyalty/rewards/new">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4" />
              Add Reward
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {rewards.rows.map((reward: any) => (
            <div
              key={reward.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      reward.is_active
                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {reward.is_active ? "Active" : "Inactive"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/loyalty/rewards/${reward.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                {reward.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                {reward.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {formatPoints(reward.points_cost)} pts
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {reward.reward_type === "discount"
                    ? `${reward.discount_percent}% Off`
                    : "Free Rental"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
