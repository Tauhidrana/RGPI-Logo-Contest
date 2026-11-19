import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { saveScore } from "@/lib/judging";
import { addAudit } from "@/lib/data";
import { sanitizeText } from "@/lib/utils";
import { revalidateAdminData } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const guard = await requireRole("judge");
  if ("response" in guard) return guard.response;
  const settings = await getSettings();
  if (settings.judging_locked) {
    return NextResponse.json({ error: "বিচার বন্ধ করে দেওয়া হয়েছে।" }, { status: 403 });
  }
  const body = (await req.json()) as {
    submission_id: string; creativity: number; theme: number; simplicity: number;
    color_typography: number; required_text: number; comment: string; is_final: boolean;
  };
  const keys = ["creativity", "theme", "simplicity", "color_typography", "required_text"] as const;
  for (const k of keys) {
    const v = body[k];
    if (typeof v !== "number" || v < 1 || v > 10) {
      return NextResponse.json({ error: "প্রতিটি মানদণ্ডে ১ থেকে ১০ নম্বর দিন" }, { status: 400 });
    }
  }
  if (!body.submission_id) return NextResponse.json({ error: "সাবমিশন নেই" }, { status: 400 });
  try {
    const score = await saveScore({
      submission_id: body.submission_id,
      judge_id: guard.user.id,
      creativity: body.creativity, theme: body.theme, simplicity: body.simplicity,
      color_typography: body.color_typography, required_text: body.required_text,
      comment: sanitizeText(body.comment ?? "").slice(0, 2000),
      is_final: !!body.is_final,
    });
    await addAudit({ actor_id: guard.user.id, actor_email: guard.user.email, action: body.is_final ? "judge.score_final" : "judge.score_draft", target: body.submission_id, details: { total: score.total } });
    revalidateAdminData();
    return NextResponse.json({ ok: true, score });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "ত্রুটি" }, { status: 500 });
  }
}
