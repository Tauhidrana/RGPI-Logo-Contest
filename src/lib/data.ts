import "server-only";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { getAdminClient } from "./supabase/server";
import { getSettings } from "./settings";
import { DEFAULT_DEPARTMENTS } from "./departments";
import type { AuditLog, Department, Submission, SubmissionStatus } from "./types";

export const PUBLISHED_STATUSES: SubmissionStatus[] = [
  "shortlisted", "winner", "first_runner_up", "second_runner_up",
];

function subSelect() {
  return "*, department:departments(*)";
}

const cachedListSubmissions = unstable_cache(async function listSubmissions(opts?: {
  includeDeleted?: boolean;
  status?: string;
  departmentId?: string;
  search?: string;
}): Promise<Submission[]> {
  const admin = getAdminClient();
  if (!admin) return [];
  try {
    let q = admin.from("submissions").select(subSelect());
    if (!opts?.includeDeleted) q = q.eq("is_deleted", false);
    if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status);
    if (opts?.departmentId && opts.departmentId !== "all") q = q.eq("department_id", opts.departmentId);
    if (opts?.search) {
      const term = `%${opts.search}%`;
      q = q.or(`submission_code.ilike.${term},full_name.ilike.${term},roll.ilike.${term},email.ilike.${term},phone.ilike.${term},logo_title.ilike.${term}`);
    }
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Submission[];
  } catch {
    return [];
  }
}, ["submissions-v1"], { revalidate: 20, tags: ["submissions"] });

export const listSubmissions = cache((opts?: Parameters<typeof cachedListSubmissions>[0]) => cachedListSubmissions(opts));

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("submissions").select(subSelect()).eq("id", id).maybeSingle();
  return (data as unknown as Submission) ?? null;
}

export async function getSubmissionByCode(code: string): Promise<Submission | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("submissions").select(subSelect()).ilike("submission_code", code).maybeSingle();
  return (data as unknown as Submission) ?? null;
}

export async function countSubmissionsBy(matcher: Partial<Record<"email" | "phone" | "roll", string>>): Promise<number> {
  const admin = getAdminClient();
  if (!admin) return 0;
  let count = 0;
  for (const [field, value] of Object.entries(matcher)) {
    if (!value) continue;
    const { count: c } = await admin.from("submissions")
      .select("id", { count: "exact", head: true })
      .eq(field, value).eq("is_deleted", false);
    count = Math.max(count, c ?? 0);
  }
  return count;
}

export async function nextSubmissionCode(): Promise<string> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const { data, error } = await admin.rpc("next_submission_code");
  if (error || !data) throw new Error(error?.message ?? "সাবমিশন কোড তৈরি করা যায়নি");
  return String(data);
}

export async function insertSubmission(row: Omit<Submission, "department" | "scores">): Promise<Submission> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const { data, error } = await admin.from("submissions").insert(row).select(subSelect()).single();
  if (error) throw new Error(error.message);
  return data as unknown as Submission;
}

export async function updateSubmission(id: string, patch: Partial<Submission>): Promise<void> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const { error } = await admin.from("submissions").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

const fetchDepartments = unstable_cache(
  async (): Promise<Department[]> => {
    const admin = getAdminClient();
    if (!admin) return DEFAULT_DEPARTMENTS;
    const { data } = await admin.from("departments").select("*").order("sort_order", { ascending: true });
    return (data ?? []) as Department[];
  },
  ["departments-v1"],
  { revalidate: 300, tags: ["departments"] }
);

export async function listDepartments(activeOnly = false): Promise<Department[]> {
  const rows = await fetchDepartments();
  return activeOnly ? rows.filter((d) => d.is_active) : rows;
}

export async function saveDepartment(dep: Partial<Department> & { name_bn: string; name_en: string }): Promise<void> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const { error } = await admin.from("departments").upsert(dep);
  if (error) throw new Error(error.message);
  revalidateTag("departments");
}

export async function deleteDepartment(id: string): Promise<void> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const { error } = await admin.from("departments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag("departments");
}

export async function addAudit(entry: Omit<AuditLog, "id" | "created_at">): Promise<void> {
  const admin = getAdminClient();
  if (!admin) return;
  const row = { ...entry, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  try { await admin.from("audit_logs").insert(row); } catch { /* non-blocking */ }
}

export async function listAudit(): Promise<AuditLog[]> {
  const admin = getAdminClient();
  if (!admin) return [];
  const { data } = await admin.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
  return (data ?? []) as AuditLog[];
}

export async function listPublishedSubmissions(): Promise<Submission[]> {
  const settings = await getSettings();
  if (!settings.gallery_visible) return [];
  const all = await listSubmissions();
  return all.filter((s) => PUBLISHED_STATUSES.includes(s.status));
}

export async function getResults() {
  const settings = await getSettings();
  if (!settings.results_published) return null;
  const all = await listSubmissions();
  const pick = (code: string | null) => (code ? all.find((s) => s.submission_code === code) ?? null : null);
  return {
    winner: pick(settings.winners.winner),
    first_runner_up: pick(settings.winners.first_runner_up),
    second_runner_up: pick(settings.winners.second_runner_up),
  };
}
