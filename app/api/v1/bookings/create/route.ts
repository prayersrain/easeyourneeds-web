/**
 * POST /api/v1/bookings/create
 * 
 * Create a new Zoom room booking with:
 * - Race condition prevention (row-level locking)
 * - Zoom account pool selection
 * - Meeting creation via Zoom API
 * - Balance deduction
 * - Transaction logging
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { createBookingMeeting } from "@/lib/zoom";
import { z } from "zod";

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const CreateBookingSchema = z.object({
  topic: z.string().min(3).max(500, "Topic must be less than 500 characters"),
  description: z.string().max(2000).optional(),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  capacity: z.number().int().refine(
    (val) => [100, 300, 500, 1000, 3000, 5000].includes(val),
    "Capacity must be one of: 100, 300, 500, 1000, 3000, 5000"
  ),
  meetingType: z.enum(["pro", "webinar"]),
  quality: z.enum(["hd", "full_hd"]),
  addons: z.object({
    mc: z.boolean().optional(),
    operator: z.boolean().optional(),
    obs: z.boolean().optional(),
    livestream: z.boolean().optional(),
  }).optional(),
  useBalance: z.boolean().optional().default(true),
});

// ============================================================
// HANDLER
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // 2. Parse and validate request body
    const body = await request.json();

    const validationResult = CreateBookingSchema.safeParse(body);

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

    const {
      topic,
      description,
      startTime,
      endTime,
      capacity,
      meetingType,
      quality,
      addons,
      useBalance,
    } = validationResult.data;

    // 3. Validate time constraints
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const now = new Date();

    if (startDateTime <= now) {
      return NextResponse.json(
        { error: "Start time must be in the future" },
        { status: 400 }
      );
    }

    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // 4. Calculate price from pricing_config
    const { rows: pricingRows } = await pool.query(
      `SELECT base_price, discount_price, id as pricing_id
       FROM pricing_config
       WHERE service_type = 'zoom_rental'
         AND capacity = $1
         AND tier = $2
         AND is_active = TRUE
       LIMIT 1`,
      [capacity, quality]
    );

    if (pricingRows.length === 0) {
      return NextResponse.json(
        { error: `Pricing not found for capacity ${capacity} ${quality}` },
        { status: 404 }
      );
    }

    const pricing = pricingRows[0];
    const totalPrice = pricing.discount_price || pricing.base_price;

    // 5. Check user balance
    const { rows: userRows } = await pool.query(
      `SELECT balance, balance_available FROM users WHERE id = $1 FOR UPDATE`,
      [userId]
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userRows[0];

    if (useBalance && user.balance_available < totalPrice) {
      return NextResponse.json(
        {
          error: "Insufficient balance",
          required: totalPrice,
          available: user.balance_available,
          message: "Please top-up your balance first",
        },
        { status: 402 }
      );
    }

    // 6. Start database transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 7. Select Zoom account (with concurrent booking check)
      const { rows: availableAccounts } = await client.query(
        `SELECT id, account_id, account_email, daily_limit, daily_usage, concurrent_limit, current_concurrent
         FROM zoom_accounts
         WHERE status = 'active'
           AND is_backup = FALSE
         ORDER BY daily_usage ASC
         FOR UPDATE SKIP LOCKED`
      );

      if (availableAccounts.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            error: "No Zoom accounts available",
            message: "All accounts are currently in use. Please try again in a few minutes.",
          },
          { status: 503 }
        );
      }

      // Find account with capacity for this time slot
      let selectedAccount: any = null;

      for (const account of availableAccounts) {
        // Check daily limit
        if (account.daily_usage >= account.daily_limit) {
          continue;
        }

        // Check concurrent meetings in this time slot
        const { rows: overlappingMeetings } = await client.query(
          `SELECT COUNT(*) as count
           FROM bookings
           WHERE zoom_account_id = $1
             AND status IN ('upcoming', 'in_progress')
             AND start_time < $2
             AND end_time > $3`,
          [account.id, endDateTime, startDateTime]
        );

        const concurrentCount = parseInt(overlappingMeetings[0].count);

        if (concurrentCount < account.concurrent_limit) {
          selectedAccount = account;
          break;
        }
      }

      if (!selectedAccount) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          {
            error: "No Zoom accounts available for selected time slot",
            message: "Please try a different time or contact support",
          },
          { status: 503 }
        );
      }

      // 8. Create Zoom meeting
      let zoomMeeting;
      try {
        zoomMeeting = await createBookingMeeting({
          topic,
          description,
          startTime: startDateTime,
          endTime: endDateTime,
          capacity,
          meetingType,
          quality,
          autoRecording: "cloud",
          enableWaitingRoom: true,
          hostEmail: selectedAccount.account_email,
        });
      } catch (zoomError: any) {
        console.error("[Booking] Zoom meeting creation failed:", zoomError);

        // Log failed operation for retry
        await client.query(
          `INSERT INTO failed_operations 
           (operation_type, resource_type, resource_id, error_message, error_code, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            "zoom_meeting_create",
            "booking",
            "pending",
            zoomError.message,
            "ZOOM_CREATE_FAILED",
            "pending",
          ]
        );

        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error: "Failed to create Zoom meeting",
            message: "Please try again or contact support",
          },
          { status: 500 }
        );
      }

      // 9. Create booking record
      const { rows: bookingRows } = await client.query(
        `INSERT INTO bookings 
         (user_id, zoom_account_id, topic, description, start_time, end_time, capacity, 
          meeting_type, quality, zoom_link, hostkey, passcode, zoom_meeting_id, 
          status, total_price, points_earned, cancellation_deadline)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING id`,
        [
          userId,
          selectedAccount.id,
          topic,
          description || null,
          startDateTime,
          endDateTime,
          capacity,
          meetingType,
          quality,
          zoomMeeting.joinUrl,
          zoomMeeting.hostkey,
          zoomMeeting.passcode,
          zoomMeeting.zoomMeetingId,
          "upcoming",
          totalPrice,
          0, // Points will be calculated after payment
          new Date(startDateTime.getTime() - 24 * 60 * 60 * 1000), // 24h before start
        ]
      );

      const bookingId = bookingRows[0].id;

      // 10. Deduct balance if using balance
      if (useBalance) {
        await client.query(
          `UPDATE users 
           SET balance = balance - $1,
               balance_available = balance_available - $1,
               updated_at = NOW()
           WHERE id = $2`,
          [totalPrice, userId]
        );

        // Record balance history
        await client.query(
          `INSERT INTO balance_history 
           (user_id, change_type, amount, balance_before, balance_after, reference_type, reference_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            userId,
            "booking",
            -totalPrice,
            user.balance_available,
            user.balance_available - totalPrice,
            "booking",
            bookingId,
          ]
        );
      }

      // 11. Create transaction record
      await client.query(
        `INSERT INTO transactions 
         (user_id, type, amount, balance_before, balance_after, reference_id, payment_method, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          "booking",
          -totalPrice,
          user.balance_available,
          user.balance_available - totalPrice,
          bookingId,
          "balance",
          "success",
        ]
      );

      // 12. Create booking addons if requested
      if (addons) {
        const addonTypes = Object.entries(addons)
          .filter(([_, enabled]) => enabled)
          .map(([type]) => type);

        for (const addonType of addonTypes) {
          // Get addon pricing
          const { rows: addonPricing } = await client.query(
            `SELECT base_price FROM pricing_config 
             WHERE service_type = $1 
               AND is_active = TRUE 
             LIMIT 1`,
            [addonType]
          );

          const addonPrice = addonPricing.length > 0 
            ? addonPricing[0].base_price 
            : 0;

          await client.query(
            `INSERT INTO booking_addons 
             (booking_id, addon_type, addon_name, quantity, total_price)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              bookingId,
              addonType,
              addonType.toUpperCase(),
              1,
              addonPrice,
            ]
          );
        }
      }

      // 13. Increment Zoom account usage
      await client.query(
        `UPDATE zoom_accounts
         SET daily_usage = daily_usage + 1,
             current_concurrent = current_concurrent + 1,
             updated_at = NOW()
         WHERE id = $1`,
        [selectedAccount.id]
      );

      // 14. Commit transaction
      await client.query("COMMIT");

      // 15. Return success response
      return NextResponse.json(
        {
          success: true,
          booking: {
            id: bookingId,
            topic,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            capacity,
            meetingType,
            quality,
            zoomLink: zoomMeeting.joinUrl,
            passcode: zoomMeeting.passcode,
            totalPrice,
            status: "upcoming",
          },
          message: "Booking created successfully",
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
    console.error("[Booking Create] Unexpected error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
