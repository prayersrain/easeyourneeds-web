/**
 * Xendit Payment Gateway Integration
 * 
 * Handles:
 * - Virtual Account (VA) creation
 * - QRIS code generation
 * - Invoice management
 * - Webhook signature validation
 * - Payment status processing
 */

import { Xendit } from "xendit-node";

// ============================================================
// XENDIT CLIENT INITIALIZATION
// ============================================================

let xenditClient: Xendit | null = null;

function getXenditClient(): Xendit {
  if (!xenditClient) {
    const secretKey = process.env.XENDIT_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error("Xendit secret key not configured (XENDIT_SECRET_KEY)");
    }

    xenditClient = new Xendit({
      secretKey,
    });
  }

  return xenditClient;
}

// ============================================================
// INVOICE CREATION
// ============================================================

export interface CreateInvoiceParams {
  externalId: string; // Unique identifier for your system
  amount: number;
  description: string;
  payerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  reminderTime?: number; // in minutes
}

export interface InvoiceResponse {
  id: string;
  external_id: string;
  amount: number;
  payer_email: string | null;
  description: string;
  status: string;
  merchant_name: string;
  currency: string;
  paid_amount: number;
  paid_at: string | null;
  payer_phone: string | null;
  payment_method: string | null;
  payment_channel: string | null;
  payment_destination: string | null;
  invoice_url: string;
  success_redirect_url: string | null;
  failure_redirect_url: string | null;
  expired_at: string | null;
  created: string;
  updated: string;
}

/**
 * Create a Xendit invoice for top-up
 * 
 * Returns invoice object with payment URL
 */
export async function createInvoice(
  params: CreateInvoiceParams
): Promise<InvoiceResponse> {
  const xendit = getXenditClient() as any;

  try {
    const invoice = await xendit.invoice.createInvoice({
      externalId: params.externalId,
      amount: params.amount,
      description: params.description,
      ...(params.payerEmail && { payerEmail: params.payerEmail }),
      ...(params.customerName && { customerName: params.customerName }),
      ...(params.customerMobilePhone && {
        customerMobilePhone: params.customerMobilePhone,
      }),
      ...(params.successRedirectUrl && {
        successRedirectUrl: params.successRedirectUrl,
      }),
      ...(params.failureRedirectUrl && {
        failureRedirectUrl: params.failureRedirectUrl,
      }),
      ...(params.reminderTime && { reminderTime: params.reminderTime }),
    });

    return invoice as unknown as InvoiceResponse;
  } catch (error: any) {
    console.error("[Xendit] Failed to create invoice:", error);
    throw new Error(`Failed to create payment invoice: ${error.message}`);
  }
}

// ============================================================
// VIRTUAL ACCOUNT CREATION
// ============================================================

export type VABankCode = "BCA" | "BNI" | "BRI" | "MANDIRI" | "PERMATA" | "BSI";

export interface CreateVAParams {
  externalId: string;
  amount: number;
  bankCode: VABankCode;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
}

export interface VAResponse {
  id: string;
  external_id: string;
  merchant_external_id: string | null;
  is_closed: boolean;
  is_single_use: boolean;
  bank_code: string;
  account_number: string;
  account_name: string;
  amount: number;
  status: string;
  created: string;
  updated: string;
}

/**
 * Create a Virtual Account for top-up
 * 
 * Returns VA object with account_number and bank_code
 */
export async function createVirtualAccount(
  params: CreateVAParams
): Promise<VAResponse> {
  const xendit = getXenditClient() as any;

  try {
    const va = await xendit.virtualAccounts.createFixedVirtualAccount({
      externalId: params.externalId,
      bankCode: params.bankCode,
      name: params.customerName,
      expectedAmt: params.amount,
      ...(params.customerEmail && { email: params.customerEmail }),
      ...(params.customerPhone && { mobileNo: params.customerPhone }),
      ...(params.description && { description: params.description }),
    });

    return va as unknown as VAResponse;
  } catch (error: any) {
    console.error("[Xendit] Failed to create VA:", error);
    throw new Error(`Failed to create virtual account: ${error.message}`);
  }
}

// ============================================================
// QRIS CREATION
// ============================================================

export interface CreateQRISParams {
  externalId: string;
  amount: number;
  description: string;
  customerName?: string;
  callbackUrl?: string;
}

export interface QRISResponse {
  id: string;
  external_id: string;
  qr_string: string;
  amount: number;
  status: string;
  callback_url: string | null;
  created: string;
  updated: string;
}

/**
 * Create a QRIS payment code
 * 
 * Returns QRIS object with qr_string for display
 */
