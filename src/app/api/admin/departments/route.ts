import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { addAudit } from "@/lib/data";
import { deleteDepartment, saveDepartment } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const body = (await req.json()) as { id?: string; name_bn: string; name_en: string; is_active?: boolean; sort_order?: number };
  if (!body.name_bn?.trim() || !body.name_en?.trim()) return NextResponse.json({ error: "উভয় নাম লিখুন" }, { status: 400 });
  try {
    await saveDepartment({ ...body, id: body.id || undefined, is_active: body.is_active ?? true, sort_order: body.sort_order ?? 99 });
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: body.id ? "department.update" : "department.create", target: body.name_en, details: {} });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id নেই" }, { status: 400 });
  try {
    await deleteDepartment(id);
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "department.delete", target: id, details: {} });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 }); }
}
