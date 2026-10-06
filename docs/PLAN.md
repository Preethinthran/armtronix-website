> **Status note:** this is the original kickoff plan. The build has since moved on - current IA, palette (graphite + copper), fonts and drawing language are defined in `DESIGN-SYSTEM.md` (v3); rationale for submission is in `design-rationale.md`. Where they disagree, those two win.

# Armtronix - Build Plan (Industrial IoT & Hardware Automation)

**Deadline:** Oct 6, 2026, 10:00 AM IST (~18 hrs left as of Oct 5 PM)
**Stack (locked, same as hameediyah/):** React 18 + Vite 5 + framer-motion + plain CSS (per-section .css). No Tailwind - faster to hand-tune industrial theme + zero config risk. Deploys clean to Vercel.
**Reference truth:** Brief says `armtronix.com` but that domain is now a MY infra group. Real Indian IIoT firm is **`armtronix.net`** (Indusπ, MCU, Retro→IIoT, Modular 4 DIO, PLC-like 2026, IPC-Mini). Use .net content, cite it in rationale.

## 1. Requirement analysis (from brief §2 Brand 2)

| Must-have | Interpretation | Anti-pattern to avoid |
|---|---|---|
| Precision-engineered, dependable, cutting-edge feel | Dark blueprint theme, mono labels, tight tolerances, real spec numbers (RS485 isolated, 8DI/8RO, RTC, WiFi+Ethernet) | Flat SaaS gradient hero with generic illustration |
| Bridge physical + digital | Every product card pairs PCB photo/line-art + live data path (sensor → edge → MQTT → dashboard → relay act) | Hiding hardware behind marketing copy |
| Real boards, MCUs, factory components | Product grid with 6 real SKUs from armtronix.net + wiring/pinout visuals | Stock photos |
| Live cloud telemetry simulation | Canvas sparklines, threshold alerts, pause-on-hover, simulated MQTT ticker | Static screenshots |
| Dark-mode aesthetic, circuit line art | Default dark (`#060b12`), optional light toggle if time; SVG PCB traces in hero | Light-only flat page |
| Interactive sensor widgets | Telemetry section = hero interactive, not decoration | Non-interactive charts |
| Clear B2B funnel for buyers/engineers | 3-step quote: use-case → plant size → email + spec-sheet download + Node-RED snippet for engineers | Newsletter-only CTA |

Scoring map: Storytelling 25% = factory-floor narrative (brownfield→smart); UI 25% = Space Grotesk + IBM Plex Mono + teal/amber on navy; Motion 25% = Framer-motion reveals + canvas telemetry + magnetic buttons; Polish 15% = responsive + `prefers-reduced-motion` + incognito-tested Vercel URL; Strategy 10% = docs/design-rationale.md.

## 2. Information architecture (single-page, 7 blocks)

1. `Hero` - headline "Physical machines. Digital nervous system." + PCB SVG + dual CTA + ticker
2. `TrustStrip` - TIDE 2.0 / MeitY / KLE / IIoT•PLC•Robotics marquee
3. `Products (#products)` - 6 cards from `src/data/products.js`, filter by [All / Edge / Retrofit / Expansion]
4. `Telemetry (#telemetry)` - 4 live widgets (temp/vibration/power/OEE) + alert log
5. `Factory (#factory)` - brownfield→smart before/after slider + OEE calculator + testimonial quote
6. `DevStack (#developers)` - SENSE→EDGE→TRANSPORT→CLOUD→ACT ladder + Node-RED JSON + RS485 wiring note
7. `Conversion (#contact)` - pilot-quote form + spec-sheet downloads + footer

Mobile: single column, sticky CTA shrinks to icon; telemetry grid 1-col, sparklines keep 120px height.

## 3. Visual system

