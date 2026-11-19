"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Charts = dynamic(() => import("./charts"), { ssr: false });
import {
  Files, Clock3, ListChecks, Users, CalendarDays, ArrowRight, Gavel,
  Download, ShieldCheck, HardDrive,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fileSizeLabel, formatDateTime } from "@/lib/utils";
import type { ContestSettings } from "@/lib/types";

type Stats = {
  total: number; pending: number; shortlisted: number;
  byStatus: Record<string, number>;
  byDepartment: { name: string; count: number }[];
  byDay: { date: string; count: number }[];
  judgeProgress: { id: string; name: string; reviewed: number; total: number }[];
};

type Storage = { jpg_bytes: number; jpg_files: number; ai_bytes: number; ai_files: number };
const FREE_STORAGE = 1024 * 1024 * 1024; // 1 GB on Supabase Free

export function AdminDashboard({ stats, settings, storage }: { stats: Stats; settings: ContestSettings; storage: Storage }) {
  const { lang } = useI18n();
  const used = storage.jpg_bytes + storage.ai_bytes;
  const usedPct = Math.min(100, Math.round((used / FREE_STORAGE) * 100));
  const open = settings.contest_open && new Date(settings.deadline).getTime() > Date.now();

  return (
    <>
      <PageHeader
        title={lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
        subtitle={lang === "bn" ? "প্রতিযোগিতার সামগ্রিক চিত্র" : "Contest overview at a glance"}
        action={
          <>
            <Button asChild variant="outline" size="sm"><a href="/api/admin/export/csv"><Download className="h-4 w-4" /> CSV</a></Button>
            <Button asChild variant="outline" size="sm"><a href="/api/admin/export/zip"><Download className="h-4 w-4" /> ZIP</a></Button>
            <Button asChild variant="brand" size="sm"><Link href="/admin/settings"><ShieldCheck className="h-4 w-4" />{lang === "bn" ? "সেটিংস" : "Settings"}</Link></Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={lang === "bn" ? "মোট সাবমিশন" : "Total submissions"} value={stats.total} icon={Files} tone="brand" />
        <StatCard label={lang === "bn" ? "পেন্ডিং" : "Pending"} value={stats.pending} icon={Clock3} tone="amber" />
        <StatCard label={lang === "bn" ? "শর্টলিস্ট" : "Shortlisted"} value={stats.shortlisted} icon={ListChecks} tone="violet" />
        <StatCard label={lang === "bn" ? "বিচারক" : "Judges"} value={stats.judgeProgress.length} icon={Users} tone="leaf" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Suspense fallback={<div className="col-span-full grid h-72 place-items-center rounded-2xl border bg-card text-sm muted">Loading…</div>}>
          <Charts stats={stats} lang={lang} />
        </Suspense>

        <Card>
          <CardHeader><CardTitle>{lang === "bn" ? "বিচারকের অগ্রগতি" : "Judge progress"}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {stats.judgeProgress.length ? stats.judgeProgress.map((j) => {
              const pct = j.total ? Math.round((j.reviewed / j.total) * 100) : 0;
              return (
                <div key={j.id}>
                  <div className="mb-1.5 flex justify-between text-sm"><span className="font-semibold">{j.name}</span><span className="muted">{j.reviewed}/{j.total}</span></div>
                  <Progress value={pct} indicatorClassName="bg-gradient-to-r from-brand-500 to-leaf-500" />
                </div>
              );
            }) : <EmptyState title={lang === "bn" ? "কোনো বিচারক নেই" : "No judges yet"} />}
            <div className="rounded-xl border border-dashed p-3 text-center text-xs muted">
              {lang === "bn" ? "বিচারক ব্যবস্থাপনায় যান" : "Manage judges"}<br />
              <Link href="/admin/judges" className="mt-1 inline-flex items-center gap-1 font-bold text-brand-600">{lang === "bn" ? "এখানে ক্লিক করুন" : "Click here"} <ArrowRight className="h-3 w-3" /></Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ${open ? "bg-leaf-100 text-leaf-700 dark:bg-leaf-900/40" : "bg-red-100 text-red-700 dark:bg-red-900/40"}`}><CalendarDays className="h-5 w-5" /></div>
            <div><p className="text-sm font-bold">{lang === "bn" ? "জমার সময়" : "Submission window"}</p><p className="text-xs muted">{formatDateTime(settings.deadline, lang === "bn" ? "bn-BD" : "en-US")}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={open ? "green" : "red"}>{open ? (lang === "bn" ? "খোলা" : "Open") : (lang === "bn" ? "বন্ধ" : "Closed")}</Badge>
            {settings.judging_locked && <Badge variant="amber"><Gavel className="mr-1 h-3 w-3" />{lang === "bn" ? "বিচার লক" : "Judging locked"}</Badge>}
            <Button asChild variant="outline" size="sm"><Link href="/admin/rankings"><ArrowRight className="h-4 w-4" />{lang === "bn" ? "র‍্যাঙ্কিং" : "Rankings"}</Link></Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><HardDrive className="h-5 w-5 text-brand-600" />{lang === "bn" ? "স্টোরেজ ব্যবহার" : "Storage usage"}</CardTitle>
          <Badge variant={usedPct >= 80 ? "red" : "green"}>{fileSizeLabel(used)} / 1 GB · {usedPct}%</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex justify-between text-xs"><span className="font-bold">JPG · {storage.jpg_files} {lang === "bn" ? "টি ফাইল" : "files"}</span><span className="muted">{fileSizeLabel(storage.jpg_bytes)}</span></div>
            <Progress value={Math.min(100, (storage.jpg_bytes / FREE_STORAGE) * 100)} indicatorClassName="bg-brand-500" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs"><span className="font-bold">AI · {storage.ai_files} {lang === "bn" ? "টি ফাইল" : "files"}</span><span className="muted">{fileSizeLabel(storage.ai_bytes)}</span></div>
            <Progress value={Math.min(100, (storage.ai_bytes / FREE_STORAGE) * 100)} indicatorClassName="bg-leaf-500" />
          </div>
          <p className="text-xs muted sm:col-span-2">{lang === "bn" ? "Supabase Free প্ল্যানে মোট ১ GB ফাইল স্টোরেজ available। ৮০%-এ পৌঁছালে প্ল্যান আপগ্রেড বা পুরোনো ফাইল পরিষ্কারের কথা ভাবুন।" : "Supabase Free includes 1 GB of file storage. Consider upgrading or cleaning old files at 80%."}</p>
        </CardContent>
      </Card>
    </>
  );
}