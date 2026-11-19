import "server-only";
import { createServerClient as createSSRClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SUPABASE_URL, isServiceRoleConfigured, isSupabaseConfigured } from "./client";

/** Server-side anon client with cookie-based session (for auth checks). */
export async function createServerSupabase() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createSSRClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // called from a Server Component — middleware refreshes the session instead
        }
      },
    },
  });
}

/** Service-role client. SERVER ONLY. Bypasses RLS — never import into client code. */
let adminClient: SupabaseClient | null = null;

export function getAdminClient() {
  if (!isServiceRoleConfigured()) return null;
  if (adminClient) return adminClient;
  // Lazy require to keep it out of any accidental client bundle.
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

/** Returns the current authenticated user's profile, or null. */
export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!data || !data.is_active) return null;
  return {
    id: user.id,
    email: user.email ?? "",
    role: data.role as "admin" | "judge",
    full_name: data.full_name,
    is_active: data.is_active,
  };
}
