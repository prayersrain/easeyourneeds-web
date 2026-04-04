/**
 * Admin Loyalty API
 * 
 * Earning Rules:
 * GET    /api/v1/admin/loyalty/rules/[id] - Get rule detail
 * PUT    /api/v1/admin/loyalty/rules/[id] - Update rule
 * DELETE /api/v1/admin/loyalty/rules/[id] - Delete rule
 * POST   /api/v1/admin/loyalty/rules      - Create rule
 * 
 * Rewards:
 * GET    /api/v1/admin/loyalty/rewards/[id] - Get reward detail
 * PUT    /api/v1/admin/loyalty/rewards/[id] - Update reward
 * DELETE /api/v1/admin/loyalty/rewards/[id] - Delete reward
 * POST   /api/v1/admin/loyalty/rewards      - Create reward
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";

// Helper to check admin access
async function checkAdminAccess() {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const userRole = (session.user as { role?: string }).role;

  if (!["admin", "super_admin"].includes(userRole || "")) {
    return { error: NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 }) };
  }

  return { session };
}

// ============================================================
// EARNING RULES
// ============================================================

// GET /api/v1/admin/loyalty/rules/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const { id } = await params;

    const { rows } = await pool.query(
      `SELECT * FROM points_earning_rules WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json({ rule: rows[0] });
  } catch (error: any) {
    console.error("[Admin Loyalty Rule Get] Error:", error);
    return NextResponse.json({ error: "Failed to fetch rule" }, { status: 500 });
  }
}

// PUT /api/v1/admin/loyalty/rules/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { capacity, pointsEarned, description, isActive } = body;

    if (!capacity || !pointsEarned) {
      return NextResponse.json(
        { error: "Capacity and points earned are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE points_earning_rules 
       SET capacity = $1,
           points_earned = $2,
           description = $3,
           is_active = $4,
           updated_at = NOW()
       WHERE id = $5`,
      [capacity, pointsEarned, description || null, isActive !== false, id]
    );

    return NextResponse.json({
      success: true,
      message: "Rule updated successfully",
    });
  } catch (error: any) {
    console.error("[Admin Loyalty Rule Update] Error:", error);
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/loyalty/rules/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const { id } = await params;
    await pool.query(`DELETE FROM points_earning_rules WHERE id = $1`, [id]);

    return NextResponse.json({
      success: true,
      message: "Rule deleted successfully",
    });
  } catch (error: any) {
    console.error("[Admin Loyalty Rule Delete] Error:", error);
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 });
  }
}

// POST /api/v1/admin/loyalty/rules
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const body = await request.json();
    const { capacity, pointsEarned, description, isActive } = body;

    if (!capacity || !pointsEarned) {
      return NextResponse.json(
        { error: "Capacity and points earned are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO points_earning_rules (capacity, points_earned, description, is_active)
       VALUES ($1, $2, $3, $4)`,
      [capacity, pointsEarned, description || null, isActive !== false]
    );

    return NextResponse.json(
      { success: true, message: "Rule created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Admin Loyalty Rule Create] Error:", error);
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 });
  }
}
