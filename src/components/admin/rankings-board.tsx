"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Medal, Award, Crown, ListChecks, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPublicImageUrl } from "@/lib/storage";
import type { ContestSettings } from "@/lib/types";
import type { RankedSubmission } from "@/lib/judging";

type WinnerKey = keyof ContestSettings["winners"];

export function RankingsBoard({ rankings, settings }: { rankings: RankedSubmission[]; settings: ContestSettings }) {
  const { lang } = useI18n();
  const router = useRouter();
  const [winners, setWinners] = useState(settings.winners);
  const [busy, setBusy] = useState(false);

  async function shortlist() {
    setBusy(true);
    try {
      const ids = rankings.slice(0, settings.shortlist_count).map((r) => r.submission.id);
      const res = await fetch("/api/admin/submissions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids, action: "status", status: "shortlisted" }) });
      if (!res.ok) throw new Error("ত্রুটি");
      toast.success(lang === "bn" ? `${ids.length}টি শর্টলিস্ট হয়েছে` : `${ids.length} shortlisted`);
      router.refresh();
    } catch { toast.error("ত্রুটি"); }
    finally { setBusy(false); }
  }

  async function publish() {
    if (!winners.winner) { toast.error(lang === "bn" ? "আগে বিজয়ী নির্বাচন করুন" : "Select a winner first"); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ winners, publish: true }) });
      if (!res.ok) throw new Error("ত্রুটি");
      toast.success(lang === "bn" ? "ফলাফল প্রকাশিত হয়েছে" : "Results published");
      router.refresh();
    } catch { toast.error("ত্রুটি"); }
    finally { setBusy(false); }
  }

  const labels: { key: WinnerKey; icon: typeof Crown; label: string; tone: string }[] = [
    { key: "winner", icon: Crown, label: lang === "bn" ? "বিজয়ী" : "Winner", tone: "text-amber-500" },
    { key: "first_runner_up", icon: Medal, label: lang === "bn" ? "১ম রানার-আপ" : "1st runner-up", tone: "text-slate-500" },
    { key: "second_runner_up", icon: Award, label: lang === "bn" ? "২য় রানার-আপ" : "2nd runner-up", tone: "text-orange-500" },
  ];

  return (
    <>
      <PageHeader title={lang === "bn" ? "র‍্যাঙ্কিং ও ফলাফল" : "Rankings & results"} subtitle={lang === "bn" ? "গড় স্কোর অনুযায়ী র‍্যাঙ্কিং" : "Ranked by average judge score"} action={
        <>
          <Button variant="outline" size="sm" onClick={shortlist} disabled={busy || !rankings.length}><ListChecks className="h-4 w-4" />{lang === "bn" ? `টপ ${settings.shortlist_count} শর্টলিস্ট` : `Shortlist top ${settings.shortlist_count}`}</Button>
          <Button variant="brand" size="sm" onClick={publish} disabled={busy}><Send className="h-4 w-4" />{lang === "bn" ? "ফলাফল প্রকাশ" : "Publish results"}</Button>
        </>
      } />

      <div className="grid gap-4 sm:grid-cols-3">
        {labels.map(({ key, icon: Icon, label, tone }) => (
          <Card key={key}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2"><Icon className={`h-5 w-5 ${tone}`} /><p className="text-sm font-bold">{label}</p></div>
              <Select value={winners[key] ?? "none"} onValueChange={(v) => setWinners((w) => ({ ...w, [key]: v === "none" ? null : v }))}>
                <SelectTrigger className="mt-3"><SelectValue placeholder={lang === "bn" ? "নির্বাচন করুন" : "Select"} /></SelectTrigger>
                <SelectContent><SelectItem value="none">{lang === "bn" ? "কেউ নয়" : "None"}</SelectItem>{rankings.map((r) => <SelectItem key={r.submission.id} value={r.submission.submission_code}>{r.submission.submission_code} — {r.average.toFixed(2)}</SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>

      {settings.results_published && <div className="mt-4 flex items-center gap-2 rounded-xl border border-leaf-300 bg-leaf-50 p-3 text-sm font-semibold text-leaf-800 dark:border-leaf-800 dark:bg-leaf-950/30 dark:text-leaf-200"><Eye className="h-4 w-4" />{lang === "bn" ? "ফলাফল প্রকাশিত আছে।" : "Results are currently published."} <Link href="/results" className="ml-auto underline">{lang === "bn" ? "দেখুন" : "View"}</Link></div>}

      <Card className="mt-5">
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" />{lang === "bn" ? "র‍্যাঙ্কিং" : "Leaderboard"}</CardTitle></CardHeader>
        <CardContent>
          {rankings.length ? (
            <div className="space-y-2">
              {rankings.map((r, i) => (
                <div key={r.submission.id} className="flex items-center gap-3 rounded-xl border p-2.5">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-slate-300 text-slate-800" : i === 2 ? "bg-orange-300 text-orange-900" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>{i + 1}</span>
                  <img src={getPublicImageUrl(r.submission.jpg_path)} alt="" className="h-11 w-11 rounded-lg border object-cover" />
                  <div className="min-w-0 flex-1"><Link href={`/admin/submissions/${r.submission.id}`} className="block truncate text-sm font-bold hover:text-brand-600">{r.submission.logo_title}</Link><p className="font-mono text-[11px] muted">{r.submission.submission_code} · {r.submission.full_name}</p></div>
                  <Badge variant={r.submission.status === "shortlisted" ? "violet" : "outline"}>{r.average.toFixed(2)} <span className="text-[9px]">/10</span></Badge>
                  <span className="hidden text-xs muted sm:block">{r.judgeCount} {lang === "bn" ? "বিচারক" : "judges"}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState title={lang === "bn" ? "এখনো র‍্যাঙ্কিং নেই" : "No rankings yet"} desc={lang === "bn" ? "বিচারকরা স্কোর জমা দিলে এখানে দেখা যাবে।" : "Rankings appear once judges submit scores."} />}
        </CardContent>
      </Card>
    </>
  );
}
