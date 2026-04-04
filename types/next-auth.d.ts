// Extend NextAuth types to include our custom user fields
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "customer" | "operator" | "admin" | "super_admin";
      balance: number;
      phone?: string | null;
    };
  }

  interface User {
    role?: "customer" | "operator" | "admin" | "super_admin";
    balance?: number;
    phone?: string | null;
  }
}
