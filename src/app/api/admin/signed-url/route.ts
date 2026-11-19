import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrJudge } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase/server";
import { AI_BUCKET, JPG_BUCKET } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const guard = await requireAdminOrJudge();
  if ("response" in guard) return guard.response;
  const path = req.nextUrl.searchParams.get("path") ?? "";
  const bucket = req.nextUrl.searchParams.get("bucket") === "ai" ? AI_BUCKET : JPG_BUCKET;
  if (!path) return NextResponse.json({ error: "path নেই" }, { status: 400 });

  const admin = getAdminClient();
  if (!admin || path.startsWith("/")) {
    return NextResponse.json({ error: "ফাইল পাওয়া যায়নি" }, { status: 404 });
  }
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, 60 * 30);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: data.signedUrl });
}
