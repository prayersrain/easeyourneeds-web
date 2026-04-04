/**
 * Admin withdrawal management endpoints
 * 
 * POST   /api/v1/admin/withdrawals/[id]/approve - Approve withdrawal
 * POST   /api/v1/admin/withdrawals/[id]/reject - Reject withdrawal
 * GET    /api/v1/admin/withdrawals - List all withdrawal requests
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";

// ============================================================
// GET /api/v1/admin/withdrawals
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role;

    if (!["admin", "super_admin"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "pending";

    const { rows } = await pool.query(
      `SELECT 
         w.*,
         u.name as user_name,
         u.email as user_email,
         admin.name as processed_by_name
       FROM withdrawals w
       LEFT JOIN users u ON w.user_id = u.id
       LEFT JOIN users admin ON w.processed_by = admin.id
       WHERE w.status = $1
       ORDER BY w.created_at ASC`,
      [status]
    );

    return NextResponse.json({
      withdrawals: rows,
      total: rows.length,
    });
  } catch (error: any) {
    console.error("[Admin Withdrawals] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/v1/admin/withdrawals/[id]/approve
// ============================================================

async function handleWithdrawalAction(
  request: NextRequest,
  params: { id: string },
  action: "approve" | "reject"
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role;

    if (!["admin", "super_admin"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const adminId = session.user.id;
    const { id } = params;

    // Parse optional notes
    let notes = "";
    try {
      const body = await request.json();
      notes = body.notes || "";
    } catch {
      // No body, that's OK
    }

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Get withdrawal (with lock)
      const { rows: withdrawalRows } = await client.query(
        `SELECT * FROM withdrawals WHERE id = $1 FOR UPDATE`,
        [id]
      );

      if (withdrawalRows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Withdrawal not found" },
          { status: 404 }
        );
      }

      const withdrawal = withdrawalRows[0];

      if (withdrawal.status !== "pending") {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: `Withdrawal already ${withdrawal.status}` },
          { status: 400 }
        );
      }

      if (action === "approve") {
        // 2a. Approve withdrawal
        await client.query(
          `UPDATE withdrawals 
           SET status = 'paid',
               processed_by = $1,
               processed_at = NOW(),
               admin_notes = $2,
               updated_at = NOW()
           WHERE id = $3`,
          [adminId, notes || "Approved", id]
        );

        // 3a. Deduct locked balance
        await client.query(
          `UPDATE users 
           SET balance = balance - $1,
               balance_locked = balance_locked - $1,
               updated_at = NOW()
           WHERE id = $2`,
          [withdrawal.amount, withdrawal.user_id]
        );

        // 4a. Record balance history
        await client.query(
          `INSERT INTO balance_history 
           (user_id, change_type, amount, balance_before, balance_after, reference_type, reference_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            withdrawal.user_id,
            "withdrawal_approved",
            -withdrawal.amount,
            withdrawal.amount,
            0,
            "withdrawal",
            id,
          ]
        );
      } else {
        // 2b. Reject withdrawal
        await client.query(
          `UPDATE withdrawals 
           SET status = 'rejected',
               processed_by = $1,
               processed_at = NOW(),
               rejection_reason = $2,
               updated_at = NOW()
           WHERE id = $3`,
          [adminId, notes || "Rejected", id]
        );

        // 3b. Unlock balance (return to available)
        await client.query(
          `UPDATE users 
           SET balance_available = balance_available + $1,
               balance_locked = balance_locked - $1,
               updated_at = NOW()
           WHERE id = $2`,
          [withdrawal.amount, withdrawal.user_id]
        );

        // 4b. Record balance history
        await client.query(
          `INSERT INTO balance_history 
           (user_id, change_type, amount, balance_before, balance_after, reference_type, reference_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            withdrawal.user_id,
            "withdrawal_rejected",
            withdrawal.amount,
            0,
            withdrawal.amount,
            "withdrawal",
            id,
          ]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: `Withdrawal ${action}d successfully`,
        withdrawal: {
          id,
          status: action === "approve" ? "paid" : "rejected",
          processedAt: new Date().toISOString(),
        },
      });
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error(`[Withdrawal ${action}] Error:`, error);

    return NextResponse.json(
      { error: `Failed to ${action} withdrawal` },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/v1/admin/withdrawals/[id]/approve
// ============================================================

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const url = new URL(request.url);
  const action = url.pathname.includes("/approve") ? "approve" : "reject";

  return handleWithdrawalAction(request, await ctx.params, action);
}
