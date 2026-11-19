"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ImageOff, Maximize2, ChevronLeft, ChevronRight, Trophy, User,
  Building2, GraduationCap, Hash, CalendarDays, ArrowRight,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ContestLogo } from "@/components/shared/contest-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getPublicImageUrl } from "@/lib/storage";
import { formatDate, statusMeta } from "@/lib/utils";
import type { Submission } from "@/lib/types";

export function GalleryPage({ visible, submissions }: { visible: boolean; submissions: Submission[] }) {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<number | null>(null);

  function move(dir: number) {
    if (active === null) return;
    setActive((active + dir + submissions.length) % submissions.length);
  }

  const current = active !== null ? submissions[active] : null;

  return (
    <div className="flex min-h-screen flex-col bg-dots">
      <SiteHeader />
      <main className="container-pad flex-1 py-12 sm:py-16">
        <div className="text-center">
          <span className="pill-outline bg-sun-100"><Trophy className="h-4 w-4" /> {lang === "bn" ? "অংশগ্রহণকারীদের কাজ" : "Participants' work"}</span>
          <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl"><span className="highlight">{t("gallery.title")}</span></h1>
          <p className="mt-3 muted">{t("gallery.desc")}</p>
        </div>

        {!visible || submissions.length === 0 ? (
          <div className="sticker mx-auto mt-14 max-w-lg px-6 py-12 text-center">
            <div className="mx-auto w-40 rotate-[-4deg]"><ContestLogo variant="compact" /></div>
            <div className="mx-auto mt-4 grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-ink bg-sun-100 text-ink shadow-[3px_3px_0_0_#0E2F33]"><ImageOff className="h-7 w-7" /></div>
            <h2 className="mt-5 text-2xl font-extrabold text-ink dark:text-foreground">{visible ? t("common.empty") : t("gallery.private")}</h2>
            <p className="mt-2 muted">{visible ? (lang === "bn" ? "বিচার শেষ হলে লোগোগুলো এখানে দেখা যাবে।" : "Logos will appear here after judging.") : t("gallery.privateDesc")}</p>
            <Button asChild variant="brand" className="mt-6"><Link href="/submit">{t("hero.cta")} <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 1, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.04 }}
                onClick={() => setActive(i)}
                className="sticker sticker-hover group overflow-hidden text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-ink bg-slate-100">
                  <img src={getPublicImageUrl(s.jpg_path)} alt={s.logo_title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 grid place-items-center bg-ink/0 opacity-0 transition group-hover:bg-ink/25 group-hover:opacity-100"><Maximize2 className="h-8 w-8 text-white" /></div>
                  {s.status === "winner" && <span className="absolute left-3 top-3"><Badge className="border-2 border-ink bg-sun-300 text-ink"><Trophy className="mr-1 h-3 w-3" />{statusMeta(s.status, lang).label}</Badge></span>}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-extrabold text-ink">{s.logo_title}</p>
                    <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[10px] font-bold text-ink">{s.submission_code}</span>
                  </div>
                  <div className="mt-3 space-y-1.5 border-t-2 border-dashed border-ink/15 pt-3 text-xs">
                    <p className="flex items-center gap-2 font-bold text-ink"><User className="h-3.5 w-3.5 text-brand-600" />{s.full_name}</p>
                    <p className="flex items-center gap-2 muted"><Building2 className="h-3.5 w-3.5 text-leaf-600" />{lang === "bn" ? s.department?.name_bn : s.department?.name_en ?? "—"}</p>
                    <p className="flex items-center gap-2 muted"><GraduationCap className="h-3.5 w-3.5 text-sun-600" />{lang === "bn" ? "সেমিস্টার" : "Semester"}: {s.semester} · {lang === "bn" ? "রোল" : "Roll"}: {s.roll}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl border-[3px] border-ink p-3 shadow-[7px_7px_0_0_#0E2F33] sm:p-5">
          {current && (
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden rounded-2xl border-[3px] border-ink bg-slate-100">
                <img src={getPublicImageUrl(current.jpg_path)} alt={current.logo_title} className="aspect-square w-full object-contain" />
                <button type="button" onClick={() => move(-1)} className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0E2F33]" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={() => move(1)} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0E2F33]" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
              </div>
              <div className="flex flex-col p-1">
                <DialogTitle className="text-2xl font-extrabold text-ink">{current.logo_title}</DialogTitle>
                <p className="mt-1 font-mono text-xs muted">{current.submission_code}</p>
                <div className="mt-3"><Badge variant={statusMeta(current.status, lang).tone as "blue"}>{statusMeta(current.status, lang).label}</Badge></div>

                <div className="mt-5 rounded-2xl border-[3px] border-ink bg-sun-50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-ink">{lang === "bn" ? "জমা দিয়েছেন" : "Submitted by"}</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-extrabold text-ink"><User className="h-5 w-5" />{current.full_name}</p>
                  <div className="mt-3 space-y-2 text-sm text-ink">
                    <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-600" />{lang === "bn" ? current.department?.name_bn : current.department?.name_en ?? "—"}</p>
                    <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-leaf-600" />{lang === "bn" ? "সেমিস্টার" : "Semester"}: {current.semester} · {lang === "bn" ? "সেশন" : "Session"}: {current.session}</p>
                    <p className="flex items-center gap-2"><Hash className="h-4 w-4 text-sun-600" />{lang === "bn" ? "রোল" : "Roll"}: {current.roll}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-ink" />{formatDate(current.created_at, lang === "bn" ? "bn-BD" : "en-US")}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs font-extrabold uppercase tracking-wide muted">{lang === "bn" ? "ডিজাইনের ধারণা" : "Concept"}</p>
                <p className="mt-1 flex-1 overflow-y-auto text-sm leading-relaxed">{current.concept}</p>
                <Button asChild variant="outline" size="sm" className="mt-4"><Link href="/submit">{lang === "bn" ? "নিজের লোগো জমা দিন" : "Submit your own"}</Link></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
