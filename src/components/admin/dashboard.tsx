"use client";

import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import {
  Files, Clock3, ListChecks, Users, CalendarDays, ArrowRight, Gavel,
  Download, TrendingUp, ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDateTime } from "@/lib/utils";
import type { ContestSettings } from "@/lib/types";

type Stats = {
  total: number; pending: number; shortlisted: number;
  byStatus: Record<string, number>;
  byDepartment: { name: string; count: number }[];
  byDay: { date: string; count: number }[];
  judgeProgress: { id: string; name: string; reviewed: number; total: number }[];
};

const PIE_COLORS = ["#337df5", "#f59e0b", "#8b5cf6", "#2b9855", "#ef4444"];

export function AdminDashboard({ stats, settings }: { stats: Stats; settings: ContestSettings }) {
  const { lang } = useI18n();
  const deps = stats.byDepartment.filter((d) => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 8);
  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));
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
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between"><CardTitle>{lang === "bn" ? "দৈনিক সাবমিশন" : "Submissions per day"}</CardTitle><Badge variant="blue"><TrendingUp className="mr-1 h-3 w-3" />{lang === "bn" ? "ট্রেন্ড" : "Trend"}</Badge></CardHeader>
          <CardContent className="h-64">
            {stats.byDay.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.byDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#337df5" stopOpacity={0.4} /><stop offset="100%" stopColor="#337df5" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" stroke="#1e5fdb" strokeWidth={2.5} fill="url(#area)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <EmptyState title={lang === "bn" ? "এখনো ডাটা নেই" : "No data yet"} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{lang === "bn" ? "অবস্থা" : "Status"}</CardTitle></CardHeader>
          <CardContent className="h-64">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3}>
                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState title={lang === "bn" ? "এখনো ডাটা নেই" : "No data yet"} />}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{lang === "bn" ? "বিভাগভিত্তিক সাবমিশন" : "Submissions by department"}</CardTitle></CardHeader>
          <CardContent className="h-72">
            {deps.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deps} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} cursor={{ fill: "#f1f5f9" }} />
                  <Bar dataKey="count" fill="#2b9855" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState title={lang === "bn" ? "এখনো ডাটা নেই" : "No data yet"} />}
          </CardContent>
        </Card>

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
    </>
  );
}
