import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import CustomerDashboardContent from "@/components/dashboard/customer-dashboard-content";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const role = (session.user as { role?: string }).role;
  
  // DEBUG: Log the role to verify it's being read correctly
  console.log("[Dashboard Page] User role:", role, "| Raw value:", JSON.stringify(role));

  // Handle automatic redirection based on role
  if (role === "admin" || role === "super_admin") {
    redirect("/admin/dashboard");
  }

  if (role === "operator") {
    redirect("/operator/dashboard");
  }

  // Fetch real stats for customer dashboard
  const userId = session.user.id;

  // Get user balance
  const balanceResult = await pool.query(
    `SELECT COALESCE(balance_available, 0) as balance FROM users WHERE id = $1`,
    [userId]
  );
  const userBalance = balanceResult.rows[0]?.balance || session.user.balance || 0;

  // Formatting balance for display
  const formattedBalance = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(userBalance);

  // Fetch upcoming bookings count
  const upcomingResult = await pool.query(
    `SELECT COUNT(*) as count FROM bookings WHERE user_id = $1 AND status = 'upcoming'`,
    [userId]
  );
  const upcomingCount = upcomingResult.rows[0]?.count || 0;

  // Fetch completed bookings count
  const completedResult = await pool.query(
    `SELECT COUNT(*) as count FROM bookings WHERE user_id = $1 AND status = 'completed'`,
    [userId]
  );
  const completedCount = completedResult.rows[0]?.count || 0;

  // Fetch loyalty points
  const pointsResult = await pool.query(
    `SELECT COALESCE(balance, 0) as points FROM loyalty_points WHERE user_id = $1`,
    [userId]
  );
  const loyaltyPoints = pointsResult.rows[0]?.points || 0;

  return (
    <CustomerDashboardContent
      userName={session.user.name || "Customer"}
      balance={formattedBalance}
      upcomingCount={upcomingCount}
      completedCount={completedCount}
      loyaltyPoints={loyaltyPoints}
    />
  );
}
