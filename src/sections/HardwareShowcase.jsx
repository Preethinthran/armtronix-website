import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Section } from '../components/primitives'
import { useLiveValue } from '../components/useLive'
import './HardwareShowcase.css'

/* One continuous system walkthrough: Signal → Processing → Action →
   Communication → Power. The diagram never swaps - scroll position only
   changes which subsystem is lit, where packets travel, and active metrics. */

const STAGES = [
  {
    id: 'mcu', n: '01', label: 'MCU', title: 'Microcontroller unit',
    desc: 'The decision point. Runs control logic, filters sensor input and drives outputs deterministically.',
    subsystem: 'MCU CORE', metric: '168 MHz · 1.0 kHz RTOS LOOP',
  },
  {
    id: 'sensor', n: '02', label: 'Sensor input', title: 'Physical signals',
    desc: 'Industrial sensors feed measurable physical conditions into the control system.',
    subsystem: 'SENSOR INPUT', metric: '4–20 mA · 24-BIT Σ-Δ AFE',
  },
  {
    id: 'io', n: '03', label: 'Digital output', title: 'Control action',
    desc: 'Processed signals become deterministic machine and actuator commands.',
    subsystem: 'DIGITAL OUTPUT', metric: '24V PWM · 1.8A LOAD DRIVE',
  },
  {
    id: 'comm', n: '04', label: 'Communication', title: 'Industrial connectivity',
    desc: 'Ethernet and RS485 move operational data between the controller and connected systems.',
    subsystem: 'COMMUNICATION', metric: 'MODBUS RTU · 10/100 BASE-T',
  },
  {
    id: 'power', n: '05', label: 'Power', title: 'Power management',
    desc: 'Regulated power keeps the controller stable through demanding industrial conditions.',
    subsystem: 'POWER MANAGEMENT', metric: '24V → 3.3V · 94.2% EFFICIENCY',
  },
]

const ORDER = ['mcu', 'sensor', 'io', 'comm', 'power']

/* Blueprint Background Grid */
function SchematicGrid({ w = 660, h = 450, step = 20 }) {
  const lines = []
  for (let x = 0; x <= w; x += step) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} className="hw-grid-line" />)
  }
  for (let y = 0; y <= h; y += step) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} className="hw-grid-line" />)
  }
  return <g className="hw-grid" aria-hidden="true">{lines}</g>
}

/* CAD Technical Corner Bracket */
function CornerBrackets({ x, y, w, h, len = 9, active }) {
  return (
    <g className={`hw-brackets ${active ? 'is-active' : ''}`} aria-hidden="true">
      <path d={`M${x} ${y + len} V${y} H${x + len}`} />
      <path d={`M${x + w - len} ${y} H${x + w} V${y + len}`} />
      <path d={`M${x} ${y + h - len} V${y + h} H${x + len}`} />
      <path d={`M${x + w - len} ${y + h} H${x + w} V${y + len}`} />
    </g>
  )
}

