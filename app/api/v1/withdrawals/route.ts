/**
 * Withdrawal API endpoints
 * 
 * POST /api/v1/withdrawals - Create withdrawal request
 * GET  /api/v1/withdrawals - List user withdrawals
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { z } from "zod";

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const CreateWithdrawalSchema = z.object({
  amount: z.number().int().min(50000, "Minimum withdrawal amount is Rp 50.000"),
  bankName: z.string().min(2).max(100),
  bankAccount: z.string().min(5).max(50),
  accountHolder: z.string().min(2).max(255),
});

// ============================================================
// POST /api/v1/withdrawals
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse and validate request
    const body = await request.json();
    const validationResult = CreateWithdrawalSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { amount, bankName, bankAccount, accountHolder } = validationResult.data;

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Get user balance (with lock)
      const { rows: userRows } = await client.query(
        `SELECT balance, balance_available FROM users WHERE id = $1 FOR UPDATE`,
        [userId]
      );

      if (userRows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const user = userRows[0];

      // 2. Check balance
      if (user.balance_available < amount) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            error: "Insufficient balance",
            required: amount,
            available: user.balance_available,
          },
          { status: 402 }
        );
      }

      // 3. Create withdrawal request
      const { rows: withdrawalRows } = await client.query(
        `INSERT INTO withdrawals 
         (user_id, amount, bank_name, bank_account, account_holder, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING id`,
        [userId, amount, bankName, bankAccount, accountHolder]
      );

      const withdrawalId = withdrawalRows[0].id;

      // 4. Lock balance (move from available to locked)
      await client.query(
        `UPDATE users 
         SET balance_available = balance_available - $1,
             balance_locked = balance_locked + $1,
             updated_at = NOW()
         WHERE id = $2`,
        [amount, userId]
      );

      // 5. Record balance history
      await client.query(
        `INSERT INTO balance_history 
         (user_id, change_type, amount, balance_before, balance_after, reference_type, reference_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          "withdrawal_pending",
          -amount,
          user.balance_available,
          user.balance_available - amount,
          "withdrawal",
          withdrawalId,
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        {
          success: true,
          withdrawal: {
            id: withdrawalId,
            amount,
            bankName,
            bankAccount,
            accountHolder,
            status: "pending",
            message: "Withdrawal request created. Waiting for admin approval.",
          },
        },
        { status: 201 }
      );
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[Withdrawal Create] Error:", error);

    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/v1/withdrawals
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

    const userId = session.user.id;
    const userRole = (session.user as { role?: string }).role;

    // Get withdrawals
    const { rows } = await pool.query(
      `SELECT 
         w.*,
         u.name as user_name,
         u.email as user_email,
         admin.name as processed_by_name
       FROM withdrawals w
       LEFT JOIN users u ON w.user_id = u.id
       LEFT JOIN users admin ON w.processed_by = admin.id
       WHERE w.user_id = $1 OR $2 IN ('admin', 'super_admin')
       ORDER BY w.created_at DESC
       LIMIT 50`,
      [userId, userRole]
    );

    return NextResponse.json({
      withdrawals: rows,
      total: rows.length,
    });
  } catch (error: any) {
    console.error("[Withdrawals List] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
