import { NextRequest, NextResponse } from "next/server";
import { getSubmissionByCode } from "@/lib/data";
import { sanitizeText } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; phone?: string };
    const code = sanitizeText(body.code ?? "").toUpperCase();
    const phone = sanitizeText(body.phone ?? "");
    if (!code || !phone) {
      return NextResponse.json({ error: "আইডি ও ফোন নম্বর দিন" }, { status: 400 });
    }
    const sub = await getSubmissionByCode(code);
    if (!sub || sub.phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) {
      return NextResponse.json({ error: "এই আইডি ও ফোন নম্বরের সাথে কোনো সাবমিশন মেলেনি।" }, { status: 404 });
    }
    return NextResponse.json({
      result: {
        submission_code: sub.submission_code,
        status: sub.status,
        full_name: sub.full_name,
        logo_title: sub.logo_title,
        created_at: sub.created_at,
        rank: null,
      },
    });
  } catch {
    return NextResponse.json({ error: "অপ্রত্যাশিত ত্রুটি" }, { status: 500 });
  }
}
