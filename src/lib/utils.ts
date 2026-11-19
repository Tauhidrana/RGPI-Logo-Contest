import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip control characters and trim; keeps Bangla/Unicode intact. */
export function sanitizeText(value: string): string {
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Stable (non-cryptographic) hash used only to coarsely identify duplicate submitters. */
export function hashString(value: string): string {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function toBanglaDigits(value: string | number): string {
  const map: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return String(value).replace(/[0-9]/g, (d) => map[d]);
}

export function formatBDTaka() {
  return "৳";
}

export function formatDate(date: string | Date, locale = "bn-BD") {
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export function formatDateTime(date: string | Date, locale = "bn-BD") {
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export function fileSizeLabel(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function safeExt(filename: string): string {
  const i = filename.lastIndexOf(".");
  if (i === -1) return "";
  return filename.slice(i + 1).toLowerCase();
}

const AI_MIMES = [
  "application/postscript",
  "application/illustrator",
  "application/octet-stream",
  "application/pdf",
];

export function isJpgFile(file: { type: string; name: string }): boolean {
  return (
    ["image/jpeg", "image/jpg"].includes(file.type) &&
    ["jpg", "jpeg"].includes(safeExt(file.name))
  );
}

export function isAiFile(file: { type: string; name: string }): boolean {
  return (
    AI_MIMES.includes(file.type) &&
    ["ai", "eps", "postscript"].includes(safeExt(file.name))
  );
}

export function randomStorageName(ext: string): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
    return `${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}.${ext}`;
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

export function statusMeta(status: string, lang: "bn" | "en") {
  const map: Record<string, { bn: string; en: string; tone: string }> = {
    submitted: { bn: "জমা দেওয়া হয়েছে", en: "Submitted", tone: "blue" },
    under_review: { bn: "পর্যালোচনাধীন", en: "Under review", tone: "amber" },
    shortlisted: { bn: "শর্টলিস্ট", en: "Shortlisted", tone: "violet" },
    winner: { bn: "বিজয়ী", en: "Winner", tone: "green" },
    first_runner_up: { bn: "প্রথম রানার-আপ", en: "1st runner-up", tone: "emerald" },
    second_runner_up: { bn: "দ্বিতীয় রানার-আপ", en: "2nd runner-up", tone: "teal" },
    rejected: { bn: "প্রত্যাখ্যাত", en: "Rejected", tone: "red" },
  };
  const m = map[status] ?? map.submitted;
  return { label: lang === "bn" ? m.bn : m.en, tone: m.tone };
}
