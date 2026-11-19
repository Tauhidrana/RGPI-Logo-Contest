import type { Metadata } from "next";
import { guardPage } from "@/lib/page-auth";
import { listSubmissions } from "@/lib/data";
import { getAllScores } from "@/lib/judging";
import { DashboardShell } from "@/components/dashboard/shell";
import { SubmissionsTable } from "@/components/admin/submissions-table";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "সাবমিশন ব্যবস্থাপনা" };

export default async function Page() {
  const user = await guardPage("admin");
  const [subs, scores] = await Promise.all([listSubmissions({ includeDeleted: true }), getAllScores()]);
  const avg: Record<string, number> = {};
  for (const s of scores) {
    if (!s.is_final) continue;
    (avg[s.submission_id] ??= 0);
    avg[s.submission_id] += s.total;
  }
  const counts: Record<string, number> = {};
  for (const k of Object.keys(avg)) {
    const n = scores.filter((s) => s.submission_id === k && s.is_final).length;
    counts[k] = n;
    avg[k] = Math.round((avg[k] / n) * 100) / 100;
  }
  return (
    <DashboardShell role="admin" user={user}>
      <SubmissionsTable submissions={subs} averages={avg} scoreCounts={counts} />
    </DashboardShell>
  );
}
