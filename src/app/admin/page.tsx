import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/judging";
import { getSettings } from "@/lib/settings";
import { DashboardShell } from "@/components/dashboard/shell";
import { AdminDashboard } from "@/components/admin/dashboard";
import LoginPage from "./login/page";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "অ্যাডমিন ড্যাশবোর্ড" };

export default async function AdminHome() {
  const user = await getAuthUser();
  // `/admin` itself opens the sign-in screen when not authenticated.
  if (!user || user.role !== "admin" || !user.is_active) return <LoginPage />;
  const [stats, settings] = await Promise.all([getDashboardStats(), getSettings()]);
  return (
    <DashboardShell role="admin" user={user}>
      <AdminDashboard stats={stats} settings={settings} />
    </DashboardShell>
  );
}
