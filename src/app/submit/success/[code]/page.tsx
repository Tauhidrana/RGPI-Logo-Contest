"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check, Home, Search, Mail, Phone, User, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

type Summary = {
  full_name: string; logo_title: string; department_id: string;
  email: string; phone: string; created_at: string;
};

export default function SuccessPage() {
  const { code } = useParams<{ code: string }>();
  const { lang } = useI18n();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("rgpi-submission");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.code === code) setSummary(parsed.summary ?? null);
      }
    } catch { /* ignore */ }
  }, [code]);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success(lang === "bn" ? "আইডি কপি হয়েছে" : "ID copied");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 dark:bg-slate-950/40">
      <SiteHeader />
      <main className="container-pad flex flex-1 items-center justify-center py-14">
        <motion.div initial={{ opacity: 1, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          <Card className="overflow-hidden border-0 shadow-soft">
            <div className="bg-gradient-to-br from-leaf-600 to-brand-600 px-6 py-10 text-center text-white">
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur">
                <CheckCircle2 className="h-9 w-9" />
              </motion.div>
              <h1 className="mt-4 text-3xl font-extrabold">{lang === "bn" ? "সাবমিশন সফল!" : "Submission successful!"}</h1>
              <p className="mt-2 text-white/85">{lang === "bn" ? "আপনার লোগো সফলভাবে জমা দেওয়া হয়েছে।" : "Your logo has been submitted successfully."}</p>
            </div>
            <CardContent className="p-6 sm:p-8">
              <p className="text-center text-xs font-bold uppercase tracking-widest muted">{lang === "bn" ? "আপনার সাবমিশন আইডি" : "Your submission ID"}</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <code className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-5 py-3 font-mono text-xl font-extrabold tracking-wide text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200">{code}</code>
                <button type="button" onClick={copy} className="grid h-10 w-10 place-items-center rounded-lg border hover:bg-accent" aria-label="Copy">
                  {copied ? <Check className="h-4 w-4 text-leaf-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-center text-xs muted">{lang === "bn" ? "ভবিষ্যতে স্থিতি দেখতে এই আইডিটি সংরক্ষণ করুন।" : "Save this ID to check your status later."}</p>

              {summary && (
                <div className="mt-7 space-y-3 rounded-2xl border bg-slate-50 p-5 dark:bg-slate-900/40">
                  <div className="flex items-center gap-3 text-sm"><User className="h-4 w-4 text-brand-500" /><span className="muted">{lang === "bn" ? "নাম" : "Name"}:</span><strong>{summary.full_name}</strong></div>
                  <div className="flex items-center gap-3 text-sm"><Trophy className="h-4 w-4 text-brand-500" /><span className="muted">{lang === "bn" ? "লোগো" : "Logo"}:</span><strong>{summary.logo_title}</strong></div>
                  <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-brand-500" /><span className="muted">Email:</span><strong>{summary.email}</strong></div>
                  <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-brand-500" /><span className="muted">Phone:</span><strong>{summary.phone}</strong></div>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="brand" className="flex-1"><Link href="/track"><Search className="h-4 w-4" /> {lang === "bn" ? "স্থিতি দেখুন" : "Track status"}</Link></Button>
                <Button asChild variant="outline" className="flex-1"><Link href="/"><Home className="h-4 w-4" /> {lang === "bn" ? "হোমে যান" : "Go home"}</Link></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
