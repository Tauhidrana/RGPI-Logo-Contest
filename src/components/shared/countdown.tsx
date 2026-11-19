"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { toBanglaDigits } from "@/lib/utils";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms <= 0,
  };
}

export function Countdown({ deadline, compact = false }: { deadline: string; compact?: boolean }) {
  const { t, lang } = useI18n();
  const target = new Date(deadline).getTime();
  const [state, setState] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setState(diff(target));
    const id = setInterval(() => setState(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) {
    return <div className={compact ? "h-10" : "h-24"} aria-hidden="true" />;
  }

  if (state.done) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-red-100 px-4 py-2 text-sm font-extrabold text-red-700 shadow-[3px_3px_0_0_#0E2F33]">
        <span className="h-2 w-2 rounded-full bg-red-500" /> {t("hero.closed")}
      </div>
    );
  }

  const units = [
    { value: state.days, label: t("hero.days") },
    { value: state.hours, label: t("hero.hours") },
    { value: state.minutes, label: t("hero.minutes") },
    { value: state.seconds, label: t("hero.seconds") },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-2 font-mono text-sm font-bold tabular-nums">
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center gap-2">
            <span className="rounded-lg border-2 border-ink bg-white px-2 py-1 text-ink">{lang === "bn" ? toBanglaDigits(u.value) : u.value}</span>
            {i < units.length - 1 && <span className="opacity-50">:</span>}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {units.map((u) => (
        <div key={u.label} className="rounded-2xl border-[3px] border-ink bg-white p-3 text-center shadow-[3px_3px_0_0_#0E2F33] sm:p-4">
          <div className="text-2xl font-extrabold tabular-nums text-ink sm:text-4xl">
            {lang === "bn" ? toBanglaDigits(u.value) : u.value}
          </div>
          <div className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink/60 sm:text-xs">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