export async function createQRISPayment(
  params: CreateQRISParams
): Promise<QRISResponse> {
  const xendit = getXenditClient() as any;

  try {
    const qris = await xendit.qrCode.createQRCode({
      externalId: params.externalId,
      amount: params.amount,
      qrCodeTypes: "DYNAMIC",
      ...(params.customerName && { customerName: params.customerName }),
      ...(params.callbackUrl && { callbackUrl: params.callbackUrl }),
    });

    return qris as unknown as QRISResponse;
  } catch (error: any) {
    console.error("[Xendit] Failed to create QRIS:", error);
    throw new Error(`Failed to create QRIS payment: ${error.message}`);
  }
}

// ============================================================
// WEBHOOK SIGNATURE VALIDATION
// ============================================================

import crypto from "crypto";

/**
 * Validate Xendit webhook signature to prevent fake requests
 * 
 * Xendit sends x-callback-token header that must match XENDIT_WEBHOOK_TOKEN
 */
export function validateWebhookSignature(
  callbackToken: string | null,
  expectedToken: string
): boolean {
  if (!callbackToken) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(callbackToken),
    Buffer.from(expectedToken)
  );
}

// ============================================================
// WEBHOOK PROCESSING
// ============================================================

export interface WebhookPayload {
  event: string;
  business_id: string;
  created: string;
  data: {
    id: string;
    external_id: string;
    amount: number;
    status: string;
    paid_amount: number;
    paid_at: string | null;
    payer_email: string | null;
    payment_method: string | null;
    payment_channel: string | null;
    payment_destination: string | null;
    bank_code: string | null;
    account_number: string | null;
    updated: string;
    created: string;
  };
}

