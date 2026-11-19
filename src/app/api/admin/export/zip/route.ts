import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireRole } from "@/lib/auth";
import { listSubmissions } from "@/lib/data";
import { getAdminClient } from "@/lib/supabase/server";
import { JPG_BUCKET } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;

  const subs = await listSubmissions();
  const zip = new JSZip();
  const admin = getAdminClient();

  await Promise.all(subs.map(async (s) => {
    try {
      let bytes: ArrayBuffer | null = null;
      if (admin && !s.jpg_path.startsWith("/")) {
        const { data } = await admin.storage.from(JPG_BUCKET).download(s.jpg_path);
        if (data) bytes = await data.arrayBuffer();
      } else {
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        const res = await fetch(new URL(s.jpg_path, base));
        if (res.ok) bytes = await res.arrayBuffer();
      }
      if (bytes) zip.file(`${s.submission_code}.jpg`, bytes);
    } catch { /* skip broken files */ }
  }));

  const buf = await zip.generateAsync({ type: "uint8array" });
  return new NextResponse(new Blob([buf as BlobPart]), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="rgpi-logos-${new Date().toISOString().slice(0, 10)}.zip"`,
    },
  });
}
