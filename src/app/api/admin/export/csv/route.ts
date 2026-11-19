import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { listSubmissions } from "@/lib/data";

export const runtime = "nodejs";

function esc(v: unknown) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const rows = await listSubmissions({ includeDeleted: true });
  const header = ["Submission ID", "Name", "Department", "Semester", "Roll", "Session", "Phone", "Email", "Logo Title", "Concept", "Status", "Created At", "Deleted"];
  const lines = [header.map(esc).join(",")];
  for (const s of rows) {
    lines.push([
      s.submission_code, s.full_name, s.department?.name_en ?? "", s.semester, s.roll, s.session,
      s.phone, s.email, s.logo_title, s.concept, s.status, s.created_at, s.is_deleted ? "yes" : "no",
    ].map(esc).join(","));
  }
  return new NextResponse("\uFEFF" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rgpi-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
