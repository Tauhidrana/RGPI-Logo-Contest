import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./supabase/server";
import { ALLOWED_ADMIN_EMAILS } from "./defaults";
import { readSessionToken, SESSION_COOKIE } from "./session";
import type { Role } from "./types";

export type AuthUser = {
  id: string;
  role: Role;
  full_name: string;
  email: string;
  is_active: boolean;
};

/**
 * Only real Supabase Auth sessions are accepted.
 * Admin access is restricted to the allowlisted Gmail address — no demo bypass.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  // Signed credential session (works even before Supabase is configured).
  const store = await cookies();
  const session = await readSessionToken(store.get(SESSION_COOKIE)?.value);
  if (session && ALLOWED_ADMIN_EMAILS.includes(session.email.toLowerCase())) {
    return {
      id: `admin-${session.email}`,
      role: "admin",
      full_name: session.email.split("@")[0],
      email: session.email,
      is_active: true,
    };
  }

  // Otherwise use a real Supabase Auth session.
  const u = await getCurrentUser();
  if (!u || !u.is_active) return null;
  const email = u.email.toLowerCase();
  if (u.role === "admin" && !ALLOWED_ADMIN_EMAILS.includes(email)) return null;
  return { id: u.id, role: u.role, full_name: u.full_name, email: u.email, is_active: true };
}

export async function requireRole(role: Role): Promise<{ user: AuthUser } | { response: NextResponse }> {
  const user = await getAuthUser();
  if (!user || user.role !== role || !user.is_active) {
    return { response: NextResponse.json({ error: "অনুমোদন নেই" }, { status: 401 }) };
  }
  return { user };
}

export async function requireAdminOrJudge(): Promise<{ user: AuthUser } | { response: NextResponse }> {
  const user = await getAuthUser();
  if (!user || !user.is_active) {
    return { response: NextResponse.json({ error: "অনুমোদন নেই" }, { status: 401 }) };
  }
  return { user };
}
