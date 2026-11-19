import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getAdminClient } from "./supabase/server";
import { getSettings } from "./settings";
import { listSubmissions, listDepartments } from "./data";
import type { Profile, Score, Submission } from "./types";
import { computeTotal } from "./judging-shared";

export { computeTotal };

export interface RankedSubmission {
  submission: Submission;
  average: number;
  judgeCount: number;
}

export async function getRankings(): Promise<RankedSubmission[]> {
  const subs = await listSubmissions();
  const scores = await getAllScores();
  return subs
    .map((submission) => {
      const own = scores.filter((s) => s.submission_id === submission.id && s.is_final);
      const average = own.length
        ? Math.round((own.reduce((a, s) => a + s.total, 0) / own.length) * 100) / 100
        : 0;
      return { submission, average, judgeCount: own.length };
    })
    .filter((r) => r.judgeCount > 0)
    .sort((a, b) => b.average - a.average || a.submission.submission_code.localeCompare(b.submission.submission_code));
}

const cachedGetAllScores = unstable_cache(async function getAllScores(): Promise<Score[]> {
  const admin = getAdminClient();
  if (!admin) return [];
  const { data, error } = await admin.from("scores").select("*").order("updated_at", { ascending: false });
  if (error) return [];
  const judges = await listJudges();
  return (data ?? []).map((s) => ({ ...(s as Score), judge: judges.find((j) => j.id === s.judge_id) ?? null }));
}, ["scores-v1"], { revalidate: 20, tags: ["scores"] });

export const getAllScores = cache(() => cachedGetAllScores());

export async function getScoresForSubmission(submissionId: string): Promise<Score[]> {
  return (await getAllScores()).filter((s) => s.submission_id === submissionId);
}

export async function getMyScore(submissionId: string, judgeId: string): Promise<Score | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("scores").select("*")
    .eq("submission_id", submissionId).eq("judge_id", judgeId).maybeSingle();
  return (data as Score) ?? null;
}

export async function saveScore(input: {
  submission_id: string;
  judge_id: string;
  creativity: number;
  theme: number;
  simplicity: number;
  color_typography: number;
  required_text: number;
  comment: string;
  is_final: boolean;
}): Promise<Score> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const weights = (await getSettings()).scoring_weights;
  const total = computeTotal(input, weights);
  const row = { ...input, total, updated_at: new Date().toISOString() };
  const { data, error } = await admin.from("scores")
    .upsert(row, { onConflict: "submission_id,judge_id" }).select().single();
  if (error) throw new Error(error.message);
  return data as Score;
}

const cachedListJudges = unstable_cache(async function listJudges(): Promise<Profile[]> {
  const admin = getAdminClient();
  if (!admin) return [];
  const { data } = await admin.from("profiles").select("*").eq("role", "judge").order("full_name");
  return (data ?? []) as Profile[];
}, ["judges-v1"], { revalidate: 20, tags: ["judges"] });

export const listJudges = cache(() => cachedListJudges());

export async function createJudge(input: { email: string; password: string; full_name: string }): Promise<{ ok: boolean; error?: string }> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, error: "Supabase কনফিগার করা নেই" };
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name, role: "judge" },
  });
  if (error) return { ok: false, error: error.message };
  const { error: pErr } = await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: input.full_name,
    role: "judge",
    is_active: true,
  });
  if (pErr) return { ok: false, error: pErr.message };
  return { ok: true };
}

export async function setJudgeActive(id: string, is_active: boolean): Promise<void> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  const { error } = await admin.from("profiles").update({ is_active }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteJudge(id: string): Promise<void> {
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই");
  await admin.from("profiles").delete().eq("id", id);
  await admin.auth.admin.deleteUser(id);
}

export async function getDashboardStats() {
  const [subs, deps, judges, scores] = await Promise.all([
    listSubmissions(), listDepartments(), listJudges(), getAllScores(),
  ]);
  const active = subs.filter((s) => !s.is_deleted);
  const byStatus: Record<string, number> = {};
  const byDepartment: { name: string; count: number }[] = [];
  const byDay: { date: string; count: number }[] = [];
  for (const s of active) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;
  for (const d of deps) byDepartment.push({ name: d.name_bn, count: active.filter((s) => s.department_id === d.id).length });
  const dayMap = new Map<string, number>();
  for (const s of active) {
    const key = s.created_at.slice(0, 10);
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  }
  for (const [date, count] of [...dayMap.entries()].sort()) byDay.push({ date, count });
  const judgeProgress = judges.map((j) => ({
    id: j.id,
    name: j.full_name,
    reviewed: new Set(scores.filter((s) => s.judge_id === j.id).map((s) => s.submission_id)).size,
    total: active.length,
  }));
  return {
    total: active.length,
    pending: byStatus.submitted ?? 0,
    shortlisted: byStatus.shortlisted ?? 0,
    byStatus, byDepartment, byDay, judgeProgress,
  };
}
