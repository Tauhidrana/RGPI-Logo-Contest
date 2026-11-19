import type { ContestSettings } from "./types";

/** Static fallback content for first render / before Supabase is configured. No fake entries. */
export const DEFAULT_SETTINGS: ContestSettings = {
  deadline: "2026-11-30T23:59:00+06:00",
  max_submissions_per_person: 3,
  gallery_visible: true,
  results_published: false,
  contest_open: true,
  anonymous_judging: true,
  judging_locked: false,
  shortlist_count: 5,
  rules_bn: [
    "লোগো অবশ্যই মৌলিক হতে হবে। অনুলিপি বা চুরি প্রমাণিত হলে অযোগ্য ঘোষণা করা হবে।",
    "প্রতি অংশগ্রহণকারী সর্বোচ্চ ৩টি লোগো জমা দিতে পারবেন (প্রশাসন পরিবর্তন করতে পারে)।",
    "JPG ফাইল সর্বোচ্চ ৫ MB এবং AI ফাইল সর্বোচ্চ ২৫ MB হতে হবে।",
    "লোগোতে বাধ্যতামূলক লেখা অন্তর্ভুক্ত করতে হবে।",
    "বিচারকদের সিদ্ধান্ত চূড়ান্ত।",
  ],
  rules_en: [
    "The logo must be original. Plagiarism leads to disqualification.",
    "Each participant may submit at most 3 logos (configurable).",
    "JPG max 5 MB, AI max 25 MB.",
    "The logo must include the required text.",
    "Judges' decision is final.",
  ],
  theme_bn: "লোগোতে রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউটের বিভাগসমূহ, প্রকৌশলী প্রতিষ্ঠানের পরিচয়, শিক্ষার প্রতীক ও সবুজ ক্যাম্পাসের ধারণা প্রতিফলিত হতে হবে।",
  theme_en: "The design should reflect RGPI's departments, an engineering institute identity, a symbol of education, and a green campus.",
  concept_bn: "আমরা এমন একটি লোগো খুঁজছি যা আমাদের গর্বিত ইতিহাস ও ভবিষ্যতের দৃষ্টিভঙ্গিকে এক দৃষ্টিতে তুলে ধরে।",
  concept_en: "We seek a logo that captures our proud history and future vision in a single glance.",
  scoring_weights: { creativity: 25, theme: 25, simplicity: 20, color_typography: 15, required_text: 15 },
  winners: { winner: null, first_runner_up: null, second_runner_up: null },
};

export const ALLOWED_ADMIN_EMAILS = ["taujidrana00@gmail.com"];
