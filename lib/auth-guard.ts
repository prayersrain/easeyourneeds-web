import { auth } from "@/auth";
import { redirect } from "next/navigation";

type AllowedRole = "customer" | "operator" | "admin" | "super_admin";

/**
 * Server-side role guard. Call this at the top of any protected Server Component.
 *
 * Usage in a page.tsx:
 *   const session = await requireRole(["admin", "super_admin"]);
 *
 * If the user doesn't have the required role, they get redirected.
 */
export async function requireRole(allowedRoles: AllowedRole[]) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const userRole = (session.user as { role?: string }).role || "customer";

  if (!allowedRoles.includes(userRole as AllowedRole)) {
    // Redirect unauthorized users to their appropriate dashboard
    redirect("/dashboard");
  }

  return session;
}

/**
 * Get the current session (nullable). Use when you want to check auth
 * without enforcing it.
 */
export async function getSession() {
  return await auth();
}