/* Module Container Card */
function ModuleCard({ id, x, y, w, h, n, title, active, seen, onClick, reduce, children }) {
  return (
    <g
      className={`hw-card ${active ? 'is-active' : ''} ${seen ? 'is-seen' : ''}`}
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(id)}
      aria-label={`Subsystem ${n}: ${title}. Click to focus.`}
    >
      {/* Background card plate */}
      <rect x={x} y={y} width={w} height={h} rx="6" className="hw-card-plate" />
      <CornerBrackets x={x} y={y} w={w} h={h} active={active} />

      {/* Header bar */}
      <g className="hw-card-header" transform={`translate(${x + 12}, ${y + 16})`}>
        {/* Stage Badge */}
        <rect x="0" y="-10" width="22" height="15" rx="3" className="hw-badge-bg" />
        <text x="11" y="1" textAnchor="middle" className="hw-badge-text">{n}</text>
        {/* Header Title */}
        <text x="28" y="1" className="hw-card-title">{title}</text>
        {/* Active pulse LED */}
        {active && (
          <circle cx={w - 24} cy="-2" r="3.2" className="hw-card-led">
            {!reduce && (
              <animate
                attributeName="opacity"
                values="0.45;1;0.45"
                dur="1.2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        )}
      </g>

      {/* Internal components */}
      {children}
    </g>
  )
}

/* Multi-particle stream moving down a wire */
function SignalStream({ d, active, reduce, dur = 2.0, count = 3, tone = 'amber' }) {
  if (reduce || !active) return null
  return (
    <g className={`hw-stream hw-stream--${tone}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} r={i === 0 ? 3.4 : 2.5} className="hw-particle">
          <animateMotion
            path={d}
            dur={`${dur}s`}
            begin={`${(i * (dur / count)).toFixed(2)}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  )
}

/* Wire Trace with Active Flow Dash and Glow */
function Trace({ d, active, seen, thick, dash, flow, rev, className = '' }) {
  return (
    <g className={`hw-trace-group ${active ? 'is-active' : ''} ${seen ? 'is-seen' : ''}`}>
      {/* Glow underlay when active */}
      {active && <path d={d} className={`hw-trace-glow ${thick ? 'thick' : ''}`} />}
      {/* Core copper wire */}
      <path
        d={d}
        className={`hw-trace-core ${thick ? 'thick' : ''} ${dash ? 'dash' : ''} ${
          active || flow ? 'flow' : ''
        } ${rev ? 'rev' : ''} ${className}`}
      />
    </g>
  )
}

/* Terminal Node Dot (Solder Joint) */
function TerminalNode({ x, y, r = 3, active, seen, label, align = 'top' }) {
  return (
    <g className={`hw-node ${active ? 'is-active' : ''} ${seen ? 'is-seen' : ''}`}>
      <circle cx={x} cy={y} r={r} className="hw-node-dot" />
      {label && (
        <text
          x={x}
          y={align === 'top' ? y - 9 : y + 15}
          textAnchor="middle"
          className="hw-node-label"
        >
          {label}
        </text>
      )}
    </g>
  )
}

/* Clean Block Box (IC / Conditioning / Transceiver module) */
function SubBlock({ x, y, w, h, label, sub, active, seen }) {
  return (
    <g className={`hw-block ${active ? 'is-active' : ''} ${seen ? 'is-seen' : ''}`}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="4" className="hw-block-body" />
      <text x={x} y={y - 2} textAnchor="middle" className="hw-block-title">{label}</text>
      {sub && <text x={x} y={y + 11} textAnchor="middle" className="hw-block-sub">{sub}</text>}
    </g>
  )
}

/* Wire Paths (Symmetric Orthogonal Layout on 660x450 Canvas) */
const PATHS = {
  // Sensor input path: Probe -> AFE -> MCU ADC Pin (turning at symmetric gap x=238)
  sensorProbe: 'M 54 110 H 132',
  sensorAdc: 'M 198 110 H 238 V 185 H 286',

  // MCU Internal Decision bus: ADC IN -> Core -> PWM OUT
  mcuCore: 'M 286 185 H 374',

  // Digital Output path: MCU PWM Pin -> Driver -> Motor Actuator (turning at symmetric gap x=422)
  ioDrive: 'M 374 185 H 422 V 110 H 452',
  ioMotor: 'M 520 110 H 565',

  // Communication path: MCU COM Pin -> RS-485 Transceiver & ETH
  commMcuToRs: 'M 312 249 V 275 H 176',
  commRsToBus: 'M 104 275 H 45',
  commRsToEth: 'M 176 275 H 188 V 345 H 176',
  commEthToBus: 'M 104 345 H 45',

  // Power path: 24V IN -> Buck Regulator -> 3.3V System Bus into MCU
  powerIn: 'M 600 280 H 543',
  powerRail: 'M 457 280 H 348 V 249',
}

function SchematicDiagram({ stage, reduce, onPick }) {
  const at = ORDER.indexOf(stage)
  const lit = (id) => ORDER.indexOf(id) <= at
  const isActive = (id) => stage === id

  const temp = useLiveValue({ base: 24.2, jitter: 0.3, min: 22.0, max: 26.8, interval: 3000, reduce })
  const volt = useLiveValue({ base: 24.08, jitter: 0.12, min: 23.85, max: 24.25, interval: 2200, reduce })
  const cur = useLiveValue({ base: 12.4, jitter: 0.28, min: 11.7, max: 13.3, interval: 1800, reduce })

  const S = lit('sensor'), O = lit('io'), C = lit('comm'), P = lit('power')

  return (
    <svg
      viewBox="0 0 660 450"
      className="hw-schematic"
      role="img"
      aria-label={`Industrial Controller Architecture Schematic, current subsystem: ${STAGES[at].label}`}
    >
      <defs>
        {/* Soft neon glow for active wire traces */}
        <filter id="hw-trace-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Technical blueprint grid */}
      <SchematicGrid w={660} h={450} step={20} />

      {/* ============================================================== */}
      {/* 02 · SENSOR INPUT MODULE (Top Left: x=16..228, y=16..196) */}
      {/* ============================================================== */}
      <ModuleCard
        id="sensor"
        x={16} y={16} w={212} h={180}
        n="02" title="SENSOR INPUT"
        active={isActive('sensor')} seen={S}
        onClick={onPick}
        reduce={reduce}
      >
        {/* RTD Temperature Probe */}
        <g className="hw-probe" transform="translate(45, 110)">
          <rect x="-6" y="-24" width="12" height="10" rx="1.5" className="hw-probe-head" />
          <rect x="-2" y="-14" width="4" height="28" className="hw-probe-stem" />
          <circle cx="0" cy="18" r="3.2" className={`hw-probe-tip ${S ? 'on' : ''}`} />
          {isActive('sensor') && !reduce && (
            <circle cx="0" cy="18" r="4" className="hw-probe-pulse">
              <animate attributeName="r" values="4;14" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.85;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* ISA-5.1 Instrument Bubble TT-101 */}
        <g className="hw-bubble" transform="translate(95, 70)">
          <circle r="14" className="hw-bubble-disc" />
          <line x1="-14" y1="0" x2="14" y2="0" className="hw-bubble-line" />
          <text y="-2.5" textAnchor="middle" className="hw-bubble-tag">TT</text>
          <text y="9" textAnchor="middle" className="hw-bubble-num">101</text>
          {/* Dashed connector from probe to transmitter */}
          <path d="M -50 40 L 0 14" className="hw-bubble-lead" />
        </g>

        <text x="45" y="152" textAnchor="middle" className="hw-mini-tag">RTD PT100</text>
        <text x="94" y="125" textAnchor="middle" className="hw-loop-tag">4–20 mA</text>

        {/* Analog Front-End Signal Conditioner */}
        <SubBlock
          x={165} y={110} w={66} h={38}
          label="AFE / ADC" sub="24-BIT Σ-Δ"
          active={isActive('sensor')} seen={S}
        />

        <text x="165" y="152" textAnchor="middle" className="hw-mini-tag">LOW-PASS FILTER</text>
      </ModuleCard>

      {/* ============================================================== */}
      {/* 03 · DIGITAL OUTPUT MODULE (Top Right: x=432..644, y=16..196) */}
      {/* ============================================================== */}
      <ModuleCard
        id="io"
        x={432} y={16} w={212} h={180}
        n="03" title="DIGITAL OUTPUT"
        active={isActive('io')} seen={O}
        onClick={onPick}
        reduce={reduce}
      >
        {/* Optoisolated Gate Driver */}
        <SubBlock
          x={486} y={110} w={68} h={38}
          label="DRIVER" sub="MOSFET/ISO"
          active={isActive('io')} seen={O}
        />
        <text x={486} y={152} textAnchor="middle" className="hw-mini-tag">GALVANIC ISOLATION</text>

        {/* Actuator / Electric Motor */}
        <g className={`hw-motor ${isActive('io') ? 'is-active' : ''}`} transform="translate(585, 110)">
          <circle r="20" className="hw-motor-case" />
          {/* Rotating rotor blades */}
          <g className="hw-motor-rotor">
            {isActive('io') && !reduce && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
            <circle r="15" className="hw-motor-dash" />
            <line x1="-12" y1="0" x2="12" y2="0" className="hw-motor-arm" />
            <line x1="0" y1="-12" x2="0" y2="12" className="hw-motor-arm" />
          </g>
          <circle r="3.2" className="hw-motor-hub" />
          <text y="28" textAnchor="middle" className="hw-motor-label">24V ACTUATOR</text>
          <text y="40" textAnchor="middle" className="hw-mini-tag">1.8A LOAD</text>
        </g>
      </ModuleCard>

      {/* ============================================================== */}
      {/* 04 · INDUSTRIAL COMMUNICATION (Bottom Left: x=16..228, y=216..396) */}
      {/* ============================================================== */}
      <ModuleCard
        id="comm"
        x={16} y={216} w={212} h={180}
        n="04" title="COMMUNICATION"
        active={isActive('comm')} seen={C}
        onClick={onPick}
        reduce={reduce}
      >
        {/* RS-485 Modbus Transceiver */}
        <SubBlock
          x={140} y={275} w={72} h={36}
          label="RS-485" sub="MODBUS RTU"
          active={isActive('comm')} seen={C}
        />

        {/* TX/RX Activity LEDs on RS-485 */}
        <g transform="translate(140, 260)">
          <circle cx="-12" cy="0" r="1.8" className={`hw-led-tx ${isActive('comm') ? 'blink' : ''}`} />
          <circle cx="-6" cy="0" r="1.8" className={`hw-led-rx ${isActive('comm') ? 'blink' : ''}`} />
        </g>

        {/* Fieldbus Terminal Nodes */}
        <TerminalNode x={45} y={275} r={3.2} active={isActive('comm')} seen={C} label="FIELD BUS A/B" align="top" />

        {/* Ethernet PHY Transceiver */}
        <SubBlock
          x={140} y={345} w={72} h={34}
          label="ETH PHY" sub="10/100 BASE-T"
          active={isActive('comm')} seen={C}
        />

        {/* Link/Act LEDs on Ethernet */}
        <g transform="translate(140, 332)">
          <circle cx="-12" cy="0" r="1.8" className={`hw-led-tx ${isActive('comm') ? 'on' : ''}`} />
          <circle cx="-6" cy="0" r="1.8" className={`hw-led-rx ${isActive('comm') ? 'blink' : ''}`} />
        </g>

        {/* Industrial Ethernet Port Terminal */}
        <TerminalNode x={45} y={345} r={3.2} active={isActive('comm')} seen={C} label="INDUSTRIAL ETH" align="top" />
      </ModuleCard>

      {/* ============================================================== */}
      {/* 05 · POWER MANAGEMENT (Bottom Right: x=432..644, y=216..396) */}
      {/* ============================================================== */}
      <ModuleCard
        id="power"
        x={432} y={216} w={212} h={180}
        n="05" title="POWER MANAGEMENT"
        active={isActive('power')} seen={P}
        onClick={onPick}
        reduce={reduce}
      >
        {/* External 24VDC Terminal Node */}
        <TerminalNode x={600} y={280} r={3.4} active={isActive('power')} seen={P} label="24 VDC IN" align="top" />

        {/* Buck DC/DC Regulator Box */}
        <SubBlock
          x={500} y={280} w={86} h={40}
          label="BUCK DC/DC" sub="24V → 3.3V"
          active={isActive('power')} seen={P}
        />

        <text x="500" y="322" textAnchor="middle" className="hw-mini-tag">SYNCHRONOUS RECTIFIER</text>

        {/* Power Rail Specs */}
        <g transform="translate(485, 350)">
          <text x="0" y="0" textAnchor="middle" className="hw-power-spec">EFFICIENCY 94.2%</text>
          <text x="0" y="12" textAnchor="middle" className="hw-mini-tag">TRANSIENT SUPPRESSION</text>
        </g>
      </ModuleCard>

      {/* ============================================================== */}
      {/* 01 · CENTRAL MICROCONTROLLER UNIT (Center: x=248..412, y=90..320) */}
      {/* ============================================================== */}
      <ModuleCard
        id="mcu"
        x={248} y={90} w={164} h={230}
        n="01" title="MCU CORE"
        active={isActive('mcu')} seen
        onClick={onPick}
        reduce={reduce}
      >
        {/* Microcontroller IC Package centered at (330, 205) */}
        <g className={`hw-ic ${isActive('mcu') ? 'is-active' : ''}`} transform="translate(330, 205)">
          {/* Subtle radiating core pulse when active */}
          {isActive('mcu') && !reduce && (
            <circle cx="0" cy="0" r="16" className="hw-ic-radar-pulse">
              <animate attributeName="r" values="16;48" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
            </circle>
          )}

          {/* IC Quad Pins: 6 on each side */}
          {/* Top Pins (y = -38 to -44) */}
          {[-25, -15, -5, 5, 15, 25].map((px) => (
            <rect key={`t${px}`} x={px - 1.2} y="-44" width="2.4" height="6" className="hw-ic-pin" />
          ))}
          {/* Bottom Pins (y = 38 to 44) */}
          {[-25, -15, -5, 5, 15, 25].map((px) => (
            <rect key={`b${px}`} x={px - 1.2} y="38" width="2.4" height="6" className="hw-ic-pin" />
          ))}
          {/* Left Pins (x = -38 to -44) */}
          {[-25, -15, -5, 5, 15, 25].map((py) => (
            <rect key={`l${py}`} x="-44" y={py - 1.2} width="6" height="2.4" className="hw-ic-pin" />
          ))}
          {/* Right Pins (x = 38 to 44) */}
          {[-25, -15, -5, 5, 15, 25].map((py) => (
            <rect key={`r${py}`} x="38" y={py - 1.2} width="6" height="2.4" className="hw-ic-pin" />
          ))}

          {/* IC Body Plate */}
          <rect x="-38" y="-38" width="76" height="76" rx="3" className="hw-ic-body" />
          {/* Pin 1 Index Dot */}
          <circle cx="-30" cy="-30" r="2.2" className="hw-ic-notch" />

          {/* IC Labels */}
          <text y="-8" textAnchor="middle" className="hw-ic-title">AX-MCU</text>
          <text y="7" textAnchor="middle" className="hw-ic-sub">ARM CORTEX-M4</text>
          <text y="20" textAnchor="middle" className="hw-ic-speed">168 MHz</text>
        </g>

        {/* RTOS Deterministic Execution Tag */}
        <text x="330" y="302" textAnchor="middle" className="hw-rtos-tag">
          1.0 kHz HARD REAL-TIME
        </text>
      </ModuleCard>

      {/* ============================================================== */}
      {/* INTERCONNECTING WIRES & CIRCUIT TRACES */}
      {/* ============================================================== */}

      {/* 1. Sensor Input Traces */}
      <Trace d={PATHS.sensorProbe} active={isActive('sensor')} seen={S} />
      <Trace d={PATHS.sensorAdc} active={isActive('sensor')} seen={S} />
      {/* Junction dot where sensor signal enters MCU ADC pin tip */}
      <TerminalNode x={286} y={185} r={2.5} active={isActive('sensor')} seen={S} />

      {/* 2. MCU Core Internal Decision Trace */}
      <Trace d={PATHS.mcuCore} active={isActive('mcu')} seen dash />

      {/* 3. Digital Output Traces */}
      <Trace d={PATHS.ioDrive} active={isActive('io')} seen={O} />
      {/* Junction dot where PWM leaves MCU pin tip */}
      <TerminalNode x={374} y={185} r={2.5} active={isActive('io')} seen={O} />
      <Trace d={PATHS.ioMotor} active={isActive('io')} seen={O} />

      {/* 4. Communication Traces */}
      <Trace d={PATHS.commMcuToRs} active={isActive('comm')} seen={C} />
      {/* Junction dot at MCU COM pin */}
      <TerminalNode x={312} y={249} r={2.5} active={isActive('comm')} seen={C} />
      <Trace d={PATHS.commRsToBus} active={isActive('comm')} seen={C} />
      <Trace d={PATHS.commRsToEth} active={isActive('comm')} seen={C} dash />
      <Trace d={PATHS.commEthToBus} active={isActive('comm')} seen={C} />

      {/* 5. Power Rail Traces */}
      <Trace d={PATHS.powerIn} active={isActive('power')} seen={P} />
      {/* Thick Regulated 3.3V System Bus */}
      <Trace d={PATHS.powerRail} active={isActive('power')} seen={P} thick />
      {/* Junction dot at MCU VCC pin */}
      <TerminalNode x={348} y={249} r={2.8} active={isActive('power')} seen={P} />
      <text x="370" y="272" className="hw-bus-label">3.3V SYSTEM BUS</text>

      {/* ============================================================== */}
      {/* DYNAMIC SIGNAL PACKET STREAMS */}
      {/* ============================================================== */}
      {/* Sensor stream: flows into AFE and into MCU */}
      <SignalStream d={PATHS.sensorProbe} active={isActive('sensor')} reduce={reduce} dur={1.6} count={2} />
      <SignalStream d={PATHS.sensorAdc} active={isActive('sensor')} reduce={reduce} dur={1.8} count={3} />

      {/* MCU stream: flows through decision bus */}
      <SignalStream d={PATHS.mcuCore} active={isActive('mcu')} reduce={reduce} dur={1.4} count={3} tone="cyan" />

      {/* Output stream: flows from MCU through Driver into Motor */}
      <SignalStream d={PATHS.ioDrive} active={isActive('io')} reduce={reduce} dur={1.6} count={3} />
      <SignalStream d={PATHS.ioMotor} active={isActive('io')} reduce={reduce} dur={1.2} count={2} />

      {/* Comm stream: bi-directional Modbus data */}
      <SignalStream d={PATHS.commMcuToRs} active={isActive('comm')} reduce={reduce} dur={1.8} count={2} />
      <SignalStream d={PATHS.commRsToBus} active={isActive('comm')} reduce={reduce} dur={1.4} count={2} />

      {/* Power stream: continuous energy current into Buck and MCU */}
      <SignalStream d={PATHS.powerIn} active={isActive('power')} reduce={reduce} dur={1.4} count={2} tone="gold" />
      <SignalStream d={PATHS.powerRail} active={isActive('power')} reduce={reduce} dur={1.8} count={3} tone="gold" />

      {/* ============================================================== */}
      {/* BOTTOM TELEMETRY STATUS HUD STRIP */}
      {/* ============================================================== */}
      <g className="hw-hud" transform="translate(16, 412)">
        <rect x="0" y="0" width="628" height="26" rx="4" className="hw-hud-bg" />
        <line x1="0" y1="0" x2="628" y2="0" className="hw-hud-border" />

        {/* Status indicator badge */}
        <circle cx="14" cy="13" r="3" className="hw-hud-dot" />
        <text x="24" y="17" className="hw-hud-text hw-hud-active">
          STAGE {STAGES[at].n}: {STAGES[at].subsystem}
        </text>

        {/* Live Hardware Telemetry Metrics */}
        <text x="235" y="17" className="hw-hud-text hw-hud-num">
          BUS: {volt.toFixed(2)} VDC
        </text>
        <text x="350" y="17" className="hw-hud-text hw-hud-num">
          AFE: {cur.toFixed(2)} mA
        </text>
        <text x="455" y="17" className="hw-hud-text hw-hud-num">
          CORE: {temp.toFixed(1)}°C
        </text>

        {/* Loop Status Tag */}
        <text x="616" y="17" textAnchor="end" className="hw-hud-text hw-hud-state">
          ● REAL-TIME ONLINE
        </text>
      </g>
    </svg>
  )
}

export default function HardwareShowcase() {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState('mcu')
  const listRef = useRef(null)

  useEffect(() => {
    const root = listRef.current
    if (!root) return
    const blocks = Array.from(root.querySelectorAll('[data-stage]'))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStage(e.target.dataset.stage)
        })
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    )
    blocks.forEach((b) => obs.observe(b))
    return () => obs.disconnect()
  }, [])

  const pick = (id) => {
    setStage(id)
    const el = listRef.current?.querySelector(`[data-stage="${id}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Section
      id="hardware"
      index="01"
      label="Physical layer"
      title="Trace the intelligence."
      lede="Follow how physical signals move through the Armtronix control system - from sensing to deterministic action."
    >
      <div className="trace">
        <div className="trace__viz">
          <div className="trace__frame">
            <SchematicDiagram stage={stage} reduce={reduce} onPick={pick} />
          </div>
        </div>

        <div className="trace__stages" ref={listRef}>
          {STAGES.map((s) => {
            const on = stage === s.id
            return (
              <article
                key={s.id}
                data-stage={s.id}
                className={`tstage ${on ? 'is-active' : ''}`}
                aria-current={on ? 'step' : undefined}
              >
                <button
                  type="button"
                  className="tstage__hit"
                  onClick={() => pick(s.id)}
                  onFocus={() => pick(s.id)}
                  aria-label={`Trace stage ${s.n}: ${s.label}`}
                >
                  <span className="tstage__n">{s.n}</span>
                  <span className="tstage__label">{s.label}</span>
                </button>
                <h3 className="tstage__title">{s.title}</h3>
                <p className="tstage__desc">{s.desc}</p>
                <div className="tstage__metric">
                  <span className="tstage__metric-label">SUBSYSTEM METRIC:</span>
                  <span className="tstage__metric-val">{s.metric}</span>
                </div>
                <span className="tstage__bar" aria-hidden="true" />
              </article>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
