import { guardPage } from "@/lib/page-auth";
import { listSubmissions } from "@/lib/data";
import { getAllScores } from "@/lib/judging";
import { getSettings } from "@/lib/settings";
import { DashboardShell } from "@/components/dashboard/shell";
import { JudgeGrid } from "@/components/judge/judge-grid";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await guardPage("judge");
  const [allSubs, scores, settings] = await Promise.all([listSubmissions(), getAllScores(), getSettings()]);
  const submissions = allSubs.filter((s) => s.status !== "rejected");
  const myScores: Record<string, boolean> = {};
  for (const s of scores) if (s.judge_id === user.id && s.is_final) myScores[s.submission_id] = true;
  return <DashboardShell role="judge" user={user}><JudgeGrid submissions={submissions} done={myScores} anonymous={settings.anonymous_judging} /></DashboardShell>;
}
