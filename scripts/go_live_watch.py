#!/usr/bin/env python3
"""Gym OS go-live watchdog.

Checks the live deployed state (DNS records, gymos.in traffic, sitemap,
GA4 tag, testimonials, app + mirror health) against GO-LIVE-CHECKLIST.md
and ticks any checkbox whose deployed evidence is now observed.

Usage:  python3 scripts/go_live_watch.py   (run from the repo root)

Ticking requires OBSERVED evidence of the deployed state — never a claim.
Manual-only steps are left untouched. Never un-ticks a box already ticked.
Exit code 0 always; print ::warning lines on downtime for CI use.
"""
import re, subprocess, urllib.request, datetime, sys

APP = "https://gym-os-app.vercel.app"
MIRROR = "https://somilsharma2000.github.io/gym-os"
WA_NUMBER = "917737077479"          # real sales number — marker of the new app
VERCEL_A = "76.76.21.21"

def fetch(url, timeout=20):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "go-live-watch/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, str(e)

def dns(query, rtype):
    # try dig, fall back to DNS-over-HTTPS (works everywhere)
    try:
        out = subprocess.run(["dig", "+short", query, rtype],
                             capture_output=True, text=True, timeout=15).stdout
        recs = [l.strip().rstrip(".") for l in out.splitlines() if l.strip()]
        if recs:
            return recs
    except Exception:
        pass
    try:
        import json
        url = f"https://dns.google/resolve?name={query}&type={rtype}"
        with urllib.request.urlopen(url, timeout=15) as r:
            d = json.loads(r.read())
        return [a.get("data", "").rstrip(".") for a in d.get("Answer", [])]
    except Exception:
        return []

# ---- gather evidence ----
app_code, app_html = fetch(APP + "/")
app_ok = app_code == 200 and WA_NUMBER in app_html
mirror_code, _ = fetch(MIRROR + "/")
mirror_ok = mirror_code == 200

gym_code, gym_html = fetch("https://gymos.in/")
gym_is_new = WA_NUMBER in gym_html
gym_is_old = "Hostinger" in gym_html or (gym_code == 200 and not gym_is_new)

sitemap_code, sitemap = fetch(APP + "/sitemap.xml")
site_url_done = sitemap_code == 200 and "https://gymos.in<" in sitemap

a_records = dns("gymos.in", "A")
dns_a_done = VERCEL_A in a_records
www_cname = dns("www.gymos.in", "CNAME")
dns_cname_done = any("cname.vercel-dns.com" in c for c in www_cname)

ga_done = app_ok and "googletagmanager.com/gtag/js" in app_html
quotes_done = app_ok and "Gyms that stopped leaking." in app_html

checks = {
    "dns-a": dns_a_done,
    "dns-cname": dns_cname_done,
    "vercel-domain": gym_is_new,          # new app observed serving on gymos.in
    "site-url": site_url_done,            # sitemap locs flipped to gymos.in
    "ga-id": ga_done,                     # gtag script observed in deployed HTML
    "quotes": quotes_done,                # testimonials section observed live
}
print("evidence:", {k: v for k, v in checks.items()})

# ---- rewrite status block ----
now = datetime.datetime.now(datetime.timezone.utc)
ts = now.strftime("%Y-%m-%d %H:%M UTC")
status = f"""_Auto-updated by the go-live-watch workflow (every 6 h). Last check: **{ts}**_

| Surface | State |
|---|---|
| Marketing app ({APP.replace('https://','')}) | {'**UP**' if app_ok else '**DOWN**'} |
| Pages mirror (somilsharma2000.github.io/gym-os) | {'**UP**' if mirror_ok else '**DOWN**'} |
| gymos.in DNS A | {', '.join(a_records) if a_records else 'unresolved'} {'→ **POINTED AT VERCEL**' if dns_a_done else '→ still old host'} |
| gymos.in traffic | {'**SERVING NEW APP**' if gym_is_new else ('old Hostinger site' if gym_is_old else 'no response')} |
| GA4 | {'**LIVE** (gtag observed)' if ga_done else 'not connected'} |
| Testimonials | {'**LIVE** (quotes published)' if quotes_done else 'no quotes yet (renders only with real quotes)'} |
"""
with open("GO-LIVE-CHECKLIST.md") as f:
    doc = f.read()
doc = re.sub(
    r"<!-- status:start -->.*?<!-- status:end -->",
    "<!-- status:start -->\n" + status + "<!-- status:end -->",
    doc, flags=re.S)

# ---- tick observed boxes (never un-tick a manually ticked box) ----
for marker, done in checks.items():
    if done:
        doc = doc.replace(f"- [ ] <!-- watch:{marker} -->", f"- [x] <!-- watch:{marker} -->")

with open("GO-LIVE-CHECKLIST.md", "w") as f:
    f.write(doc)

if not app_ok:
    print("::warning::Marketing app DOWN or showing wrong content")
sys.exit(0)
