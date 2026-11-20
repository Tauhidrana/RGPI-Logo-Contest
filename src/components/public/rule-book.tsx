"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen, ArrowRight, List, CheckCircle2, Info, Download, Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ContestLogo } from "@/components/shared/contest-logo";
import { OrganizerBadge } from "@/components/shared/organizer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RULE_BOOK_META, RULE_INTRO, RULE_SECTIONS, type RuleBlock } from "@/lib/rulebook";

function Block({ block }: { block: RuleBlock }) {
  if (block.type === "p") return <p className="text-sm leading-7 text-foreground/85">{block.text}</p>;
  if (block.type === "subhead") {
    return <h3 className="pt-2 text-sm font-extrabold text-brand-700 dark:text-brand-300">{block.text}</h3>;
  }
  if (block.type === "concept") {
    return (
      <div className="rounded-2xl border-[3px] border-ink bg-leaf-50 p-4 shadow-[3px_3px_0_0_#0E2F33] dark:bg-leaf-950/20">
        <p className="flex items-center gap-2 text-sm font-extrabold text-ink dark:text-foreground"><Sparkles className="h-4 w-4 text-leaf-600" />{block.title}</p>
        <ul className="mt-2 space-y-1.5">
          {block.items.map((item, i) => <li key={i} className="flex gap-2 text-sm leading-6 text-foreground/80"><span className="text-leaf-600">•</span>{item}</li>)}
        </ul>
      </div>
    );
  }
  if (block.type === "note") {
    return (
      <div className="flex gap-3 rounded-xl border-[3px] border-ink bg-sun-50 p-4 text-sm font-semibold text-ink shadow-[3px_3px_0_0_#0E2F33] dark:bg-sun-950/30 dark:text-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /><p className="leading-6">{block.text}</p>
      </div>
    );
  }
  if (block.type === "list" || block.type === "numbered") {
    const Tag = block.type === "numbered" ? "ol" : "ul";
    return (
      <Tag className="space-y-2.5 pl-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm leading-7 text-foreground/85">
            <span className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-leaf-500 text-[11px] font-extrabold text-white">
              {block.type === "numbered" ? i + 1 : <CheckCircle2 className="h-3.5 w-3.5" />}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </Tag>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border-[3px] border-ink shadow-[3px_3px_0_0_#0E2F33]">
      <div className="grid grid-cols-[minmax(120px,38%)_1fr] bg-ink text-xs font-extrabold text-white">
        <div className="p-3">{block.head[0]}</div><div className="p-3">{block.head[1]}</div>
      </div>
      {block.rows.map(([a, b], i) => (
        <div key={i} className="grid grid-cols-[minmax(120px,38%)_1fr] border-t-2 border-ink/10 text-sm odd:bg-slate-50 dark:odd:bg-slate-900/40">
          <div className="p-3 font-bold">{a}</div><div className="p-3 leading-6 text-foreground/80">{b}</div>
        </div>
      ))}
    </div>
  );
}

export function RuleBookPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-dots">
      <SiteHeader />
      <main>
        {/* hero */}
        <section className="hero-glow border-b">
          <div className="container-pad py-12 text-center sm:py-16">
            <div className="mx-auto w-56 sm:w-72"><ContestLogo variant="compact" /></div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="pill-outline bg-leaf-100 dark:bg-leaf-900/40"><BookOpen className="h-4 w-4" /> Rule Book · v1.0</span>
              <OrganizerBadge />
            </div>
            <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-6xl dark:text-foreground"><span className="highlight">নিয়মাবলি</span></h1>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-brand-600">{RULE_BOOK_META.tagline}</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-ink/80 dark:text-foreground/80">{RULE_BOOK_META.institute}</p>
            <div className="mx-auto mt-5 max-w-3xl space-y-3 text-left">
              {RULE_INTRO.map((p, i) => <p key={i} className="text-sm leading-7 text-foreground/80">{p}</p>)}
            </div>
            <p className="mt-4 text-xs muted">{RULE_BOOK_META.published}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand"><Link href="/submit">{t("hero.cta")} <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><a href="/contest-logo.svg" download><Download className="h-4 w-4" /> Contest logo</a></Button>
            </div>
          </div>
        </section>

        <div className="container-pad grid gap-8 py-12 lg:grid-cols-[240px_1fr]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border-[3px] border-ink bg-card p-4 shadow-[4px_4px_0_0_#0E2F33]">
              <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-ink dark:text-foreground"><List className="h-4 w-4 text-brand-600" /> বিষয়সূচি</p>
              <nav className="max-h-[65vh] space-y-1 overflow-y-auto">
                {RULE_SECTIONS.map((s) => (
                  <a
                    key={s.num}
                    href={`#rule-${s.num}`}
                    onClick={() => setActive(s.num)}
                    className={`block rounded-lg px-3 py-2 text-xs font-semibold transition ${active === s.num ? "bg-brand-600 text-white" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                  >
                    {s.num}. {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* sections */}
          <div className="space-y-5">
            {RULE_SECTIONS.map((s) => (
              <section key={s.num} id={`rule-${s.num}`} className="sticker scroll-mt-24 p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-sun-300 text-lg font-extrabold text-ink shadow-[3px_3px_0_0_#0E2F33]">{s.num}</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-ink sm:text-2xl dark:text-foreground">{s.title}</h2>
                    {s.sub && <p className="mt-0.5 text-xs font-bold text-brand-600">{s.sub}</p>}
                    <div className="mt-1 h-1 w-12 rounded-full bg-leaf-500" />
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {s.blocks.map((b, i) => <Block key={i} block={b} />)}
                </div>
              </section>
            ))}

            <div className="sticker bg-sun-300 p-7 text-center dark:bg-sun-700">
              <Badge variant="outline" className="border-2 border-ink bg-white/70 text-ink">প্রস্তুত?</Badge>
              <h3 className="mt-3 text-2xl font-extrabold text-ink dark:text-white">এখনই আপনার লোগো জমা দিন</h3>
              <p className="mt-2 text-sm font-semibold text-ink/80 dark:text-white/90">নিয়ম মেনে ডিজাইন করুন, শেষ সময় ৩০ নভেম্বর ২০২৬।</p>
              <Button asChild className="mt-5" variant="default"><Link href="/submit">{t("hero.cta")} <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