export enum PaymentStatus {
  PAID = "PAID",
  EXPIRED = "EXPIRED",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

/**
 * Process Xendit webhook payload
 * 
 * This function should be called from the webhook handler after signature validation.
 * It updates the database based on payment status.
 */
export async function processWebhookPayload(
  payload: WebhookPayload,
  db: any // pg pool
): Promise<{
  success: boolean;
  message: string;
  transactionId?: string;
}> {
  const { event, data } = payload;

  console.log(`[Xendit Webhook] Event: ${event}, External ID: ${data.external_id}`);

  // Only process payment events
  if (!event.startsWith("invoice.")) {
    return { success: true, message: "Ignored non-invoice event" };
  }

  try {
    // Check if transaction already exists (idempotency)
    const { rows: existingTransaction } = await db.query(
      `SELECT id, status FROM transactions WHERE reference_id = $1`,
      [data.id]
    );

    if (existingTransaction.length > 0) {
      const existing = existingTransaction[0];
      
      // If already paid, ignore (prevent double credit)
      if (existing.status === "success") {
        console.log(`[Xendit Webhook] Transaction ${data.id} already processed, ignoring duplicate`);
        return { success: true, message: "Transaction already processed" };
      }
    }

    // Update transaction status based on event
    let newStatus: string;
    let message: string;

    switch (data.status) {
      case PaymentStatus.PAID:
        newStatus = "success";
        message = "Payment successful, balance updated";

        // Update transaction
        await db.query(
          `UPDATE transactions 
           SET status = $1, 
               updated_at = NOW(),
               metadata = jsonb_set(
                 COALESCE(metadata, '{}'::jsonb),
                 '{xendit_paid_at}',
                 to_jsonb($2::text)
               )
           WHERE reference_id = $3`,
          [newStatus, data.paid_at, data.id]
        );

        // Get transaction details to update user balance
        const { rows: transaction } = await db.query(
          `SELECT user_id, amount, type FROM transactions WHERE reference_id = $1`,
          [data.id]
        );

        if (transaction.length > 0) {
          const txn = transaction[0];

          // Update user balance (only for topup)
          if (txn.type === "topup") {
            await db.query(
              `UPDATE users 
               SET balance = balance + $1,
                   balance_available = balance_available + $1,
                   updated_at = NOW()
               WHERE id = $2`,
              [txn.amount, txn.user_id]
            );

            // Record balance history
            await db.query(
              `INSERT INTO balance_history 
               (user_id, change_type, amount, balance_before, balance_after, reference_type, reference_id)
               SELECT 
                 $1,
                 'topup',
                 $2,
                 balance - $2,
                 balance,
                 'transaction',
                 $3
               FROM users WHERE id = $1`,
              [txn.user_id, txn.amount, txn.id]
            );
          }
        }

        break;

      case PaymentStatus.EXPIRED:
        newStatus = "failed";
        message = "Payment expired";

        await db.query(
          `UPDATE transactions 
           SET status = $1, updated_at = NOW()
           WHERE reference_id = $2`,
          [newStatus, data.id]
        );
        break;

      case PaymentStatus.FAILED:
        newStatus = "failed";
        message = "Payment failed";

        await db.query(
          `UPDATE transactions 
           SET status = $1, updated_at = NOW()
           WHERE reference_id = $2`,
          [newStatus, data.id]
        );
        break;

      default:
        return { success: true, message: `Ignored status: ${data.status}` };
    }

    console.log(`[Xendit Webhook] ${message} - Transaction: ${data.id}`);

    return {
      success: true,
      message,
      transactionId: data.id,
    };
  } catch (error: any) {
    console.error("[Xendit Webhook] Error processing payload:", error);

    // Log to failed_operations table for manual review
    try {
      await db.query(
        `INSERT INTO failed_operations 
         (operation_type, resource_type, resource_id, error_message, error_code, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          "xendit_webhook",
          "transaction",
          data.id,
          error.message,
          "WEBHOOK_PROCESSING_ERROR",
          "pending",
        ]
      );
    } catch (logError) {
      console.error("[Xendit Webhook] Failed to log error:", logError);
    }

    return {
      success: false,
      message: `Failed to process webhook: ${error.message}`,
    };
  }
}

// ============================================================
// INVOICE STATUS CHECK
// ============================================================

/**
 * Check invoice status from Xendit
 * 
 * Use this for manual reconciliation or status polling
 */
export async function getInvoiceStatus(
  invoiceId: string
): Promise<InvoiceResponse> {
  const xendit = getXenditClient() as any;

  try {
    const invoice = await xendit.invoice.getInvoiceById({
      invoiceId,
    });

    return invoice as unknown as InvoiceResponse;
  } catch (error: any) {
    console.error("[Xendit] Failed to get invoice status:", error);
    throw new Error(`Failed to get invoice status: ${error.message}`);
  }
}

// ============================================================
// TOP-UP CREATION HELPER
// ============================================================

export interface CreateTopUpParams {
  userId: string;
  amount: number;
  paymentMethod: "va" | "qris";
  vaBankCode?: VABankCode; // Required if paymentMethod is "va"
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  baseUrl: string; // For redirect URLs
}

/**
 * Complete top-up creation flow:
 * 1. Create transaction record in DB
 * 2. Create payment via Xendit
 * 3. Return payment details
 */
export async function createTopUp(
  params: CreateTopUpParams,
  db: any // pg pool
): Promise<{
  transactionId: string;
  paymentUrl?: string;
  vaNumber?: string;
  vaBankCode?: string;
  qrCodeUrl?: string;
  invoiceId: string;
  amount: number;
  expiresAt: string;
}> {
  const externalId = `topup_${params.userId}_${Date.now()}`;

  try {
    // 1. Create transaction record
    const { rows: transaction } = await db.query(
      `INSERT INTO transactions 
       (user_id, type, amount, balance_before, balance_after, reference_id, payment_method, status, metadata)
       SELECT 
         $1,
         'topup',
         $2,
         balance,
         balance, -- Will be updated after payment
         $3,
         $4,
         'pending',
         jsonb_build_object(
           'external_id', $5,
           'va_bank_code', $6,
           'customer_name', $7
         )
       FROM users
       WHERE id = $1
       RETURNING id, balance_before`,
      [
        params.userId,
        params.amount,
        externalId,
        `xendit_${params.paymentMethod}`,
        externalId,
        params.vaBankCode || null,
        params.customerName || null,
      ]
    );

    if (transaction.length === 0) {
      throw new Error("User not found");
    }

    const txnId = transaction[0].id;

    // 2. Create payment via Xendit
    let paymentUrl: string | undefined;
    let vaNumber: string | undefined;
    let vaBank: string | undefined;
    let qrCodeUrl: string | undefined;
    let invoiceId: string;

    if (params.paymentMethod === "va") {
      if (!params.vaBankCode) {
        throw new Error("VA bank code is required");
      }

      const va = await createVirtualAccount({
        externalId,
        amount: params.amount,
        bankCode: params.vaBankCode,
        customerName: params.customerName || "Customer",
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone,
        description: `Top-up balance - ${externalId}`,
      });

      vaNumber = va.account_number;
      vaBank = va.bank_code;
      invoiceId = va.id;
    } else {
      // QRIS
      const qris = await createQRISPayment({
        externalId,
        amount: params.amount,
        description: `Top-up balance - ${externalId}`,
        customerName: params.customerName,
        callbackUrl: `${params.baseUrl}/api/webhooks/xendit`,
      });

      qrCodeUrl = qris.qr_string;
      invoiceId = qris.id;
    }

    // Update transaction with Xendit invoice ID
    await db.query(
      `UPDATE transactions 
       SET reference_id = $1,
           metadata = jsonb_set(metadata, '{xendit_invoice_id}', to_jsonb($1::text))
       WHERE id = $2`,
      [invoiceId, txnId]
    );

    return {
      transactionId: txnId,
      paymentUrl,
      vaNumber,
      vaBankCode: vaBank,
      qrCodeUrl,
      invoiceId,
      amount: params.amount,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
  } catch (error: any) {
    console.error("[Xendit] Failed to create top-up:", error);
    throw error;
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if Xendit is configured
 */
export function isXenditConfigured(): boolean {
  return !!process.env.XENDIT_SECRET_KEY;
}

/**
 * Generate unique external ID for idempotency
 */
export function generateExternalId(prefix: string = "txn"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
