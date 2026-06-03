# Authentic Car Care — Project Notes & Handoff

> Single source of truth for this project. Read this first in any new session
> to get fully up to speed. Last updated: 2026-06-03.

## What this is
A live marketing + lead-capture website for **Authentic Car Care**, a mobile
car-detailing business serving Prince Edward Island (PEI), Canada.

- **Live site:** https://authenticcarcare.com (also www.)
- **Repo:** github.com/AccBusiness/authentic-car-care
- **Hosting:** Vercel (auto-deploys on every push to `main`, ~1 min)
- **Domain registrar:** GoDaddy (DNS: A `@` → 216.198.79.1, CNAME `www` → vercel)
- **Owner email:** getauthenticcare@gmail.com
- **Phone on site:** (902) 213-0825

## Tech / how it's built
- Single self-contained `index.html` at repo root. React 18 + Babel run
  **in-browser** (no build step) via `<script type="text/babel">` blocks.
  CSS is inlined in a `<style>` tag.
- Images live in `project/assets/`. Original uploads in `project/uploads/`.
- `preview.html` and `vendor/` are LOCAL-ONLY dev helpers (gitignored) used to
  screenshot/test offline — they are NOT part of the deployed site.
- Editing model: the owner is non-technical. Changes are made by editing
  `index.html`, committing, and pushing — Vercel redeploys automatically.
  Small text/price edits can also be done directly on GitHub in the browser.

## Site sections (in order)
1. Cinematic intro animation (logo + name lockup beside a black car; click to skip)
2. Hero (silver studio car image fading into the page)
3. Services: Express Wash $60, Interior Care from $110, Exterior Care from $110,
   Complete Care from $200 (flip cards; tap on mobile). Add-ons: Pet hair $30,
   Hand wax $50 (wax only with Express/Exterior; included in Complete).
4. Before/After gallery (drag slider). Real photos: Subaru Outback (interior),
   Honda CR-V (interior), Ford Escape (exterior). Tabs: All / Interior / Exterior.
5. Booking form (3 steps) — see "Lead capture" below.
6. FAQ
7. Footer

## Lead capture (IMPORTANT — this is wired and live)
- The 3-step booking form sends each lead to a **Google Apps Script Web App**,
  which: (1) appends a row to a Google Sheet, (2) emails getauthenticcare@gmail.com,
  (3) saves uploaded photos to Drive (in a per-customer subfolder).
- Endpoint URL is hard-coded in `index.html` as `BOOKING_ENDPOINT`.
- The Apps Script source lives in `backend/google-apps-script.gs`. Setup steps in
  `backend/SETUP.md`. To change the script, re-paste it into Apps Script and
  redeploy as a NEW VERSION (URL stays the same).
- Photo handling: browser resizes each photo to ~1400px before sending (raw phone
  photos were too big and got silently dropped). Photos are processed ONE AT A TIME
  with a pause + one retry (avoids phone memory exhaustion dropping a photo).
- HEIC (iPhone) and Live Photos can't be decoded by browser canvas — the form
  now DETECTS these on upload and warns the customer (tip: take a screenshot, or
  set iPhone Camera → Formats → "Most Compatible"). It does not auto-convert.

## Business accuracy rules (things the owner does / doesn't offer)
- NO paint correction / polishing / sealant. (Removed all such wording.)
  Clay bar and hand wax ARE offered.
- Payment: cash or e-transfer only. NO credit/debit cards.
- Do NOT promise a specific response time ("within an hour" was removed) — keep
  it generic ("we'll be in touch soon").
- Mobile detailing, weekends, all over PEI.

## Conventions that have worked well this project
- After每 change: rebuild preview, screenshot with Playwright (chromium at
  /opt/pw-browsers/chromium-1194/chrome-linux/chrome, --no-sandbox), VERIFY
  visually, then commit + push. Always confirm `git` local == origin/main.
- Mobile and desktop intro styles are intentionally SEPARATE (changing one must
  not affect the other). Owner reviews both.
- Owner reviews via screenshots here and on their own phone/desktop.

## Open / next up
- (Optional) Re-deploy the updated Apps Script for per-customer photo subfolders.
- NEXT SESSION: set up Google Analytics + first Google Ads campaign ($600 budget).
  Owner will work with a marketing strategist. Likely needs: GA4 tag added to
  index.html, conversion tracking on booking form submit, maybe a Google Ads
  conversion event when a lead is sent.
