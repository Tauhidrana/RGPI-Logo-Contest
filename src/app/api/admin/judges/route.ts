import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { addAudit } from "@/lib/data";
import { createJudge, deleteJudge, setJudgeActive } from "@/lib/judging";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const body = (await req.json()) as { email: string; password: string; full_name: string };
  if (!body.email || !body.password || body.password.length < 8 || !body.full_name)
    return NextResponse.json({ error: "নাম, ইমেইল ও কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন" }, { status: 400 });
  const result = await createJudge(body);
  if (!result.ok) return NextResponse.json({ error: result.error ?? "ত্রুটি" }, { status: 400 });
  await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "judge.create", target: body.email, details: {} });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const body = (await req.json()) as { id: string; is_active: boolean };
  try {
    await setJudgeActive(body.id, body.is_active);
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "judge.toggle", target: body.id, details: { is_active: body.is_active } });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id নেই" }, { status: 400 });
  try {
    await deleteJudge(id);
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "judge.delete", target: id, details: {} });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 }); }
}
