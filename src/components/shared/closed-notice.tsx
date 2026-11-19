"use client";

import Link from "next/link";
import { LockKeyhole, ArrowLeft, CalendarDays } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export function ClosedNotice({ deadline }: { deadline: string }) {
  const { t, lang } = useI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-pad flex flex-1 items-center justify-center py-20">
        <div className="max-w-lg text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-red-100 text-red-600 dark:bg-red-950/40"><LockKeyhole className="h-10 w-10" /></div>
          <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{t("hero.closed")}</h1>
          <p className="mt-3 text-base muted">{t("hero.closedDesc")}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border bg-card px-5 py-3 text-sm font-semibold shadow-sm">
            <CalendarDays className="h-4 w-4 text-brand-500" />
            {lang === "bn" ? "শেষ সময় ছিল" : "Deadline was"} {formatDateTime(deadline, lang === "bn" ? "bn-BD" : "en-US")}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand"><Link href="/"><ArrowLeft className="h-4 w-4" /> {lang === "bn" ? "হোমে যান" : "Go home"}</Link></Button>
            <Button asChild variant="outline"><Link href="/track">{t("track.button")}</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
