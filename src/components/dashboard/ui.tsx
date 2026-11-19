"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>{subtitle && <p className="mt-1 text-sm muted">{subtitle}</p>}</div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "brand", hint }: { label: string; value: string | number; icon: typeof Inbox; tone?: "brand" | "leaf" | "amber" | "violet" | "slate"; hint?: string }) {
  const tones = {
    brand: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
    leaf: "bg-leaf-100 text-leaf-700 dark:bg-leaf-900/40 dark:text-leaf-200",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
    slate: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  };
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-wide muted">{label}</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{value}</p></div>
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl", tones[tone])}><Icon className="h-5 w-5" /></div>
      </div>
      {hint && <p className="mt-2 text-xs muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800"><Inbox className="h-7 w-7" /></div>
      <p className="mt-4 font-bold">{title}</p>
      {desc && <p className="mt-1 max-w-sm text-sm muted">{desc}</p>}
    </div>
  );
}
