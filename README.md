# RGPI Logo Design Contest 2026

A Bangla-first, production-ready logo contest platform for **Rajshahi Government Polytechnic Institute, Rajshahi (Est. 1963)**.

Built with **Next.js 15 App Router · TypeScript · Tailwind · shadcn/ui · Supabase (Postgres/Auth/Storage/RLS) · react-hook-form + Zod**. All content and submissions are real — no demo/fake data.

> **This repository is public.** Secrets (database keys, admin password, auth tokens) must never be committed. They live only in `.env.local` (gitignored) and in Vercel project environment variables.

---

## Live

Deployed on Vercel (free plan). The public site, admin panel, judge panel, submissions, gallery, tracking, results and rule book are all live.

- Site: `https://rgpi-logo-contest.vercel.app`
- Admin sign-in: open `/admin` and authenticate with the configured admin account.

## Pages

- `/` — landing (contest logo, countdown, themes, required text, formats, rules + key points, timeline, FAQ)
- `/rules` — full rule book (15 sections, table of contents)
- `/submit` — 4-step submission (JPG required, AI optional)
- `/gallery` — published logos with submitter information + lightbox
- `/track` — status lookup by submission ID + phone
- `/results` — winners, visible after admin publishes
- `/admin` and `/judge` — protected panels

## Features

- **Admin** — dashboard charts, submissions table (search/filter/sort/paginate), bulk actions, CSV/ZIP export, detail view with judge scores and signed file downloads, settings, departments, judges, rankings, audit log.
- **Judge** — anonymous one-by-one review, weighted 1–10 scoring, draft/final submit, progress.
- **Submit** — client + server validation, real extension/MIME checks, rate limit, honeypot, optional Turnstile, unique `RGPI-LOGO-0001` IDs, duplicate limit.
- **Security** — service-role key used only in server-only modules; RLS on every table; public cannot insert directly; signed session cookie for fast admin navigation; admin allowlist from a private env variable.

## Local development

```bash
npm install
cp .env.example .env.local
# Fill .env.local with your own private values, then:
npm run dev
```

Useful commands: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run seed:admin`.

## Supabase setup (fresh project)

1. Create a Supabase project.
2. In SQL Editor run, in order: `supabase/migrations/0001_initial_schema.sql`, `0002_rls_policies.sql`, `0003_storage.sql`, then `supabase/seed.sql`.
3. Set the private values in `.env.local` and in your hosting provider's environment variables.
4. Run `npm run seed:admin` to create the admin account in Supabase Auth.
5. Judge accounts are created from `/admin/judges`.

## Deployment

Any Next.js host works. On Vercel: import the repo, add the private environment variables in Project Settings, then deploy. `vercel.json` pins functions to the same region as the database for lower latency. A scheduled GitHub Action pings the database so a free Supabase project does not pause.

## Repository hygiene

- `.env.local`, `.data`, `node_modules`, `.next`, `.vercel` are gitignored.
- No credentials, project refs or passwords are stored in README or source code.
- Turnstile and confirmation email are optional / not enabled by default.

## Testing checklist

- [ ] Landing countdown, language toggle, FAQ, rule book link
- [ ] Submit validation, duplicate cap, JPG-only submission
- [ ] Track, gallery (with submitter info), results visibility
- [ ] Admin login, filters, bulk actions, exports, settings, rankings
- [ ] Judge scoring, drafts/final, progress
- [ ] 360px mobile layout, no console errors
