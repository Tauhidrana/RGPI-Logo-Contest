import type { Metadata } from "next";
import { guardPage } from "@/lib/page-auth";
import { listSubmissions } from "@/lib/data";
import { getAllScores } from "@/lib/judging";
import { getSettings } from "@/lib/settings";
import { DashboardShell } from "@/components/dashboard/shell";
import { JudgeReview } from "@/components/judge/judge-review";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "বিচারক প্যানেল" };

export default async function Page({ searchParams }: { searchParams: Promise<{ start?: string }> }) {
  const user = await guardPage("judge");
  const { start } = await searchParams;
  const [allSubs, scores, settings] = await Promise.all([listSubmissions(), getAllScores(), getSettings()]);
  const submissions = allSubs.filter((s) => s.status !== "rejected");
  const myScores: Record<string, typeof scores[number]> = {};
  for (const s of scores) if (s.judge_id === user.id) myScores[s.submission_id] = s;
  const startIndex = Math.max(0, Math.min(submissions.length - 1, Number(start) || 0));
  return (
    <DashboardShell role="judge" user={user}>
      <JudgeReview submissions={submissions} initialScores={myScores} anonymous={settings.anonymous_judging} weights={settings.scoring_weights} locked={settings.judging_locked} judgeId={user.id} startIndex={startIndex} />
    </DashboardShell>
  );
}