- Colors: `--bg0 #060b12`, `--bg1 #0a1220`, `--teal #38e1c6` (signal/ok), `--amber #ffb224` (warn/CTA accent), `--alert #ff5d5d`, `--muted #93a4bd`. Contrast ≥4.5 for body.
- Type: Display `Space Grotesk 600/700`, Body `Inter 400/500`, Mono `IBM Plex Mono` for specs/pins/values. Loaded in index.html (already wired).
- Texture: `.grid-bg` blueprint grid + per-card 1px `line` borders + corner screw-dots (CSS). Reuse hameediyah grain technique but blue-tinted.
- Motion: Framer-motion `whileInView` fade/slide 0.5s, hero trace-dash animation (SVG `stroke-dashoffset`), button lift -2px, number tween on telemetry. Respect reduced-motion.

## 4. Telemetry implementation (the differentiator)

`src/sections/Telemetry.jsx` - currently simulated with setInterval. Finish as:
- `useRef` canvas per channel, 60-point ring buffer, `requestAnimationFrame` @ ~1Hz push, draw teal line + amber threshold dashed line.
- Hover freezes channel (pause buffer), toggle sets threshold, breach → push to alert log + flash card border red.
- Add `?demo=cnc|energy` query to preset bases. Later swap generator with real MQTT/ws without changing UI.
- Keep CPU low: one shared interval, canvas 2x DPR capped, no libs beyond React.

## 5. Factory + conversion details

- Before/after: CSS range slider clipping two divs (grayscale photo vs telemetry overlay). Use CSS-only to save time.
- OEE calculator: 3 number inputs (downtime hrs/week, cost/hr, machines) → `savings = hrs*cost*4.3*0.32` (32% idle-cut assumption, label it). One-line JS, big pitch value.
- Quote form: native form → `mailto:sales@armtronix` fallback + Google Form link; add `download` links to `/public/specs/*.pdf` (export 1-pagers tonight if time, else link armtronix.net product pages).

## 6. Tonight's build order (fastest path to shippable)

1. `npm install && npm run dev` - verify scaffold runs (5 min)
2. Flesh `Hero + TrustStrip + Products` CSS (2 hrs) - highest visual weight
3. Finish `Telemetry` canvas (2.5 hrs) - highest motion weight
4. `Factory` slider + calculator + testimonial (1.5 hrs)
5. `DevStack + Conversion + Footer + Navbar` polish (1.5 hrs)
6. Responsive pass 390px/768px/1280px + reduced-motion (1 hr)
7. `npm run build`, deploy Vercel, incognito test, write `submission.txt` entries (1 hr)
8. Fill `docs/design-rationale.md` + wireframe screenshots (1 hr, parallelizable)

Total ~10-11 hrs → fits overnight buffer before 10 AM deadline.

## 7. File map (created)

```
armtronix/
  package.json, vite.config.js, index.html, .gitignore
  src/main.jsx, src/App.jsx
  src/components/Navbar.jsx
  src/sections/Hero|TrustStrip|Products|Telemetry|Factory|DevStack|Conversion|Footer.jsx
  src/data/products.js (6 real SKUs + channels + stack)
  src/styles/global.css (industrial tokens)
  docs/PLAN.md (this file)
```

Next files to add: `src/sections/*.css` (one per section, copy pattern from hameediyah), `src/components/Reveal.jsx + CircuitTrace.jsx`, `public/specs/`, `docs/design-rationale.md`, `docs/wireframes.md`.

## 8. Deploy + submit checklist

- [ ] `npm run build` clean, no broken imports
- [ ] Vercel import `armtronix/`, test incognito (no login wall)
- [ ] GitHub repo public, link ready
- [ ] `submission.txt` lines: Armtronix live URL + repo + 5-line rationale
- [ ] Screenshots / screen recording in Drive folder

## 9. Risks & cuts if time runs out

- Cut light-mode toggle, keep dark-only (brief says "options" - note as future).
- Cut real photos, use SVG board art + spec tables (avoids asset licensing).
- Never cut: products grid, telemetry widget, quote funnel, responsiveness - these are the graded core.
