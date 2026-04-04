/**
 * WhatsApp Notification Service (Fonnte API)
 * 
 * Handles:
 * - Booking confirmation
 * - Reminder notifications (H-1, H-0)
 * - Payment status
 * - Overtime warnings
 */

const FONTTE_API_URL = "https://api.fonnte.com/send";

// ============================================================
// WHATSAPP CLIENT
// ============================================================

interface FonnteResponse {
  status: boolean;
  code: number;
  messages: string;
  data?: {
    id: string;
    target: string;
    status: string;
  };
}

async function sendWhatsAppRaw(
  target: string,
  message: string,
  options?: {
    countryCode?: string;
    schedule?: string;
  }
): Promise<FonnteResponse> {
  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    throw new Error("WhatsApp API key not configured (WHATSAPP_API_KEY)");
  }

  const params = new URLSearchParams({
    target,
    message,
    countryCode: options?.countryCode || "62",
  });

  if (options?.schedule) {
    params.append("schedule", options.schedule);
  }

  const response = await fetch(FONTTE_API_URL, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp API error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<FonnteResponse>;
}

// ============================================================
// MESSAGE TEMPLATES
// ============================================================

export interface BookingConfirmationParams {
  phone: string;
  name: string;
  topic: string;
  startTime: string;
  endTime: string;
  capacity: number;
  zoomLink: string;
  passcode: string;
}

export function bookingConfirmationMessage(
  params: BookingConfirmationParams
): { target: string; message: string } {
  const startFormatted = new Date(params.startTime).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `
🎉 *Booking Berhasil!*

Halo ${params.name},

Booking Zoom room Anda telah berhasil dibuat:

📋 *Detail Booking:*
- Topic: ${params.topic}
- Waktu: ${startFormatted}
- Kapasitas: ${params.capacity} peserta

🔗 *Join URL:*
${params.zoomLink}

🔑 *Passcode:* ${params.passcode}

Simpan link ini dan join tepat waktu. Terima kasih!

---
Ease Your Needs
Zoom Room Booking Platform
  `.trim();

  return { target: params.phone, message };
}

// -----------------------------------------------------------
// Reminder H-1 (1 day before)
// -----------------------------------------------------------

export interface ReminderParams {
  phone: string;
  name: string;
  topic: string;
  startTime: string;
  zoomLink: string;
  passcode: string;
}

export function reminderH1Message(params: ReminderParams): { target: string; message: string } {
  const startFormatted = new Date(params.startTime).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `
⏰ *Reminder H-1*

Halo ${params.name},

Meeting Anda akan dilaksanakan besok:

📅 *${params.topic}*
🕐 ${startFormatted}

🔗 Join: ${params.zoomLink}
🔑 Passcode: ${params.passcode}

Pastikan sudah siap! 🚀

---
Ease Your Needs
  `.trim();

  return { target: params.phone, message };
}

// -----------------------------------------------------------
// Reminder H-0 (On the day, 1 hour before)
// -----------------------------------------------------------

export function reminderH0Message(params: ReminderParams): { target: string; message: string } {
  const startFormatted = new Date(params.startTime).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `
🚨 *Reminder - 1 Jam Lagi!*

Halo ${params.name},

Meeting Anda akan segera dimulai:

📋 *${params.topic}*
🕐 Pukul ${startFormatted}

🔗 Join sekarang: ${params.zoomLink}
🔑 Passcode: ${params.passcode}

Sampai jumpa di meeting! 👋

---
Ease Your Needs
  `.trim();

  return { target: params.phone, message };
}

// -----------------------------------------------------------
// Payment Success
// -----------------------------------------------------------

export interface PaymentSuccessParams {
  phone: string;
  name: string;
  amount: number;
  type: "topup" | "booking";
}

export function paymentSuccessMessage(
  params: PaymentSuccessParams
): { target: string; message: string } {
  const amountFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(params.amount);

  const typeLabel = params.type === "topup" ? "Top-Up" : "Booking";
  const icon = params.type === "topup" ? "💰" : "📅";

  const message = `
${icon} *Pembayaran Berhasil!*

Halo ${params.name},

${typeLabel} Anda sebesar ${amountFormatted} telah berhasil diproses.

${params.type === "topup" ? "Saldo Anda telah ditambahkan. ✅" : "Silakan cek email untuk detail booking."}

Terima kasih! 🙏

---
Ease Your Needs
  `.trim();

  return { target: params.phone, message };
}

// -----------------------------------------------------------
// Overtime Warning
// -----------------------------------------------------------

export interface OvertimeWarningParams {
  phone: string;
  name: string;
  topic: string;
  endTime: string;
}

export function overtimeWarningMessage(
  params: OvertimeWarningParams
): { target: string; message: string } {
  const endFormatted = new Date(params.endTime).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `
⚠️ *Peringatan Overtime*

Halo ${params.name},

Meeting Anda akan berakhir dalam 15 menit:

📋 *${params.topic}*
⏰ Selesai: ${endFormatted}

Harap segera selesaikan meeting. Jika perlu perpanjangan, silakan upgrade melalui dashboard.

Terima kasih! 🙏

---
Ease Your Needs
  `.trim();

  return { target: params.phone, message };
}

// ============================================================
// HIGH-LEVEL SEND FUNCTIONS
// ============================================================

/**
 * Send booking confirmation via WhatsApp
 */
export async function sendBookingConfirmation(
  params: BookingConfirmationParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { target, message } = bookingConfirmationMessage(params);
    const result = await sendWhatsAppRaw(target, message);

    return {
      success: result.status,
      messageId: result.data?.id,
      error: result.messages,
    };
  } catch (error: any) {
    console.error("[WhatsApp] Failed to send booking confirmation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send reminder H-1 via WhatsApp
 */
export async function sendReminderH1(
  params: ReminderParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { target, message } = reminderH1Message(params);
    const result = await sendWhatsAppRaw(target, message);

    return {
      success: result.status,
      messageId: result.data?.id,
      error: result.messages,
    };
  } catch (error: any) {
    console.error("[WhatsApp] Failed to send H-1 reminder:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send reminder H-0 via WhatsApp
 */
export async function sendReminderH0(
  params: ReminderParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { target, message } = reminderH0Message(params);
    const result = await sendWhatsAppRaw(target, message);

    return {
      success: result.status,
      messageId: result.data?.id,
      error: result.messages,
    };
  } catch (error: any) {
    console.error("[WhatsApp] Failed to send H-0 reminder:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment success notification via WhatsApp
 */
export async function sendPaymentSuccess(
  params: PaymentSuccessParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { target, message } = paymentSuccessMessage(params);
    const result = await sendWhatsAppRaw(target, message);

    return {
      success: result.status,
      messageId: result.data?.id,
      error: result.messages,
    };
  } catch (error: any) {
    console.error("[WhatsApp] Failed to send payment success:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send overtime warning via WhatsApp
 */
export async function sendOvertimeWarning(
  params: OvertimeWarningParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { target, message } = overtimeWarningMessage(params);
    const result = await sendWhatsAppRaw(target, message);

    return {
      success: result.status,
      messageId: result.data?.id,
      error: result.messages,
    };
  } catch (error: any) {
    console.error("[WhatsApp] Failed to send overtime warning:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if WhatsApp is configured
 */
export function isWhatsAppConfigured(): boolean {
  return !!process.env.WHATSAPP_API_KEY;
}
