"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Download, ZoomIn, Save, Trash2, RotateCcw, Star, User,
  FileText, MessageSquare, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getPublicImageUrl } from "@/lib/storage";
import { formatDateTime, statusMeta } from "@/lib/utils";
import type { ScoringWeights, Score, Submission, SubmissionStatus } from "@/lib/types";

const STATUSES: SubmissionStatus[] = ["submitted", "under_review", "shortlisted", "winner", "first_runner_up", "second_runner_up", "rejected"];

async function openFile(path: string, bucket: "jpg" | "ai", download: boolean) {
  const res = await fetch(`/api/admin/signed-url?path=${encodeURIComponent(path)}&bucket=${bucket}`);
  const data = await res.json();
  if (!res.ok || !data.url) { toast.error("ফাইল খোলা যায়নি"); return; }
  if (download) {
    const a = document.createElement("a");
    a.href = data.url; a.download = path.split("/").pop() ?? "file";
    document.body.appendChild(a); a.click(); a.remove();
  } else window.open(data.url, "_blank", "noopener");
}

export function SubmissionDetail({ submission, scores, weights, anonymous }: { submission: Submission; scores: Score[]; weights: ScoringWeights; anonymous: boolean }) {
  const { lang } = useI18n();
  const router = useRouter();
  const [status, setStatus] = useState(submission.status);
  const [note, setNote] = useState(submission.admin_note ?? "");
  const [zoom, setZoom] = useState(false);
  const [busy, setBusy] = useState(false);

  const meta = statusMeta(submission.status, lang);
  const info: [string, string | null | undefined][] = [
    [lang === "bn" ? "পুরো নাম" : "Full name", submission.full_name],
    [lang === "bn" ? "বিভাগ" : "Department", lang === "bn" ? submission.department?.name_bn : submission.department?.name_en],
    [lang === "bn" ? "সেমিস্টার" : "Semester", submission.semester],
    [lang === "bn" ? "রোল" : "Roll", submission.roll],
    [lang === "bn" ? "সেশন" : "Session", submission.session],
    ["Phone", submission.phone], ["Email", submission.email],
    [lang === "bn" ? "জমার সময়" : "Submitted", formatDateTime(submission.created_at, lang === "bn" ? "bn-BD" : "en-US")],
  ];

  async function save() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/submission/${submission.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_note: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(lang === "bn" ? "সংরক্ষিত হয়েছে" : "Saved");
      router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
    finally { setBusy(false); }
  }

  async function toggleDelete() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [submission.id], action: submission.is_deleted ? "restore" : "delete" }),
      });
      if (!res.ok) throw new Error("ত্রুটি");
      toast.success(submission.is_deleted ? (lang === "bn" ? "রিস্টোর হয়েছে" : "Restored") : (lang === "bn" ? "মুছে ফেলা হয়েছে" : "Deleted"));
      router.push("/admin/submissions");
      router.refresh();
    } catch { toast.error("ত্রুটি"); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon"><Link href="/admin/submissions"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <div><h1 className="text-2xl font-extrabold">{submission.logo_title}</h1><p className="font-mono text-xs muted">{submission.submission_code}</p></div>
          <Badge variant={meta.tone as "blue"}>{meta.label}</Badge>
          {submission.is_deleted && <Badge variant="red">{lang === "bn" ? "মুছে ফেলা" : "Deleted"}</Badge>}
        </div>
        <Button variant={submission.is_deleted ? "outline" : "destructive"} size="sm" onClick={toggleDelete} disabled={busy}>
          {submission.is_deleted ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}{submission.is_deleted ? (lang === "bn" ? "রিস্টোর" : "Restore") : (lang === "bn" ? "মুছুন" : "Delete")}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader className="flex-row items-center justify-between"><CardTitle>{lang === "bn" ? "লোগো প্রিভিউ" : "Logo preview"}</CardTitle><Button variant="ghost" size="sm" onClick={() => setZoom(true)}><ZoomIn className="h-4 w-4" />{lang === "bn" ? "জুম" : "Zoom"}</Button></CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-2xl border bg-slate-100 p-3 dark:bg-slate-800">
                <img src={getPublicImageUrl(submission.jpg_path)} alt={submission.logo_title} className="mx-auto max-h-96 w-full rounded-xl object-contain" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => openFile(submission.jpg_path, "jpg", true)}><Download className="h-4 w-4" /> JPG</Button>
                {submission.ai_path && <Button variant="outline" size="sm" onClick={() => openFile(submission.ai_path, "ai", true)}><Download className="h-4 w-4" /> AI</Button>}
                <Button variant="outline" size="sm" onClick={() => openFile(submission.jpg_path, "jpg", false)}><ZoomIn className="h-4 w-4" />{lang === "bn" ? "নতুন ট্যাবে" : "New tab"}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand-500" />{lang === "bn" ? "ডিজাইনের ধারণা" : "Design concept"}</CardTitle></CardHeader>
            <CardContent><p className="whitespace-pre-wrap text-sm leading-relaxed">{submission.concept}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" />{lang === "bn" ? "বিচারকের স্কোর" : "Judge scores"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {scores.length ? scores.map((s) => (
                <div key={s.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800"><User className="h-4 w-4" /></div><div><p className="text-sm font-bold">{anonymous ? (lang === "bn" ? `বিচারক ${s.id.slice(-4)}` : `Judge ${s.id.slice(-4)}`) : s.judge?.full_name ?? "Judge"}</p><p className="text-[11px] muted">{s.is_final ? (lang === "bn" ? "চূড়ান্ত" : "Final") : (lang === "bn" ? "ড্রাফট" : "Draft")}</p></div></div>
                    <Badge variant="amber">{s.total.toFixed(2)} / 10</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
                    {([["creativity", "Creativity"], ["theme", "Theme"], ["simplicity", "Simplicity"], ["color_typography", "Colour"], ["required_text", "Text"]] as const).map(([k, label]) => (
                      <div key={k} className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800"><p className="muted">{label} <span className="text-[9px]">({weights[k]}%)</span></p><p className="font-bold">{s[k]}/10</p></div>
                    ))}
                  </div>
                  {s.comment && <div className="mt-3 flex gap-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800"><MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" /><p>{s.comment}</p></div>}
                </div>
              )) : <p className="py-6 text-center text-sm muted">{lang === "bn" ? "এখনো কোনো স্কোর নেই" : "No scores yet"}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>{lang === "bn" ? "শিক্ষার্থীর তথ্য" : "Student information"}</CardTitle></CardHeader>
            <CardContent>
              <dl className="divide-y">
                {info.map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 py-2.5 text-sm"><dt className="muted">{k}</dt><dd className="text-right font-semibold">{v || "—"}</dd></div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{lang === "bn" ? "অ্যাডমিন কন্ট্রোল" : "Admin controls"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>{lang === "bn" ? "অবস্থা" : "Status"}</Label><Select value={status} onValueChange={(v) => setStatus(v as SubmissionStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{statusMeta(s, lang).label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>{lang === "bn" ? "অভ্যন্তরীণ নোট" : "Internal note"}</Label><Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder={lang === "bn" ? "শুধু অ্যাডমিন দেখতে পারবেন…" : "Only admins can see this…"} /></div>
              <Button variant="brand" className="w-full" onClick={save} disabled={busy}><Save className="h-4 w-4" />{lang === "bn" ? "সংরক্ষণ করুন" : "Save changes"}</Button>
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><ShieldAlert className="h-4 w-4 shrink-0" />{lang === "bn" ? "অবস্থা পরিবর্তন সাথে সাথে প্রকাশিত ফলাফলে প্রভাব ফেলতে পারে।" : "Changing status may affect published results."}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-4xl"><DialogTitle className="sr-only">{submission.logo_title}</DialogTitle><img src={getPublicImageUrl(submission.jpg_path)} alt={submission.logo_title} className="mx-auto max-h-[80vh] w-full object-contain" /></DialogContent>
      </Dialog>
    </>
  );
}
