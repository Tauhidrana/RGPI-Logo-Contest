import { guardPage } from "@/lib/page-auth";
import { getRankings } from "@/lib/judging";
import { getSettings } from "@/lib/settings";
import { DashboardShell } from "@/components/dashboard/shell";
import { RankingsBoard } from "@/components/admin/rankings-board";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await guardPage("admin");
  const [rankings, settings] = await Promise.all([getRankings(), getSettings()]);
  return <DashboardShell role="admin" user={user}><RankingsBoard rankings={rankings} settings={settings} /></DashboardShell>;
}
