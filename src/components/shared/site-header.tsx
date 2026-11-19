"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { InstituteLogo } from "./institute-logo";
import { LanguageToggle } from "./language-toggle";
import { cn } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n/dict";

const links: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/submit", key: "nav.submit" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/track", key: "nav.track" },
  { href: "/results", key: "nav.results" },
  { href: "/rules", key: "nav.rules" },
];

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="container-pad flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 rounded-xl focus-ring" onClick={() => setOpen(false)}>
          <InstituteLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-ring",
                  active ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {t(l.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://tauhidrana.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-ink/70 transition hover:border-brand-400 hover:text-brand-600 focus-ring xl:inline-flex dark:bg-card dark:text-foreground/70"
            title="tauhidrana.vercel.app"
          >
            Made by <strong className="font-extrabold text-ink dark:text-foreground">Kazi Tauhid Rana</strong>
            <span className="h-3 w-px bg-ink/20" />
            <span className="font-mono text-[10px] text-muted-foreground">tauhidrana.vercel.app</span>
          </a>
          <LanguageToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border lg:hidden focus-ring"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background px-5 pb-4 pt-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-semibold",
                pathname === l.href ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30" : "text-muted-foreground"
              )}
            >
              {t(l.key)}
            </Link>
          ))}
          <a href="https://tauhidrana.vercel.app" target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="mt-2 block rounded-lg border border-ink/15 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-ink/70 dark:bg-slate-800 dark:text-foreground/70">
            Made by <strong className="font-extrabold">Kazi Tauhid Rana</strong> · tauhidrana.vercel.app
          </a>
        </nav>
      )}
    </header>
  );
}
