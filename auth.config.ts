import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// This is the Edge-compatible auth configuration.
// It DOES NOT include the database adapter or Email providers to avoid errors in Middleware.
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // Credentials logic is implemented in auth.ts to stay Edge-compatible here
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-email",
    error: "/signin",
  },
} satisfies NextAuthConfig;
