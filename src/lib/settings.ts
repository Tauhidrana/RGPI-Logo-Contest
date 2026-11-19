import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { getAdminClient } from "./supabase/server";
import { DEFAULT_SETTINGS } from "./defaults";
import type { ContestSettings } from "./types";

const KEY = "contest_settings";
export const SETTINGS_TAG = "contest-settings";

const fetchSettings = unstable_cache(
  async (): Promise<ContestSettings> => {
    const admin = getAdminClient();
    if (!admin) return structuredClone(DEFAULT_SETTINGS);
    try {
      const { data, error } = await admin.from("settings").select("value").eq("key", KEY).maybeSingle();
      if (error || !data?.value) return structuredClone(DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS, ...(data.value as Partial<ContestSettings>) };
    } catch {
      return structuredClone(DEFAULT_SETTINGS);
    }
  },
  ["contest-settings-v1"],
  { revalidate: 300, tags: [SETTINGS_TAG] }
);

export async function getSettings(): Promise<ContestSettings> {
  return fetchSettings();
}

export async function updateSettings(patch: Partial<ContestSettings>): Promise<ContestSettings> {
  const current = await getSettings();
  const next: ContestSettings = { ...current, ...patch };
  const admin = getAdminClient();
  if (!admin) throw new Error("Supabase কনফিগার করা নেই — ডাটা সংরক্ষণ করা যাবে না।");
  const { error } = await admin
    .from("settings")
    .upsert({ key: KEY, value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidateTag(SETTINGS_TAG);
  return next;
}

export function isContestOpen(settings: ContestSettings): boolean {
  if (!settings.contest_open) return false;
  return new Date(settings.deadline).getTime() > Date.now();
}
