"use client";

import Link from "next/link";
import { CheckCircle2, EyeOff, Eye, Gavel } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { getPublicImageUrl } from "@/lib/storage";
import type { Submission } from "@/lib/types";

export function JudgeGrid({ submissions, done, anonymous }: { submissions: Submission[]; done: Record<string, boolean>; anonymous: boolean }) {
  const { lang } = useI18n();
  return (
    <>
      <PageHeader title={lang === "bn" ? "সব লোগো" : "All logos"} subtitle={lang === "bn" ? "যেকোনো লোগোতে ক্লিক করে স্কোর দিন" : "Click any logo to score it"} />
      {submissions.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {submissions.map((s, i) => (
            <Link key={s.id} href={`/judge?start=${i}`} className="group overflow-hidden rounded-2xl border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={getPublicImageUrl(s.jpg_path)} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                {done[s.id] && <span className="absolute right-2 top-2"><Badge className="bg-leaf-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" />{lang === "bn" ? "সম্পন্ন" : "Done"}</Badge></span>}
              </div>
              <div className="p-3">
                <p className="truncate font-mono text-xs font-bold">{s.submission_code}</p>
                {!anonymous && <p className="mt-0.5 truncate text-xs muted">{s.full_name}</p>}
                <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-brand-600"><Gavel className="h-3 w-3" />{lang === "bn" ? "স্কোর দিন" : "Score now"}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : <EmptyState title={lang === "bn" ? "কোনো লোগো নেই" : "No logos"} />}
      <div className="mt-5 flex items-center gap-2 text-xs muted">
        {anonymous ? <><EyeOff className="h-4 w-4" />{lang === "bn" ? "অজ্ঞাত মোড চলছে" : "Anonymous mode is on"}</> : <><Eye className="h-4 w-4" />{lang === "bn" ? "নাম প্রকাশ মোড" : "Identified mode"}</>}
      </div>
    </>
  );
}
