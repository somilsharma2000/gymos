# Gym OS — The Operating System for Indian Gyms

> ⚠️ **SUPERSEDED REPO.** This was the first Gym OS rewrite and is no longer deployed.
> Active repos: **gym-os-app** (live marketing site + console, Vercel) · **gym-os-v3** (live product) · **gym-os** (Pages mirror).
> This repo now hosts the **[GO-LIVE-CHECKLIST](GO-LIVE-CHECKLIST.md)** — the tracked launch checklist.

The complete Gym OS product: frontend + backend in **one website**.
Product of **Beyond Pixells**.

- **Stack:** Next.js 14 (App Router, TypeScript) · Tailwind CSS · Prisma · PostgreSQL
- **Hosting:** Vercel
- **Database:** any PostgreSQL (Neon / Supabase / Vercel Postgres — free tiers work)
- **No Base44.** 100% of the product lives in this repo. We own the code, the data, and the domain.

## What's inside

| Route | What it is |
|---|---|
| `/` | Product front door — hero + demo CTA |
| `/demo` | **Public live demo** — the real owner dashboard UI, read-only, seeded demo gym (PULSE Fitness) |
| `/api/demo/overview` | Backend JSON API serving the demo overview |
| `/login` | Owner login (email + password, Auth.js) |
| `/dashboard` `/members` `/leads` `/payments` `/classes` | **Owner app** — protected, live CRUD against PostgreSQL |

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000/demo
```

No database needed to view the demo (it serves the seeded dataset).

**Owner app:** email/password auth via Auth.js (NextAuth). Demo owner created by the seed:
`owner@pulse.demo` / `demo1234` — change it before real use. In production set
`NEXTAUTH_SECRET` (random string) and `NEXTAUTH_URL` (your deployed URL) as Vercel env vars.
To attach the real database:

```bash
# create a free Postgres at neon.tech, then:
echo 'DATABASE_URL="postgresql://..." > .env
npx prisma db push
npm run db:seed
```

## Deploy to Vercel (one-time, ~10 min)

1. Push this repo to GitHub.
2. On vercel.com → Add New Project → import this repo. Framework: Next.js (auto-detected).
3. (Optional, for the live DB) create a free Postgres at neon.tech → copy the connection string → add it as the `DATABASE_URL` environment variable in Vercel.
4. Deploy. You get `gymos.vercel.app` (or your custom domain).

See `docs/DEPLOY.md` for the full walkthrough and `docs/ARCHITECTURE.md` for the data model.

## Data model (Prisma → PostgreSQL)

15 entities, multi-tenant from day one: every row belongs to a `Gym`. See `prisma/schema.prisma`.

Gym · Branch · Member · MembershipPlan · Membership · AttendanceRecord · Lead ·
GymClass · ClassBooking · Trainer · Staff · FollowUpTask · RenewalPipeline · Payment · TrialPass

## Docs

- `docs/ARCHITECTURE.md` — system design, phases, roadmap
- `docs/DEPLOY.md` — step-by-step Vercel + Neon deployment
- `docs/MIGRATION.md` — what moved from the legacy platform, what stays as backup
