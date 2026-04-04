/**
 * POST /api/v1/topup/create
 * 
 * Create a top-up request via Xendit (Virtual Account or QRIS)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { createTopUp, VABankCode } from "@/lib/xendit";
import { z } from "zod";

const CreateTopUpSchema = z.object({
  amount: z.number().int().min(10000, "Minimum top-up amount is Rp 10.000"),
  paymentMethod: z.enum(["va", "qris"]),
  vaBankCode: z.enum(["BCA", "BNI", "BRI", "MANDIRI", "PERMATA", "BSI"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userName = session.user.name || "Customer";
    const userEmail = session.user.email || "";

    // Parse and validate request
    const body = await request.json();
    const validationResult = CreateTopUpSchema.safeParse(body);

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

    const { amount, paymentMethod, vaBankCode } = validationResult.data;

    // Validate VA bank code if payment method is VA
    if (paymentMethod === "va" && !vaBankCode) {
      return NextResponse.json(
        { error: "VA bank code is required for Virtual Account payment" },
        { status: 400 }
      );
    }

    // Get request URL for callback
    const url = new URL(request.url);
    const baseUrl = url.origin;

    // Create top-up via Xendit
    const result = await createTopUp(
      {
        userId,
        amount,
        paymentMethod,
        vaBankCode: vaBankCode as VABankCode,
        customerName: userName,
        customerEmail: userEmail,
        baseUrl,
      },
      pool
    );

    return NextResponse.json(
      {
        success: true,
        topup: {
          transactionId: result.transactionId,
          invoiceId: result.invoiceId,
          amount: result.amount,
          expiresAt: result.expiresAt,
          ...(result.vaNumber && {
            vaNumber: result.vaNumber,
            vaBankCode: result.vaBankCode,
            paymentInstructions: `Transfer ${result.amount} ke ${result.vaBankCode} ${result.vaNumber}`,
          }),
          ...(result.qrCodeUrl && {
            qrCodeUrl: result.qrCodeUrl,
            paymentInstructions: "Scan QR code menggunakan e-wallet",
          }),
        },
        message: "Top-up created successfully. Please complete payment.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Top-up Create] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create top-up",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
