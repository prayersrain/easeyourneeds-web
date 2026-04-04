/**
 * Reset Password API
 * 
 * GET  /api/v1/auth/reset-password?token=xxx - Validate token
 * POST /api/v1/auth/reset-password - Reset password with token
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

// ============================================================
// GET /api/v1/auth/reset-password?token=xxx
// Validate reset token
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find token in database
    const { rows } = await pool.query(
      `SELECT identifier, expires 
       FROM verification_token 
       WHERE token = $1 AND identifier LIKE 'reset-password:%'`,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const tokenData = rows[0];
    const expiresAt = new Date(tokenData.expires);

    // Check if token expired
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Token is valid",
    });
  } catch (error: any) {
    console.error("[Reset Password Validate] Error:", error);

    return NextResponse.json(
      { error: "Failed to validate token" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/v1/auth/reset-password
// Reset password with token
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find and validate token
    const { rows: tokenRows } = await pool.query(
      `SELECT identifier, expires 
       FROM verification_token 
       WHERE token = $1 AND identifier LIKE 'reset-password:%'`,
      [token]
    );

    if (tokenRows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const tokenData = tokenRows[0];
    const expiresAt = new Date(tokenData.expires);

    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    // Extract user ID from identifier (format: reset-password:USER_ID)
    const userId = tokenData.identifier.replace("reset-password:", "");

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await pool.query(
      `UPDATE users 
       SET password = $1, updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, userId]
    );

    // Delete used token
    await pool.query(
      `DELETE FROM verification_token WHERE token = $1`,
      [token]
    );

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("[Reset Password] Error:", error);

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
