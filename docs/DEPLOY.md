# Deploy Gym OS to Vercel (10-minute walkthrough)

## 1. Push this repo to GitHub
Already pushed if you're reading this on GitHub.

## 2. Import into Vercel
1. Sign up / log in at vercel.com (free Hobby plan is enough to start).
2. "Add New → Project" → import the `gymos` repo.
3. Vercel auto-detects Next.js. Click **Deploy**.
4. Done — the demo is live at `https://gymos-<something>.vercel.app`.

## 3. (Phase 2) Attach the database
1. Create a free Postgres at neon.tech (or supabase.com).
2. Copy the connection string (`postgresql://...`).
3. In Vercel → Project → Settings → Environment Variables → add `DATABASE_URL`.
4. Redeploy. Then run once from your computer:
   ```
   DATABASE_URL="postgresql://..." npx prisma db push
   DATABASE_URL="postgresql://..." npm run db:seed   # seeds the demo gym
   ```

## 4. Custom domain
In Vercel → Settings → Domains → add `gymos.in` (or your domain) and follow the DNS
instructions. You can point the root at the marketing site and a subdomain
(e.g. `app.gymos.in`) here, or host everything on one domain — this app is both.

## Notes
- The public demo needs no database — it renders the seeded dataset.
- Cron jobs (renewal reminders) come with phase 3; Vercel Hobby allows daily crons.
