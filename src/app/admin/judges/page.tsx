import { guardPage } from "@/lib/page-auth";
import { listJudges } from "@/lib/judging";
import { DashboardShell } from "@/components/dashboard/shell";
import { JudgesManager } from "@/components/admin/judges-manager";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await guardPage("admin");
  const judges = await listJudges();
  return <DashboardShell role="admin" user={user}><JudgesManager judges={judges} /></DashboardShell>;
}
