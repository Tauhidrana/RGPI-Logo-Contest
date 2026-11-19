"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck, Eye, EyeOff, ArrowLeft, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { ContestLogo } from "@/components/shared/contest-logo";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

export default function LoginPage() {
  const { lang } = useI18n();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) router.replace(d.user.role === "admin" ? "/admin" : "/judge"); })
      .finally(() => setChecking(false));
  }, [router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error(lang === "bn" ? "শুধুমাত্র অনুমোদিত অ্যাডমিন ইমেইল দিয়ে প্রবেশ করা যাবে।" : "Only the authorised admin email can sign in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? (lang === "bn" ? "লগ ইন ব্যর্থ" : "Sign in failed"));
      toast.success(lang === "bn" ? "স্বাগতম!" : "Welcome!");
      router.replace(data.role === "admin" ? "/admin" : "/judge");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (lang === "bn" ? "লগ ইন ব্যর্থ" : "Sign in failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-dots">
      <header className="container-pad flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center"><ContestLogo variant="compact" className="h-12 w-auto" /></Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-ink hover:text-brand-600"><ArrowLeft className="h-4 w-4" />{lang === "bn" ? "সাইটে যান" : "Back to site"}</Link>
        </div>
      </header>
      <main className="container-pad flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md">
          <Card className="sticker border-0 shadow-[7px_7px_0_0_#0E2F33]">
            <CardContent className="p-7 sm:p-9">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border-[3px] border-ink bg-sun-300 text-ink shadow-[3px_3px_0_0_#0E2F33]"><ShieldCheck className="h-7 w-7" /></div>
              <h1 className="mt-5 text-center text-3xl font-extrabold text-ink">{lang === "bn" ? "স্টাফ লগ ইন" : "Staff sign in"}</h1>
              <p className="mt-1 text-center text-sm muted">{lang === "bn" ? "অ্যাডমিন ও বিচারকগণ এখানে প্রবেশ করুন" : "Admins and judges sign in here"}</p>

              {checking ? (
                <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>
              ) : (
                <form onSubmit={signIn} className="mt-7 space-y-5">
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={ADMIN_EMAIL} required autoComplete="username" /></div>
                  <div className="space-y-2">
                    <Label>{lang === "bn" ? "পাসওয়ার্ড" : "Password"}</Label>
                    <div className="relative"><Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" className="pr-11" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-muted-foreground" aria-label="Toggle password">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                  </div>
                  <Button type="submit" variant="brand" className="w-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}{lang === "bn" ? "প্রবেশ করুন" : "Sign in"}</Button>
                  <p className="text-center text-xs muted">{lang === "bn" ? "শুধুমাত্র অনুমোদিত অ্যাকাউন্ট দিয়েই প্রবেশ করা যাবে।" : "Only authorised accounts can access this area."}</p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
