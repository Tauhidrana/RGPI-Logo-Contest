import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const configured = URL.startsWith("http") && !URL.includes("your-project") && ANON.length > 30;

export async function middleware(req: NextRequest) {
  if (!configured) return NextResponse.next();

  // Public visitors without a session cookie skip the network round-trip entirely.
  const hasSession =
    req.cookies.getAll().some((c) => c.name.startsWith("sb-")) ||
    req.headers.get("authorization")?.startsWith("Bearer ");
  if (!hasSession && !req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/judge")) {
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: { headers: req.headers } });
  const supabase = createServerClient(URL, ANON, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies: { name: string; value: string; options?: CookieOptions }[]) => {
        cookies.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: { headers: req.headers } });
        cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/og|api/demo-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
