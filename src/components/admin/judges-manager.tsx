"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Power, Users, Mail } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Profile } from "@/lib/types";

export function JudgesManager({ judges }: { judges: Profile[] }) {
  const { lang } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/judges", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(lang === "bn" ? "বিচারক তৈরি হয়েছে" : "Judge created");
      setOpen(false); setName(""); setEmail(""); setPassword("");
      router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
    finally { setBusy(false); }
  }

  async function mutate(url: string, options?: RequestInit) {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(lang === "bn" ? "আপডেট হয়েছে" : "Updated");
      router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
  }

  return (
    <>
      <PageHeader title={lang === "bn" ? "বিচারক ব্যবস্থাপনা" : "Manage judges"} subtitle={lang === "bn" ? "বিচারক অ্যাকাউন্ট তৈরি ও নিষ্ক্রিয় করুন" : "Create and manage judge accounts"} action={<Button variant="brand" size="sm" onClick={() => setOpen(true)}><UserPlus className="h-4 w-4" />{lang === "bn" ? "নতুন বিচারক" : "New judge"}</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {judges.length ? judges.map((j) => (
          <Card key={j.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-leaf-500 font-extrabold text-white">{j.full_name.slice(0, 1).toUpperCase()}</div>
                  <div><p className="font-bold">{j.full_name}</p><p className="flex items-center gap-1 text-xs muted"><Mail className="h-3 w-3" />{j.email ?? "—"}</p></div>
                </div>
                <Badge variant={j.is_active ? "green" : "red"}>{j.is_active ? (lang === "bn" ? "সক্রিয়" : "Active") : (lang === "bn" ? "নিষ্ক্রিয়" : "Inactive")}</Badge>
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => mutate("/api/admin/judges", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: j.id, is_active: !j.is_active }) })}><Power className="h-4 w-4" />{j.is_active ? (lang === "bn" ? "নিষ্ক্রিয়" : "Disable") : (lang === "bn" ? "সক্রিয়" : "Enable")}</Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => { if (confirm(lang === "bn" ? "নিশ্চিত?" : "Sure?")) mutate(`/api/admin/judges?id=${j.id}`, { method: "DELETE" }); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )) : <div className="sm:col-span-2 lg:col-span-3"><EmptyState title={lang === "bn" ? "কোনো বিচারক নেই" : "No judges yet"} desc={lang === "bn" ? "নতুন বিচারক যোগ করতে উপরের বাটন ব্যবহার করুন।" : "Use the button above to add a judge."} /></div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{lang === "bn" ? "নতুন বিচারক" : "New judge"}</DialogTitle><DialogDescription>{lang === "bn" ? "বিচারকের জন্য অ্যাকাউন্ট তৈরি করুন।" : "Create an account for a judge."}</DialogDescription></DialogHeader>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2"><Label>{lang === "bn" ? "পুরো নাম" : "Full name"}</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label>{lang === "bn" ? "পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)" : "Password (min 8 chars)"}</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>{lang === "bn" ? "বাতিল" : "Cancel"}</Button><Button type="submit" variant="brand" disabled={busy}>{lang === "bn" ? "তৈরি করুন" : "Create"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
