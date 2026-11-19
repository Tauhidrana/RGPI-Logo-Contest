"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CalendarDays, Settings2, ListChecks, Palette, Scale, Eye } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { ContestSettings, ScoringWeights } from "@/lib/types";

export function SettingsForm({ settings }: { settings: ContestSettings }) {
  const { lang } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState<ContestSettings>(settings);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ContestSettings>(k: K, v: ContestSettings[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setWeight = (k: keyof ScoringWeights, v: number) => setForm((f) => ({ ...f, scoring_weights: { ...f.scoring_weights, [k]: v } }));

  function toLocalInput(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  async function save() {
    setBusy(true);
    try {
      const payload = { ...form, deadline: new Date(form.deadline).toISOString() };
      const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(lang === "bn" ? "সেটিংস সংরক্ষিত হয়েছে" : "Settings saved");
      router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
    finally { setBusy(false); }
  }

  type BoolKey = "contest_open" | "gallery_visible" | "results_published" | "anonymous_judging" | "judging_locked";
  const toggles: { key: BoolKey; label: { bn: string; en: string }; desc: { bn: string; en: string } }[] = [
    { key: "contest_open", label: { bn: "প্রতিযোগিতা খোলা", en: "Contest open" }, desc: { bn: "বন্ধ করলে জমা ফর্ম বন্ধ হয়ে যাবে।", en: "Closing disables the submission form." } },
    { key: "gallery_visible", label: { bn: "গ্যালারি প্রকাশ", en: "Publish gallery" }, desc: { bn: "নির্বাচিত লোগোসহ গ্যালারি প্রকাশ করুন।", en: "Show selected logos to the public." } },
    { key: "results_published", label: { bn: "ফলাফল প্রকাশ", en: "Publish results" }, desc: { bn: "ফলাফল পেইজে বিজয়ী দেখানো হবে।", en: "Show winners on the results page." } },
    { key: "anonymous_judging", label: { bn: "অজ্ঞাত বিচার", en: "Anonymous judging" }, desc: { bn: "বিচারকরা শিক্ষার্থীর নাম দেখবেন না।", en: "Judges won't see student identities." } },
    { key: "judging_locked", label: { bn: "বিচার লক করুন", en: "Lock judging" }, desc: { bn: "লক করলে বিচারকরা স্কোর সম্পাদনা করতে পারবেন না।", en: "Judges can no longer edit scores." } },
  ];

  return (
    <>
      <PageHeader title={lang === "bn" ? "প্রতিযোগিতার সেটিংস" : "Contest settings"} subtitle={lang === "bn" ? "সময়, নিয়ম, সীমা ও প্রকাশ নিয়ন্ত্রণ" : "Deadline, rules, limits and visibility"} action={<Button variant="brand" onClick={save} disabled={busy}><Save className="h-4 w-4" />{lang === "bn" ? "সব সংরক্ষণ" : "Save all"}</Button>} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-brand-500" />{lang === "bn" ? "সময় ও সীমা" : "Time & limits"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>{lang === "bn" ? "শেষ সময় (Asia/Dhaka)" : "Deadline (Asia/Dhaka)"}</Label><Input type="datetime-local" value={toLocalInput(form.deadline)} onChange={(e) => set("deadline", new Date(e.target.value).toISOString())} /></div>
            <div className="space-y-2"><Label>{lang === "bn" ? "প্রতি ব্যক্তির সর্বোচ্চ সাবমিশন" : "Max submissions per person"}</Label><Input type="number" min={1} max={20} value={form.max_submissions_per_person} onChange={(e) => set("max_submissions_per_person", Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>{lang === "bn" ? "শর্টলিস্ট সংখ্যা" : "Shortlist count"}</Label><Input type="number" min={1} max={50} value={form.shortlist_count} onChange={(e) => set("shortlist_count", Number(e.target.value))} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-leaf-500" />{lang === "bn" ? "প্রকাশ ও নিয়ন্ত্রণ" : "Visibility & controls"}</CardTitle><CardDescription>{lang === "bn" ? "টগল বদলে সাথে সাথে সংরক্ষণ করুন।" : "Toggle and save to apply."}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {toggles.map((t) => (
              <label key={t.key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-3">
                <div><p className="text-sm font-bold">{lang === "bn" ? t.label.bn : t.label.en}</p><p className="text-xs muted">{lang === "bn" ? t.desc.bn : t.desc.en}</p></div>
                <Checkbox checked={form[t.key]} onCheckedChange={(v) => set(t.key, v === true)} />
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-violet-500" />{lang === "bn" ? "নিয়মাবলী" : "Rules"}</CardTitle><CardDescription>{lang === "bn" ? "এক লাইনে একটি নিয়ম লিখুন।" : "One rule per line."}</CardDescription></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>বাংলা</Label><Textarea rows={7} value={form.rules_bn.join("\n")} onChange={(e) => set("rules_bn", e.target.value.split("\n"))} /></div>
            <div className="space-y-2"><Label>English</Label><Textarea rows={7} value={form.rules_en.join("\n")} onChange={(e) => set("rules_en", e.target.value.split("\n"))} /></div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-amber-500" />{lang === "bn" ? "থিম ও ধারণা" : "Theme & concept"}</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2"><Label>{lang === "bn" ? "থিম (বাংলা)" : "Theme (Bangla)"}</Label><Textarea rows={3} value={form.theme_bn} onChange={(e) => set("theme_bn", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang === "bn" ? "ধারণা (বাংলা)" : "Concept (Bangla)"}</Label><Textarea rows={3} value={form.concept_bn} onChange={(e) => set("concept_bn", e.target.value)} /></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Theme (English)</Label><Textarea rows={3} value={form.theme_en} onChange={(e) => set("theme_en", e.target.value)} /></div>
              <div className="space-y-2"><Label>Concept (English)</Label><Textarea rows={3} value={form.concept_en} onChange={(e) => set("concept_en", e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-brand-500" />{lang === "bn" ? "স্কোরিং ওজন" : "Scoring weights"}</CardTitle><CardDescription>{lang === "bn" ? "মোট ১০০ হওয়া আবশ্যক নয়; অনুপাত হিসেবে ব্যবহৃত হয়।" : "Need not total 100; used as ratios."}</CardDescription></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-5">
            {(Object.keys(form.scoring_weights) as (keyof ScoringWeights)[]).map((k) => (
              <div key={k} className="space-y-2"><Label className="capitalize">{k.replace("_", " ")}</Label><Input type="number" min={1} max={100} value={form.scoring_weights[k]} onChange={(e) => setWeight(k, Number(e.target.value))} /></div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end"><Button variant="brand" size="lg" onClick={save} disabled={busy} className="shadow-soft"><Save className="h-4 w-4" />{lang === "bn" ? "সব পরিবর্তন সংরক্ষণ করুন" : "Save all changes"}</Button></div>
    </>
  );
}
