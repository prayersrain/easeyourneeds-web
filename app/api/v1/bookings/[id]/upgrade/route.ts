/**
 * POST /api/v1/bookings/[id]/upgrade
 * Upgrade booking capacity and quality
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { createBookingMeeting, endMeeting, deleteMeeting } from "@/lib/zoom";

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

    // Parse request body
    const body = await request.json();
    const { newCapacity, newQuality } = body;

    if (!newCapacity || !newQuality) {
      return NextResponse.json(
        { error: "Missing required fields: newCapacity, newQuality" },
        { status: 400 }
      );
    }

    if (!["hd", "full_hd"].includes(newQuality)) {
      return NextResponse.json(
        { error: "Invalid quality. Must be 'hd' or 'full_hd'" },
        { status: 400 }
      );
    }

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

      // 2. Check if upgrade is allowed
      if (booking.status !== "upcoming") {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Can only upgrade upcoming bookings" },
          { status: 400 }
        );
      }

      // Check if new capacity is actually higher
      if (newCapacity <= booking.capacity) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "New capacity must be higher than current capacity" },
          { status: 400 }
        );
      }

      // 3. Get new pricing
      const { rows: pricingRows } = await client.query(
        `SELECT base_price, discount_price FROM pricing_config
         WHERE service_type = 'zoom_rental'
           AND capacity = $1
           AND tier = $2
           AND is_active = TRUE
         LIMIT 1`,
        [newCapacity, newQuality]
      );

      if (pricingRows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Pricing not found for selected capacity" },
          { status: 404 }
        );
      }

      const newPrice = pricingRows[0].discount_price || pricingRows[0].base_price;
      const priceDifference = newPrice - booking.total_price;

      // 4. Check if user has enough balance
      const userRow = await client.query(
        `SELECT balance_available FROM users WHERE id = $1`,
        [userId]
      );

      if (parseInt(userRow.rows[0].balance_available) < priceDifference) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }

      // 5. End old Zoom meeting
      try {
        await endMeeting(booking.zoom_meeting_id);
        await deleteMeeting(booking.zoom_meeting_id);
      } catch (zoomError) {
        console.error("[Upgrade] Failed to end/delete old meeting:", zoomError);
        // Continue anyway
      }

      // 6. Create new Zoom meeting
      const newMeeting = await createBookingMeeting({
        topic: booking.topic,
        startTime: booking.start_time,
        endTime: booking.end_time,
        capacity: newCapacity,
        meetingType: booking.meeting_type,
        quality: newQuality,
        autoRecording: "cloud",
        enableWaitingRoom: true,
      });

      // 7. Update booking
      await client.query(
        `UPDATE bookings
         SET capacity = $1,
             quality = $2,
             zoom_link = $3,
             passcode = $4,
             zoom_meeting_id = $5,
             total_price = $6,
             updated_at = NOW()
         WHERE id = $7`,
        [
          newCapacity,
          newQuality,
          newMeeting.joinUrl,
          newMeeting.passcode,
          newMeeting.zoomMeetingId,
          newPrice,
          id,
        ]
      );

      // 8. Deduct balance
      await client.query(
        `UPDATE users
         SET balance = balance - $1,
             balance_available = balance_available - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [priceDifference, userId]
      );

      // 9. Record transaction
      await client.query(
        `INSERT INTO transactions
         (user_id, type, amount, balance_before, balance_after, reference_id, payment_method, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          "upgrade",
          priceDifference,
          bookingRows[0].balance_available,
          bookingRows[0].balance_available - priceDifference,
          id,
          "balance_deduction",
          "success",
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        upgrade: {
          oldCapacity: booking.capacity,
          newCapacity,
          oldQuality: booking.quality,
          newQuality,
          zoomLink: newMeeting.joinUrl,
          passcode: newMeeting.passcode,
          totalPrice: newPrice,
          priceDifference,
        },
        message: "Booking upgraded successfully",
      });
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[Booking Upgrade] Error:", error);

    return NextResponse.json(
      { error: "Failed to upgrade booking" },
      { status: 500 }
    );
  }
}
