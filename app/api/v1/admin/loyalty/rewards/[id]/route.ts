/**
 * Admin Loyalty Rewards API
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";

async function checkAdminAccess() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const userRole = (session.user as { role?: string }).role;
  if (!["admin", "super_admin"].includes(userRole || "")) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

// GET /api/v1/admin/loyalty/rewards/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const { id } = await params;
    const { rows } = await pool.query(`SELECT * FROM loyalty_rewards WHERE id = $1`, [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }
    return NextResponse.json({ reward: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch reward" }, { status: 500 });
  }
}

// PUT /api/v1/admin/loyalty/rewards/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, pointsCost, rewardType, discountPercent, targetCapacity, targetDuration, isActive } = body;

    if (!name || !pointsCost) {
      return NextResponse.json({ error: "Name and points cost are required" }, { status: 400 });
    }

    await pool.query(
      `UPDATE loyalty_rewards 
       SET name = $1, description = $2, points_cost = $3, reward_type = $4,
           discount_percent = $5, target_capacity = $6, target_duration = $7,
           is_active = $8, updated_at = NOW()
       WHERE id = $9`,
      [name, description || null, pointsCost, rewardType, discountPercent || null, targetCapacity || null, targetDuration || "per_day", isActive !== false, id]
    );

    return NextResponse.json({ success: true, message: "Reward updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update reward" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/loyalty/rewards/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const { id } = await params;
    await pool.query(`DELETE FROM loyalty_rewards WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: "Reward deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete reward" }, { status: 500 });
  }
}

// POST /api/v1/admin/loyalty/rewards
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (authCheck.error) return authCheck.error;

  try {
    const body = await request.json();
    const { name, description, pointsCost, rewardType, discountPercent, targetCapacity, targetDuration, isActive } = body;

    if (!name || !pointsCost) {
      return NextResponse.json({ error: "Name and points cost are required" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO loyalty_rewards (name, description, points_cost, reward_type, discount_percent, target_capacity, target_duration, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, description || null, pointsCost, rewardType, discountPercent || null, targetCapacity || null, targetDuration || "per_day", isActive !== false]
    );

    return NextResponse.json({ success: true, message: "Reward created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
  }
}
