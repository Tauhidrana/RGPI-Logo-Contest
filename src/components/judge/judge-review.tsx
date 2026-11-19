"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Save, Send, Gavel, EyeOff, Eye, Loader2,
  CheckCircle2, Star, LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { getPublicImageUrl } from "@/lib/storage";
import { computeTotal } from "@/lib/judging-shared";
import type { ScoringWeights, Score, Submission } from "@/lib/types";

const CRITERIA: { key: keyof ScoringWeights; bn: string; en: string }[] = [
  { key: "creativity", bn: "সৃজনশীলতা", en: "Creativity" },
  { key: "theme", bn: "থিমের প্রাসঙ্গিকতা", en: "Theme relevance" },
  { key: "simplicity", bn: "সরলতা ও স্কেলেবিলিটি", en: "Simplicity & scalability" },
  { key: "color_typography", bn: "রঙ ও টাইপোগ্রাফি", en: "Colour & typography" },
  { key: "required_text", bn: "বাধ্যতামূলক লেখা", en: "Use of required text" },
];

type Values = Record<keyof ScoringWeights, number> & { comment: string };

export function JudgeReview({ submissions, initialScores, anonymous, weights, locked, judgeId, startIndex = 0 }: {
  submissions: Submission[];
  initialScores: Record<string, Score>;
  anonymous: boolean;
  weights: ScoringWeights;
  locked: boolean;
  judgeId: string;
  startIndex?: number;
}) {
  const { lang } = useI18n();
  const router = useRouter();
  const [index, setIndex] = useState(startIndex);
  const [scores, setScores] = useState(initialScores);
  const [values, setValues] = useState<Values>(() => blank());
  const [busy, setBusy] = useState(false);

  const current = submissions[index];
  const reviewed = Object.values(scores).filter((s) => s.is_final).length;
  const pct = submissions.length ? Math.round((reviewed / submissions.length) * 100) : 0;

  function blank(): Values {
    return { creativity: 8, theme: 8, simplicity: 8, color_typography: 8, required_text: 8, comment: "" };
  }

  useEffect(() => {
    if (!current) return;
    const s = scores[current.id];
    setValues(s ? {
      creativity: s.creativity, theme: s.theme, simplicity: s.simplicity,
      color_typography: s.color_typography, required_text: s.required_text,
      comment: s.comment,
    } : blank());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const total = useMemo(() => computeTotal(values, weights), [values, weights]);

  async function save(is_final: boolean) {
    if (!current) return;
    setBusy(true);
    try {
      const res = await fetch("/api/judge/score", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: current.id, ...values, is_final }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScores((s) => ({ ...s, [current.id]: data.score }));
      toast.success(is_final ? (lang === "bn" ? "চূড়ান্ত স্কোর জমা দেওয়া হয়েছে" : "Final score submitted") : (lang === "bn" ? "ড্রাফট সংরক্ষিত" : "Draft saved"));
      if (is_final && index < submissions.length - 1) setIndex(index + 1);
      router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
    finally { setBusy(false); }
  }

  if (!current) {
    return <><PageHeader title={lang === "bn" ? "পর্যালোচনা" : "Review"} /><Card><CardContent className="py-16 text-center text-muted-foreground">{lang === "bn" ? "পর্যালোচনার জন্য কোনো লোগো নেই" : "No logos to review"}</CardContent></Card></>;
  }

  const s = scores[current.id];

  return (
    <>
      <PageHeader title={lang === "bn" ? "লোগো পর্যালোচনা" : "Review logos"} subtitle={lang === "bn" ? "প্রতিটি মানদণ্ডে ১–১০ নম্বর দিন" : "Score each criterion from 1–10"} action={
        <Button asChild variant="outline" size="sm"><a href="/judge/submissions"><LayoutGrid className="h-4 w-4" />{lang === "bn" ? "সব লোগো" : "All logos"}</a></Button>
      } />

      <Card className="mb-5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">{lang === "bn" ? "আপনার অগ্রগতি" : "Your progress"}</span>
            <span className="muted">{reviewed} / {submissions.length} {lang === "bn" ? "পর্যালোচিত" : "reviewed"}</span>
          </div>
          <Progress value={pct} indicatorClassName="bg-gradient-to-r from-brand-500 to-leaf-500" className="mt-2" />
        </CardContent>
      </Card>

      {locked && <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{lang === "bn" ? "বিচার লক করা হয়েছে। আপনি নতুন স্কোর জমা দিতে পারবেন না।" : "Judging is locked. You can no longer submit scores."}</div>}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-mono text-base">{current.submission_code}</CardTitle>
            <Badge variant={anonymous ? "amber" : "blue"}>{anonymous ? <><EyeOff className="mr-1 h-3 w-3" />{lang === "bn" ? "অজ্ঞাত" : "Anonymous"}</> : <><Eye className="mr-1 h-3 w-3" />{lang === "bn" ? "নাম প্রকাশ" : "Identified"}</>}</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border bg-slate-100 p-3 dark:bg-slate-800">
              <img src={getPublicImageUrl(current.jpg_path)} alt={current.logo_title} className="mx-auto max-h-[460px] w-full object-contain" />
            </div>
            {!anonymous && <div className="mt-4"><p className="font-bold">{current.full_name}</p><p className="text-sm muted">{lang === "bn" ? current.department?.name_bn : current.department?.name_en} · {current.logo_title}</p></div>}
            <p className="mt-3 text-sm leading-relaxed"><span className="font-bold muted">{lang === "bn" ? "ধারণা: " : "Concept: "}</span>{current.concept}</p>
            <div className="mt-5 flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeft className="h-4 w-4" />{lang === "bn" ? "আগেরটি" : "Previous"}</Button>
              <span className="text-xs muted">{index + 1} / {submissions.length}</span>
              <Button variant="outline" size="sm" disabled={index >= submissions.length - 1} onClick={() => setIndex(index + 1)}>{lang === "bn" ? "পরবর্তী" : "Next"}<ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5 text-brand-500" />{lang === "bn" ? "স্কোরিং" : "Scoring"}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {CRITERIA.map((c) => (
              <div key={c.key} className="space-y-2">
                <div className="flex items-center justify-between"><Label>{lang === "bn" ? c.bn : c.en} <span className="text-[10px] muted">({weights[c.key]}%)</span></Label><Badge variant="blue">{values[c.key]}/10</Badge></div>
                <Input type="range" min={1} max={10} step={1} value={values[c.key]} onChange={(e) => setValues((v) => ({ ...v, [c.key]: Number(e.target.value) }))} className="h-2 cursor-pointer p-0" />
              </div>
            ))}

            <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-brand-50 to-leaf-50 p-4 dark:from-brand-950/40 dark:to-leaf-950/40">
              <span className="font-bold">{lang === "bn" ? "মোট স্কোর" : "Total score"}</span>
              <span className="flex items-center gap-1 text-2xl font-extrabold text-brand-700 dark:text-brand-300"><Star className="h-5 w-5 fill-amber-400 text-amber-400" />{total.toFixed(2)} <span className="text-sm font-normal muted">/10</span></span>
            </div>

            <div className="space-y-2"><Label>{lang === "bn" ? "সামগ্রিক মন্তব্য" : "Overall comment"}</Label><Textarea rows={4} value={values.comment} onChange={(e) => setValues((v) => ({ ...v, comment: e.target.value }))} placeholder={lang === "bn" ? "আপনার মতামত লিখুন…" : "Write your feedback…"} /></div>

            {s && <div className="flex items-center gap-2 text-xs muted"><CheckCircle2 className="h-4 w-4 text-leaf-500" />{s.is_final ? (lang === "bn" ? "আপনি এই লোগোতে চূড়ান্ত স্কোর দিয়েছেন" : "You have submitted a final score") : (lang === "bn" ? "এখানে ড্রাফট আছে" : "A draft exists here")}</div>}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => save(false)} disabled={busy || locked}><Save className="h-4 w-4" />{lang === "bn" ? "ড্রাফট" : "Draft"}</Button>
              <Button variant="brand" onClick={() => save(true)} disabled={busy || locked}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{lang === "bn" ? "চূড়ান্ত দিন" : "Final submit"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
