"use client";

import { ScrollText } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { AuditLog } from "@/lib/types";

export function AuditLogView({ logs }: { logs: AuditLog[] }) {
  const { lang } = useI18n();
  return (
    <>
      <PageHeader title={lang === "bn" ? "অডিট লগ" : "Audit log"} subtitle={lang === "bn" ? "গুরুত্বপূর্ণ অ্যাডমিন actions" : "Important admin actions"} />
      {logs.length ? (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col gap-2 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800"><ScrollText className="h-4 w-4" /></div>
                <div><p className="font-mono text-sm font-bold">{log.action}</p><p className="text-xs muted">{log.target ?? "—"} {log.actor_email ? `· ${log.actor_email}` : ""}</p></div>
              </div>
              <div className="flex items-center gap-3"><Badge variant="outline">{formatDateTime(log.created_at, lang === "bn" ? "bn-BD" : "en-US")}</Badge></div>
            </div>
          ))}
        </div>
      ) : <EmptyState title={lang === "bn" ? "কোনো লগ নেই" : "No log entries"} desc={lang === "bn" ? "অ্যাডমিন actions এখানে রেকর্ড হবে।" : "Admin actions will be recorded here."} />}
    </>
  );
}
