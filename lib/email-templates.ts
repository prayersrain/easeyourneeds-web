/**
 * Email templates for authentication and notifications
 * 
 * Uses Resend for sending emails
 */

import { Resend } from "resend";

// ============================================================
// RESEND CLIENT
// ============================================================

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("Resend API key not configured (RESEND_API_KEY)");
    }

    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// -----------------------------------------------------------
// Magic Link / OTP Email
// -----------------------------------------------------------

export function magicLinkEmail(params: {
  to: string;
  url: string;
  name?: string;
}): EmailTemplate {
  const { to, url, name = "User" } = params;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Magic Link Login</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Ease Your Needs</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Zoom Room Booking Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Halo ${name}! 👋
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Anda menerima email ini karena ada permintaan login ke akun Anda. 
                Klik tombol di bawah untuk login dengan aman:
              </p>
              
              <!-- Magic Link Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 20px 0;">
                    <a href="${url}" 
                       style="display: inline-block; padding: 16px 40px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Login Sekarang →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; margin-top: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      <strong>⚠️ Keamanan:</strong> Jika Anda tidak meminta login ini, abaikan email ini. 
                      Link ini akan kadaluarsa dalam 15 menit.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px;">
                Email ini dikirim secara otomatis oleh sistem Ease Your Needs.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Ease Your Needs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
    Halo ${name}!
    
    Klik link berikut untuk login ke akun Anda:
    ${url}
    
    Link ini akan kadaluarsa dalam 15 menit.
    
    Jika Anda tidak meminta login ini, abaikan email ini.
    
    ---
    Ease Your Needs - Zoom Room Booking Platform
  `;

  return { to, subject: "Login ke Ease Your Needs", html, text };
}

// -----------------------------------------------------------
// Booking Confirmation Email
// -----------------------------------------------------------

export function bookingConfirmationEmail(params: {
  to: string;
  name: string;
  bookingId: string;
  topic: string;
  startTime: string;
  endTime: string;
  capacity: number;
  zoomLink: string;
  passcode: string;
  totalPrice: number;
}): EmailTemplate {
  const { to, name, bookingId, topic, startTime, endTime, capacity, zoomLink, passcode, totalPrice } = params;

  const startFormatted = new Date(startTime).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endFormatted = new Date(endTime).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });

  const priceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalPrice);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Booking Berhasil!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Halo ${name}!
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Booking Zoom room Anda telah berhasil dibuat. Berikut detailnya:
              </p>
              
              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 140px;"><strong>Booking ID</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${bookingId}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Topik</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${topic}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Waktu</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${startFormatted} - ${endFormatted}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Kapasitas</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${capacity} peserta</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Total</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${priceFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Join Meeting Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 20px 0;">
                    <a href="${zoomLink}" 
                       style="display: inline-block; padding: 16px 40px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Join Meeting →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Passcode -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; margin-top: 24px;">
                <tr>
                  <td style="padding: 16px; text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px;"><strong>Passcode:</strong></p>
                    <p style="margin: 0; color: #1e40af; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${passcode}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px;">
                Butuh bantuan? Hubungi kami di support@easeyourneeds.com
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Ease Your Needs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
    Booking Berhasil!
    
    Halo ${name},
    
    Booking Zoom room Anda telah berhasil dibuat.
    
    Booking ID: ${bookingId}
    Topik: ${topic}
    Waktu: ${startFormatted} - ${endFormatted}
    Kapasitas: ${capacity} peserta
    Total: ${priceFormatted}
    
    Join URL: ${zoomLink}
    Passcode: ${passcode}
    
    ---
    Ease Your Needs - Zoom Room Booking Platform
  `;

  return {
    to,
    subject: `✅ Booking Berhasil - ${topic}`,
    html,
    text,
  };
}

// -----------------------------------------------------------
// Payment Receipt Email
// -----------------------------------------------------------

export function paymentReceiptEmail(params: {
  to: string;
  name: string;
  amount: number;
  type: "topup" | "booking" | "refund";
  status: string;
  referenceId: string;
}): EmailTemplate {
  const { to, name, amount, type, status, referenceId } = params;

  const amountFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  const typeLabel = type === "topup" ? "Top-Up" : type === "booking" ? "Booking" : "Refund";
  const icon = type === "topup" ? "💰" : type === "booking" ? "📅" : "↩️";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${icon} ${typeLabel} ${status === "success" ? "Berhasil" : "Diproses"}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Halo ${name}!
              </h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 140px;"><strong>Tipe</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${typeLabel}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Jumlah</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${amountFormatted}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Status</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${status}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Reference ID</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${referenceId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Ease Your Needs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return {
    to,
    subject: `${icon} ${typeLabel} ${status === "success" ? "Berhasil" : "Diproses"} - ${amountFormatted}`,
    html,
    text: `${typeLabel} ${status}. Jumlah: ${amountFormatted}`,
  };
}

// ============================================================
// SEND EMAIL FUNCTIONS
// ============================================================

/**
 * Send an email using Resend
 */
export async function sendEmail(template: EmailTemplate): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const resend = getResendClient();

    const from = `${process.env.RESEND_FROM_NAME || "Ease Your Needs"} <${
      process.env.RESEND_FROM_EMAIL || "noreply@easeyourneeds.com"
    }>`;

    const result = await resend.emails.send({
      from,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (result.error) {
      console.error("[Email] Resend error:", result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error: any) {
    console.error("[Email] Failed to send:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
