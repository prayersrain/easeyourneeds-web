/**
 * POST /api/v1/bookings/[id]/cancel
 * Cancel a booking and process refund
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { endMeeting } from "@/lib/zoom";

export async function POST(
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

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Get booking (with lock)
      const { rows: bookingRows } = await client.query(
        `SELECT * FROM bookings WHERE id = $1 AND user_id = $2 FOR UPDATE`,
        [id, userId]
      );

      if (bookingRows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      const booking = bookingRows[0];

      // 2. Check if cancellation is allowed
      if (booking.status === "cancelled") {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Booking already cancelled" },
          { status: 400 }
        );
      }

      if (booking.status === "completed" || booking.status === "in_progress") {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Cannot cancel ongoing or completed bookings" },
          { status: 400 }
        );
      }

      // 3. Check cancellation deadline
      const now = new Date();
      const deadline = new Date(booking.cancellation_deadline);

      if (now > deadline) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            error: "Cancellation deadline has passed",
            message: "Please contact support for assistance",
          },
          { status: 400 }
        );
      }

      // 4. Calculate refund amount (full refund before deadline)
      const refundAmount = booking.total_price;

      // 5. End Zoom meeting
      try {
        await endMeeting(booking.zoom_meeting_id);
      } catch (zoomError) {
        console.error("[Cancel] Failed to end meeting:", zoomError);
        // Continue anyway
      }

      // 6. Update booking status
      await client.query(
        `UPDATE bookings
         SET status = 'cancelled',
             updated_at = NOW()
         WHERE id = $1`,
        [id]
      );

      // 7. Refund balance
      await client.query(
        `UPDATE users
         SET balance = balance + $1,
             balance_available = balance_available + $1,
             updated_at = NOW()
         WHERE id = $2`,
        [refundAmount, userId]
      );

      // 8. Record refund transaction
      await client.query(
        `INSERT INTO transactions
         (user_id, type, amount, balance_before, balance_after, reference_id, payment_method, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          "refund",
          refundAmount,
          bookingRows[0].balance_available,
          bookingRows[0].balance_available + refundAmount,
          id,
          "balance_refund",
          "success",
        ]
      );

      // 9. Decrement Zoom account usage
      await client.query(
        `UPDATE zoom_accounts
         SET daily_usage = GREATEST(daily_usage - 1, 0),
             current_concurrent = GREATEST(current_concurrent - 1, 0),
             updated_at = NOW()
         WHERE id = $1`,
        [booking.zoom_account_id]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        refund: {
          amount: refundAmount,
          message: "Full refund processed successfully",
        },
        message: "Booking cancelled successfully",
      });
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[Booking Cancel] Error:", error);

    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
