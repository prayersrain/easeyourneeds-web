/**
 * POST /api/webhooks/xendit
 * 
 * Handle Xendit payment webhook callbacks
 * - Validates webhook signature
 * - Processes payment status
 * - Updates user balance on successful payment
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateWebhookSignature, processWebhookPayload, WebhookPayload } from "@/lib/xendit";

export async function POST(request: NextRequest) {
  try {
    // 1. Validate webhook signature
    const callbackToken = request.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (!expectedToken) {
      console.error("[Xendit Webhook] XENDIT_WEBHOOK_TOKEN not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    if (!validateWebhookSignature(callbackToken, expectedToken)) {
      console.warn("[Xendit Webhook] Invalid signature - possible spoof attempt");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // 2. Parse webhook payload
    const body = await request.json();
    const payload: WebhookPayload = body;

    console.log("[Xendit Webhook] Received event:", payload.event);

    // 3. Process webhook
    const result = await processWebhookPayload(payload, pool);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      // Return 500 to trigger Xendit retry
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Xendit Webhook] Unexpected error:", error);

    // Return 500 to trigger Xendit retry
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Xendit may also send GET request to verify webhook endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Xendit webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
