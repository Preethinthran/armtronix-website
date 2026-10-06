# Armtronix IoT - Design System v3

**Theme:** dark graphite, copper accent · **Fonts:** Inter Tight (display) + Inter (body) - unchanged
**Stack:** React 18 + Vite 5 + framer-motion + plain CSS
Single source of truth for colour, type, drawing language and component usage.
All colour lives in `src/styles/tokens.css`; nothing in a component may hard-code a hex value.

## 1. Why this design

Armtronix sells to plant heads and automation engineers who live in SCADA screens, PLC IDEs and
control rooms. The site has to feel like their tools - dense, exact, dependable - and it has to
show hardware, not hide it. Every diagram is therefore drawn with real engineering components
(IEC 60617 schematic symbols, ISA-5.1 instrument bubbles, IEC 61131 ladder logic, IC packages,
terminal blocks, DIN-rail modules) rather than boxes and circles.

## 2. Why copper (and not blue)

- **It is the product.** Copper is the colour of the traces on every PCB Armtronix ships; the
  gold finish on pads is the secondary accent. The brand colour is literally the hardware.
- **Industrial convention.** Warm orange is the signature of automation hardware (Rockwell,
  Phoenix Contact, safety enclosures); generic SaaS blue is not.
- **Clear signal hierarchy.** Copper = actionable / energised. Green = running / OK.
  Yellow = caution (threshold near breach). Red = fault. Status colours are never decorative, so
  an operator can scan the page like an HMI panel.
- **Contrast.** `#e2813b` on `#0a0c0f` ≈ 6.9:1; text on copper buttons is near-black `#170c04`
  (≈ 6.8:1), not white (2.8:1).

## 3. Colour tokens

| Token | Value | Use |
|---|---|---|
| `--bg-0` / `--bg-1` | `#0a0c0f` / `#0f1317` | page / alt section & panels |
| `--surface` / `--surface-2` | `#14181d` / `#1a1f25` | cards, component bodies |
| `--line` / `--line-strong` | `#2a3037` / `#3b434c` | hairlines / idle wires |
| `--ink` `--muted` `--faint` | `#f3f4f6` `#9199a3` `#78828d` | text tiers |
| `--primary` / `--primary-hover` | `#e2813b` / `#f09856` | CTA, active, energised wire |
| `--signal` | `#f2a263` | accent text, focus ring |
| `--primary-ink` | `#170c04` | text on copper |
| `--gold` | `#d9b45a` | pad finish on board drawings |
| `--ok` / `--warn` / `--fault` | `#3ddc97` / `#f5c84c` / `#ff5c5c` | HMI status only |
| `--board` / `--board-line` | `#0d1a17` / `#1d3a33` | solder-mask substrate in board views |

`*-rgb` triplets exist for translucent fills: `rgba(var(--primary-rgb), .12)`.

## 4. Typography (unchanged)

Display: Inter Tight 600/700, tight tracking, uppercase for statements. Body: Inter 400/500/600.
Labels in diagrams are small-caps Inter with generous tracking (`.eg-t`), because instrument
panels label, they don't narrate. Numerals are tabular.

## 5. Engineering drawing language (`src/components/eng/`)

- `Symbols.jsx` - the component library: passives (resistor, capacitor, inductor, diode, fuse,
  ground), switching (relay coil, contact, ladder contact NO/NC, ladder coil, op-amp), ISA
  instrument `Bubble`, field devices (probe, pressure transmitter, accelerometer, CT, motor,
  pump, fan, valve, tank, heater), network (cloud, database, gateway), PCB parts (QFP/SOIC `IC`,
  `Terminals`, `Rj45`, `Relay`, `Smd`, `Crystal`, `Via`, `MountHole`), `DinModule`, `ScopeFrame`.
- `eng.css` - one class vocabulary: `.eg-w` wires, `.eg-b` bodies, `.eg-cu` copper, `.eg-pad`
  gold, `.eg-t` labels, `.eg-trace`/`.eg-limit` for plots. **State is a modifier class:**
  `.on` energised, `.hot` caution, `.bad` fault. Diagrams light up by toggling a class, so
  transitions are free and the palette is swappable in one file.
- `Packet` - a signal packet travelling a wire (SMIL `animateMotion`); returns `null` under
  `prefers-reduced-motion`.
- Label sizes bump automatically below 640 px so drawings stay legible on a phone.

## 6. Components

- **Buttons** - `.btn`, uppercase 0.8rem; `--primary` solid (dark ink), `--ghost` outline that
  turns copper on hover. Hover: arrow nudge only.
- **Panels** - 1px `--line`, 6px radius, `--bg-1` fill. No shadows, no gradients.
- **Telemetry** - number in display type, unit muted, bar gauge with hatched caution zone.
  Trend recorder: gridded canvas, axis in engineering units, dashed limit line, hover crosshair.
- **Nav** - sticky, hairline bottom border, active link underlined in copper.

## 7. Motion

Framer-motion reveal: fade + 18px rise, 0.55 s, once. Everything else is *signal* motion:
dashed-wire flow, packets, LED blink, rotating impellers, scan bars. Machine-like, never bouncy.
`prefers-reduced-motion` removes all of it and leaves the drawing in its energised state.

## 8. Section map

Hero (controller board) → 01 Trace the intelligence (scroll-spy schematic) → 02 Signal journey →
03 Live telemetry (simulated) → 04 Automation loop (interactive) → 05 Technology bench →
06 Application explorer → 07 Why Armtronix → 08 Enquiry funnel → 09 Final CTA / footer.
