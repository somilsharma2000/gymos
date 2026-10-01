# GYM OS — Go-Live Checklist

**Live product:** https://gym-os-app.vercel.app (marketing + console)
**Pages mirror:** https://somilsharma2000.github.io/gym-os
**This repo** (`gymos`) is superseded as a codebase — it now hosts the tracked
go-live checklist for the Gym OS launch. The **go-live-watch workflow**
(.github/workflows/go-live-watch.yml) re-verifies every 6 hours and ticks
boxes automatically as each item lands.

> Repo map (don't get lost):
> - `gym-os-app` — the live marketing site + ops console (Vercel)
> - `gym-os-v3` — the live product (dashboard + member portal)
> - `gym-os` — GitHub Pages mirror target (auto-deployed by the pages-mirror workflow)
> - `gymos` (this repo) — retired first rewrite; hosts this checklist

## Live status

<!-- status:start -->
_Auto-updated by the go-live-watch workflow (every 6 h). Last check: **2026-10-01 03:02 UTC**_

| Surface | State |
|---|---|
| Marketing app (gym-os-app.vercel.app) | **UP** |
| Pages mirror (somilsharma2000.github.io/gym-os) | **UP** |
| gymos.in DNS A | 145.223.124.143, 88.223.87.154 → still old host |
| gymos.in traffic | old Hostinger site |
| GA4 | not connected |
| Testimonials | no quotes yet (renders only with real quotes) |
<!-- status:end -->

---

## 1. gymos.in domain migration  `owner action — needs Hostinger + Vercel panels`

Current state: `gymos.in` still serves the **old Hostinger static site**
(title "GymOS: Gym Management & Software"). The real app is live at
`gym-os-app.vercel.app` and verified green.

- [ ] <!-- watch:dns-a -->**Hostinger hPanel → DNS Zone** — add: `A @ 76.76.21.21`
- [ ] <!-- watch:dns-cname -->**Hostinger hPanel → DNS Zone** — add: `CNAME www → cname.vercel-dns.com`
- [ ] <!-- watch:vercel-domain -->**Vercel → gym-os-app project → Settings → Domains** — add `gymos.in` and `www.gymos.in`
- [ ] <!-- watch:site-url -->**Set env var** `NEXT_PUBLIC_SITE_URL=https://gymos.in` on the Vercel gym-os-app project
      (code already reads this — flips canonical URLs, OG tags and sitemap atomically)
- [ ] **Verify after propagation** (the watch workflow also checks these continuously):
  ```bash
  curl -s https://gymos.in/ | grep -c 917737077479   # must be ≥ 1
  curl -s -o /dev/null -w "%{http_code}" https://gymos.in/privacy  # must be 200
  curl -s https://gymos.in/sitemap.xml | head -3     # must show https://gymos.in locs
  ```

## 2. GA4 analytics  `owner action — needs Google account; ~2 min`

The site ships GA4 support that is **dormant until the env var is set**.
CSP is already configured (commit `afdd81c`) to allow gtag + the collect beacon.

- [ ] **Google Analytics → Admin → Create Property** → Web → name it, use `https://gymos.in`
- [ ] **Copy the `G-XXXXXXXXXX` measurement ID**
- [ ] <!-- watch:ga-id -->**Set env var** `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` on the Vercel gym-os-app project
- [ ] **Verify:** GA Realtime report shows a live visit after browsing the site

## 3. Customer quotes → testimonials  `owner action — needs real client quotes`

The home page has a Testimonials section that **renders only when real quotes
exist** in `gym-os-app/src/lib/testimonials.ts`. No invented social proof is
shipped by design.

- [ ] **Collect 2–3 real quotes** — each with: name, gym name, city, 1–2 sentence result, optional metric
- [ ] <!-- watch:quotes -->**Add them** — paste to the agent in chat, or edit `src/lib/testimonials.ts` and open a PR
- [ ] **Verify:** `/` renders the quotes section

---

## Post-completion reminders

- Once gymos.in is live: update the WhatsApp demo CTA copy if it references the vercel URL anywhere (grep for `gym-os-app.vercel.app`).
- Keep `MIRROR_PAT` secret fresh in `gym-os-app` (used by the pages-mirror workflow).
- Footer contact: beyondpixells@gmail.com · WhatsApp +91 77370 77479.
