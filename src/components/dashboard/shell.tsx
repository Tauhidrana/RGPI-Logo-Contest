"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Files, Trophy, Users, Building2, Settings, ScrollText,
  Gavel, LogOut, Menu, X, ExternalLink, ShieldCheck, Search,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { InstituteLogo } from "@/components/shared/institute-logo";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const adminNav = [
  { href: "/admin", label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, icon: LayoutDashboard },
  { href: "/admin/submissions", label: { bn: "সাবমিশন", en: "Submissions" }, icon: Files },
  { href: "/admin/rankings", label: { bn: "র‍্যাঙ্কিং", en: "Rankings" }, icon: Trophy },
  { href: "/admin/judges", label: { bn: "বিচারক", en: "Judges" }, icon: Users },
  { href: "/admin/departments", label: { bn: "বিভাগ", en: "Departments" }, icon: Building2 },
  { href: "/admin/settings", label: { bn: "সেটিংস", en: "Settings" }, icon: Settings },
  { href: "/admin/audit", label: { bn: "অডিট লগ", en: "Audit log" }, icon: ScrollText },
];

const judgeNav = [
  { href: "/judge", label: { bn: "পর্যালোচনা", en: "Review" }, icon: Gavel },
  { href: "/judge/submissions", label: { bn: "সব লোগো", en: "All logos" }, icon: Files },
];

export function DashboardShell({ role, children, user }: { role: Role; children: React.ReactNode; user?: { full_name: string; email: string } }) {
  const { lang } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nav = role === "admin" ? adminNav : judgeNav;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success(lang === "bn" ? "লগআউট হয়েছে" : "Signed out");
    router.replace("/admin/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b px-5 py-5"><InstituteLogo /></div>
      <div className="px-4 py-3">
        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold", role === "admin" ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "bg-leaf-100 text-leaf-700 dark:bg-leaf-900/40 dark:text-leaf-200")}>
          {role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <Gavel className="h-3 w-3" />}
          {role === "admin" ? (lang === "bn" ? "অ্যাডমিন প্যানেল" : "Admin panel") : (lang === "bn" ? "বিচারক প্যানেল" : "Judge panel")}
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800")}>
              <Icon className="h-4 w-4" /> {lang === "bn" ? item.label.bn : item.label.en}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><ExternalLink className="h-4 w-4" />{lang === "bn" ? "সাইট দেখুন" : "View site"}</Link>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut className="h-4 w-4" />{lang === "bn" ? "লগআউট" : "Sign out"}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r bg-white dark:bg-slate-900 lg:block">{sidebar}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform dark:bg-slate-900 lg:hidden", open ? "translate-x-0" : "-translate-x-full")}>{sidebar}</aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur dark:bg-slate-900/90 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="grid h-9 w-9 place-items-center rounded-lg border lg:hidden" onClick={() => setOpen(true)} aria-label="Menu"><Menu className="h-5 w-5" /></button>
            <div className="hidden items-center gap-2 rounded-lg border bg-slate-50 px-3 py-1.5 text-xs text-muted-foreground sm:flex dark:bg-slate-800"><Search className="h-3.5 w-3.5" />{role === "admin" ? "RGPI Admin" : "RGPI Judge"}</div>
            <span className="text-sm font-bold lg:text-base">{lang === "bn" ? "লোগো প্রতিযোগিতা" : "Logo Contest"}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://tauhidrana.vercel.app" target="_blank" rel="noreferrer" className="hidden text-right text-[11px] leading-tight text-muted-foreground transition hover:text-brand-600 xl:block">
              Made by <strong className="font-extrabold text-foreground">Kazi Tauhid Rana</strong>
              <br /><span className="font-mono">tauhidrana.vercel.app</span>
            </a>
            <LanguageToggle />
            {user && <div className="hidden text-right sm:block"><p className="text-xs font-bold">{user.full_name}</p><p className="text-[11px] muted">{user.email}</p></div>}
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-leaf-500 text-xs font-extrabold text-white">{(user?.full_name ?? "U").slice(0, 1).toUpperCase()}</div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
