"use client";

import Link from "next/link";
import {
  ArrowRight, Building2, Cog, GraduationCap, Leaf, FileImage, FileCode2,
  ClipboardList, Gavel, Trophy, Copy, Check, CalendarDays, HelpCircle,
  Sparkles, ChevronDown, LockKeyhole, Palette, PartyPopper,
  ShieldCheck, Hash, PenLine, BookOpen,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Countdown } from "@/components/shared/countdown";
import { ContestLogo } from "@/components/shared/contest-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import { RULE_HIGHLIGHTS } from "@/lib/rulebook";
import type { ContestSettings } from "@/lib/types";
import type { DictKey } from "@/lib/i18n/dict";

const REQUIRED_TEXT = "রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী";
const REQUIRED_YEAR = "১৯৬৩";


const faqs: { q: { bn: string; en: string }; a: { bn: string; en: string } }[] = [
  { q: { bn: "কে এই প্রতিযোগিতায় অংশ নিতে পারেন?", en: "Who can participate?" }, a: { bn: "রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউটের বর্তমান শিক্ষার্থীরা অংশ নিতে পারেন। কোনো লগইন বা অ্যাকাউন্টের প্রয়োজন নেই।", en: "Current students of RGPI can participate. No login or account is required." } },
  { q: { bn: "কতটি লোগো জমা দেওয়া যাবে?", en: "How many logos can I submit?" }, a: { bn: "প্রতি শিক্ষার্থী সর্বোচ্চ ৩টি লোগো জমা দিতে পারেন। প্রতিটির জন্য আলাদা JPG ও AI ফাইল লাগবে।", en: "Each student can submit up to 3 logos. Each needs a separate JPG and AI file." } },
  { q: { bn: "ফাইলের সাইজ কত হতে পারে?", en: "What are the file size limits?" }, a: { bn: "JPG প্রিভিউ আবশ্যক (সর্বোচ্চ ৫ MB)। AI সোর্স ফাইল ঐচ্ছিক, দিলে সর্বোচ্চ ২৫ MB হতে পারে।", en: "JPG preview is required (max 5 MB). AI source is optional (max 25 MB if provided)." } },
  { q: { bn: "লোগোতে কী লেখা থাকতে হবে?", en: "What text must the logo include?" }, a: { bn: "লোগোতে অবশ্যই «রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী» এবং «১৯৬৩» থাকতে হবে।", en: "The logo must include the institute's name and the year 1963." } },
  { q: { bn: "কীভাবে বিচার করা হবে?", en: "How will entries be judged?" }, a: { bn: "বিচারকরা সৃজনশীলতা, থিমের প্রাসঙ্গিকতা, সরলতা, রঙ ও টাইপোগ্রাফি এবং বাধ্যতামূলক লেখার ব্যবহার — এই পাঁচটি মানদণ্ডে ১–১০ নম্বর দেবেন।", en: "Judges score creativity, theme relevance, simplicity, colour & typography, and use of required text from 1–10." } },
  { q: { bn: "স্থিতি কীভাবে জানব?", en: "How do I check my status?" }, a: { bn: "জমা দেওয়ার পর RGPI-LOGO-0001 আইডি পাবেন। «স্থিতি দেখুন» পেইজে সেই আইডি ও ফোন নম্বর দিয়ে দেখতে পারেন।", en: "After submitting you get an ID like RGPI-LOGO-0001. Use it with your phone on the Track page." } },
];

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="pill-outline bg-leaf-100 dark:bg-leaf-900/40">{eyebrow}</span>
      <h2 className="mt-5 text-3xl font-extrabold text-ink sm:text-5xl dark:text-foreground"><span className="highlight">{title}</span></h2>
      {desc && <p className="mt-4 text-base leading-relaxed muted">{desc}</p>}
    </div>
  );
}

