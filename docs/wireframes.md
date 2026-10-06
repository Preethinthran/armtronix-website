# Wireframes & Layout Flow - Armtronix

Journey: **recognise the hardware → follow one signal → see it live → watch it act → find your
environment → trust the company → talk to an engineer.** One scroll, nine blocks, one primary CTA
("Talk to an engineer") repeated in the nav, hero, enquiry and footer.

```
DESKTOP (≥ 960)                                   MOBILE (< 960)
┌───────────────────────────────────────────┐    ┌──────────────────────┐
│ ▮ ARMTRONIX  Tech Solutions Apps …  [TALK]│    │ ▮ ARMTRONIX [CONTACT]☰│
├───────────────────────────────────────────┤    ├──────────────────────┤
│ HERO                                      │    │ HERO copy + CTAs     │
│  eyebrow / H1 / lede / [CTA][ghost]       │    │ ┌──────────────────┐ │
│                  ┌─────────────────────┐  │    │ │ controller board │ │
│                  │ controller PCB view │  │    │ │ (live packets)   │ │
│                  │  live packets + LEDs│  │    │ └──────────────────┘ │
│                  └─────────────────────┘  │    ├──────────────────────┤
├───────────────────────────────────────────┤    │ 01 TRACE (sticky    │
│ 01 TRACE THE INTELLIGENCE                 │    │    schematic on top, │
│ ┌──────────────────┐  01 MCU   ◄ active   │    │    stages scroll     │
│ │ sticky schematic │  02 Sensor input     │    │    beneath)          │
│ │ stages light up  │  03 Digital output   │    ├──────────────────────┤
│ └──────────────────┘  04 Comms · 05 Power │    │ 02 SIGNAL JOURNEY    │
├───────────────────────────────────────────┤    │  spine + 6 stages,   │
│ 02 SIGNAL JOURNEY   spine · 6 drawings    │    │  drawing under each  │
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 03 LIVE TELEMETRY (simulated)             │    │ 03 TELEMETRY         │
│  [ISA nodes ─ bus ─ gateway ─ cloud]      │    │  nodes · 2×3 gauges  │
│  [6 gauges]  [trend recorder + limit]     │    │  trend recorder      │
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 04 AUTOMATION LOOP                        │    │ 04 LOOP (stacked)    │
│  [sensor+ISA] ─► [ladder rung] ─► [outs]  │    │  sensor ▼ rung ▼ outs│
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 05 TECHNOLOGY BENCH  tabs ×6              │    │ 05 tabs (h-scroll)   │
│  [engineering drawing] │ description      │    │  drawing / description│
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 06 APPLICATIONS  rail ×8 │ live drawing   │    │ 06 rail (h-scroll)   │
│                          │ + metric       │    │  drawing / metric    │
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 07 WHY ARMTRONIX  5 statements + glyphs   │    │ 07 accordion         │
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 08 ENQUIRY  ① build  ② describe  ③ email  │    │ 08 enquiry (1 col)   │
├───────────────────────────────────────────┤    ├──────────────────────┤
│ 09 FINAL CTA + copper bus into MCU        │    │ 09 CTA + bus         │
│ footer                                    │    │ footer               │
└───────────────────────────────────────────┘    └──────────────────────┘
```

## Interaction notes

| Block | Primary interaction | Fallback / a11y |
|---|---|---|
| Hero board | passive: packets, LED cycle, live readout | `role="img"` + description |
| 01 Trace | scroll-spy lights the matching circuit; click/focus a stage | keyboard focus selects stage |
| 02 Journey | scroll progress fills the spine | static, all stages visible |
| 03 Telemetry | pause/resume; hover/touch trend to read a value | canvas is focusable with label |
| 04 Loop | "+ heat sensor", reset, tap an output to force it | outputs are `aria-pressed` buttons |
| 05 / 06 Benches | tabs / rail with arrow-key navigation | roving focus, `aria-selected` |
| 07 Why | hover, focus or tap to expand a statement | `aria-expanded` |
| 08 Enquiry | 3-step funnel, inline validation | native form, `role="alert"` errors |

Breakpoints: 1480 max content width · 960 stack hero/trace · 900 stack benches · 560 compact nav
CTA and smaller telemetry grid. All drawings are SVG, so they scale; label size steps up below 640 px.
