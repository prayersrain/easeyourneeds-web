/**
 * POST /api/v1/auth/forgot-password
 * 
 * Send password reset email with token
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";
import { sendEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { rows } = await pool.query(
      `SELECT id, name, email FROM users WHERE email = $1`,
      [email]
    );

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      console.log(`[Forgot Password] Email not found: ${email}`);
      return NextResponse.json({
        success: true,
        message: "If the email exists, we've sent a reset link",
      });
    }

    const user = rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database
    await pool.query(
      `INSERT INTO verification_token (identifier, token, expires)
       VALUES ($1, $2, $3)
       ON CONFLICT (identifier, token) 
       DO UPDATE SET token = $2, expires = $3`,
      [`reset-password:${user.id}`, resetToken, resetTokenExpiry]
    );

    // Build reset URL
    const url = new URL(request.url);
    const baseUrl = url.origin;
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send email
    const emailTemplate = {
      to: user.email,
      subject: "Reset Password - Ease Your Needs",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Reset Password 🔑</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                    Halo ${user.name || "User"}!
                  </h2>
                  
                  <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                    Anda menerima email ini karena ada permintaan reset password untuk akun Anda.
                    Klik tombol di bawah untuk membuat password baru:
                  </p>
                  
                  <!-- Reset Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align: center; padding: 20px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; padding: 16px 40px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                          Reset Password →
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Alternative Link -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; margin-top: 24px;">
                    <tr>
                      <td style="padding: 16px;">
                        <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px;">
                          <strong>Link tidak berfungsi?</strong> Copy dan paste URL berikut ke browser:
                        </p>
                        <p style="margin: 0; color: #78350f; font-size: 12px; word-break: break-all; font-family: monospace;">
                          ${resetUrl}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Security Notice -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fee2e2; border-radius: 8px; margin-top: 16px;">
                    <tr>
                      <td style="padding: 16px;">
                        <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
                          <strong>⚠️ Keamanan:</strong> Jika Anda tidak meminta reset password, abaikan email ini. 
                          Password Anda tidak akan berubah. Link ini akan kadaluarsa dalam 1 jam.
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
      `,
      text: `
        Reset Password - Ease Your Needs
        
        Halo ${user.name || "User"},
        
        Klik link berikut untuk reset password Anda:
        ${resetUrl}
        
        Link ini akan kadaluarsa dalam 1 jam.
        
        Jika Anda tidak meminta reset password, abaikan email ini.
        
        ---
        Ease Your Needs - Zoom Room Booking Platform
      `,
    };

    const emailResult = await sendEmail(emailTemplate);

    if (!emailResult.success) {
      console.error("[Forgot Password] Failed to send email:", emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "If the email exists, we've sent a reset link",
    });
  } catch (error: any) {
    console.error("[Forgot Password] Error:", error);

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
