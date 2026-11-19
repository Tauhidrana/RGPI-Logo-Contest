import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";
import { getSettings, isContestOpen } from "@/lib/settings";
import { addAudit, countSubmissionsBy, insertSubmission, listDepartments, nextSubmissionCode } from "@/lib/data";
import { AI_BUCKET, JPG_BUCKET } from "@/lib/storage";
import { submitSchema, validateAi, validateJpg } from "@/lib/validations";
import { hashString, randomStorageName, sanitizeText } from "@/lib/utils";
import { revalidateAdminData } from "@/lib/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateBucket = new Map<string, number[]>();
const RATE_WINDOW = 60_000;
const RATE_MAX = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (rateBucket.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  if (hits.length >= RATE_MAX) return true;
  hits.push(now);
  rateBucket.set(ip, hits);
  return false;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  try {
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "অনেকগুলো আবেদন একসাথে পাঠানো হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" }, { status: 429 });
    }

    const form = await req.formData();
    const honeypot = String(form.get("website_url") ?? "");
    if (honeypot) {
      // Silently accept bots so they think they succeeded.
    revalidateAdminData();
      return NextResponse.json({ ok: true });
    }

    const raw = {
      full_name: String(form.get("full_name") ?? ""),
      department_id: String(form.get("department_id") ?? ""),
      semester: String(form.get("semester") ?? ""),
      roll: String(form.get("roll") ?? ""),
      session: String(form.get("session") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      logo_title: String(form.get("logo_title") ?? ""),
      concept: String(form.get("concept") ?? ""),
      declaration: form.get("declaration") === "true" || form.get("declaration") === "on",
      jpg: form.get("jpg"),
      ai: form.get("ai"),
      turnstileToken: String(form.get("turnstileToken") ?? ""),
    };

    const settings = await getSettings();
    if (!isContestOpen(settings)) {
      return NextResponse.json({ error: "জমা দেওয়ার সময় শেষ হয়ে গেছে।", code: "CLOSED" }, { status: 403 });
    }

    const parsed = submitSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first?.message ?? "তথ্য যাচাই করা যায়নি", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const departments = await listDepartments(true);
    if (!departments.some((d) => d.id === parsed.data.department_id)) {
      return NextResponse.json({ error: "বৈধ বিভাগ নির্বাচন করুন" }, { status: 400 });
    }

    const jpgErr = validateJpg(parsed.data.jpg);
    if (jpgErr) return NextResponse.json({ error: jpgErr }, { status: 400 });
    const aiFile = parsed.data.ai instanceof File ? parsed.data.ai : null;
    if (aiFile) {
      const aiErr = validateAi(aiFile);
      if (aiErr) return NextResponse.json({ error: aiErr }, { status: 400 });
    }

    if (!(await verifyTurnstile(parsed.data.turnstileToken ?? "", ip))) {
      return NextResponse.json({ error: "রোবোট যাচাইকরণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" }, { status: 400 });
    }

    const count = await countSubmissionsBy({ email: parsed.data.email, phone: parsed.data.phone, roll: parsed.data.roll });
    if (count >= settings.max_submissions_per_person) {
      return NextResponse.json(
        { error: `আপনি ইতিমধ্যে ${settings.max_submissions_per_person}টি লোগো জমা দিয়েছেন।` },
        { status: 409 }
      );
    }

    const clean = {
      department_id: parsed.data.department_id,
      full_name: sanitizeText(parsed.data.full_name),
      semester: sanitizeText(parsed.data.semester),
      roll: sanitizeText(parsed.data.roll),
      session: sanitizeText(parsed.data.session),
      phone: sanitizeText(parsed.data.phone),
      email: sanitizeText(parsed.data.email).toLowerCase(),
      logo_title: sanitizeText(parsed.data.logo_title),
      concept: sanitizeText(parsed.data.concept),
    };

    const admin = getAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "সার্ভারে ডাটাবেস কনফিগার করা নেই। দয়া করে পরে আবার চেষ্টা করুন।" }, { status: 503 });
    }

    const jpgName = randomStorageName("jpg");
    const jpgBuf = Buffer.from(await parsed.data.jpg.arrayBuffer());
    const jpgU = await admin.storage.from(JPG_BUCKET).upload(jpgName, jpgBuf, { contentType: "image/jpeg", upsert: false });
    if (jpgU.error) throw new Error(`JPG আপলোড ব্যর্থ: ${jpgU.error.message}`);
    const jpgPath = jpgName;

    // AI source is optional: upload only when supplied.
    let aiPath = "";
    if (aiFile) {
      const aiName = randomStorageName("ai");
      const aiBuf = Buffer.from(await aiFile.arrayBuffer());
      const aiU = await admin.storage.from(AI_BUCKET).upload(aiName, aiBuf, { contentType: "application/octet-stream", upsert: false });
      if (aiU.error) throw new Error(`AI আপলোড ব্যর্থ: ${aiU.error.message}`);
      aiPath = aiName;
    }

    const code = await nextSubmissionCode();
    const row = {
      id: crypto.randomUUID(),
      submission_code: code,
      full_name: clean.full_name,
      department_id: clean.department_id,
      semester: clean.semester,
      roll: clean.roll,
      session: clean.session,
      phone: clean.phone,
      email: clean.email,
      logo_title: clean.logo_title,
      concept: clean.concept,
      jpg_path: jpgPath,
      ai_path: aiPath,
      status: "submitted" as const,
      is_deleted: false,
      admin_note: null,
      created_at: new Date().toISOString(),
      ip_hash: hashString(ip + "::" + clean.phone),
    };

    await insertSubmission(row);
    await addAudit({ actor_id: null, actor_email: clean.email, action: "submission.created", target: code, details: {} });

    return NextResponse.json({
      ok: true,
      code,
      summary: {
        full_name: clean.full_name,
        logo_title: clean.logo_title,
        department_id: clean.department_id,
        department_name: departments.find((d) => d.id === clean.department_id)?.name_bn ?? "",
        email: clean.email,
        phone: clean.phone,
        created_at: row.created_at,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "অপ্রত্যাশিত ত্রুটি";
    return NextResponse.json({ error: `জমা দেওয়া যায়নি: ${msg}` }, { status: 500 });
  }
}
