"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggle } = useI18n();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "bn" ? "Switch to English" : "বাংলায় যান"}
      title={lang === "bn" ? "English" : "বাংলা"}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border bg-background px-3 text-xs font-bold text-foreground shadow-sm transition hover:border-brand-400 hover:text-brand-600 focus-ring",
        className
      )}
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "bn" ? "EN" : "বাং"}
    </button>
  );
}
