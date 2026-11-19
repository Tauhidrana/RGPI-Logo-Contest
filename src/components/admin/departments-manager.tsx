"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n-provider";
import { PageHeader } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Department } from "@/lib/types";

export function DepartmentsManager({ departments }: { departments: Department[] }) {
  const { lang } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Department | null>(null);
  const [bn, setBn] = useState("");
  const [en, setEn] = useState("");
  const [busy, setBusy] = useState(false);

  function openDialog(dep?: Department) {
    setEdit(dep ?? null);
    setBn(dep?.name_bn ?? ""); setEn(dep?.name_en ?? "");
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/departments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: edit?.id, name_bn: bn, name_en: en, is_active: edit?.is_active ?? true, sort_order: edit?.sort_order ?? departments.length + 1 }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(lang === "bn" ? "সংরক্ষিত হয়েছে" : "Saved");
      setOpen(false); router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "ত্রুটি"); }
    finally { setBusy(false); }
  }

  async function remove(dep: Department) {
    if (!confirm(`${lang === "bn" ? "মুছে ফেলবেন?" : "Delete?"} ${dep.name_en}`)) return;
    try {
      const res = await fetch(`/api/admin/departments?id=${dep.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ত্রুটি");
      toast.success(lang === "bn" ? "মুছে ফেলা হয়েছে" : "Deleted");
      router.refresh();
    } catch { toast.error("ত্রুটি"); }
  }

  return (
    <>
      <PageHeader title={lang === "bn" ? "বিভাগ ব্যবস্থাপনা" : "Departments"} subtitle={lang === "bn" ? "জমা ফর্মের ড্রপডাউন নিয়ন্ত্রণ করুন" : "Control the submission form dropdown"} action={<Button variant="brand" size="sm" onClick={() => openDialog()}><Plus className="h-4 w-4" />{lang === "bn" ? "নতুন বিভাগ" : "Add department"}</Button>} />

      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>#</TableHead><TableHead>{lang === "bn" ? "নাম (বাংলা)" : "Name (Bangla)"}</TableHead><TableHead>{lang === "bn" ? "নাম (English)" : "Name (English)"}</TableHead><TableHead>{lang === "bn" ? "অবস্থা" : "Status"}</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {departments.map((d, i) => (
              <TableRow key={d.id}>
                <TableCell className="muted">{i + 1}</TableCell>
                <TableCell className="font-semibold">{d.name_bn}</TableCell>
                <TableCell>{d.name_en}</TableCell>
                <TableCell><Badge variant={d.is_active ? "green" : "red"}>{d.is_active ? (lang === "bn" ? "সক্রিয়" : "Active") : (lang === "bn" ? "নিষ্ক্রিয়" : "Inactive")}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog(d)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => remove(d)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit ? (lang === "bn" ? "বিভাগ সম্পাদনা" : "Edit department") : (lang === "bn" ? "নতুন বিভাগ" : "New department")}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2"><Label>{lang === "bn" ? "নাম (বাংলা)" : "Name (Bangla)"}</Label><Input value={bn} onChange={(e) => setBn(e.target.value)} required /></div>
            <div className="space-y-2"><Label>{lang === "bn" ? "নাম (English)" : "Name (English)"}</Label><Input value={en} onChange={(e) => setEn(e.target.value)} required /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>{lang === "bn" ? "বাতিল" : "Cancel"}</Button><Button type="submit" variant="brand" disabled={busy}>{lang === "bn" ? "সংরক্ষণ" : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
