import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getAdminClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { ALLOWED_ADMIN_EMAILS } from "@/lib/defaults";

export const runtime = "nodejs";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "taujidrana00@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Tauhidrana00@00@";

async function signedResponse(role: "admin" | "judge", email: string, req: NextRequest) {
  const token = await createSessionToken(role, email);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
    secure: process.env.NODE_ENV === "production" && req.nextUrl.protocol === "https:",
  });
  return res;
}

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

    // Only the allowlisted Gmail gets admin access. Others must be active judges.
    // Signed cookie lets every later admin request skip Supabase auth + profile lookups.
    if (ALLOWED_ADMIN_EMAILS.includes(email)) return signedResponse("admin", email, req);

    const { data: session } = await supabase.auth.getUser();
    const adminClient = getAdminClient();
    const { data: profile } = adminClient && session.user
      ? await adminClient.from("profiles").select("role,is_active").eq("id", session.user.id).maybeSingle()
      : { data: null };
    if (profile?.role === "judge" && profile.is_active) {
      return signedResponse("judge", email, req);
    }
    return NextResponse.json({ error: "অনুমোদিত ইমেইল নয়" }, { status: 403 });
  }

  // Local credential login — only the authorised admin Gmail and password.
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ইমেইল বা পাসওয়ার্ড ভুল" }, { status: 401 });
  }

  return signedResponse("admin", email, req);
}
