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
    "লোগো অবশ্যই নিজস্ব মৌলিক সৃষ্টি হতে হবে; নকল, অনুকরণ বা কপিরাইট লঙ্ঘন গ্রহণযোগ্য নয়।",
    "আটটি টেকনোলজির সম্মিলিত প্রকৌশল পরিচয়, শিক্ষা ও সবুজ ক্যাম্পাসের ভাবনা এক অর্থবহ ইউনিফাইড লোগোতে তুলে ধরতে হবে।",
    "বাধ্যতামূলক লেখা: «রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী» ও «১৯৬৩»।",
    "নীল ও সবুজ প্রাধান্য; একটি কালার ও একটি কালো-সাদা/মনোক্রোম সংস্করণ তৈরি করতে হবে।",
    "অনলাইন ফর্মে JPG প্রিভিউ আবশ্যক; AI সোর্স ঐচ্ছিক (চূড়ান্ত পর্যায়ে চাওয়া হতে পারে)।",
    "৩০ নভেম্বর ২০২৬-এর পর কোনো লোগো গ্রহণ করা হবে না।",
    "প্রতিযোগিতাসংক্রান্ত যেকোনো বিষয়ে বিচারকমণ্ডলী ও কর্তৃপক্ষের সিদ্ধান্ত চূড়ান্ত।",
  ],
  rules_en: [
    "The logo must be an original creation; copying, imitation or copyright infringement is not accepted.",
    "Unify all 8 technologies, education and the green campus into one meaningful identity — 8 separate symbols are not required.",
    "Mandatory text: institute name and the year 1963.",
    "Blue and green preferred; provide both a colour version and a black-and-white/monochrome version.",
    "JPG preview required online; AI source optional (may be requested at the final stage).",
    "No entries accepted after 30 November 2026.",
    "The decision of the judges and the authority is final.",
  ],
  theme_bn: "আধুনিক, অর্থবহ ও স্বতন্ত্র লোগো — Electrical, Electronics, Computer, Civil, Mechanical, Power, Electro-Medical ও Mechatronics Technology-এর সম্মিলিত প্রকৌশল পরিচয়, শিক্ষা ও দক্ষতা, গবেষণা ও উদ্ভাবন, এবং প্রতিষ্ঠানের ঐতিহ্য ও সবুজ ক্যাম্পাসের ভাবনা।",
  theme_en: "A modern, meaningful and distinct logo uniting all 8 technologies with education, research, innovation, institutional heritage and a green campus.",
  concept_bn: "Design Our Identity | Celebrate Engineering | Inspire Innovation — আপনার সৃজনশীলতায় ফুটে উঠুক RGPI-এর পরিচয়।",
  concept_en: "Design Our Identity | Celebrate Engineering | Inspire Innovation.",
  scoring_weights: { creativity: 25, theme: 25, simplicity: 20, color_typography: 15, required_text: 15 },
  winners: { winner: null, first_runner_up: null, second_runner_up: null },
};

/** Admin allowlist comes from the private server environment — never committed. */
export const ALLOWED_ADMIN_EMAILS = process.env.ADMIN_EMAIL
  ? [process.env.ADMIN_EMAIL.trim().toLowerCase()]
  : [];
