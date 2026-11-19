"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Loader2, Hash, Phone, CheckCircle2, Clock3, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusMeta, formatDateTime } from "@/lib/utils";
import type { TrackResult, SubmissionStatus } from "@/lib/types";

const icons: Record<string, typeof CheckCircle2> = {
  submitted: Clock3, under_review: Clock3, shortlisted: CheckCircle2,
  winner: Trophy, first_runner_up: Trophy, second_runner_up: Trophy, rejected: XCircle,
};

export function TrackPage() {
  const { t, lang } = useI18n();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? (lang === "bn" ? "পাওয়া যায়নি" : "Not found"));
        return;
      }
      setResult(data.result);
    } catch {
      toast.error(lang === "bn" ? "নেটওয়ার্ক ত্রুটি" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const meta = result ? statusMeta(result.status, lang) : null;
  const Icon = result ? icons[result.status] ?? Clock3 : Clock3;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 dark:bg-slate-950/40">
      <SiteHeader />
      <main className="container-pad flex flex-1 items-center justify-center py-14">
        <div className="w-full max-w-xl">
          <div className="text-center"><h1 className="text-3xl font-extrabold sm:text-4xl">{t("track.title")}</h1><p className="mt-2 muted">{t("track.desc")}</p></div>
          <Card className="mt-8 shadow-soft">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={check} className="space-y-5">
                <div className="space-y-2">
                  <Label>{t("track.id")}</Label>
                  <div className="relative"><Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="RGPI-LOGO-0001" className="pl-9 font-mono" required /></div>
                </div>
                <div className="space-y-2">
                  <Label>{t("track.phone")}</Label>
                  <div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="pl-9" required /></div>
                </div>
                <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {t("track.button")}
                </Button>
              </form>

              {result && (
                <motion.div initial={{ opacity: 1, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-7 rounded-2xl border bg-slate-50 p-6 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm dark:bg-slate-800"><Icon className="h-5 w-5" /></div>
                      <div><p className="text-xs muted">{t("track.id")}</p><p className="font-mono font-bold">{result.submission_code}</p></div>
                    </div>
                    <Badge variant={meta?.tone as "blue"}>{meta?.label}</Badge>
                  </div>
                  <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                    <div className="flex justify-between"><span className="muted">{lang === "bn" ? "লোগো" : "Logo"}</span><strong>{result.logo_title ?? "—"}</strong></div>
                    <div className="flex justify-between"><span className="muted">{lang === "bn" ? "জমার সময়" : "Submitted"}</span><strong>{formatDateTime(result.created_at, lang === "bn" ? "bn-BD" : "en-US")}</strong></div>
                  </div>
                  <div className="mt-5 rounded-xl bg-brand-50 p-3 text-center text-xs text-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
                    {lang === "bn" ? "ফলাফল প্রকাশিত হলে বিজয়ীদের নাম দেখা যাবে।" : "Winners will be announced on the Results page."}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
          <p className="mt-5 text-center text-sm muted"><Link href="/submit" className="font-semibold text-brand-600 hover:underline">{t("nav.submit")} →</Link></p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
