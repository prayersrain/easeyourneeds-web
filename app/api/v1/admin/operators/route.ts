/**
 * Admin Operators API
 * 
 * POST /api/v1/admin/operators - Create new operator
 * GET  /api/v1/admin/operators - List all operators
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

// ============================================================
// POST /api/v1/admin/operators
// Create new operator account + profile
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

    const userRole = (session.user as { role?: string }).role;

    if (!["admin", "super_admin"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      tier,
      hourlyRate,
      bio,
      isAvailable,
    } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { rows: existingUsers } = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Create user account
      const { rows: userRows } = await client.query(
        `INSERT INTO users (email, name, phone, password, role, balance, balance_available, balance_locked)
         VALUES ($1, $2, $3, $4, 'operator', 0, 0, 0)
         RETURNING id`,
        [email, name, phone || null, hashedPassword]
      );

      const userId = userRows[0].id;

      // 2. Create operator profile
      await client.query(
        `INSERT INTO operator_profiles (user_id, name, tier, hourly_rate, bio, is_available, rating, total_sessions)
         VALUES ($1, $2, $3, $4, $5, $6, 5.0, 0)`,
        [userId, name, tier || "bronze", parseInt(hourlyRate) || 60000, bio || null, isAvailable !== false]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        {
          success: true,
          message: "Operator created successfully",
          operator: {
            id: userId,
            name,
            email,
            tier: tier || "bronze",
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
    console.error("[Admin Operators Create] Error:", error);

    return NextResponse.json(
      { error: "Failed to create operator" },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/v1/admin/operators
// List all operators
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
    const tier = url.searchParams.get("tier");
    const available = url.searchParams.get("available");

    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (tier && tier !== "all") {
      whereClause += ` AND op.tier = $${paramIndex}`;
      queryParams.push(tier);
      paramIndex++;
    }

    if (available !== null && available !== "all") {
      whereClause += ` AND op.is_available = $${paramIndex}`;
      queryParams.push(available === "true");
      paramIndex++;
    }

    const { rows } = await pool.query(
      `SELECT 
         op.*,
         u.email,
         u.phone,
         u.last_login_at,
         u.password IS NOT NULL as has_account
       FROM operator_profiles op
       LEFT JOIN users u ON op.user_id = u.id
       ${whereClause}
       ORDER BY op.tier, op.name`,
      queryParams
    );

    return NextResponse.json({
      operators: rows,
      total: rows.length,
    });
  } catch (error: any) {
    console.error("[Admin Operators List] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch operators" },
      { status: 500 }
    );
  }
}
