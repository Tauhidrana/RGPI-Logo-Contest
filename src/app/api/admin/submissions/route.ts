import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateSubmission } from "@/lib/data";
import { addAudit } from "@/lib/data";
import type { SubmissionStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const body = (await req.json()) as { ids?: string[]; action?: string; status?: SubmissionStatus };
  const ids = body.ids ?? [];
  if (!ids.length) return NextResponse.json({ error: "কোনো সাবমিশন নির্বাচন করা হয়নি" }, { status: 400 });

  try {
    if (body.action === "status" && body.status) {
      await Promise.all(ids.map((id) => updateSubmission(id, { status: body.status })));
      await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "submission.bulk_status", target: `${ids.length} items`, details: { status: body.status } });
    } else if (body.action === "delete") {
      await Promise.all(ids.map((id) => updateSubmission(id, { is_deleted: true })));
      await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "submission.bulk_delete", target: `${ids.length} items`, details: {} });
    } else if (body.action === "restore") {
      await Promise.all(ids.map((id) => updateSubmission(id, { is_deleted: false })));
      await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "submission.bulk_restore", target: `${ids.length} items`, details: {} });
    } else {
      return NextResponse.json({ error: "অবৈধ অ্যাকশন" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, count: ids.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 });
  }
}
