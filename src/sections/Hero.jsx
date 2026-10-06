import { useId, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLiveValue, useCycle } from '../components/useLive'
import {
  Txt, Packet, Node, Via, IC, Relay, Smd, Crystal, Rj45, MountHole,
} from '../components/eng/Symbols'
import './Hero.css'

const EASE = [0.22, 1, 0.36, 1]

/* ---------- local board-level parts (same classes as the shared library) ---------- */

/* Horizontal screw terminal block. Wires leave from the side facing `exit`. */
function TermBlock({ x, y, n, pitch = 16, labels, labelPos = 'above', exit = 'bottom', h = 20 }) {
  const w = n * pitch
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={w} height={h} rx="1.5" className="eg-b" />
      {Array.from({ length: n }).map((_, i) => {
        const c = pitch / 2 + i * pitch
        return (
          <g key={i}>
            {i > 0 && <path d={`M${i * pitch} 1.5 V${h - 1.5}`} className="eg-w thin" style={{ opacity: 0.5 }} />}
            <circle cx={c} cy={h / 2} r="4.4" className="eg-b deep" />
            <path d={`M${c - 2.6} ${h / 2 - 2.6} L${c + 2.6} ${h / 2 + 2.6}`} className="eg-w thin" />
            <rect x={c - 2.5} y={exit === 'bottom' ? h : -3} width="5" height="3" className="eg-pad" />
            {labels?.[i] && (
              <text x={c} y={labelPos === 'above' ? -6 : h + 10} textAnchor="middle" className="eg-t sm">{labels[i]}</text>
            )}
          </g>
        )
      })}
    </g>
  )
}

/* Two-pole vertical terminal block, wires enter from the left edge. */
function TermV({ x, y, labels, pitch = 12 }) {
  const h = pitch * 2
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="22" height={h} rx="1.5" className="eg-b" />
      {[0, 1].map((i) => {
        const cy = pitch / 2 + i * pitch
        return (
          <g key={i}>
            {i > 0 && <path d={`M1.5 ${pitch} H20.5`} className="eg-w thin" style={{ opacity: 0.5 }} />}
            <circle cx="12" cy={cy} r="4.2" className="eg-b deep" />
            <path d={`M9.4 ${cy - 2.6} L14.6 ${cy + 2.6}`} className="eg-w thin" />
            <rect x="-3" y={cy - 2.5} width="3" height="5" className="eg-pad" />
            {labels?.[i] && <text x="27" y={cy + 2.6} className="eg-t sm">{labels[i]}</text>}
          </g>
        )
      })}
    </g>
  )
}

/* Radial electrolytic capacitor, top view with polarity band. */
function ElCap({ x, y, r = 8.5 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} className="eg-b" />
      <path d={`M0 ${-r + 0.8} A${r - 0.8} ${r - 0.8} 0 0 0 0 ${r - 0.8} Z`} className="eg-b deep" style={{ strokeWidth: 0 }} />
      <circle r={r - 2.4} className="eg-w thin" style={{ opacity: 0.5 }} />
      <path d="M3.4 -1.4 H6.2 M4.8 -2.8 V0" className="eg-w thin" style={{ stroke: 'var(--ink)' }} />
    </g>
  )
}

/* Shielded power inductor (SMD) with wound-top look. */
function PowerInd({ x, y, w = 26, h = 18, on }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" className={`eg-ic ${on ? 'on' : ''}`} />
      <rect x={-w / 2} y={-h / 2} width="5" height={h} className="eg-pad" />
      <rect x={w / 2 - 5} y={-h / 2} width="5" height={h} className="eg-pad" />
      <circle r="5.2" className="eg-w thin" />
      <path d="M-3.4 0 a1.7 1.7 0 0 1 3.4 0 a1.7 1.7 0 0 1 3.4 0" className="eg-w thin" style={{ stroke: 'var(--primary)' }} />
    </g>
  )
}

/* ---------- geometry (viewBox 0 0 520 432) ---------- */

const MCU = { x: 260, y: 215, w: 64, pins: 8 }
/* pin pitch of the QFP, matching the shared IC symbol */
const pinAt = (i) => -MCU.w / 2 + (MCU.w / (MCU.pins + 1)) * (i + 1)
const mx = (i) => +(MCU.x + pinAt(i)).toFixed(2)
const my = (i) => +(MCU.y + pinAt(i)).toFixed(2)
const TIP = MCU.w / 2 + 7 // pin tip distance from the MCU centre

/* sensor inputs: J2 terminals -> MCU left pins, staggered so traces never cross */
const SENSE = [0, 1, 2, 3].map((k) => {
  const x0 = 62 + 16 * k
  const yh = 150 - 12 * k
  const py = my(k)
  const ex = 217
  const xs = +(ex - (py - yh)).toFixed(2)
  return { d: `M${x0} 56 V${yh} H${xs} L${ex} ${py} H${MCU.x - TIP}`, via: [xs, yh] }
})

