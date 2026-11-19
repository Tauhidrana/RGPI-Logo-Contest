"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, CloudUpload, FileImage,
  FileCode2, X, Loader2, ShieldCheck, PartyPopper, Image as ImageIcon,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Countdown } from "@/components/shared/countdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Turnstile } from "./turnstile";
import { validateAi, validateJpg, MAX_AI, MAX_JPG } from "@/lib/validations";
import type { ContestSettings, Department } from "@/lib/types";
import { cn, fileSizeLabel } from "@/lib/utils";

const isFile = (v: unknown) => !!v && typeof v === "object" && "name" in v && "size" in v;

const clientSchema = z.object({
  full_name: z.string().trim().min(3, "কমপক্ষে ৩ অক্ষরের নাম দিন"),
  department_id: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  semester: z.string().trim().min(1, "সেমিস্টার লিখুন"),
  roll: z.string().trim().min(2, "রোল নম্বর লিখুন"),
  session: z.string().trim().min(4, "সেশন লিখুন (যেমন 2022-2026)"),
  phone: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশি ফোন নম্বর দিন"),
  email: z.string().trim().email("সঠিক ইমেইল ঠিকানা দিন"),
  logo_title: z.string().trim().min(3, "লোগোর শিরোনাম দিন"),
  concept: z.string().trim().min(20, "কমপক্ষে ২০ অক্ষরের ধারণা লিখুন").max(500, "ধারণা ৫০০ অক্ষরের বেশি হতে পারবে না"),
  declaration: z.literal(true, { errorMap: () => ({ message: "মৌলিকতার ঘোষণায় সম্মত হতে হবে" }) }),
  jpg: z.any().refine(isFile, "JPG ফাইল আপলোড করুন"),
  ai: z.any().optional(),
  honeypot: z.string().optional(),
});
type FormValues = z.infer<typeof clientSchema>;

const L = {
  bn: {
    title: "লোগো জমা দিন", sub: "চারটি সহজ ধাপে আপনার ডিজাইন জমা দিন",
    step: "ধাপ", of: "৪ এর", details: "আপনার তথ্য", files: "ফাইল আপলোড", review: "পর্যালোচনা", confirm: "নিশ্চিতকরণ",
    fullName: "পুরো নাম", department: "বিভাগ", semester: "সেমিস্টার", roll: "রোল নম্বর", session: "সেশন",
    phone: "মোবাইল নম্বর", email: "ইমেইল", logoTitle: "লোগোর শিরোনাম", concept: "ডিজাইনের ধারণা",
    conceptHint: "আপনার ডিজাইনের গল্প সংক্ষেপে লিখুন (সর্বোচ্চ ৫০০ অক্ষর)",
    selectDept: "আপনার বিভাগ নির্বাচন করুন", jpgTitle: "JPG প্রিভিউ", aiTitle: "AI সোর্স ফাইল",
    drop: "ফাইল এখানে টেনে আনুন অথবা নির্বাচন করুন", jpgHint: ".jpg / .jpeg · সর্বোচ্চ ৫ MB", aiHint: ".ai · সর্বোচ্চ ২৫ MB",
    preview: "প্রিভিউ", remove: "অপসারণ", declaration: "আমি ঘোষণা করছি যে এই লোগোটি সম্পূর্ণরূপে আমার নিজস্ব মৌলিক কাজ।",
    reviewNote: "নিচের তথ্যগুলো যাচাই করে নিশ্চিত করুন। জমা দেওয়ার পর তথ্য সম্পাদনা করা যাবে না।",
    submit: "এখন জমা দিন", submitting: "জমা দেওয়া হচ্ছে…", uploadPct: "আপলোড হচ্ছে",
    success: "সাবমিশন সফল!", successDesc: "আপনার লোগো সফলভাবে জমা দেওয়া হয়েছে।",
    backHome: "হোমে ফিরে যান", track: "স্থিতি দেখুন", requiredTextReminder: "মনে রাখবেন: লোগোতে «রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী» ও «১৯৬৩» থাকতে হবে।",
  },
  en: {
    title: "Submit your logo", sub: "Submit your design in four easy steps",
    step: "Step", of: "of 4", details: "Your details", files: "Upload files", review: "Review", confirm: "Confirm",
    fullName: "Full name", department: "Department", semester: "Semester", roll: "Roll number", session: "Session",
    phone: "Mobile number", email: "Email", logoTitle: "Logo title", concept: "Design concept",
    conceptHint: "Briefly tell the story behind your design (max 500 characters)",
    selectDept: "Select your department", jpgTitle: "JPG preview", aiTitle: "AI source file",
    drop: "Drag & drop a file here or click to browse", jpgHint: ".jpg / .jpeg · max 5 MB", aiHint: ".ai · max 25 MB",
    preview: "Preview", remove: "Remove", declaration: "I declare that this logo is entirely my own original work.",
    reviewNote: "Please verify the details below before confirming. You cannot edit after submitting.",
    submit: "Submit now", submitting: "Submitting…", uploadPct: "Uploading",
    success: "Submission successful!", successDesc: "Your logo has been submitted successfully.",
    backHome: "Back to home", track: "Track status", requiredTextReminder: "Remember: the logo must include “রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী” and “১৯৬৩”.",
  },
};

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label} <span className="text-red-500">*</span></Label>
      {children}
      {hint && !error && <p className="text-xs muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function FileDrop({
  label, hint, accept, value, error, kind, onChange, required = true,
}: {
  label: string; hint: string; accept: string; value: File | null | undefined; error?: string;
  kind: "jpg" | "ai"; onChange: (f: File | null) => void; required?: boolean;
}) {
  const { lang } = useI18n();
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [localErr, setLocalErr] = useState<string>("");

  const handle = useCallback((file: File | undefined) => {
    if (!file) return;
    const err = kind === "jpg" ? validateJpg(file) : validateAi(file);
    if (err) {
      setLocalErr(err);
      toast.error(err);
      return;
    }
    setLocalErr("");
    onChange(file);
    if (kind === "jpg") setPreview(URL.createObjectURL(file));
  }, [kind, onChange]);

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label} {required ? <span className="text-red-500">*</span> : <span className="text-xs font-normal muted">({lang === "bn" ? "ঐচ্ছিক" : "optional"})</span>}</Label>
      <input
        type="file"
        accept={accept}
        id={`file-${kind}`}
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-leaf-300 bg-leaf-50/60 p-3 dark:border-leaf-800 dark:bg-leaf-950/30">
          {kind === "jpg" && preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40"><FileCode2 className="h-7 w-7" /></div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{value.name}</p>
            <p className="text-xs muted">{fileSizeLabel(value.size)} · {kind === "jpg" ? L[lang].jpgTitle : L[lang].aiTitle}</p>
          </div>
          <button type="button" onClick={() => { onChange(null); setPreview(""); setLocalErr(""); }} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-red-100 hover:text-red-600" aria-label={L[lang].remove}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => document.getElementById(`file-${kind}`)?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-7 text-center transition",
            drag ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : error || localErr ? "border-red-300 bg-red-50/50 dark:bg-red-950/20" : "border-slate-300 hover:border-brand-400 hover:bg-brand-50/40 dark:border-slate-700"
          )}
        >
          {kind === "jpg" ? <CloudUpload className="h-8 w-8 text-brand-500" /> : <FileCode2 className="h-8 w-8 text-amber-500" />}
          <span className="text-sm font-semibold">{L[lang].drop}</span>
          <span className="text-xs muted">{hint}</span>
        </button>
      )}
      {(error || localErr) && <p className="text-xs font-medium text-red-600">{error || localErr}</p>}
    </div>
  );
}

