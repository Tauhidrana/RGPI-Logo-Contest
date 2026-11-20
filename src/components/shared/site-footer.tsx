"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { ContestLogo } from "./contest-logo";
import { OrganizerPanel } from "./organizer";
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
          <div className="mt-5 flex flex-col gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-sun-400" /> {t("footer.address")}</span>
            <a href="tel:+8801712685203" className="inline-flex w-fit items-center gap-2 transition hover:text-white"><Phone className="h-4 w-4 shrink-0 text-sun-400" /> 01712685203</a>
            <a href="mailto:rajpolytech@gmail.com" className="inline-flex w-fit items-center gap-2 transition hover:text-white"><Mail className="h-4 w-4 shrink-0 text-sun-400" /> rajpolytech@gmail.com</a>
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
        <div className="container-pad py-8 sm:py-10">
          <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
            <div className="shrink-0">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-sun-300">
                <MessageCircle className="h-4 w-4" /> {t("footer.infoTitle")}
              </p>
              <a
                href="https://wa.me/8801712685203"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-extrabold text-[#08351b] shadow-[3px_3px_0_0_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:bg-[#1eb757]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp · 01712685203 <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t("footer.infoNote")}
              </p>
            </div>
            <div className="h-px w-full bg-white/10 sm:h-20 sm:w-px" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{t("footer.contactLabel")}</p>
              <p className="mt-1.5 text-lg font-extrabold text-white sm:text-xl">{t("footer.contactName")}</p>
              <p className="mt-1 text-sm font-semibold text-slate-300">{t("footer.contactRole")}</p>
              <p className="mt-1 text-sm text-slate-400">{t("footer.contactDept")}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href="mailto:aman4cse@gmail.com" className="inline-flex items-center gap-2 font-semibold text-emerald-300 transition hover:text-emerald-200"><Mail className="h-4 w-4" /> aman4cse@gmail.com</a>
                <a href="tel:+8801712685203" className="inline-flex items-center gap-2 font-semibold text-slate-300 transition hover:text-white"><Phone className="h-4 w-4" /> 01712685203</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20">
        <div className="container-pad py-8">
          <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
            <span className="h-px w-8 bg-slate-600" /> {t("organize.footerTitle")}
          </p>
          <OrganizerPanel tone="dark" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-pad flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} RGPI. {t("footer.rights")}.</p>
          <p>
            Made by <a href="https://tauhidrana.vercel.app" target="_blank" rel="noreferrer" className="font-bold text-slate-300 underline decoration-slate-600 underline-offset-2 hover:text-white">Kazi Tauhid Rana</a> · <a href="https://tauhidrana.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white">tauhidrana.vercel.app</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
