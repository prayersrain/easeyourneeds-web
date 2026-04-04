/**
 * Admin Users Management
 * 
 * Full CRUD for users table
 * - View all users with real data
 * - Change user role
 * - Suspend/activate users
 * - View user details
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Wallet,
  Calendar,
  MoreVertical,
  Edit,
  Ban,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; search?: string }>;
}) {
  await requireRole(["admin", "super_admin"]);

  const params = await searchParams;
  const roleFilter = params.role || "all";
  const statusFilter = params.status || "all";
  const searchQuery = params.search || "";

  // Build query
  let whereClause = "WHERE 1=1";
  const queryParams: any[] = [];
  let paramIndex = 1;

  if (roleFilter !== "all") {
    whereClause += ` AND u.role = $${paramIndex}`;
    queryParams.push(roleFilter);
    paramIndex++;
  }

  if (searchQuery) {
    whereClause += ` AND (u.email ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`;
    queryParams.push(`%${searchQuery}%`);
    paramIndex++;
  }

  // Fetch users with stats
  const users = await pool.query(
    `SELECT 
       u.id,
       u.email,
       u.name,
       u.phone,
       u.role,
       u.balance,
       u.balance_available,
       u.balance_locked,
       u.created_at,
       u.last_login_at,
       COUNT(b.id) FILTER (WHERE b.status = 'upcoming') as upcoming_bookings,
       COUNT(b.id) FILTER (WHERE b.status = 'completed') as completed_bookings,
       COALESCE(lp.balance, 0) as loyalty_points
     FROM users u
     LEFT JOIN bookings b ON u.id = b.user_id
     LEFT JOIN loyalty_points lp ON u.id = lp.user_id
     ${whereClause}
     GROUP BY u.id, lp.balance
     ORDER BY u.created_at DESC
     LIMIT 100`,
    queryParams
  );

  // Fetch user stats
  const stats = await pool.query(
    `SELECT 
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE role = 'customer') as customers,
       COUNT(*) FILTER (WHERE role = 'operator') as operators,
       COUNT(*) FILTER (WHERE role = 'admin') as admins,
       COUNT(*) FILTER (WHERE role = 'super_admin') as super_admins
     FROM users`
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

  const getRoleBadge = (role: string) => {
    const badges = {
      super_admin: {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/20",
        label: "Super Admin",
      },
      admin: {
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-500/20",
        label: "Admin",
      },
      operator: {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-500/20",
        label: "Operator",
      },
      customer: {
        color: "text-slate-600 dark:text-slate-400",
        bg: "bg-slate-100 dark:bg-slate-500/20",
        label: "Customer",
      },
    };
    return badges[role as keyof typeof badges] || badges.customer;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            User Management 👥
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage all registered users, roles, and account status.
          </p>
        </div>
        <Link href="/admin/users/new">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
            <Users className="w-5 h-5" />
            Add User
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Customers
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.customers}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Operators
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.operators}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Admins
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.admins}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Super Admin
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {s.super_admins}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Search className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
          defaultValue={roleFilter}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("role", e.target.value);
            window.location.href = url.toString();
          }}
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="operator">Operator</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <input
          type="text"
          placeholder="Search by email or name..."
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white w-64"
          defaultValue={searchQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const url = new URL(window.location.href);
              url.searchParams.set("search", (e.target as HTMLInputElement).value);
              window.location.href = url.toString();
            }
          }}
        />
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.rows.map((user: any) => {
                const badge = getRoleBadge(user.role);
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {user.name || "Unnamed"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formatCurrency(user.balance)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Available: {formatCurrency(user.balance_available)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user.upcoming_bookings} upcoming
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.completed_bookings} completed
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {user.loyalty_points.toLocaleString()} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.rows.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No users found
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