export function SubmitWizard({ settings, departments }: { settings: ContestSettings; departments: Department[] }) {
  const { lang } = useI18n();
  const l = L[lang];
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const { register, control, watch, setValue, trigger, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    defaultValues: {
      full_name: "", department_id: "", semester: "", roll: "", session: "",
      phone: "", email: "", logo_title: "", concept: "", declaration: false as unknown as true,
      honeypot: "",
    },
  });

  const values = watch();
  const steps = [l.details, l.files, l.review, l.confirm];
  const deptName = useMemo(() => {
    const d = departments.find((x) => x.id === values.department_id);
    return lang === "bn" ? d?.name_bn ?? "" : d?.name_en ?? "";
  }, [departments, values.department_id, lang]);

  const conceptLen = values.concept?.length ?? 0;

  async function goNext() {
    let ok = true;
    if (step === 1) {
      ok = await trigger(["full_name", "department_id", "semester", "roll", "session", "phone", "email", "logo_title", "concept"]);
    } else if (step === 2) {
      ok = await trigger(["jpg"]);
    } else if (step === 3) {
      ok = await trigger(["declaration"]);
    }
    if (ok) {
      setStep((s) => Math.min(4, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error(lang === "bn" ? "দয়া করে চিহ্নিত ফিল্ডগুলো ঠিক করুন" : "Please fix the highlighted fields");
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setUploading(true);
    setProgress(0);
    const fd = new FormData();
    (Object.keys(data) as (keyof FormValues)[]).forEach((k) => {
      const v = data[k];
      if (k === "jpg" || k === "ai") {
        if (v) fd.append(k, v as File);
      } else if (k === "declaration") {
        fd.append(k, "true");
      } else if (v != null) {
        fd.append(k, String(v));
      }
    });
    fd.append("turnstileToken", turnstileToken);

    try {
      const result = await new Promise<{ ok: boolean; code?: string; error?: string; summary?: unknown }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/submit");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90));
        };
        xhr.onload = () => {
          setProgress(100);
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error("Invalid server response")); }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(fd);
      });
      if (!result.ok || !result.code) {
        toast.error(result.error ?? (lang === "bn" ? "জমা দেওয়া যায়নি" : "Submission failed"));
        setUploading(false);
        return;
      }
      try { sessionStorage.setItem("rgpi-submission", JSON.stringify(result)); } catch { /* ignore */ }
      router.push(`/submit/success/${result.code}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : (lang === "bn" ? "নেটওয়ার্ক ত্রুটি" : "Network error"));
      setUploading(false);
    }
  });

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/40">
      <SiteHeader />
      <main className="container-pad py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold sm:text-4xl">{l.title}</h1>
            <p className="mt-2 muted">{l.sub}</p>
          </div>

          <div className="mt-8 rounded-2xl border bg-white p-4 shadow-card dark:bg-card sm:p-6">
            {/* stepper */}
            <ol className="flex items-center">
              {steps.map((label, i) => {
                const n = i + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold transition",
                        done ? "bg-leaf-600 text-white" : active ? "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/40" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                      )}>
                        {done ? <Check className="h-4 w-4" /> : n}
                      </span>
                      <span className={cn("hidden text-[11px] font-semibold sm:block", active ? "text-brand-700 dark:text-brand-300" : "muted")}>{label}</span>
                    </div>
                    {i < steps.length - 1 && <span className={cn("mx-2 h-0.5 flex-1 rounded", done ? "bg-leaf-500" : "bg-slate-200 dark:bg-slate-700")} />}
                  </li>
                );
              })}
            </ol>

            <form onSubmit={onSubmit} className="mt-8">
              <input type="hidden" {...register("honeypot")} autoComplete="off" tabIndex={-1} aria-hidden="true" />
              
                <div key={step}>
                  {step === 1 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2"><Field label={l.fullName} error={errors.full_name?.message}><Input {...register("full_name")} placeholder={lang === "bn" ? "যেমন: আব্দুল্লাহ আল মামুন" : "e.g. Abdullah Al Mamun"} /></Field></div>
                      <div className="sm:col-span-2">
                        <Field label={l.department} error={errors.department_id?.message}>
                          <Controller control={control} name="department_id" render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue placeholder={l.selectDept} /></SelectTrigger>
                              <SelectContent>
                                {departments.map((d) => <SelectItem key={d.id} value={d.id}>{lang === "bn" ? d.name_bn : d.name_en}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )} />
                        </Field>
                      </div>
                      <Field label={l.semester} error={errors.semester?.message}><Input {...register("semester")} placeholder="e.g. 4th" /></Field>
                      <Field label={l.roll} error={errors.roll?.message}><Input {...register("roll")} placeholder="e.g. 2022-1045" /></Field>
                      <Field label={l.session} error={errors.session?.message}><Input {...register("session")} placeholder="e.g. 2022-2026" /></Field>
                      <Field label={l.phone} error={errors.phone?.message}><Input {...register("phone")} inputMode="tel" placeholder="01XXXXXXXXX" /></Field>
                      <div className="sm:col-span-2"><Field label={l.email} error={errors.email?.message}><Input {...register("email")} type="email" placeholder="name@example.com" /></Field></div>
                      <div className="sm:col-span-2"><Field label={l.logoTitle} error={errors.logo_title?.message}><Input {...register("logo_title")} placeholder={lang === "bn" ? "যেমন: সবুজ জ্ঞানের আলো" : "e.g. Light of Knowledge"} /></Field></div>
                      <div className="sm:col-span-2">
                        <Field label={l.concept} error={errors.concept?.message} hint={l.conceptHint}>
                          <Textarea {...register("concept")} maxLength={500} rows={5} placeholder={lang === "bn" ? "আপনার ডিজাইনের পেছনের গল্প…" : "The story behind your design…"} />
                        </Field>
                        <p className="mt-1 text-right text-xs muted">{conceptLen}/500</p>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                        <ShieldCheck className="mr-2 inline h-4 w-4" /> {l.requiredTextReminder}
                      </div>
                      <Controller control={control} name="jpg" render={({ field }) => (
                        <FileDrop kind="jpg" label={l.jpgTitle} hint={l.jpgHint} accept=".jpg,.jpeg,image/jpeg" value={field.value as File | null | undefined} error={errors.jpg?.message as string | undefined} onChange={field.onChange} />
                      )} />
                      <Controller control={control} name="ai" render={({ field }) => (
                        <FileDrop kind="ai" label={l.aiTitle} hint={l.aiHint} required={false} accept=".ai,.eps,application/postscript,application/octet-stream" value={field.value as File | null | undefined} error={errors.ai?.message as string | undefined} onChange={field.onChange} />
                      )} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border p-3"><p className="text-xs font-bold text-brand-600">JPG</p><p className="text-xs muted">{l.jpgHint}</p></div>
                        <div className="rounded-xl border p-3"><p className="text-xs font-bold text-amber-600">AI</p><p className="text-xs muted">{l.aiHint}</p></div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <p className="text-sm muted">{l.reviewNote}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          [l.fullName, values.full_name], [l.department, deptName], [l.semester, values.semester],
                          [l.roll, values.roll], [l.session, values.session], [l.phone, values.phone],
                          [l.email, values.email], [l.logoTitle, values.logo_title],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-xl border bg-slate-50 p-3 dark:bg-slate-900/40">
                            <p className="text-[11px] font-semibold uppercase tracking-wide muted">{k}</p>
                            <p className="mt-0.5 break-words text-sm font-bold">{v || "—"}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/40">
                        <p className="text-[11px] font-semibold uppercase tracking-wide muted">{l.concept}</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{values.concept}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-xl border p-3 text-sm"><FileImage className="h-5 w-5 text-brand-500" /><span className="truncate">{String((values.jpg as File | undefined)?.name ?? "")}</span></div>
                        <div className="flex items-center gap-2 rounded-xl border p-3 text-sm"><FileCode2 className="h-5 w-5 text-amber-500" /><span className="truncate">{(values.ai as File | undefined)?.name ?? (lang === "bn" ? "AI ফাইল দেওয়া হয়নি (ঐচ্ছিক)" : "No AI file (optional)")}</span></div>
                      </div>
                      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-900 dark:bg-brand-950/30">
                        <Controller control={control} name="declaration" render={({ field }) => (
                          <label className="flex cursor-pointer items-start gap-3">
                            <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                            <span className="text-sm font-medium leading-relaxed">{l.declaration}</span>
                          </label>
                        )} />
                        {errors.declaration && <p className="mt-2 text-xs font-medium text-red-600">{errors.declaration.message}</p>}
                      </div>
                      <Turnstile onToken={setTurnstileToken} />
                    </div>
                  )}

                  {step === 4 && (
                    <div className="py-6 text-center">
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-600 to-leaf-600 text-white shadow-soft"><PartyPopper className="h-8 w-8" /></div>
                      <h2 className="mt-5 text-2xl font-extrabold">{l.confirm}</h2>
                      <p className="mx-auto mt-2 max-w-md text-sm muted">{l.reviewNote}</p>
                      <div className="mx-auto mt-6 max-w-sm rounded-2xl border bg-slate-50 p-5 text-left dark:bg-slate-900/40">
                        <div className="flex justify-between text-sm"><span className="muted">{l.fullName}</span><span className="font-bold">{values.full_name}</span></div>
                        <div className="mt-2 flex justify-between text-sm"><span className="muted">{l.logoTitle}</span><span className="font-bold">{values.logo_title}</span></div>
                        <div className="mt-2 flex justify-between text-sm"><span className="muted">{l.department}</span><span className="font-bold">{deptName}</span></div>
                      </div>
                      {uploading && (
                        <div className="mx-auto mt-6 max-w-sm">
                          <div className="mb-2 flex justify-between text-xs font-semibold"><span>{l.uploadPct}</span><span>{progress}%</span></div>
                          <Progress value={progress} indicatorClassName="bg-gradient-to-r from-brand-500 to-leaf-500" />
                        </div>
                      )}
                      <Button type="submit" variant="brand" size="lg" disabled={uploading} className="mt-7 w-full sm:w-auto">
                        {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> {l.submitting}</> : <><CheckCircle2 className="h-4 w-4" /> {l.submit}</>}
                      </Button>
                    </div>
                  )}
                </div>
              

              {step < 4 && (
                <div className="mt-8 flex items-center justify-between border-t pt-5">
                  <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                    <ArrowLeft className="h-4 w-4" /> {lang === "bn" ? "পেছনে" : "Back"}
                  </Button>
                  <Button type="button" variant="brand" onClick={goNext}>
                    {lang === "bn" ? "পরবর্তী" : "Next"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {step === 4 && (
                <div className="mt-6 text-center">
                  <button type="button" onClick={() => setStep(3)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-1 inline h-3.5 w-3.5" /> {lang === "bn" ? "সম্পাদনায় ফিরে যান" : "Go back & edit"}
                  </button>
                </div>
              )}
            </form>
          </div>

          <Card className="mt-5">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-2 text-sm"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-500 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-leaf-600" /></span><span className="font-semibold">{lang === "bn" ? "জমা চলছে" : "Contest is open"}</span></div>
              <Countdown deadline={settings.deadline} compact />
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-xs muted">
            {lang === "bn" ? "কোনো অ্যাকাউন্টের প্রয়োজন নেই · " : "No account needed · "}<Link href="/track" className="font-semibold text-brand-600 hover:underline">{l.track}</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
