-- ============================================================================
-- Seed: departments + default contest settings
-- Run after migrations. Safe to re-run (ON CONFLICT).
-- ============================================================================

-- Official RGPI departments (re-running this seed replaces older entries)
insert into public.departments (id, name_en, name_bn, sort_order, is_active) values
  ('11111111-1111-4111-8111-111111111111', 'Civil Technology', 'সিভিল টেকনোলজি', 1, true),
  ('22222222-2222-4222-8222-222222222222', 'Mechanical Technology', 'মেকানিকাল টেকনোলজি', 2, true),
  ('33333333-3333-4333-8333-333333333333', 'Electrical Technology', 'ইলেকট্রিক্যাল টেকনোলজি', 3, true),
  ('44444444-4444-4444-8444-444444444444', 'Mechatronics Technology', 'মেকাট্রনিক্স টেকনোলজি', 4, true),
  ('55555555-5555-4555-8555-555555555555', 'Electronics Technology', 'ইলেকট্রনিক্স টেকনোলজি', 5, true),
  ('66666666-6666-4666-8666-666666666666', 'Computer Technology', 'কম্পিউটার টেকনোলজি', 6, true),
  ('77777777-7777-4777-8777-777777777777', 'Electromedical Technology', 'ইলেক্ট্রোমেডিকেল টেকনোলজি', 7, true),
  ('88888888-8888-4888-8888-888888888888', 'Power Technology', 'পাওয়ার টেকনোলজি', 8, true)
on conflict (id) do update set
  name_en = excluded.name_en,
  name_bn = excluded.name_bn,
  sort_order = excluded.sort_order,
  is_active = true;

delete from public.departments where id not in (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555',
  '66666666-6666-4666-8666-666666666666',
  '77777777-7777-4777-8777-777777777777',
  '88888888-8888-4888-8888-888888888888'
);

insert into public.settings (key, value) values ('contest_settings', '{
  "deadline": "2026-11-30T23:59:00+06:00",
  "max_submissions_per_person": 3,
  "gallery_visible": true,
  "results_published": false,
  "contest_open": true,
  "anonymous_judging": true,
  "judging_locked": false,
  "shortlist_count": 5,
  "rules_bn": [
    "লোগো অবশ্যই মৌলিক হতে হবে। অনুলিপি বা চুরি প্রমাণিত হলে অযোগ্য ঘোষণা করা হবে।",
    "প্রতি অংশগ্রহণকারী সর্বোচ্চ ৩টি লোগো জমা দিতে পারবেন (প্রশাসন পরিবর্তন করতে পারে)।",
    "JPG প্রিভিউ আবশ্যক (সর্বোচ্চ ৫ MB)। AI সোর্স ফাইল ঐচ্ছিক (দিলে সর্বোচ্চ ২৫ MB)।",
    "লোগোতে বাধ্যতামূলক লেখা অন্তর্ভুক্ত করতে হবে।",
    "বিচারকদের সিদ্ধান্ত চূড়ান্ত।"
  ],
  "rules_en": [
    "The logo must be original. Plagiarism leads to disqualification.",
    "Each participant may submit at most 3 logos (configurable).",
    "JPG preview is required (max 5 MB); AI source is optional (max 25 MB if provided).",
    "The logo must include the required text.",
    "Judges'' decision is final."
  ],
  "theme_bn": "লোগোতে রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউটের বিভাগসমূহ, প্রকৌশলী প্রতিষ্ঠানের পরিচয়, শিক্ষার প্রতীক ও সবুজ ক্যাম্পাসের ধারণা প্রতিফলিত হতে হবে।",
  "theme_en": "The design should reflect RGPI''s departments, an engineering institute identity, a symbol of education, and a green campus.",
  "concept_bn": "আমরা এমন একটি লোগো খুঁজছি যা আমাদের গর্বিত ইতিহাস ও ভবিষ্যতের দৃষ্টিভঙ্গিকে এক দৃষ্টিতে তুলে ধরে।",
  "concept_en": "We seek a logo that captures our proud history and future vision in a single glance.",
  "scoring_weights": {
    "creativity": 25, "theme": 25, "simplicity": 20,
    "color_typography": 15, "required_text": 15
  },
  "winners": { "winner": null, "first_runner_up": null, "second_runner_up": null }
}'::jsonb)
on conflict (key) do nothing;
