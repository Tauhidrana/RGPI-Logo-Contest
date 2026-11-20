"use client";

import { GraduationCap, Landmark, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

/** Small crest used wherever the organizing department is credited. */
export function OrganizerMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-[3px] border-ink bg-sun-300 text-ink shadow-[3px_3px_0_0_#0E2F33]",
        className
      )}
    >
      <GraduationCap className="h-7 w-7" strokeWidth={2.5} />
      <span className="absolute -bottom-2 -right-2 rounded-full border-2 border-ink bg-brand-600 px-2 py-0.5 text-[9px] font-extrabold leading-none tracking-wide text-white">
        CSE
      </span>
    </span>
  );
}

/** Compact inline credit — used in the hero and on small screens. */
export function OrganizerBadge({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-3 rounded-full border-[3px] border-ink bg-white/90 py-2 pl-2 pr-5 shadow-[3px_3px_0_0_#0E2F33] backdrop-blur dark:bg-card",
        className
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun-300 text-ink">
        <GraduationCap className="h-5 w-5" strokeWidth={2.6} />
      </span>
      <span className="min-w-0 text-sm font-extrabold leading-tight text-ink sm:text-base dark:text-foreground">
        <span className="text-brand-600">{t("organize.label")}</span>{" "}
        <span className="hidden sm:inline">· </span>
        <span className="block sm:inline">{t("organize.deptShort")}</span>
      </span>
    </div>
  );
}

/** Full credit panel — used in the closing CTA and the global footer. */
export function OrganizerPanel({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const { t } = useI18n();
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3xl border-[3px] p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8",
        dark
          ? "border-white/15 bg-white/5"
          : "border-ink bg-white/85 shadow-[5px_5px_0_0_#0E2F33] dark:border-ink/60 dark:bg-card",
        className
      )}
    >
      <OrganizerMark className={dark ? "border-white/30 shadow-[3px_3px_0_0_rgba(0,0,0,0.35)]" : undefined} />
      <div className="min-w-0 flex-1">
        <p className={cn("flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] sm:text-sm", dark ? "text-sun-300" : "text-brand-600")}>
          <Sparkles className="h-4 w-4" /> {t("organize.label")}
        </p>
        <p className={cn("mt-1.5 text-2xl font-extrabold leading-snug sm:text-3xl", dark ? "text-white" : "text-ink dark:text-foreground")}>
          {t("organize.dept")}
        </p>
        <p className={cn("mt-1.5 flex items-center gap-2 text-base sm:text-lg", dark ? "text-slate-300" : "muted")}>
          <Landmark className="h-4 w-4 shrink-0" /> {t("organize.institute")}
        </p>
      </div>
      <div className={cn("hidden shrink-0 rounded-2xl border-2 px-5 py-3 text-center text-sm font-extrabold sm:block", dark ? "border-white/15 text-slate-300" : "border-ink/20 text-ink/70 dark:text-foreground/70")}>
        RGPI
        <span className="mt-0.5 block text-xs font-bold opacity-70">EST. 1963</span>
      </div>
    </div>
  );
}
