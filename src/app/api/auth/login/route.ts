import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { ALLOWED_ADMIN_EMAILS } from "@/lib/defaults";

export const runtime = "nodejs";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "taujidrana00@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Tauhidrana00@00@";

export async function POST(req: NextRequest) {
  let email = "";
  let password = "";
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    email = (body.email ?? "").trim().toLowerCase();
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "ইমেইল ও পাসওয়ার্ড দিন" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "ইমেইল ও পাসওয়ার্ড দিন" }, { status: 400 });
  }

  // Live Supabase Auth when credentials are configured.
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    if (!supabase) return NextResponse.json({ error: "সার্ভার কনফিগার ত্রুটি" }, { status: 500 });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    const role = ALLOWED_ADMIN_EMAILS.includes(email) ? "admin" : "judge";
    return NextResponse.json({ ok: true, role });
  }

  // Local credential login — only the authorised admin Gmail and password.
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ইমেইল বা পাসওয়ার্ড ভুল" }, { status: 401 });
  }

  const token = await createSessionToken("admin", email);
  const res = NextResponse.json({ ok: true, role: "admin" });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
    secure: process.env.NODE_ENV === "production" && req.nextUrl.protocol === "https:",
  });
  return res;
}