/* MCU right pins -> relay coil pads */
const RY = [134, 182, 230]
const COIL = [
  `M${MCU.x + TIP} ${my(0)} H316 V${RY[0] - 6} H362`,
  `M${MCU.x + TIP} ${my(1)} H330 V${RY[1] - 6} H362`,
  `M${MCU.x + TIP} ${my(2)} H342 V${RY[2] - 6} H362`,
]

/* Ethernet: MCU bottom pins -> PHY (U2) -> RJ45 */
const ETH_X = [84, 92, 100, 108]
const ETH = [0, 1, 2, 3].map((i) => `M${mx(i)} ${MCU.y + TIP} V${266 + 8 * i} H${ETH_X[i]} V311`)
const ETH_OUT = [84, 92, 108, 116].map((x) => `M${x} 349 V366`)

/* RS485: MCU bottom pins -> driver (U4) -> A / B / GND terminal */
const RS_X = [374, 382, 390]
const RS = [5, 6, 7].map((p, k) => `M${mx(p)} ${MCU.y + TIP} V${290 - 8 * k} H${RS_X[k]} V311`)
const RS_A = 'M382 349 V356 L374 364 V372'
const RS_B = 'M390 349 V372'
const RS_G = 'M398 349 V356 L406 364 V372'

/* Power: 24 VDC in -> F1 -> D1 -> U3 buck -> L1 -> 3V3 rail -> MCU */
const PWR_IN = 'M435 56 V74 H313.2 V81'
const PWR_SW = 'M286.8 115 V122 H263'
const PWR_RAIL = `M237 122 H${mx(0)} V${MCU.y - TIP}`

/* Detailed controller board: top view of the AX-CTRL-01 PCB.
   Signal story: sensor -> MCU, MCU -> relay, MCU -> RS485 / ETH uplink, 24VDC rail. */
