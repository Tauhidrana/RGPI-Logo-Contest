import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { SESSION_COOKIE } from "@/lib/session";
export async function POST() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
