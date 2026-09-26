# Gym OS Architecture

## Principle
One website, one codebase, one database. The product is a single Next.js app:
marketing pages, public demo, owner app, and API all live here. Deployed on Vercel,
backed by PostgreSQL. No proprietary platform dependency — the whole product is
plain TypeScript in a repo we own.

## Layers

```
Browser
  └─ Next.js app (this repo, on Vercel)
       ├─ /            marketing front door
       ├─ /demo        public read-only demo (seeded dataset)
       ├─ /login       owner auth (phase 2)
       └─ /api/*       backend routes (server-side)
            └─ Prisma ORM
                 └─ PostgreSQL (Neon/Supabase — DATABASE_URL)
```

## Multi-tenancy
Every entity row carries `gymId`. The public demo gym has `isDemo=true, isPublic=true`
and is the only gym the demo routes can read. Real gyms are only reachable by their
authenticated owners. This mirrors the DPDP posture: separated per gym, demo data never
mixed with real data.

## Phases

### Phase 1 (this commit) — foundation + public demo
- Next.js + Tailwind + Prisma + PostgreSQL schema (15 entities, multi-tenant)
- Public read-only demo at /demo with seeded dataset (PULSE Fitness)
- JSON API at /api/demo/overview
- Deployable to Vercel with zero external services

### Phase 2 — real backend live
- Attach DATABASE_URL (Neon free tier)
- Owner auth (email+password via Auth.js, session cookie; WhatsApp OTP login later)
- Owner dashboard wired to live Postgres CRUD (members, payments, leads, classes)
- QR check-in: member QR code → validate → AttendanceRecord
- Client gym websites (public marketing page per gym, generated from Gym record)

### Phase 3 — automation engine
- Renewal pipeline: daily cron (Vercel Cron) → RenewalPipeline rows → WhatsApp
  reminders via WhatsApp Business Cloud API (Meta) or a BSP
- At-risk detection: visit-frequency rules → FollowUpTask
- Lead auto-reply + trial pass QR
- Nightly owner digest on WhatsApp

### Phase 4 — scale
- UPI collections (Razorpay/PhonePe PG) with webhooks → Payment rows
- Roles (owner/manager/desk), audit log
- Custom domain, analytics, per-gym branding

## Design language
App surfaces use the Gym OS product tokens (navy #0A0E29 canvas, #0066FF primary,
#141833/#242842 surfaces, #272C49 borders, success #21C45D, Inter). Marketing pages
follow Beyond Pixells brand (Space Grotesk + Plus Jakarta Sans). This app is the product
surface; the marketing site (beyond-pixells hub / gym-os landing) links into it.

## Secrets & security
- DATABASE_URL is the only required secret for phase 2+.
- WhatsApp/Meta, Razorpay keys added in phase 3/4, stored as Vercel env vars — never in the repo.
- DPDP: consent captured on every lead form; written DPA per gym; data export per gym.