export function LandingPage({ settings }: { settings: ContestSettings }) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const rules = lang === "bn" ? settings.rules_bn : settings.rules_en;
  const deadlineLabel = formatDateTime(settings.deadline, lang === "bn" ? "bn-BD" : "en-US");

  const themes: { key: DictKey; icon: typeof Building2; box: string }[] = [
    { key: "theme.departments", icon: Building2, box: "bg-leaf-500" },
    { key: "theme.engineering", icon: Cog, box: "bg-ink" },
    { key: "theme.education", icon: GraduationCap, box: "bg-sun-400" },
    { key: "theme.green", icon: Leaf, box: "bg-brand-600" },
  ];

  const ruleIcons = { cog: Cog, shield: ShieldCheck, pen: PenLine, palette: Palette, file: FileImage, calendar: CalendarDays };

  function copyText() {
    navigator.clipboard.writeText(`${REQUIRED_TEXT} — ${REQUIRED_YEAR}`).then(() => {
      setCopied(true);
      toast.success(lang === "bn" ? "লেখা কপি হয়েছে!" : "Text copied!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error(lang === "bn" ? "কপি করা যায়নি" : "Could not copy"));
  }

  return (
    <div className="min-h-screen overflow-hidden bg-dots">
      <SiteHeader />

      <main>
      {/* HERO */}
      <section className="relative hero-glow">
        <div className="container-pad relative pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto w-full max-w-3xl">
              <ContestLogo className="drop-shadow-[6px_6px_0_rgba(14,47,51,0.12)]" />
            </div>
            <p className="mt-6 text-lg font-extrabold text-ink sm:text-2xl dark:text-foreground">
              {t("hero.subtitle")} <span className="text-sun-500">✦</span>
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed muted sm:text-lg">
              {t("hero.desc")}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="brand" size="lg" className="w-full sm:w-auto"><Link href="/submit">{t("hero.cta")} <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto"><Link href="#details">{t("hero.ctaSecondary")}</Link></Button>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <div className="sticker overflow-hidden bg-white p-1.5 dark:bg-card">
              <div className="rounded-[20px] bg-leaf-50 p-5 dark:bg-leaf-950/30 sm:p-7">
                <div className="mb-4 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-ink dark:text-foreground">
                  <CalendarDays className="h-4 w-4 text-leaf-600" /> {t("hero.deadline")}
                </div>
                <Countdown deadline={settings.deadline} />
                <p className="mt-4 text-center text-sm text-ink/80 dark:text-foreground/80">
                  {lang === "bn" ? "শেষ সময়:" : "Deadline:"} <strong>{deadlineLabel}</strong> · Asia/Dhaka
                </p>
              </div>
            </div>
          </div>

          {/* stickers */}
          <div className="pointer-events-none absolute left-1 top-1/3 hidden animate-float rounded-2xl border-[3px] border-ink bg-sun-300 px-4 py-2 font-extrabold text-ink shadow-[4px_4px_0_0_#0E2F33] xl:block">EST. 1963 ✦</div>
          <div className="pointer-events-none absolute right-1 top-1/2 hidden animate-float rounded-2xl border-[3px] border-ink bg-leaf-500 px-4 py-2 font-extrabold text-ink shadow-[4px_4px_0_0_#0E2F33] xl:block">GO GREEN 🌱</div>
        </div>
      </section>

      <div id="details">
        {/* THEMES */}
        <section className="section-pad">
          <div className="container-pad">
            <SectionTitle eyebrow={lang === "bn" ? "ডিজাইন গাইড" : "Design brief"} title={t("theme.title")} desc={lang === "bn" ? settings.theme_bn : settings.theme_en} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {themes.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.key}>
                    <div className="sticker sticker-hover h-full p-6">
                      <div className={cn("grid h-14 w-14 place-items-center rounded-2xl border-[3px] border-ink text-white shadow-[3px_3px_0_0_#0E2F33]", item.box)}><Icon className="h-7 w-7" /></div>
                      <h3 className="mt-5 text-xl font-extrabold text-ink dark:text-foreground">{t(item.key)}</h3>
                      <p className="mt-2 text-sm leading-relaxed muted">{t(`${item.key}Desc` as DictKey)}</p>
                      <div className="mt-4 h-1.5 w-12 rounded-full bg-sun-400 transition-all group-hover:w-20" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TEXT + COLORS */}
        <section className="section-pad bg-white/60 dark:bg-slate-950/40">
          <div className="container-pad grid gap-8 lg:grid-cols-2">
            <div>
              <div className="sticker h-full bg-sun-50 p-6 dark:bg-sun-950/20 sm:p-9">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-ink bg-sun-300 text-ink shadow-[3px_3px_0_0_#0E2F33]"><Sparkles className="h-6 w-6" /></div>
                  <div><h3 className="text-xl font-extrabold text-ink dark:text-foreground">{t("text.title")}</h3><p className="text-sm muted">{t("text.desc")}</p></div>
                </div>
                <div className="mt-6 rounded-3xl border-[3px] border-dashed border-ink bg-white p-6 dark:bg-card">
                  <p className="text-center font-bangla text-xl font-bold leading-relaxed text-ink dark:text-foreground sm:text-2xl">{REQUIRED_TEXT}</p>
                  <div className="my-4 flex items-center gap-3 text-xs font-bold text-ink"><span className="h-px flex-1 bg-ink/20" /> {t("text.year")} <span className="h-px flex-1 bg-ink/20" /></div>
                  <p className="text-center font-bangla text-4xl font-extrabold text-leaf-600">{REQUIRED_YEAR}</p>
                </div>
                <Button variant="outline" className="mt-5 w-full" onClick={copyText}>{copied ? <Check className="h-4 w-4 text-leaf-600" /> : <Copy className="h-4 w-4" />}{copied ? t("text.copied") : t("text.copy")}</Button>
              </div>
            </div>

            <div>
              <div className="sticker h-full bg-leaf-50 p-6 dark:bg-leaf-950/20 sm:p-9">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-ink bg-leaf-500 text-white shadow-[3px_3px_0_0_#0E2F33]"><Palette className="h-6 w-6" /></div>
                  <div><h3 className="text-xl font-extrabold text-ink dark:text-foreground">{t("color.title")}</h3><p className="text-sm muted">{t("color.desc")}</p></div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {[
                    { c: "#0E2F33", n: "Ink" }, { c: "#F9B825", n: "Sun" }, { c: "#16A34A", n: "Green" }, { c: "#2563EB", n: "Blue" }, { c: "#A3CF3A", n: "Lime" }, { c: "#F3FAF1", n: "Mint" },
                  ].map((s) => (
                    <div key={s.n} className="text-center">
                      <div className="mx-auto h-14 w-14 rounded-2xl border-[3px] border-ink shadow-[3px_3px_0_0_#0E2F33]" style={{ background: s.c }} />
                      <p className="mt-2 text-xs font-bold text-ink dark:text-foreground">{s.n}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2 text-sm font-bold text-ink dark:text-foreground">
                  <p>🟢 {t("color.green")}</p><p>🔵 {t("color.blue")}</p>
                </div>
                <div className="mt-5 rounded-2xl border-[3px] border-ink bg-white p-3 text-center text-sm font-extrabold text-ink shadow-[3px_3px_0_0_#0E2F33] dark:bg-card dark:text-foreground">
                  {lang === "bn" ? "✨ যেকোনো রঙের ব্যবহার অনুমোদিত" : "✨ Any colour scheme is welcome"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FORMATS */}
        <section className="section-pad">
          <div className="container-pad">
            <SectionTitle eyebrow={lang === "bn" ? "ফাইল গাইড" : "File guide"} title={t("format.title")} desc={t("format.desc")} />
            <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
              {[
                { icon: FileImage, title: t("format.jpg"), size: "5 MB", ext: ".JPG / .JPEG", box: "bg-brand-600", tag: lang === "bn" ? "আবশ্যক" : "Required" },
                { icon: FileCode2, title: t("format.ai"), size: "25 MB", ext: ".AI (Illustrator)", box: "bg-sun-400", tag: lang === "bn" ? "ঐচ্ছিক" : "Optional" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.ext} className="sticker p-6">
                    <div className={cn("grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-ink text-white shadow-[3px_3px_0_0_#0E2F33]", f.box)}><Icon className="h-6 w-6" /></div>
                    <h3 className="mt-4 text-xl font-extrabold text-ink dark:text-foreground">{f.title}</h3>
                    <p className="text-sm muted">{f.ext}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-2 border-ink">{lang === "bn" ? "সর্বোচ্চ" : "Max"} {f.size}</Badge>
                      <Badge variant={f.tag === (lang === "bn" ? "আবশ্যক" : "Required") ? "green" : "secondary"} className="border-2 border-ink">{f.tag}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RULES + TIMELINE */}
        <section className="section-pad bg-white/60 dark:bg-slate-950/40">
          <div className="container-pad grid gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-ink bg-sun-300 text-ink shadow-[3px_3px_0_0_#0E2F33]"><ClipboardList className="h-6 w-6" /></div><h2 className="text-3xl font-extrabold text-ink dark:text-foreground">{t("rules.title")}</h2></div>
              <ul className="mt-6 space-y-3">
                {rules.map((rule, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-[3px_3px_0_0_#0E2F33] dark:bg-card">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-leaf-500 text-sm font-extrabold text-white">{lang === "bn" ? ["১", "২", "৩", "৪", "৫"][i] ?? i + 1 : i + 1}</span>
                    <span className="text-sm leading-relaxed font-medium">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-ink bg-brand-600 text-white shadow-[3px_3px_0_0_#0E2F33]"><CalendarDays className="h-6 w-6" /></div><h2 className="text-3xl font-extrabold text-ink dark:text-foreground">{t("timeline.title")}</h2></div>
              <div className="mt-6 space-y-0">
                {[
                  { icon: Sparkles, label: t("timeline.open"), when: lang === "bn" ? "এখন খোলা" : "Open now", c: "bg-leaf-500" },
                  { icon: LockKeyhole, label: t("timeline.closed"), when: deadlineLabel, c: "bg-brand-600" },
                  { icon: Gavel, label: t("timeline.judging"), when: lang === "bn" ? "জমার পরে" : "After closing", c: "bg-sun-400" },
                  { icon: Trophy, label: t("timeline.result"), when: lang === "bn" ? "শীঘ্রই" : "Soon", c: "bg-ink" },
                ].map((step, i, arr) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="relative flex gap-4 pb-7 last:pb-0">
                      {i < arr.length - 1 && <span className="absolute left-5 top-12 h-[calc(100%-2rem)] w-0.5 border-l-2 border-dashed border-ink/30" />}
                      <div className={cn("z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-ink text-white shadow-[3px_3px_0_0_#0E2F33]", step.c)}><Icon className="h-5 w-5" /></div>
                      <div className="pt-1"><p className="font-extrabold text-ink dark:text-foreground">{step.label}</p><p className="text-sm muted">{step.when}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* RULE BOOK KEY POINTS */}
        <section className="section-pad bg-white/60 dark:bg-slate-950/40">
          <div className="container-pad">
            <SectionTitle
              eyebrow={lang === "bn" ? "নিয়ম এক নজরে" : "Rules at a glance"}
              title={lang === "bn" ? "নিয়মাবলির মূল পয়েন্ট" : "Key points from the rule book"}
              desc={lang === "bn" ? "সম্পূর্ণ নিয়মাবলি পড়ুন — অংশগ্রহণের আগে জেনে নিন সব শর্ত।" : "Read the full rule book before you submit."}
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RULE_HIGHLIGHTS.map((h, i) => {
                const Icon = ruleIcons[h.icon];
                return (
                  <div key={h.icon} className="sticker sticker-hover p-5">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border-[3px] border-ink bg-sun-300 text-ink shadow-[3px_3px_0_0_#0E2F33]"><Icon className="h-5 w-5" /></div>
                    <p className="mt-4 text-base font-extrabold text-ink dark:text-foreground">{lang === "bn" ? h.bn : h.en}</p>
                    <p className="mt-1 text-sm leading-relaxed muted">{h.detail}</p>
                    <span className="mt-3 inline-block text-[11px] font-extrabold text-brand-600">#{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="brand" size="lg"><Link href="/rules"><BookOpen className="h-4 w-4" /> {lang === "bn" ? "সম্পূর্ণ নিয়মাবলি দেখুন" : "Read the full rule book"} <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-pad">
          <div className="container-pad">
            <SectionTitle eyebrow={lang === "bn" ? "জানতে চান?" : "Good to know"} title={t("faq.title")} />
            <div className="mx-auto mt-10 max-w-3xl space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#0E2F33] dark:bg-card">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-extrabold text-ink dark:text-foreground">
                    <span className="flex items-center gap-3"><HelpCircle className="h-5 w-5 shrink-0 text-brand-600" />{lang === "bn" ? f.q.bn : f.q.en}</span>
                    <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", openFaq === i && "rotate-180")} />
                  </button>
                  {openFaq === i && <div className="border-t-2 border-dashed border-ink/20 px-5 py-4 text-sm leading-relaxed muted">{lang === "bn" ? f.a.bn : f.a.en}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="container-pad">
            <div className="sticker overflow-hidden bg-sun-300 px-6 py-14 text-center sm:px-12 dark:bg-sun-700">
              <PartyPopper className="mx-auto h-12 w-12 text-ink dark:text-white" />
              <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl dark:text-white">{lang === "bn" ? "আপনার সৃজনশীলতা দেখান" : "Show us your creativity"}</h2>
              <p className="mx-auto mt-3 max-w-xl font-semibold text-ink/80 dark:text-white/90">{lang === "bn" ? "একটি লোগো, অসীম সম্ভাবনা। আজই জমা দিন এবং RGPI-এর ইতিহাসের অংশ হুন।" : "One logo, endless possibilities. Submit today and become part of RGPI's history."}</p>
              <Button asChild variant="default" size="lg" className="mt-7 border-sun-300"><Link href="/submit">{t("hero.cta")} <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </div>
        </section>
      </div>

      </main>

      <SiteFooter />
    </div>
  );
}
