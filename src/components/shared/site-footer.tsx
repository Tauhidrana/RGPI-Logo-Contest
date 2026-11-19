"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { ContestLogo } from "./contest-logo";
import type { DictKey } from "@/lib/i18n/dict";

const links: { href: string; key: DictKey }[] = [
  { href: "/submit", key: "nav.submit" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/track", key: "nav.track" },
  { href: "/results", key: "nav.results" },
  { href: "/rules", key: "nav.rules" },
];

export function SiteFooter() {
  const { t, lang } = useI18n();
  return (
    <footer className="border-t bg-slate-950 text-slate-300 dark:bg-black">
      <div className="container-pad grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="inline-block rounded-2xl bg-white p-3 shadow-[4px_4px_0_0_#F9B825]">
            <ContestLogo variant="full" className="h-24 w-auto" />
          </div>
          <h3 className="mt-5 text-base font-bold text-white">
            {lang === "bn" ? "রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী" : "Rajshahi Government Polytechnic Institute, Rajshahi"}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">{t("footer.aboutText")}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> রাজশাহী, বাংলাদেশ</span>
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +880 721 775 0881</span>
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> info@rgpi.ac.bd</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{t("footer.links")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-slate-400 transition hover:text-white">{t(l.key)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{t("theme.title")}</h4>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{lang === "bn" ? "বিভাগ · প্রকৌশল · শিক্ষা · সবুজ ক্যাম্পাস" : "Departments · Engineering · Education · Green campus"}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Established 1963
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-pad flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} RGPI. {t("footer.rights")}.</p>
          <p>Made with care for our institute 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}