function Board() {
  const reduce = useReducedMotion()
  const pid = useId().replace(/:/g, '')
  const temp = useLiveValue({ base: 24.7, jitter: 0.7, min: 22, max: 28, interval: 1600, reduce })
  const rh = useLiveValue({ base: 63.4, jitter: 1.4, min: 58, max: 69, interval: 1900, reduce })
  const amps = useLiveValue({ base: 4.82, jitter: 0.16, min: 4.4, max: 5.3, interval: 1400, reduce })
  const outIdx = useCycle(3, 2600, reduce)

  /* unused MCU pins fan out to dim stubs with vias, as on a real layout */
  const stubs = []
  for (let i = 4; i < 8; i++) stubs.push({ d: `M${MCU.x - TIP} ${my(i)} H205`, v: [205, my(i)] })
  for (let i = 3; i < 8; i++) {
    const sx = i < 6 ? 312 : 306
    stubs.push({ d: `M${MCU.x + TIP} ${my(i)} H${sx}`, v: [sx, my(i)] })
  }
  for (let i = 1; i < 5; i++) stubs.push({ d: `M${mx(i)} ${MCU.y - TIP} V160`, v: [mx(i), 160] })
  stubs.push({ d: `M${mx(4)} ${MCU.y + TIP} V264`, v: [mx(4), 264] })

  return (
    <svg className="board" viewBox="0 0 520 432" role="img"
      aria-label="Armtronix AX-CTRL-01 controller board: sensor inputs, microcontroller, relay outputs, Ethernet, RS485 and 24 volt power stage">
      <defs>
        <pattern id={`pour${pid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(var(--primary-rgb), 0.07)" strokeWidth="1.6" />
        </pattern>
      </defs>

      {/* live telemetry readout */}
      <Txt x="20" y="16" cls="mid num hi">{temp.toFixed(1)} °C · {rh.toFixed(1)} % RH · {amps.toFixed(2)} A · 98.2 % UPTIME</Txt>

      {/* PCB substrate */}
      <rect x="20" y="30" width="480" height="388" rx="10" className="eg-b board" />
      <rect x="20" y="30" width="480" height="388" rx="10" fill={`url(#pour${pid})`} stroke="none" />
      <rect x="20" y="30" width="480" height="388" rx="10" fill="none" stroke="rgba(var(--primary-rgb), 0.14)" strokeWidth="5" />
      <rect x="27" y="37" width="466" height="374" rx="6" className="eg-silk" strokeDasharray="1 3" />

      {/* ---- copper layer ---- */}
      <g>
        {SENSE.map((s, k) => <path key={k} d={s.d} className={`eg-cu ${k < 2 ? 'on' : ''}`} />)}
        <path d="M122 56 V92" className="eg-cu dim" />
        {stubs.map((s, i) => <path key={i} d={s.d} className="eg-cu dim" />)}
        {COIL.map((d, i) => <path key={i} d={d} className={`eg-cu ${i === outIdx ? 'on' : ''}`} />)}
        {RY.map((y, i) => (
          <g key={i}>
            <path d={`M362 ${y + 6} H350`} className="eg-cu dim" />
            <path d={`M398 ${y - 6} H432 M398 ${y + 6} H432`} className={`eg-cu ${i === outIdx ? 'on' : ''}`} />
          </g>
        ))}
        {ETH.map((d, i) => <path key={i} d={d} className={`eg-cu ${i < 2 ? 'on' : ''}`} />)}
        {ETH_OUT.map((d, i) => <path key={i} d={d} className={`eg-cu ${i < 2 ? 'on' : ''}`} />)}
        {RS.map((d, i) => <path key={i} d={d} className="eg-cu on" />)}
        <path d={RS_A} className="eg-cu on" />
        <path d={RS_B} className="eg-cu on" />
        <path d={RS_G} className="eg-cu dim" />
        <path d="M374 366 H377.5 M386.5 366 H390" className="eg-cu" />
        <path d={PWR_IN} className="eg-cu on" style={{ strokeWidth: 2.4 }} />
        <path d="M364 74 V83" className="eg-cu on" style={{ strokeWidth: 2.2 }} />
        <path d={PWR_SW} className="eg-cu on" style={{ strokeWidth: 2.2 }} />
        <path d={PWR_RAIL} className="eg-cu on" style={{ strokeWidth: 2.2 }} />
        <path d="M457 66 V84" className="eg-cu dim" style={{ strokeWidth: 2.2 }} />
        <path d={`M${mx(0)} 126 H222 V129.5 M${mx(0)} 152 H222 V155.5 M281 122 V129.5 M${mx(7)} ${MCU.y - TIP} V168 H292 V164.5`} className="eg-cu on" />
        <path d={`M267.25 153 V160 L${mx(5)} 163.5 V${MCU.y - TIP} M281.25 153 V160 L${mx(6)} 163.5 V${MCU.y - TIP}`} className="eg-cu" />
      </g>

      {/* vias on bends and fan-outs */}
      {SENSE.map((s, k) => <Via key={k} x={s.via[0]} y={s.via[1]} dim={k > 1} />)}
      {stubs.map((s, i) => <Via key={i} x={s.v[0]} y={s.v[1]} dim r={2.2} />)}
      <Via x="457" y="84" dim />
      <Via x="222" y="144" dim />
      <Via x="222" y="170" dim />
      <Via x="281" y="146" dim />
      <Via x="122" y="92" dim />
      {RY.map((y, i) => <Via key={i} x="350" y={y + 6} dim r={2.2} />)}
      <Node x="364" y="74" r="1.8" />
      <Node x={mx(0)} y="126" r="1.8" />
      <Node x={mx(0)} y="152" r="1.8" />
      <Node x="281" y="122" r="1.8" />
      <Node x="374" y="366" r="1.8" />
      <Node x="390" y="366" r="1.8" />

      {/* ---- brand + silkscreen ---- */}
      <g aria-hidden="true">
        <path d="M144 80 l7 -12 l7 12 z" className="eg-silk" />
        <Txt x="166" y="80" cls="big hi">ARMTRONIX</Txt>
        <Txt x="144" y="94" cls="sm dim">INDUSTRIAL IOT CONTROLLER</Txt>
        <Txt x="140" y="60" cls="sm">J2 · SENSOR IN</Txt>
        <Txt x="416" y="55" cls="sm" anchor="end">J5 · 24 VDC IN</Txt>
        <Txt x="474" y="116" cls="sm" anchor="end">J3 · RELAY OUT</Txt>
        <Txt x="300" y="184" cls="sm">U1</Txt>
        <Txt x="250" y="108" cls="sm" anchor="middle">L1</Txt>
        <Txt x="244" y="142" cls="sm hi">3V3</Txt>
      </g>

      {/* ---- components ---- */}
      <TermBlock x={54} y={46} n={5} labels={['AI1', 'AI2', 'AI3', 'AI4', 'GND']} />
      <TermBlock x={424} y={46} n={2} pitch={22} labels={['+24V', '0V']} />

      {/* power stage */}
      <Smd x={412} y={74} w={14} h={6} tone />
      <Txt x="412" y="66" cls="sm" anchor="middle">F1</Txt>
      <Smd x={388} y={74} w={10} h={5} />
      <Txt x="388" y="66" cls="sm" anchor="middle">D1</Txt>
      <ElCap x={364} y={92} />
      <Txt x="376" y="96" cls="sm">C1</Txt>
      <IC x={300} y={98} w={44} h={20} pins={4} kind="dual" label="BUCK" on />
      <Txt x="326" y="116" cls="sm">U3</Txt>
      <PowerInd x={250} y={122} on />
      <Smd x={281} y={134} rot={90} />
      <Txt x="288" y="135" cls="sm">D2</Txt>
      <Smd x={222} y={134} rot={90} />
      <Smd x={222} y={160} rot={90} />
      <Smd x={292} y={160} rot={90} />
      <Txt x="212" y="138" cls="sm" anchor="end">C2</Txt>
      <Txt x="212" y="164" cls="sm" anchor="end">C3</Txt>
      <Txt x="299" y="164" cls="sm">C6</Txt>

      {/* MCU + crystal */}
      <IC x={MCU.x} y={MCU.y} w={MCU.w} h={MCU.w} pins={MCU.pins} kind="quad" on label="AX-MCU" sub="32-BIT" />
      <Crystal x={274.25} y={148} />
      <Txt x="289" y="151" cls="sm">Y1</Txt>

      {/* relay bank + outputs */}
      {RY.map((y, i) => (
        <g key={i}>
          <Relay x={380} y={y} on={i === outIdx} label={`K${i + 1}`} />
          <TermV x={432} y={y - 12} labels={['NO', 'COM']} />
        </g>
      ))}

      {/* Ethernet */}
      <IC x={100} y={330} w={48} h={24} pins={5} kind="dual" label="PHY" on />
      <Txt x="130" y="334" cls="sm">U2</Txt>
      <Rj45 x={100} y={380} on />
      <Txt x="122" y="383" cls="sm">J1 · ETH</Txt>

      {/* RS485 */}
      <IC x={390} y={330} w={48} h={24} pins={5} kind="dual" label="RS485" on />
      <Txt x="420" y="334" cls="sm">U4</Txt>
      <Smd x={382} y={366} w={9} h={4.4} tone />
      <Txt x="368" y="369" cls="sm" anchor="end">R5 120Ω</Txt>
      <TermBlock x={366} y={372} n={3} labels={['A', 'B', 'GND']} labelPos="below" exit="top" />
      <Txt x="418" y="386" cls="sm">J4 · RS485</Txt>

      {/* status LEDs */}
      {[['PWR', 'on'], ['RUN', 'cu on'], ['LINK', 'on']].map(([t, c], i) => (
        <g key={t}>
          <rect x="437" y={293 + i * 14} width="7" height="6" className="eg-pad" style={{ opacity: 0.5 }} />
          <circle cx="440.5" cy={296 + i * 14} r="2.3" className={`eg-led ${c}`} />
          <Txt x="450" y={299 + i * 14} cls="sm">{t}</Txt>
        </g>
      ))}

      {/* title block */}
      <g aria-hidden="true">
        <rect x="172" y="352" width="152" height="44" className="eg-silk" />
        <path d="M172 366 H324 M172 380 H324 M246 366 V396" className="eg-silk" style={{ opacity: 0.6 }} />
        <Txt x="178" y="362" cls="tb hi">AX-CTRL-01 · REV C</Txt>
        <Txt x="178" y="376" cls="sm">ARMTRONIX LTD</Txt>
        <Txt x="252" y="376" cls="sm">SCALE 1:1</Txt>
        <Txt x="178" y="390" cls="sm dim">DWG PCB-0142</Txt>
        <Txt x="252" y="390" cls="sm dim">SHEET 1 / 1</Txt>
      </g>

      <MountHole x={40} y={50} r={4.5} />
      <MountHole x={480} y={50} r={4.5} />
      <MountHole x={40} y={398} r={4.5} />
      <MountHole x={480} y={398} r={4.5} />

      {/* one signal dot: sensor -> MCU (the only moving element) */}
      <g aria-hidden="true">
        <Packet d={SENSE[0].d} dur={3.2} />
      </g>
    </svg>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  return (
    <section className="section hero" id="top" ref={ref}>
      <div className="techgrid" aria-hidden="true" />
      <div className="wrap hero__grid">
        <motion.div
          className="hero__copy"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="hero__eyebrow">Armtronix<br />Industrial IoT · Hardware · Automation</p>
          <h1 className="h-xl">Engineering intelligence into the physical world.</h1>
          <p className="lede hero__lede">
            Armtronix builds Industrial IoT, automation controllers, sensor interfaces
            and connected systems that turn physical industrial signals into intelligent action.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#contact">Talk to an engineer <span className="arr" aria-hidden="true">→</span></a>
            <a className="btn btn--ghost" href="#technology">Explore technology <span className="arr" aria-hidden="true">→</span></a>
          </div>
          <p className="tlabel hero__meta">Hardware → Sensors → Control → Connectivity → Cloud → Intelligence → Action</p>
        </motion.div>
        <motion.div
          className="hero__visual"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
        >
          <Board />
        </motion.div>
      </div>
    </section>
  )
}
