"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Eye, Download, FileArchive, Trash2, RotateCcw, ChevronLeft, ChevronRight,
  ArrowUpDown, MoreHorizontal, Check, X, Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getPublicImageUrl } from "@/lib/storage";
import { cn, formatDate, statusMeta } from "@/lib/utils";
import type { Submission, SubmissionStatus } from "@/lib/types";

const STATUSES: SubmissionStatus[] = ["submitted", "under_review", "shortlisted", "winner", "first_runner_up", "second_runner_up", "rejected"];
const PAGE_SIZE = 10;

export function SubmissionsTable({ submissions, averages, scoreCounts }: { submissions: Submission[]; averages: Record<string, number>; scoreCounts: Record<string, number> }) {
  const { lang } = useI18n();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dept, setDept] = useState("all");
  const [score, setScore] = useState("all");
  const [deleted, setDeleted] = useState("active");
  const [sort, setSort] = useState<"newest" | "oldest" | "code" | "score">("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const departments = useMemo(() => {
    const m = new Map<string, string>();
    submissions.forEach((s) => s.department && m.set(s.department.id, lang === "bn" ? s.department.name_bn : s.department.name_en));
    return [...m.entries()];
  }, [submissions, lang]);

  const filtered = useMemo(() => {
    let rows = submissions.filter((s) => {
      if (deleted === "active" && s.is_deleted) return false;
      if (deleted === "deleted" && !s.is_deleted) return false;
      if (status !== "all" && s.status !== status) return false;
      if (dept !== "all" && s.department_id !== dept) return false;
      if (score === "scored" && !scoreCounts[s.id]) return false;
      if (score === "unscored" && scoreCounts[s.id]) return false;
      if (score === "high" && (averages[s.id] ?? 0) < 8) return false;
      if (search) {
        const q = search.toLowerCase();
        if (![s.submission_code, s.full_name, s.email, s.phone, s.roll, s.logo_title].some((v) => v?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sort === "newest") return b.created_at.localeCompare(a.created_at);
      if (sort === "oldest") return a.created_at.localeCompare(b.created_at);
      if (sort === "score") return (averages[b.id] ?? -1) - (averages[a.id] ?? -1);
      return a.submission_code.localeCompare(b.submission_code);
    });
    return rows;
  }, [submissions, deleted, status, dept, score, search, sort, averages, scoreCounts]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function toggle(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  async function bulk(action: "status" | "delete" | "restore", newStatus?: SubmissionStatus) {
    if (!selected.length) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, action, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(lang === "bn" ? `${data.count}টি আপডেট হয়েছে` : `${data.count} updated`);
      setSelected([]);
      router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
    finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title={lang === "bn" ? "সাবমিশন" : "Submissions"} subtitle={`${submissions.length} ${lang === "bn" ? "টি এন্ট্রি" : "entries"}`} action={
        <>
          <Button asChild variant="outline" size="sm"><a href="/api/admin/export/csv"><Download className="h-4 w-4" /> CSV</a></Button>
          <Button asChild variant="outline" size="sm"><a href="/api/admin/export/zip"><FileArchive className="h-4 w-4" /> ZIP</a></Button>
        </>
      } />

      <div className="mb-4 rounded-2xl border bg-card p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative sm:col-span-2"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={lang === "bn" ? "নাম, আইডি, ফোন…" : "Name, ID, phone…"} className="pl-9" /></div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}><SelectTrigger><SelectValue placeholder={lang === "bn" ? "অবস্থা" : "Status"} /></SelectTrigger><SelectContent><SelectItem value="all">{lang === "bn" ? "সব অবস্থা" : "All status"}</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{statusMeta(s, lang).label}</SelectItem>)}</SelectContent></Select>
          <Select value={dept} onValueChange={(v) => { setDept(v); setPage(1); }}><SelectTrigger><SelectValue placeholder={lang === "bn" ? "বিভাগ" : "Department"} /></SelectTrigger><SelectContent><SelectItem value="all">{lang === "bn" ? "সব বিভাগ" : "All departments"}</SelectItem>{departments.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent></Select>
          <Select value={score} onValueChange={(v) => { setScore(v); setPage(1); }}><SelectTrigger><SelectValue placeholder={lang === "bn" ? "স্কোর" : "Score"} /></SelectTrigger><SelectContent><SelectItem value="all">{lang === "bn" ? "সব স্কোর" : "All scores"}</SelectItem><SelectItem value="scored">{lang === "bn" ? "স্কোর করা" : "Scored"}</SelectItem><SelectItem value="unscored">{lang === "bn" ? "অস্কোর করা" : "Unscored"}</SelectItem><SelectItem value="high">≥ 8</SelectItem></SelectContent></Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">{lang === "bn" ? "নতুন আগে" : "Newest"}</SelectItem><SelectItem value="oldest">{lang === "bn" ? "পুরোনো আগে" : "Oldest"}</SelectItem><SelectItem value="code">{lang === "bn" ? "আইডি অনুসারে" : "By ID"}</SelectItem><SelectItem value="score">{lang === "bn" ? "স্কোর অনুসারে" : "By score"}</SelectItem></SelectContent></Select>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2 text-xs muted"><Filter className="h-3.5 w-3.5" />{filtered.length} {lang === "bn" ? "টি ফলাফল" : "results"}</div>
          <div className="flex items-center gap-2">
            <Select value={deleted} onValueChange={(v) => { setDeleted(v); setPage(1); }}><SelectTrigger className="h-9 w-36 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">{lang === "bn" ? "সক্রিয়" : "Active"}</SelectItem><SelectItem value="deleted">{lang === "bn" ? "মুছে ফেলা" : "Deleted"}</SelectItem></SelectContent></Select>
            {selected.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" size="sm">{selected.length} {lang === "bn" ? "নির্বাচিত" : "selected"} <MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{lang === "bn" ? "অবস্থা বদলান" : "Change status"}</DropdownMenuLabel>
                  {STATUSES.map((s) => <DropdownMenuItem key={s} disabled={busy} onClick={() => bulk("status", s)}>{statusMeta(s, lang).label}</DropdownMenuItem>)}
                  <DropdownMenuItem disabled={busy} onClick={() => bulk(deleted === "deleted" ? "restore" : "delete")}>
                    {deleted === "deleted" ? <><RotateCcw className="h-4 w-4" />{lang === "bn" ? "রিস্টোর" : "Restore"}</> : <><Trash2 className="h-4 w-4" />{lang === "bn" ? "মুছুন" : "Delete"}</>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="w-10"><Checkbox checked={rows.length > 0 && rows.every((r) => selected.includes(r.id))} onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])} /></TableHead>
            <TableHead>{lang === "bn" ? "লোগো" : "Logo"}</TableHead>
            <TableHead>{lang === "bn" ? "সাবমিশন" : "Submission"}</TableHead>
            <TableHead>{lang === "bn" ? "বিভাগ" : "Department"}</TableHead>
            <TableHead>{lang === "bn" ? "অবস্থা" : "Status"}</TableHead>
            <TableHead><span className="inline-flex items-center gap-1">{lang === "bn" ? "স্কোর" : "Score"}<ArrowUpDown className="h-3 w-3" /></span></TableHead>
            <TableHead>{lang === "bn" ? "তারিখ" : "Date"}</TableHead>
            <TableHead />
          </TableRow></TableHeader>
          <TableBody>
            {rows.map((s) => {
              const m = statusMeta(s.status, lang);
              return (
                <TableRow key={s.id} className={cn(s.is_deleted && "opacity-60")}>
                  <TableCell><Checkbox checked={selected.includes(s.id)} onCheckedChange={() => toggle(s.id)} /></TableCell>
                  <TableCell><Link href={`/admin/submissions/${s.id}`}><img src={getPublicImageUrl(s.jpg_path)} alt="" className="h-11 w-11 rounded-lg border object-cover" /></Link></TableCell>
                  <TableCell><Link href={`/admin/submissions/${s.id}`} className="hover:text-brand-600"><p className="font-bold">{s.logo_title}</p><p className="font-mono text-[11px] muted">{s.submission_code}</p><p className="text-[11px] muted">{s.full_name}</p></Link></TableCell>
                  <TableCell className="text-xs">{lang === "bn" ? s.department?.name_bn : s.department?.name_en ?? "—"}</TableCell>
                  <TableCell><Badge variant={m.tone as "blue"}>{m.label}</Badge></TableCell>
                  <TableCell>{scoreCounts[s.id] ? <span className="font-bold">{averages[s.id]?.toFixed(2)} <span className="text-[10px] font-normal muted">({scoreCounts[s.id]})</span></span> : <span className="muted">—</span>}</TableCell>
                  <TableCell className="text-xs muted">{formatDate(s.created_at, lang === "bn" ? "bn-BD" : "en-US")}</TableCell>
                  <TableCell><Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link href={`/admin/submissions/${s.id}`}><Eye className="h-4 w-4" /></Link></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {rows.length === 0 && <div className="py-16 text-center text-sm muted">{lang === "bn" ? "কোনো সাবমিশন পাওয়া যায়নি" : "No submissions found"}</div>}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs muted">{lang === "bn" ? "পৃষ্ঠা" : "Page"} {current} / {pages}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" disabled={current >= pages} onClick={() => setPage(current + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </>
  );
}
