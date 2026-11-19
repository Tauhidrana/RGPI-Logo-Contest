import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guardPage } from "@/lib/page-auth";
import { getSubmissionById } from "@/lib/data";
import { getScoresForSubmission } from "@/lib/judging";
import { getSettings } from "@/lib/settings";
import { DashboardShell } from "@/components/dashboard/shell";
import { SubmissionDetail } from "@/components/admin/submission-detail";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "সাবমিশন বিবরণ" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await guardPage("admin");
  const { id } = await params;
  const [sub, scores, settings] = await Promise.all([getSubmissionById(id), getScoresForSubmission(id), getSettings()]);
  if (!sub) notFound();
  return (
    <DashboardShell role="admin" user={user}>
      <SubmissionDetail submission={sub} scores={scores} weights={settings.scoring_weights} anonymous={settings.anonymous_judging} />
    </DashboardShell>
  );
}
