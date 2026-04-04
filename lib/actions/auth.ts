"use server";
 
import { signIn, signOut } from "@/auth";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Sign in with Credentials (Email & Password)
 */
export async function signInWithPassword(data: { email: string; password?: string }) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    throw error;
  }
}
 
/**
 * Sign in with Email Magic Link (Resend)
 */
export async function signInWithEmail(email: string) {
  try {
    await signIn("resend", {
      email,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // NextAuth throws NEXT_REDIRECT which is expected behavior
    throw error;
  }
}
 
/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  try {
    await signIn("google", {
      redirectTo: "/dashboard",
    });
  } catch (error) {
    throw error;
  }
}
 
/**
 * Register a new user with Password
 */
export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
}) {
  try {
    // Check if user already exists
    const existing = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [data.email]
    );
 
    if (existing.rows.length > 0) {
      throw new Error("Email ini sudah terdaftar. Silakan login.");
    }
 
    // Hash password
    let hashedPassword = null;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // Create the user
    await pool.query(
      `INSERT INTO users (id, email, name, phone, password, role, balance, balance_available, balance_locked, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'customer', 0, 0, 0, NOW(), NOW())`,
      [data.email, data.name, data.phone, hashedPassword]
    );
 
    // Automatically sign in with credentials after registration
    if (data.password) {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirectTo: "/dashboard",
      });
    } else {
      // Fallback to resend if no password (though UI will require it now)
      await signIn("resend", {
        email: data.email,
        redirectTo: "/dashboard",
      });
    }
  } catch (error) {
    throw error;
  }
}
 
/**
 * Sign out
 */
export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}
