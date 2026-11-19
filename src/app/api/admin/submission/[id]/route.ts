import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { addAudit, getSubmissionById, updateSubmission } from "@/lib/data";
import type { SubmissionStatus } from "@/lib/types";
import { revalidateAdminData } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const { id } = await params;
  const body = (await req.json()) as { status?: SubmissionStatus; admin_note?: string };
  try {
    const patch: Record<string, unknown> = {};
    if (body.status) patch.status = body.status;
    if (body.admin_note !== undefined) patch.admin_note = body.admin_note;
    await updateSubmission(id, patch);
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "submission.update", target: id, details: patch });
    revalidateAdminData();
    return NextResponse.json({ ok: true, submission: await getSubmissionById(id) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 });
  }
}
