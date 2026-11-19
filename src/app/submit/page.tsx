import type { Metadata } from "next";
import { getSettings, isContestOpen } from "@/lib/settings";
import { listDepartments } from "@/lib/data";
import { SubmitWizard } from "@/components/submit/submit-wizard";
import { ClosedNotice } from "@/components/shared/closed-notice";

export const revalidate = 300;
export const metadata: Metadata = { title: "লোগো জমা দিন", description: "RGPI লোগো ডিজাইন প্রতিযোগিতায় আপনার ডিজাইন জমা দিন।" };

export default async function SubmitPage() {
  const [settings, departments] = await Promise.all([getSettings(), listDepartments(true)]);
  if (!isContestOpen(settings)) return <ClosedNotice deadline={settings.deadline} />;
  return <SubmitWizard settings={settings} departments={departments} />;
}
