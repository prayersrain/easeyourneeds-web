/**
 * Admin Pricing API
 * 
 * GET    /api/v1/admin/pricing/[id] - Get pricing detail
 * PUT    /api/v1/admin/pricing/[id] - Update pricing
 * DELETE /api/v1/admin/pricing/[id] - Delete pricing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";

// ============================================================
// GET /api/v1/admin/pricing/[id]
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    const { rows } = await pool.query(
      `SELECT * FROM pricing_config WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Pricing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pricing: rows[0] });
  } catch (error: any) {
    console.error("[Admin Pricing Get] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch pricing" },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT /api/v1/admin/pricing/[id]
// ============================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      basePrice,
      discountPrice,
      unit,
      capacity,
      tier,
      serviceType,
      isActive,
    } = body;

    if (!name || !basePrice) {
      return NextResponse.json(
        { error: "Name and base price are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE pricing_config 
       SET name = $1,
           description = $2,
           base_price = $3,
           discount_price = $4,
           unit = $5,
           capacity = $6,
           tier = $7,
           service_type = $8,
           is_active = $9,
           updated_at = NOW()
       WHERE id = $10`,
      [
        name,
        description || null,
        basePrice,
        discountPrice || null,
        unit || "per_hour",
        capacity || null,
        tier || null,
        serviceType || "zoom_rental",
        isActive !== false,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Pricing updated successfully",
    });
  } catch (error: any) {
    console.error("[Admin Pricing Update] Error:", error);

    return NextResponse.json(
      { error: "Failed to update pricing" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/v1/admin/pricing/[id]
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    await pool.query(`DELETE FROM pricing_config WHERE id = $1`, [id]);

    return NextResponse.json({
      success: true,
      message: "Pricing deleted successfully",
    });
  } catch (error: any) {
    console.error("[Admin Pricing Delete] Error:", error);

    return NextResponse.json(
      { error: "Failed to delete pricing" },
      { status: 500 }
    );
  }
}
