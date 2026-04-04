/**
 * Meeting Reports Page - Customer Dashboard
 * 
 * Shows:
 * - Detailed meeting history with filters
 * - Export functionality
 * - Cost analysis per meeting
 * - Usage patterns
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import {
  Download,
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import MeetingReportsFilters from "@/components/dashboard/meeting-reports-filters";

export default async function MeetingReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; month?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const userId = session.user.id;
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const monthFilter = params.month || "all";

  // Build query with filters
  let whereClause = "WHERE b.user_id = $1";
  const queryParams: any[] = [userId];
  let paramIndex = 2;

  if (statusFilter !== "all") {
    whereClause += ` AND b.status = $${paramIndex}`;
    queryParams.push(statusFilter);
    paramIndex++;
  }

  if (monthFilter !== "all") {
    whereClause += ` AND DATE_TRUNC('month', b.start_time) = $${paramIndex}::date`;
    queryParams.push(`${monthFilter}-01`);
    paramIndex++;
  }

  // Fetch meetings
  const meetings = await pool.query(
    `SELECT 
       b.id,
       b.topic,
       b.description,
       b.start_time,
       b.end_time,
       b.capacity,
       b.meeting_type,
       b.quality,
       b.zoom_link,
       b.passcode,
       b.status,
       b.total_price,
       b.points_earned,
       b.created_at,
       za.account_email as zoom_account,
       json_agg(
         json_build_object(
           'type', ba.addon_type,
           'name', ba.addon_name,
           'price', ba.total_price
         ) ORDER BY ba.addon_type
       ) FILTER (WHERE ba.id IS NOT NULL) as addons
     FROM bookings b
     LEFT JOIN zoom_accounts za ON b.zoom_account_id = za.id
     LEFT JOIN booking_addons ba ON b.id = ba.booking_id
     ${whereClause}
     GROUP BY b.id, za.account_email
     ORDER BY b.start_time DESC
     LIMIT 50`,
    queryParams
  );

  // Fetch available months for filter
  const availableMonths = await pool.query(
    `SELECT DISTINCT 
       DATE_TRUNC('month', start_time) as month,
       TO_CHAR(DATE_TRUNC('month', start_time), 'YYYY-MM') as month_str,
       TO_CHAR(DATE_TRUNC('month', start_time), 'Month YYYY') as month_label,
       COUNT(*) as count
     FROM bookings
     WHERE user_id = $1
     GROUP BY month, month_str, month_label
     ORDER BY month DESC`,
    [userId]
  );

  // Calculate report totals
  const totals = await pool.query(
    `SELECT 
       COUNT(*) as total_meetings,
       COALESCE(SUM(total_price), 0) as total_cost,
       COALESCE(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600), 0) as total_hours,
       COALESCE(AVG(total_price), 0) as avg_cost,
       COALESCE(SUM(points_earned), 0) as total_points
     FROM bookings b
     ${whereClause}`,
    queryParams
  );

  const t = totals.rows[0];
  const totalHours = parseFloat(t.total_hours).toFixed(1);

  // Format helpers
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: {
        icon: Calendar,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-500/20",
        label: "Upcoming",
      },
      in_progress: {
        icon: PlayCircle,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-500/20",
        label: "In Progress",
      },
      completed: {
        icon: CheckCircle,
        color: "text-slate-600 dark:text-slate-400",
        bg: "bg-slate-100 dark:bg-slate-500/20",
        label: "Completed",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/20",
        label: "Cancelled",
      },
      overtime: {
        icon: AlertCircle,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-500/20",
        label: "Overtime",
      },
    };

    return badges[status as keyof typeof badges] || badges.upcoming;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Meeting Reports 📈
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Detailed history and analysis of all your meetings.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-700">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Report Totals */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Meetings
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.total_meetings}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Total Cost
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(parseInt(t.total_cost))}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Total Hours
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalHours}h
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Avg Cost
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(parseInt(t.avg_cost))}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              Points Earned
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {parseInt(t.total_points).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <MeetingReportsFilters availableMonths={availableMonths.rows} />

      {/* Meetings Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="col-span-3">Meeting</div>
          <div className="col-span-2">Date & Time</div>
          <div className="col-span-1">Capacity</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Quality</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Cost</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        {meetings.rows.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No meetings found
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-4">
              Try adjusting your filters or create a new booking
            </p>
            <Link href="/bookings/create">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
                <Calendar className="w-4 h-4" />
                New Booking
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {meetings.rows.map((meeting) => {
              const badge = getStatusBadge(meeting.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={meeting.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Meeting Info */}
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {meeting.topic}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {meeting.id.substring(0, 8)}
                    </p>
                    {meeting.addons && meeting.addons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meeting.addons.map((addon: any) => (
                          <span
                            key={addon.type}
                            className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-medium"
                          >
                            {addon.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="lg:col-span-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(meeting.start_time)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                    </p>
                  </div>

                  {/* Capacity */}
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                      {meeting.capacity}P
                    </span>
                  </div>

                  {/* Type */}
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm text-slate-900 dark:text-white">
                      {meeting.meeting_type === "pro" ? "Pro" : "Webinar"}
                    </span>
                  </div>

                  {/* Quality */}
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm text-slate-900 dark:text-white">
                      {meeting.quality.toUpperCase()}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-1 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.color}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>

                  {/* Cost */}
                  <div className="lg:col-span-1 flex items-center justify-end">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(meeting.total_price)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex items-center justify-end gap-2">
                    {meeting.status === "upcoming" && meeting.zoom_link && (
                      <a
                        href={meeting.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Join
                      </a>
                    )}
                    <Link
                      href={`/bookings/${meeting.id}`}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/bookings/create">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
            <Calendar className="w-5 h-5" />
            New Booking
          </button>
        </Link>
        <Link href="/meeting-summary">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-700">
            <BarChart3 className="w-5 h-5" />
            View Summary
          </button>
        </Link>
      </div>
    </div>
  );
}
