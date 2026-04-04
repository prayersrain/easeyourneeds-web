/**
 * Booking detail endpoint
 *
 * GET /api/v1/bookings/[id] - Get booking details
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";

// ============================================================
// GET /api/v1/bookings/[id]
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

    const userId = session.user.id;
    const { id } = await params;

    const { rows } = await pool.query(
      `SELECT b.*, za.account_email as zoom_account_email
       FROM bookings b
       LEFT JOIN zoom_accounts za ON b.zoom_account_id = za.id
       WHERE b.id = $1 AND b.user_id = $2`,
      [id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = rows[0];

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        topic: booking.topic,
        description: booking.description,
        startTime: booking.start_time,
        endTime: booking.end_time,
        capacity: booking.capacity,
        meetingType: booking.meeting_type,
        quality: booking.quality,
        zoomLink: booking.zoom_link,
        passcode: booking.passcode,
        status: booking.status,
        totalPrice: booking.total_price,
        pointsEarned: booking.points_earned,
        cancellationDeadline: booking.cancellation_deadline,
        createdAt: booking.created_at,
        zoomAccountEmail: booking.zoom_account_email,
      },
    });
  } catch (error: any) {
    console.error("[Booking Detail] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
