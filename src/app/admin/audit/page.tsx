import { guardPage } from "@/lib/page-auth";
import { listAudit } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/shell";
import { AuditLogView } from "@/components/admin/audit-log";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await guardPage("admin");
  const logs = await listAudit();
  return <DashboardShell role="admin" user={user}><AuditLogView logs={logs} /></DashboardShell>;
}
