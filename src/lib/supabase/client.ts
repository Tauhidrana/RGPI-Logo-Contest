import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function looksConfigured(url: string, key: string) {
  return (
    !!url &&
    !!key &&
    url.startsWith("http") &&
    !url.includes("your-project") &&
    !key.includes("your-") &&
    key.length > 30
  );
}

/** True only when real credentials are present (not placeholders). */
export function isSupabaseConfigured(): boolean {
  return looksConfigured(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function isServiceRoleConfigured(): boolean {
  return looksConfigured(SUPABASE_URL, SERVICE_ROLE_KEY);
}

/** Browser (anon) client — safe for auth only. Never use the service role here. */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
