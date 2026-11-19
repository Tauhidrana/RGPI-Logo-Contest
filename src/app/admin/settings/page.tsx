import { guardPage } from "@/lib/page-auth";
import { getSettings } from "@/lib/settings";
import { DashboardShell } from "@/components/dashboard/shell";
import { SettingsForm } from "@/components/admin/settings-form";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await guardPage("admin");
  const settings = await getSettings();
  return <DashboardShell role="admin" user={user}><SettingsForm settings={settings} /></DashboardShell>;
}
