import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Minimal .env.local loader (avoids an extra dependency). */
export function loadEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key] !== undefined) continue;
    let value = raw.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

export function requireEnv(...keys) {
  for (const k of keys) {
    if (!process.env[k]) {
      console.error(`\n❌ Missing environment variable: ${k}`);
      console.error("   Copy .env.example to .env.local and fill in the values.\n");
      process.exit(1);
    }
  }
}

export function configured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return url.startsWith("http") && !url.includes("your-project") && key.length > 30;
}
