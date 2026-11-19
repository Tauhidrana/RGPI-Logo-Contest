"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Clock3, Crown, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ContestLogo } from "@/components/shared/contest-logo";
import { getPublicImageUrl } from "@/lib/storage";
import type { Submission } from "@/lib/types";

type Results = {
  winner: Submission | null;
  first_runner_up: Submission | null;
  second_runner_up: Submission | null;
} | null;

export function ResultsPage({ results }: { results: Results }) {
  const { t, lang } = useI18n();

  if (!results) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="container-pad flex flex-1 items-center justify-center bg-dots py-20">
          <div className="sticker max-w-lg px-8 py-12 text-center">
            <div className="mx-auto w-44 rotate-[-3deg]"><ContestLogo variant="compact" /></div>
            <div className="mx-auto mt-4 grid h-14 w-14 place-items-center rounded-2xl border-[3px] border-ink bg-sun-100 text-ink shadow-[3px_3px_0_0_#0E2F33]"><Clock3 className="h-7 w-7" /></div>
            <h1 className="mt-6 text-3xl font-extrabold text-ink dark:text-foreground">{t("results.hidden")}</h1>
            <p className="mt-3 muted">{t("results.hiddenDesc")}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/gallery" className="rounded-xl border-[3px] border-ink bg-brand-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-[3px_3px_0_0_#0E2F33] hover:bg-brand-700">{t("nav.gallery")}</Link>
              <Link href="/" className="rounded-xl border-[3px] border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink shadow-[3px_3px_0_0_#0E2F33] hover:bg-sun-50 dark:bg-card dark:text-foreground">{lang === "bn" ? "হোম" : "Home"}</Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const podium = [
    { key: "first_runner_up" as const, label: t("results.first"), icon: Medal, sub: lang === "bn" ? "দ্বিতীয় স্থান" : "Second place", ring: "ring-slate-300 dark:ring-slate-600", badge: "bg-slate-200 text-slate-700" },
    { key: "winner" as const, label: t("results.winner"), icon: Crown, sub: lang === "bn" ? "প্রথম স্থান" : "First place", ring: "ring-amber-400", badge: "bg-amber-400 text-amber-950" },
    { key: "second_runner_up" as const, label: t("results.second"), icon: Award, sub: lang === "bn" ? "তৃতীয় স্থান" : "Third place", ring: "ring-orange-300 dark:ring-orange-700", badge: "bg-orange-300 text-orange-900" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 dark:bg-slate-950/40">
      <SiteHeader />
      <main className="container-pad flex-1 py-14">
        <div className="text-center">
          <BadgeInline>{lang === "bn" ? "বিচার সমাপ্ত" : "Judging complete"} · 2026</BadgeInline>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl"><span className="heading-gradient">{t("results.title")}</span></h1>
          <p className="mx-auto mt-3 max-w-xl muted">{lang === "bn" ? "আমাদের নতুন লোগো নির্বাচিত হয়েছে। বিজয়ী ও রানার-আপদের অভিনন্দন!" : "Our new logo has been chosen. Congratulations to the winners!"}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl items-end gap-5 sm:grid-cols-3">
          {podium.map((p, i) => {
            const sub = results[p.key];
            const Icon = p.icon;
            return (
              <motion.div key={p.key} initial={{ opacity: 1, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} className={`rounded-3xl border bg-card p-4 shadow-card ${p.key === "winner" ? "sm:-translate-y-6 ring-2 " + p.ring : ""}`}>
                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${p.badge}`}><Icon className="h-3.5 w-3.5" /> {p.label}</div>
                {sub ? (
                  <>
                    <div className="mt-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getPublicImageUrl(sub.jpg_path)} alt={sub.logo_title} className="h-full w-full object-cover" />
                    </div>
                    <h2 className="mt-4 text-lg font-extrabold">{sub.logo_title}</h2>
                    <p className="text-sm muted">{sub.full_name}</p>
                    <p className="mt-1 font-mono text-xs muted">{sub.submission_code}</p>
                  </>
                ) : (
                  <div className="mt-4 grid aspect-square place-items-center rounded-2xl border border-dashed text-center text-sm muted">{p.sub}<br />{lang === "bn" ? "নির্ধারিত হবে" : "TBA"}</div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-3xl border bg-gradient-to-br from-brand-700 to-leaf-700 p-8 text-center text-white shadow-soft">
          <Sparkles className="mx-auto h-8 w-8" />
          <p className="mt-3 text-lg font-bold">{lang === "bn" ? "সব অংশগ্রহণকারীকে ধন্যবাদ!" : "Thank you to every participant!"}</p>
          <p className="mt-2 text-sm text-white/80">{lang === "bn" ? "আপনাদের সৃজনশীলতা আমাদের প্রতিষ্ঠানের জন্য এক নতুন অধ্যায় রচনা করেছে।" : "Your creativity has written a new chapter for our institute."}</p>
          <Link href="/gallery" className="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 hover:bg-slate-100">{t("nav.gallery")}</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function BadgeInline({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-leaf-300 bg-leaf-50 px-3 py-1.5 text-xs font-extrabold text-leaf-700 dark:border-leaf-800 dark:bg-leaf-950/40 dark:text-leaf-300"><Trophy className="h-3.5 w-3.5" />{children}</span>;
}
