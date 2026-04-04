/**
 * Meeting Summary Page - Customer Dashboard
 * 
 * Shows:
 * - Total meetings statistics
 * - Upcoming vs completed vs cancelled
 * - Total hours used
 * - Most used capacity tier
 * - Spending overview
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default async function MeetingSummaryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const userId = session.user.id;

  // Fetch meeting statistics
  const stats = await pool.query(
    `SELECT 
       COUNT(*) FILTER (WHERE status = 'upcoming') as upcoming,
       COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
       COUNT(*) FILTER (WHERE status = 'completed') as completed,
       COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
       COUNT(*) FILTER (WHERE status = 'overtime') as overtime,
       COUNT(*) as total,
       COALESCE(SUM(total_price) FILTER (WHERE status IN ('completed', 'in_progress')), 0) as total_spent,
       COALESCE(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) FILTER (WHERE status = 'completed'), 0) as total_hours
     FROM bookings
     WHERE user_id = $1`,
    [userId]
  );

  const s = stats.rows[0];

  // Fetch most used capacity
  const capacityStats = await pool.query(
    `SELECT capacity, COUNT(*) as count
     FROM bookings
     WHERE user_id = $1 AND status = 'completed'
     GROUP BY capacity
     ORDER BY count DESC
     LIMIT 1`,
    [userId]
  );

  const mostUsedCapacity = capacityStats.rows[0];

  // Fetch recent meetings (last 5 completed)
  const recentMeetings = await pool.query(
    `SELECT 
       id,
       topic,
       start_time,
       end_time,
       capacity,
       meeting_type,
       quality,
       total_price,
       status,
       zoom_link,
       created_at
     FROM bookings
     WHERE user_id = $1 AND status = 'completed'
     ORDER BY end_time DESC
     LIMIT 5`,
    [userId]
  );

  // Fetch this month's activity
  const monthlyActivity = await pool.query(
    `SELECT 
       COUNT(*) as count,
       COALESCE(SUM(total_price), 0) as spent
     FROM bookings
     WHERE user_id = $1 
       AND status = 'completed'
       AND start_time >= DATE_TRUNC('month', CURRENT_DATE)`,
    [userId]
  );

  const monthly = monthlyActivity.rows[0];

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
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalHours = parseFloat(s.total_hours).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Meeting Summary 📊
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Overview of all your Zoom meetings and usage statistics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Meetings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            Total Meetings
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {s.total}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {s.upcoming} upcoming, {s.completed} completed
          </p>
        </div>

        {/* Total Hours Used */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10">
              <Clock className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            Total Hours Used
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalHours}h
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            From completed meetings
          </p>
        </div>

        {/* Total Spending */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            Total Spending
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(parseInt(s.total_spent))}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {monthly.count} meetings this month ({formatCurrency(parseInt(monthly.spent))})
          </p>
        </div>

        {/* Most Used Capacity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10">
              <Users className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            Most Used Capacity
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {mostUsedCapacity ? `${mostUsedCapacity.capacity}P` : "-"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {mostUsedCapacity ? `Used ${mostUsedCapacity.count} times` : "No data yet"}
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Status Breakdown
          </h2>

          <div className="space-y-4">
            {/* Upcoming */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Upcoming</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled meetings</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {s.upcoming}
              </span>
            </div>

            {/* In Progress */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">In Progress</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Currently active</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {s.in_progress}
              </span>
            </div>

            {/* Completed */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-500/20">
                  <CheckCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Completed</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Finished meetings</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {s.completed}
              </span>
            </div>

            {/* Cancelled */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/20">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Cancelled</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Refunded meetings</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {s.cancelled}
              </span>
            </div>

            {/* Overtime */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Overtime</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Extended meetings</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {s.overtime}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Completed Meetings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Recent Meetings
            </h2>
            <Link
              href="/bookings?status=completed"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentMeetings.rows.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No completed meetings yet
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Your completed meetings will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMeetings.rows.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {meeting.topic}
                    </h3>
                    <span className="shrink-0 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                      Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(meeting.start_time)}
                    </div>
                    <div>
                      <span className="font-medium">Capacity:</span>{" "}
                      {meeting.capacity}P
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {meeting.meeting_type === "pro" ? "Zoom Pro" : "Webinar"}
                    </div>
                    <div>
                      <span className="font-medium">Quality:</span>{" "}
                      {meeting.quality.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(meeting.total_price)}
                    </span>
                    <Link
                      href={`/bookings/${meeting.id}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/bookings/create">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
            <Calendar className="w-5 h-5" />
            New Booking
          </button>
        </Link>
        <Link href="/bookings">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-700">
            <BarChart3 className="w-5 h-5" />
            View All Bookings
          </button>
        </Link>
      </div>
    </div>
  );
}
