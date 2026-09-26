# Migration notes — off the legacy platform

Founder directive (27 Sep 2026): Gym OS lives fully in our own GitHub repo, deployed
on Vercel, with our own database. No new work on Base44.

## What moved here
- Product data model → `prisma/schema.prisma` (15 core entities, multi-tenant)
- Public demo concept → `/demo` (seeded PULSE Fitness dataset, read-only)
- Product design tokens → Tailwind theme (navy/blue product palette)
- Deployment story → Vercel + Postgres (`docs/DEPLOY.md`)

## What stays on the legacy platform (for now)
- The published legacy app — kept as a working REFERENCE and backup only.
  Never delete it (founder decision), never link to it publicly.
- Nothing new is built there. All new product work happens in this repo.

## Migration order
1. This repo deploys to Vercel; demo live. (done with phase 1)
2. Database attached; owner auth; dashboards read live Postgres. (phase 2)
3. Automation engine moved (renewals, at-risk, digests). (phase 3)
4. Payments + client websites moved. (phase 4)
5. Legacy platform archived read-only.

## Honest status line
This repo is the product. The legacy platform is the museum.
