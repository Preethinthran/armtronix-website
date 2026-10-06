# Design & Strategy Rationale - Armtronix

## Brand strategy

**Concept - "Hardware you can read."** Armtronix sells to plant heads and automation engineers who
trust what they can inspect: schematics, pinouts, scan times. The site treats every diagram as a
real engineering drawing - IEC 60617 symbols, ISA-5.1 instrument bubbles, IEC 61131 ladder logic,
QFP/SOIC packages, screw terminals, DIN-rail modules - so the page itself proves the company
understands the physical layer. It is the opposite of a flat SaaS landing page that hides the
hardware.

**Colour - graphite + PCB copper.** Dark graphite is the control-room surface engineers already
work in (SCADA, PLC IDEs). The single accent is copper, the colour of the traces and pads on the
boards Armtronix ships, with a gold pad-finish as a rare secondary. Green / yellow / red are
reserved for HMI status (running / caution / fault) and never used decoratively, so the page can
be scanned like an operator panel. Orange is also the recognised signature of automation hardware
(Rockwell, Phoenix Contact), where generic blue reads as software.

**Typography.** Inter Tight for display (compact, engineered, works in uppercase statements) and
Inter for body and instrument labels. Labels are tracked small-caps with tabular numerals - the way
a panel nameplate or drawing title block reads.

**Structure.** Hardware first, then signal, then data, then action, then proof - the order a
buyer validates a system: *is the board real → how does the signal travel → what do I see →
what does it do → can it scale → talk to an engineer.*

## UX & motion

- **Trace the intelligence** - a sticky schematic with scroll-spy: as you read about the MCU, the
  sensor input, the relay output, the comms and the power stage, that part of the circuit energises
  and packets start moving. Cumulative lighting ends with one fully operating system.
- **Signal journey** - six stages from sensor to automation, each a different drawing, powering up
  as you scroll: the story of one signal, told as hardware.
- **Live telemetry (simulated, labelled as such)** - ISA-tagged sensor nodes on a bus, bar-gauge
  readouts with a caution zone, and a trend recorder with axes, a limit line and a hover
  crosshair. Pause/resume lets a buyer freeze a spike and inspect it.
- **Automation loop** - push the sensor over 78 °C and watch the ladder rung energise, the
  controller act and the fan, pump, motor and beacon respond. Tap an output to force it.
- **Application and technology benches** - one stage, many environments. Selecting P&ID process
  control, energy single-line, robotics or PLC ladder swaps drawing, telemetry and copy as one
  continuous system.
- **Motion is signal motion** - wire flow, packets, LEDs, impellers, scan bars. Short, linear,
  machine-like; no bounce. `prefers-reduced-motion` freezes everything in its energised state.

## Client pitch value

- Shows physical reality (boards, MCUs, relays, RS485, DIN modules) next to live telemetry - the
  credibility gap versus software-only competitors closes in the first scroll.
- Engineering-literate drawings speak directly to the people who sign off pilots; they can see the
  company thinks in terms of loops, interlocks and field wiring.
- The retrofit story (legacy equipment + sensor node + gateway) lowers adoption fear for brownfield
  plants, the fastest path to a pilot.
- A short three-step enquiry (what are you building → describe the system → work email) replaces a
  generic contact form and pre-qualifies the lead for an engineer.
- Honest by design: all telemetry is labelled "simulation" - nothing implies operational data.
