# RGPI Logo Design Contest 2026

A production-ready, Bangla-first contest platform for **Rajshahi Government Polytechnic Institute, Rajshahi (Est. 1963)**. Students submit without an account; admins and judges use Supabase Auth. All data is real — no demo/fake entries.

Built with **Next.js 15 App Router · TypeScript · Tailwind · shadcn/ui · Supabase (Postgres/Auth/Storage/RLS) · react-hook-form + Zod · Framer Motion · Recharts**.

The visual identity uses the official contest artwork: mint canvas, deep teal ink, green / sun-yellow / blue / lime sticker shapes with bold dark outlines.

---

## Live deployment (already configured)

- **Site:** https://rgpi-logo-contest.vercel.app
- **Supabase project:** `rgpi-logo-contest` (ref `gvczjtibbbfzjzycigfy`, region ap-south-1), owned by `tauhidrana's projects` org.
- Migrations + seed applied via Supabase CLI (`supabase link` → `supabase db push` → `supabase db query --linked --file supabase/seed.sql`).
- Admin created with `npm run seed:admin` in Supabase Auth.
- Env vars set in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`.
- No demo/fake submissions exist — the database starts empty.

## 1. Setup (for a fresh project)

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only**, never exposed |
| `ADMIN_EMAIL` | Must be `taujidrana00@gmail.com` |
| `ADMIN_PASSWORD` | `Tauhidrana00@00@` (default) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL |
| Turnstile keys | Optional bot protection |

Then create the database:

1. In Supabase SQL Editor run, in order: `supabase/migrations/0001_initial_schema.sql`, `0002_rls_policies.sql`, `0003_storage.sql`, `supabase/seed.sql`.
2. `npm run seed:admin` — creates the single admin account. Only `taujidrana00@gmail.com` is accepted (enforced in the app and RLS layer).
3. `npm run dev` → http://localhost:3000

Sign in at `/admin` (or `/admin/login`) with `taujidrana00@gmail.com` / `Tauhidrana00@00@`. When Supabase is configured, `npm run seed:admin` creates the same account in Supabase Auth. Before Supabase is configured, a signed server-only cookie session using those exact credentials is used instead — still no auto-login and no fake data. Judge accounts are created by the admin from `/admin/judges`.

## 2. Features

- **Landing** — official contest logo, countdown, themes, required text, colour palette, formats, rules, timeline, FAQ, SEO + OG image.
- **Submit** — 4-step validated form, drag & drop, **JPG preview required** (max 5 MB), **AI source optional** (max 25 MB), MIME/extension checks, progress, rate limit, honeypot, optional Turnstile, unique `RGPI-LOGO-0001` IDs. Department dropdown: Civil, Mechanical, Electrical, Mechatronics, Electronics, Computer, Electromedical, Power (BN/EN names from `supabase/seed.sql`, mirrored in `src/lib/departments.ts`).
- **Gallery** — published logos **with submitter information beside each logo** (name, department, semester, session, roll, concept) and a lightbox.
- **Track / Results** — status lookup; winners only after admin publishes.
- **Admin** — dashboard charts, submissions table with filters/bulk actions/CSV/ZIP, detail view with score breakdown and signed downloads, judges/departments/settings/audit/rankings.
- **Judge** — anonymous review, weighted 1–10 scoring, drafts, final submit, progress, card grid.

## 3. Security

- Service-role key is imported only in server-only modules.
- RLS on every table; students cannot write directly — all submissions go through the validated `/api/submit` route.
- Admin email allowlist (`taujidrana00@gmail.com`) is checked server-side on every protected page and API route.
- `logos-jpg` public for previews, `logos-ai` private with 30-minute signed URLs.
- Random storage names; sanitised text; 1-minute rate limit and honeypot on submit.

## 4. Deploy

Push to GitHub → import in Vercel → add all env vars → deploy. `middleware.ts` refreshes Supabase auth cookies.

## 5. Testing checklist

- [ ] Only `taujidrana00@gmail.com` can sign in; no demo entry buttons exist.
- [ ] Submit rejects invalid phone / fake `.ai` / oversized JPG; 4th submission blocked.
- [ ] Gallery shows each logo with submitter name, department, semester, roll, session and concept; lightbox works.
- [ ] Track returns correct status; results hidden until published.
- [ ] Admin filters, bulk actions, CSV/ZIP, settings, judge management, rankings, winners, audit log.
- [ ] Judge anonymous mode, scoring, drafts/final, progress.
- [ ] 360px mobile layout has no overflow; EN/বাংলা toggle works everywhere.

## 6. Known limitations

- Rate-limit counters are in-memory per instance; use Redis for strict limits in serverless.
- No confirmation email is sent (success page + ID serve as confirmation).
- JPG bucket is public; make it private and use signed URLs if you need published-only visibility.
- Dark mode tokens exist but have no UI toggle.
