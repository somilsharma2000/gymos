# Beyond Pixells — Growth Engine (v2)

**Goal:** paying Gym OS clients, on repeat, with the minimum manual work.
**This is the operating manual. The agent runs the machine; the owner spends ~30 min/day on human-only steps.**

---

## 1. The math of getting clients

We control conversion only if we control the funnel. Working backwards from 1 closed gym/month:

| Stage | Target rate | Needed per month |
|---|---|---|
| Content impressions (IG+FB+LI) | 100% | ~60,000 |
| Profile visits → site/DM | 1.5% | ~900 |
| Leads captured (DM + form) | 8% | ~70 |
| Qualified (ICP match, respond) | 30% | ~21 |
| Demos booked | 40% | ~8 |
| Close | 25% | **2 gyms** |

Impressions are the cheapest lever early (organic reach compounds as engagement rises), so **content volume + quality is job #1 until inbound leads hit ~70/month.**

---

## 2. Funnel architecture

```
ATTENTION → CAPTURE → NURTURE → CONVERT → AMPLIFY
 (content)   (DM→form)  (WhatsApp)  (demo→close) (quotes→referrals)
```

### 2.1 ATTENTION — the content engine
- **Cadence:** IG + FB 2x/day (10:00 & 18:00 IST) · LinkedIn 3x/week (Mon/Wed/Fri 11:00 IST, company page org 109877511)
- **Video-first:** 1 Reel/week minimum (30-sec product walkthroughs outperform static 3-5x). Static + carousel fill the rest.
- **6 proven formats** (generator scripts produce these on-brand automatically):
  1. STAT CALLOUT — big number + consequence ("₹4L/year leaking")
  2. HOOK CARD — one painful truth on glassmorphism card
  3. BEFORE/AFTER — register vs Gym OS split
  4. LIST — "5 tools → 1 platform"
  5. QUESTION HOOK — "Why do 60% of gyms fail?"
  6. MINIMAL BOLD — status/premium positioning
- **Content pillars (rotation):** ops pain (40%) · product proof/screens (30%) · owner psychology + status (20%) · brand story (10%)
- **Rules:** Gym OS focus only · FOMO/urgency/status triggers · navy #0A0E27 + blue #0066FF + Inter · logo top-left · "DM us" CTA only, never phone numbers · no emojis in images
- **LinkedIn differs:** B2B thought leadership, text-first, saves/comments over likes, ends with a question. No hard CTA pressure.

### 2.2 CAPTURE — every path ends in the Lead entity
- Instagram/FB bio → link → website lead form → `captureWebsiteLead` API (live, honeypot + dedupe + consent)
- DMs: answer within working hours; every reply offers the 15-min demo and captures name/gym/city
- Website: demo section (self-serve sandbox), blog posts target long-tail search (renewals, GST, QR check-in)
- Every captured lead fires the Lead Welcome notification automatically (active workflow)

### 2.3 NURTURE — WhatsApp sequences (the money is in the follow-up)
Speed-to-lead decides everything: **respond < 5 min** when possible.
| Lead age | Message | Angle |
|---|---|---|
| 0 min | "Hi {name}, saw you run {gym}. Quick question — how do you track renewals today?" | curiosity, not pitch |
| 1 day | 30-sec demo reel + "This is what replaces the register" | product proof |
| 3 days | "Gym down the road ({city}) just went live with QR check-in" | FOMO / social proof |
| 7 days | Offer the 15-min demo, 2 time slots | urgency, low friction |
| 14 days | "Should I close your file or are you still planning?" | loss aversion, filter |

### 2.4 CONVERT — the demo that closes
- Demo flow (15 min): their problems (3 min) → live sandbox on THEIR use case (8 min) → pricing tiers + onboarding "live in a day" (4 min)
- Pricing (negotiable, owner approves final): Standard 15k/3.5k · Good 20k/4k · Premium 30k/4.5k
- Objections: "too expensive" → compare to 1 lost renewal/month; "my staff won't use it" → 30-second check-in demo; "I have software" → free data-import offer
- The closer: **1-day onboarding + free data import**. Remove all friction.

### 2.5 AMPLIFY — proof compounds
- First 3 clients: ask for a quote + metric at week 4, publish as testimonials (site renders them only when real — code already built)
- Referral loop: every live gym = a case study + a warm intro to 2-3 nearby gyms (geography clustering from the 174-lead dataset)

---

## 3. Automation map — what runs without the owner

| Workflow | Cadence | Status |
|---|---|---|
| IG/FB Publisher | 2x daily (10:00, 18:00 IST) | **ACTIVE** (reactivated Sep 29) |
| LinkedIn Publisher | Mon/Wed/Fri 11:00 IST | ACTIVE |
| Social Monitor | scheduled | ACTIVE (FB/IG comment reading needs re-auth) |
| Weekly Analytics | Monday 09:00 IST | ACTIVE |
| Daily Report | scheduled | ACTIVE |
| Lead Welcome (entity trigger) | on new lead | ACTIVE |
| Payment Receipt / At-Risk / Renewal (Gym OS product) | per event | ACTIVE |
| **Go-Live Watchdog** (domain + checklist) | 2x daily | ACTIVE |

**Content pipeline:** agent generates posts (branded generator) → ScheduledPost entity → publishers push at cadence → weekly analytics report every Monday grades what worked.

## 4. The 174-lead goldmine (highest-probability source)

We hold 174 real gym leads across 54 cities with an ICP strategy built. These are warmer than any cold audience. Plan:
1. **Tier the list** — ICP match: size, website status, digital maturity → Tier A (top ~40): personalized WhatsApp; Tier B: template WhatsApp; Tier C: email nurture
2. **Outreach wave 1 (Tier A):** 10/day, tracked in Lead entity with `next_follow_up_date` — never more than 10/day so replies stay answerable
3. **Every reply** enters the nurture sequence (2.3)
4. **Wave 2 (Tier B)** starts when Tier A is exhausted
> Outreach messages are drafted by the agent and **sent by/approved through the owner's WhatsApp** until volume justifies the WhatsApp Business API.

## 5. This week's content calendar (queued)

IG/FB 10:00 + 18:00 daily · LinkedIn Mon/Wed/Fri 11:00. Content rotates ops pain → proof → psychology → story. See ScheduledPost entity (generated Sep 29 batch).

## 6. Owner's daily 30 minutes

1. Morning: check agent report → approve/skip today's posts (2 min)
2. Midday: answer DMs that need a human + send that day's 10 outreach messages (20 min)
3. Evening: note anything weird; agent handles the rest

## 7. Weekly review (agent delivers every Monday)

- Follower/impression growth per platform · best/worst post · leads captured + response time · pipeline movement (leads → demos → closes) · next week's plan

## 8. Blockers (owner actions)

| Blocker | Impact | Fix |
|---|---|---|
| Instagram token broken (malformed) | ~half of publishing reach | Reconnect IG token in Meta settings, send agent the new token |
| FB lacks `pages_read_engagement` | can't read comments/monitoring | Re-auth FB with comment-reading permission |
| gymos.in DNS + GA4 + quotes | conversion tracking + proof | see GO-LIVE-CHECKLIST.md |
