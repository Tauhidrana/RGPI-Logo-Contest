import { guardPage } from "@/lib/page-auth";
import { listDepartments } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/shell";
import { DepartmentsManager } from "@/components/admin/departments-manager";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await guardPage("admin");
  const departments = await listDepartments();
  return <DashboardShell role="admin" user={user}><DepartmentsManager departments={departments} /></DashboardShell>;
}
