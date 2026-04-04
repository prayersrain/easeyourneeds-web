import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PostgresAdapter(pool),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password?: string };
        
        if (!email || !password) return null;

        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = rows[0];

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      // Sync role dynamically from DB to handle admin changes without relogging
      if (token.id) {
        try {
          const { rows } = await pool.query("SELECT role FROM users WHERE id = $1", [token.id]);
          if (rows[0]) {
            // Trim whitespace and normalize to lowercase to prevent comparison issues
            token.role = rows[0].role?.trim().toLowerCase();
          }
        } catch (error) {
          console.error("[Auth] Error syncing user role:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
        // Ensure role is normalized (trim + lowercase) for consistent comparison
        const rawRole = (token.role as string) || "customer";
        session.user.role = rawRole.trim().toLowerCase() as "customer" | "operator" | "admin" | "super_admin";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // When Auth.js creates a new user, ensure custom columns have defaults
      try {
        await pool.query(
          `UPDATE users SET role = 'customer', balance = 0, balance_available = 0, balance_locked = 0 WHERE id = $1 AND role IS NULL`,
          [user.id]
        );
      } catch (err) {
        console.error("[Auth] Failed to initialize new user defaults:", err);
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
