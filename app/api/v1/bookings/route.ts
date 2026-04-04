/**
 * GET /api/v1/bookings
 * 
 * List user's bookings with pagination and filtering
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { z } from "zod";

const QuerySchema = z.object({
  status: z.enum(["upcoming", "in_progress", "completed", "cancelled", "overtime"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

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

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = {
      status: url.searchParams.get("status") || undefined,
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "20",
    };

    const queryResult = QuerySchema.safeParse(queryParams);

    if (!queryResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryResult.error.issues },
        { status: 400 }
      );
    }

    const { status, page, limit } = queryResult.data;
    const offset = (page - 1) * limit;

    // Build query
    let whereClause = userRole === "customer" ? "b.user_id = $1" : "1=1";
    const params: any[] = userRole === "customer" ? [userId] : [];
    let paramIndex = params.length + 1;

    if (status) {
      whereClause += ` AND b.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Get bookings with count
    const { rows } = await pool.query(
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
         u.name as user_name,
         u.email as user_email,
         za.account_email as zoom_account_email
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       LEFT JOIN zoom_accounts za ON b.zoom_account_id = za.id
       WHERE ${whereClause}
       ORDER BY b.start_time DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Get total count
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as total FROM bookings b WHERE ${whereClause}`,
      params
    );

    const total = parseInt(countRows[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      bookings: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("[Bookings List] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
