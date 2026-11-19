import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { addAudit } from "@/lib/data";
import { updateSettings } from "@/lib/settings";
import type { ContestSettings } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const guard = await requireRole("admin");
  if ("response" in guard) return guard.response;
  const patch = (await req.json()) as Partial<ContestSettings>;
  try {
    const next = await updateSettings(patch);
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: "settings.update", target: "contest_settings", details: { keys: Object.keys(patch) } });
    return NextResponse.json({ ok: true, settings: next });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 });
  }
}
