import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Section } from '../components/primitives'
import { applications } from '../data/site'
import { useLiveValue, useCycle, useAnomaly, useSwap } from '../components/useLive'
import {
  Svg, G, Txt, Wire, Node, Motor, Pump, Fan, Valve, Tank, Heater, Probe, Accel,
  CT, Cloud, Gateway, IC, ScopeFrame, Bubble, CoilBox, Contact, Ground,
} from '../components/eng/Symbols'
import { RobotArmGraphic, solveArm, deg, fmt } from '../components/eng/RobotArm'
import './ApplicationExplorer.css'

const cx = (...a) => a.filter(Boolean).join(' ')
const VB = '0 0 540 230'

/* Directional flow arrow on a process line */
function Arrow({ x, y, rot = 0, on = true }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M-4 -3.2 L4 0 L-4 3.2 Z" className={cx('eg-dot', !on && 'off')} style={{ transition: 'fill 0.4s ease' }} />
    </G>
  )
}

/* Machine elevation: clean, simplified industrial silhouette */
function Machine({ x, y, kind = 'cnc', on = true }) {
  return (
    <G x={x} y={y}>
      <rect x="-26" y="-20" width="52" height="40" rx="3" className={cx('eg-b', on && 'on')} />
      {kind === 'cnc' && (
        <>
          <rect x="-20" y="-14" width="26" height="22" rx="2" className="eg-b deep" />
          <path d="M-7 -14 V-3" className={cx('eg-w thick', on && 'on')} />
          <path d="M-11 -3 H-3 L-7 3 Z" className={cx('eg-b', on && 'on lit')} />
          <circle cx="15" cy="-8" r="2" className={cx('eg-led', on && 'on')} />
          <circle cx="15" cy="-1" r="2" className={cx('eg-led cu', on && 'on')} />
        </>
      )}
      {kind === 'press' && (
        <>
          <rect x="-16" y="-14" width="32" height="7" rx="1.5" className="eg-b deep" />
          <path d="M0 -7 V-1" className={cx('eg-w thick', on && 'on')} />
          <rect x="-10" y="-1" width="20" height="6" rx="1" className={cx('eg-b', on && 'on lit')} />
          <rect x="-16" y="9" width="32" height="5" rx="1" className="eg-b deep" />
        </>
      )}
      {kind === 'lathe' && (
        <>
          <rect x="-20" y="-12" width="14" height="18" rx="2" className="eg-b deep" />
          <rect x="-4" y="-3" width="20" height="4" className={cx('eg-b', on && 'on lit')} />
          <circle cx="-13" cy="-7" r="2" className={cx('eg-led', on && 'on')} />
        </>
      )}
    </G>
  )
}

/* Metric morph hook for smooth transitions */
function useMetricMorph(target, reduce) {
  const [display, setDisplay] = useState(target)
  const first = useRef(true)

  const parse = (s) => {
    const m = String(s).match(/^([−-]?\d+(?:\.\d+)?)(.*)$/)
    if (!m) return null
    const num = parseFloat(m[1].replace('−', '-'))
    const suffix = m[2]
    const dot = m[1].indexOf('.')
    const dec = dot === -1 ? 0 : m[1].length - dot - 1
    return { num, suffix, dec }
  }

  useEffect(() => {
    if (first.current) {
      first.current = false
      setDisplay(target)
      return
    }
    const from = parse(display)
    const to = parse(target)
    if (reduce || !from || !to) {
      setDisplay(target)
      return
    }
    const t = setInterval(() => {
      setDisplay((cur) => {
        const c = parse(cur)
        if (!c) {
          clearInterval(t)
          return target
        }
        const n = c.num + (to.num - c.num) * 0.2
        if (Math.abs(n - to.num) < Math.abs(to.num) * 0.005 + 0.01) {
          clearInterval(t)
          return target
        }
        return `${n.toFixed(to.dec)}${to.suffix}`
      })
    }, 90)
    return () => clearInterval(t)
  }, [target, reduce])
  return display
}

/* =========================================================================
   1 · Smart Factory: Automated cell linked over an industrial IoT fieldbus
   ========================================================================= */
function FactoryViz({ reduce }) {
  const xs = [68, 178, 288]
  const kinds = ['cnc', 'press', 'lathe']
  const cells = [
    { title: 'CELL 01', sub: 'CNC MILL', node: 'NODE 0x11' },
    { title: 'CELL 02', sub: 'STAMPING', node: 'NODE 0x12' },
    { title: 'CELL 03', sub: 'LATHE DE', node: 'NODE 0x13' },
  ]
  const kw = [
    useLiveValue({ base: 4.2, jitter: 0.3, min: 3.4, max: 5.1, interval: 3200, reduce }),
    useLiveValue({ base: 3.9, jitter: 0.2, min: 3.1, max: 4.8, interval: 3400, reduce }),
    useLiveValue({ base: 4.6, jitter: 0.3, min: 3.6, max: 5.4, interval: 3000, reduce }),
  ]
  const BUS_Y = 162

  return (
    <Svg viewBox={VB} className="appviz" label="Smart Factory: three production workcells networked via an RS-485 bus to an industrial gateway and cloud">
      {/* ================= LEFT: Production Cells & Fieldbus ================= */}
      {/* Conveyor / Machine Base Elevation Guide Rail */}
      <rect x="22" y="86" width="316" height="5" rx="1.5" className="eg-b" />
      {[36, 122, 232, 324].map((lx) => (
        <rect key={lx} x={lx} y="91" width="4" height="6" rx="1" className="eg-b deep" />
      ))}

      {/* Production Cells 01, 02, 03 */}
      {xs.map((x, i) => (
        <g key={cells[i].title}>
          {/* Station Header */}
          <Txt x={x} y="22" anchor="middle" cls="sm hi">{cells[i].title}</Txt>
          <Txt x={x} y="32" anchor="middle" cls="sm dim" style={{ fontSize: '7px' }}>{cells[i].sub}</Txt>

          {/* Machine Elevation Silhouette */}
          <Machine x={x} y={60} kind={kinds[i]} />

          {/* Machine base mounting flange */}
          <rect x={x - 22} y="80" width="44" height="6" rx="1.5" className="eg-b on" />

          {/* Conduit connection down to Node Module */}
          <Wire d={`M${x} 86 V100`} on thick />

          {/* Edge IoT Node / Smart Bus Coupler Unit */}
          <rect x={x - 34} y="100" width="68" height="32" rx="3" className="eg-b deep" />
          <circle cx={x - 24} cy="110" r="1.8" className="eg-led on ok" />
          <circle cx={x - 18} cy="110" r="1.8" className="eg-led on cu" />
          <Txt x={x + 24} y="112" anchor="end" cls="sm dim" style={{ fontSize: '7px' }}>{cells[i].node}</Txt>
          <Txt x={x} y="125" anchor="middle" cls="sm num hi" style={{ fontWeight: 600 }}>{`${kw[i].toFixed(1)} kW`}</Txt>

          {/* Drop Tap Line from Node down to RS-485 Trunk */}
          <Wire d={`M${x} 132 V${BUS_Y}`} on />
          <Node x={x} y={BUS_Y} r={2.5} />
        </g>
      ))}

      {/* RS-485 Shielded Fieldbus Trunk Cable */}
      <Wire d={`M22 ${BUS_Y} H328`} on thick />

      {/* 120 Ohm Bus Termination Resistor on Left */}
      <rect x="18" y={BUS_Y - 4} width="5" height="8" rx="1" className="eg-b" />
      <Txt x="20" y={BUS_Y - 7} anchor="middle" cls="sm dim" style={{ fontSize: '6px' }}>120Ω</Txt>

      {/* Gateway Junction Point on Right */}
      <rect x="328" y={BUS_Y - 6} width="10" height="12" rx="2" className="eg-b on" />
      <circle cx="333" cy={BUS_Y} r="2" className="eg-dot ok" />

      {/* Fieldbus Caption */}
      <Txt x="175" y={BUS_Y + 16} anchor="middle" cls="sm dim" style={{ fontSize: '7.5px' }}>
        RS-485 MODBUS FIELDBUS TRUNK · 115.2 kbps · ISOLATED
      </Txt>
      <Txt x="175" y={BUS_Y + 28} anchor="middle" cls="sm cu" style={{ fontSize: '7px' }}>
        DETERMINISTIC MULTI-DROP TOPOLOGY · 3 ACTIVE SLAVES
      </Txt>

      {/* ================= RIGHT: Plant Telemetry & OEE HUD Card ================= */}
      <rect x="356" y="14" width="168" height="202" rx="6" className="eg-b deep" />

      {/* HUD Header */}
      <circle cx="372" cy="30" r="3" className="eg-dot ok" />
      <Txt x="382" y="34" cls="sm hi" style={{ letterSpacing: '0.04em' }}>LINE MONITOR</Txt>
      <Txt x="510" y="34" anchor="end" cls="sm ok" style={{ fontSize: '8px', fontWeight: 600 }}>ONLINE</Txt>
      <path d="M368 42 H512" className="eg-axis" />

      {/* Primary OEE Metric Display */}
      <Txt x="440" y="58" anchor="middle" cls="sm dim" style={{ fontSize: '7.5px', letterSpacing: '0.04em' }}>
        LINE EFFICIENCY (OEE)
      </Txt>
      <Txt x="440" y="88" anchor="middle" cls="big num hi" style={{ fontSize: '28px', fontWeight: 700 }}>
        94.2 %
      </Txt>
      <Txt x="440" y="102" anchor="middle" cls="sm ok" style={{ fontSize: '8px', fontWeight: 600 }}>
        ▲ OPTIMAL PERFORMANCE
      </Txt>

      <path d="M368 110 H512" className="eg-axis" />

      {/* Workcell Breakdown Rows */}
      <Txt x="372" y="125" cls="sm dim" style={{ fontSize: '7.5px' }}>CELL 01 (CNC)</Txt>
      <Txt x="510" y="125" anchor="end" cls="sm num hi" style={{ fontSize: '8px' }}>
        {`${kw[0].toFixed(1)} kW · 96%`}
      </Txt>

      <Txt x="372" y="141" cls="sm dim" style={{ fontSize: '7.5px' }}>CELL 02 (PRESS)</Txt>
      <Txt x="510" y="141" anchor="end" cls="sm num hi" style={{ fontSize: '8px' }}>
        {`${kw[1].toFixed(1)} kW · 92%`}
      </Txt>

      <Txt x="372" y="157" cls="sm dim" style={{ fontSize: '7.5px' }}>CELL 03 (LATHE)</Txt>
      <Txt x="510" y="157" anchor="end" cls="sm num hi" style={{ fontSize: '8px' }}>
        {`${kw[2].toFixed(1)} kW · 95%`}
      </Txt>

      <path d="M368 165 H512" className="eg-axis" />

      {/* Edge Gateway & Cloud Uplink Badge */}
      <rect x="368" y="174" width="144" height="24" rx="3" className="eg-b" />
      <circle cx="380" cy="186" r="2.5" className="eg-dot ok" />
      <Txt x="444" y="189" anchor="middle" cls="sm ok" style={{ fontSize: '8px', fontWeight: 600 }}>
        ● MQTT / TLS CLOUD UPLINK
      </Txt>
    </Svg>
  )
}

/* =========================================================================
   2 · Machine Monitoring: Multi-parameter motor & bearing condition monitoring
   ========================================================================= */
function MonitoringViz({ reduce }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduce) return
    let animId
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // Calm, settled analog oscilloscope sweep pace: 1 cycle every ~4.5s
      setPhase((p) => p + dt * 1.4)
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [reduce])

  // Settled, rock-steady multi-harmonic vibration waveform (ISO 10816 2.6 mm/s baseline)
  const N = 56
  const X0 = 40, X1 = 292, Y_MID = 92
  const X = (i) => X0 + (i / (N - 1)) * (X1 - X0)

  // Stable vibration waveform: 1X fundamental + 2X bearing harmonic
  const points = Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1)
    const angle = u * 4 * Math.PI - phase
    const v = Math.sin(angle) + 0.22 * Math.sin(2 * angle + 0.5) + 0.08 * Math.sin(3 * angle - 0.3)
    const y = Y_MID - v * 22
    return { x: X(i), y }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const lastPoint = points[points.length - 1]

  // Settled engineering values with very subtle micro-variation
  const vibVal = (2.61 + Math.sin(phase * 0.25) * 0.03).toFixed(2)
  const tempVal = (46.8 + Math.cos(phase * 0.15) * 0.2).toFixed(1)
  const curVal = (14.2 + Math.sin(phase * 0.2) * 0.1).toFixed(1)

  return (
    <Svg viewBox={VB} className="appviz" label="Machinery condition monitoring: Motor, bearing and impeller with vibration, temperature and current telemetry">
      {/* ================= LEFT: Machine Train Elevation ================= */}
      {/* Rigid Structural Steel Baseplate */}
      <rect x="16" y="152" width="188" height="8" rx="2" className="eg-b on" />
      <circle cx="24" cy="156" r="1.6" className="eg-hole" />
      <circle cx="196" cy="156" r="1.6" className="eg-hole" />

      {/* Motor M1 (415V 3-phase AC) */}
      <rect x="28" y="140" width="32" height="12" rx="2" className="eg-b" />
      <Motor x={44} y={118} r={20} on label="M1" phase="3~" />

      {/* Motor Power Feed with CT-01 Current Clamp */}
      <Wire d="M44 98 V72 H20" on thick />
      <CT x={30} y={72} on />
      <Txt x={30} y={58} anchor="middle" cls="sm hi">CT-01</Txt>
      <Txt x={30} y={88} anchor="middle" cls="sm ok num" style={{ fontSize: '7.5px' }}>{`${curVal} A`}</Txt>

      {/* Drive Shaft (Connecting Motor -> Bearing -> Fan) */}
      <Wire d="M64 118 H184" thick on />

      {/* Flexible Shaft Coupling C-101 */}
      <rect x="82" y="111" width="12" height="14" rx="2" className="eg-b on" />
      <path d="M88 109 V127" className="eg-w thin on" />
      <Txt x="88" y="103" anchor="middle" cls="sm dim" style={{ fontSize: '7.5px' }}>COUPLING</Txt>

      {/* Pillow Block Bearing Housing DE */}
      <rect x="112" y="140" width="40" height="12" rx="2" className="eg-b" />
      <rect x="116" y="98" width="32" height="42" rx="3" className="eg-b on" />
      <circle cx="132" cy="118" r="8" className="eg-b deep" />
      <circle cx="132" cy="118" r="2.5" className="eg-w thin on" />

      {/* ACC-01 Accelerometer (Vibration Sensor Stud-Mounted on Bearing Cap) */}
      <path d="M132 98 V93" className="eg-w thick on" />
      <rect x="124" y="81" width="16" height="12" rx="2" className="eg-b on lit" />
      <rect x="129" y="77" width="6" height="4" className="eg-b deep" />
      <path d="M143 84 q3 3 0 6 M147 82 q4 5 0 10" className="eg-w thin ok" />
      <Txt x="114" y="87" anchor="end" cls="sm hi">ACC-01</Txt>

      {/* RTD-01 Bearing Temperature Sensor Probe */}
      <rect x="146" y="106" width="4" height="4" className="eg-b deep" />
      <path d="M148 108 H158 V96" className="eg-w thin ok" />
      <Txt x="162" y="93" cls="sm dim">RTD-01</Txt>
      <Txt x="162" y="103" cls="sm ok num" style={{ fontSize: '7.5px' }}>{`${tempVal}°C`}</Txt>

      {/* Impeller / Fan Housing */}
      <rect x="176" y="133" width="16" height="19" rx="2" className="eg-b deep" />
      <circle cx="184" cy="118" r="15" className="eg-b" />
      <Fan x={184} y={118} r={14} on />

      {/* Machine Train Foot Labels */}
      <Txt x="44" y="174" anchor="middle" cls="sm dim">MOTOR</Txt>
      <Txt x="132" y="174" anchor="middle" cls="sm dim">BEARING (DE)</Txt>
      <Txt x="184" y="174" anchor="middle" cls="sm dim">IMPELLER</Txt>
      <Txt x="110" y="192" anchor="middle" cls="sm cu">RIGID MACHINE SKID · ISO 10816-3</Txt>

      {/* IEPE Sensor Cable: Emerging from ACC-01 directly into Scope BNC port */}
      <Wire d="M132 77 V42 H224" on thick />
      <circle cx="224" cy="42" r="2.5" className="eg-dot ok" />
      <Txt x="229" y="39" cls="sm dim">BNC IN</Txt>

      {/* ================= RIGHT: Vibration Trend Scope ================= */}
      <ScopeFrame x={224} y={16} w={304} h={194}>
        {/* Scope Header */}
        <Txt x="12" y="16" cls="sm hi">VIBRATION TIME WAVEFORM</Txt>
        <Txt x="292" y="16" anchor="end" cls="sm ok num">{`${vibVal} mm/s RMS · SETTLED`}</Txt>
        <path d="M12 24 H292" className="eg-axis" />

        {/* Y-Axis Scale Reference Marks */}
        <Txt x="34" y="66" anchor="end" cls="sm dim" style={{ fontSize: '7px' }}>+4.2</Txt>
        <Txt x="34" y="94" anchor="end" cls="sm dim" style={{ fontSize: '7px' }}> 0.0</Txt>
        <Txt x="34" y="118" anchor="end" cls="sm dim" style={{ fontSize: '7px' }}>-3.0</Txt>
        <Txt x="16" y="94" anchor="middle" cls="sm dim" rot="-90" style={{ fontSize: '6.5px' }}>mm/s</Txt>

        {/* ISO Warning Alert Limit Line at 4.2 mm/s */}
        <path d="M40 64 H292" className="eg-limit" />
        <Txt x="292" y="60" anchor="end" cls="sm hot">ALERT 4.2 mm/s</Txt>

        {/* Center Zero Reference Axis */}
        <path d="M40 92 H292" className="eg-axis thin dash" />

        {/* Smooth, Settled Periodic Vibration Waveform Trace */}
        <path d={pathD} className="eg-trace ok" style={{ strokeWidth: 1.6 }} />
        <circle cx={lastPoint.x} cy={lastPoint.y} r="3" className="eg-dot ok" />

        {/* Defined Telemetry Metric Cells */}
        <rect x="18" y="136" width="84" height="26" rx="3" className="eg-b deep" />
        <Txt x="60" y="146" anchor="middle" cls="sm dim" style={{ fontSize: '7px' }}>VIB VELOCITY</Txt>
        <Txt x="60" y="157" anchor="middle" cls="sm ok num" style={{ fontSize: '9px', fontWeight: 600 }}>{`${vibVal} mm/s`}</Txt>

        <rect x="110" y="136" width="84" height="26" rx="3" className="eg-b deep" />
        <Txt x="152" y="146" anchor="middle" cls="sm dim" style={{ fontSize: '7px' }}>BEARING TEMP</Txt>
        <Txt x="152" y="157" anchor="middle" cls="sm hi num" style={{ fontSize: '9px', fontWeight: 600 }}>{`${tempVal} °C`}</Txt>

        <rect x="202" y="136" width="84" height="26" rx="3" className="eg-b deep" />
        <Txt x="244" y="146" anchor="middle" cls="sm dim" style={{ fontSize: '7px' }}>MOTOR LOAD</Txt>
        <Txt x="244" y="157" anchor="middle" cls="sm hi num" style={{ fontSize: '9px', fontWeight: 600 }}>{`${curVal} A`}</Txt>

        {/* Scope Footer Status Line */}
        <Txt x="18" y="178" cls="sm dim" style={{ fontSize: '7px' }}>CH1: IEPE ACCEL · TIMEBASE: 20 ms/DIV · FMAX: 1.0 kHz</Txt>
        <Txt x="286" y="178" anchor="end" cls="sm ok" style={{ fontSize: '7.5px' }}>● ISO 10816 CLASS II · NORMAL</Txt>
      </ScopeFrame>
    </Svg>
  )
}

/* =========================================================================
   3 · Process Automation: Clean, symmetrical P&ID with sequenced batch control
   ========================================================================= */
const PSTAGES = ['MIX', 'HEAT', 'CURE', 'PACK']
const PCFG = [
  { feed: true, agit: true, heat: false, hot: false, pump: false, level: 0.78, temp: 26, flow: 0, valve: 'SHUT' },
  { feed: false, agit: true, heat: true, hot: true, pump: false, level: 0.78, temp: 72, flow: 0, valve: 'SHUT' },
  { feed: false, agit: false, heat: true, hot: false, pump: false, level: 0.78, temp: 80, flow: 0, valve: 'SHUT' },
  { feed: false, agit: false, heat: false, hot: false, pump: true, level: 0.35, temp: 38, flow: 12.4, valve: 'OPEN' },
]

function ProcessViz({ reduce }) {
  const step = useCycle(4, 3800, reduce)
  const [batch, setBatch] = useState(42)

  useEffect(() => {
    if (step === 0) setBatch((b) => b + (reduce ? 0 : 1))
  }, [step, reduce])

  const flowLive = useLiveValue({ base: 12.4, jitter: 0.6, min: 11.0, max: 13.8, interval: 2600, reduce })
  const c = PCFG[step] || PCFG[0]
  const currentFlow = c.pump ? flowLive : 0

  const rows = [
    ['TANK LEVEL', `${Math.round(c.level * 100)} %`],
    ['BATCH TEMP', `${c.temp} °C`],
    ['OUTPUT FLOW', `${currentFlow.toFixed(1)} m³/h`],
    ['OUTLET VALVE', c.valve],
  ]

  return (
    <Svg viewBox={VB} className="appviz" label="Process automation: automated batch tank with level, temperature, pump and valve controls">
      {/* Top stage sequence: clean, compact timeline above the process stage */}
      {PSTAGES.map((s, i) => {
        const x = 20 + i * 80
        const on = i === step
        return (
          <g key={s}>
            <rect x={x} y="8" width="72" height="20" rx="3" className={cx('eg-b', on ? 'on lit' : i < step ? 'ok' : 'deep')} />
            <Txt x={x + 8} y="22" cls={cx('sm num', on ? 'cu' : 'dim')} style={{ fontSize: '8.5px' }}>{`0${i + 1}`}</Txt>
            <Txt x={x + 24} y="22" cls={cx('sm', on ? 'hi' : '')} style={{ fontSize: '8.5px', fontWeight: on ? 600 : 400 }}>{s}</Txt>
            {on && <circle cx={x + 62} cy="18" r="2" className="eg-dot ok" />}
          </g>
        )
      })}

      {/* Raw Material Inflow: solidly connected into tank inlet collar */}
      <Wire d="M10 84 H51" on={c.feed} thick />
      <Arrow x={30} y={84} rot={0} on={c.feed} />
      <rect x="47" y="80" width="5" height="8" rx="1" className={cx('eg-b', c.feed && 'on')} />
      <Txt x="12" y="74" cls="sm dim" style={{ fontSize: '7.5px' }}>RAW FEED</Txt>

      {/* Centered Batch Tank T-101 */}
      <Tank x={88} y={114} w={74} h={86} level={c.level} on />
      <Txt x="88" y="94" anchor="middle" cls="sm dim" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>T-101</Txt>

      {/* Agitator Motor: mounted firmly on tank top pedestal with centered shaft */}
      <rect x="78" y="68" width="20" height="5" rx="1.5" className={cx('eg-b', c.agit && 'on')} />
      <Motor x={88} y={58} r={10} on={c.agit} run={c.agit} label="M" phase="" />
      <Wire d="M88 68 V138" thick on={c.agit} />
      <path d="M72 138 H104" className={cx('eg-w thick', c.agit && 'on')} />
      <path d="M72 134 V142 M104 134 V142" className={cx('eg-w', c.agit && 'on')} />

      {/* Immersion Heating Element */}
      <Heater x={88} y={146} on={c.heat} hot={c.hot} />

      {/* Level Transmitter LT-101: connected to tank nozzle */}
      <rect x="124" y="111" width="4" height="6" rx="1" className="eg-b on" />
      <Wire d="M128 114 H142" thin on />
      <Bubble x={152} y={114} tag="LT" num="101" on r={10} />

      {/* Central Supervisory Controller (PLC AUTO) */}
      <rect x="186" y="74" width="64" height="28" rx="3" className="eg-b deep" />
      <circle cx="196" cy="88" r="2.2" className="eg-dot ok" />
      <Txt x="221" y="90" anchor="middle" cls="sm hi" style={{ fontSize: '8px', fontWeight: 600 }}>PLC AUTO</Txt>
      <Txt x="221" y="97" anchor="middle" cls="sm ok" style={{ fontSize: '6.5px' }}>RUNNING</Txt>

      {/* Supervisory Signal Lines: fully connected with terminal dots */}
      {/* 1. LT-101 to PLC AUTO */}
      <path d="M162 114 H174 V88 H186" className="eg-w thin dash" />
      <circle cx="186" cy="88" r="2" className="eg-dot on" />

      {/* 2. PLC AUTO down to FV-103 actuator dome */}
      <path d="M218 102 V166" className={cx('eg-w thin dash', c.pump && 'on')} />
      <circle cx="218" cy="102" r="2" className={cx('eg-dot', c.pump ? 'ok' : 'off')} />
      <circle cx="218" cy="166" r="2" className={cx('eg-dot', c.pump ? 'ok' : 'off')} />

      {/* 3. PLC AUTO to TT-102 */}
      <path d="M250 88 H292 V132" className={cx('eg-w thin dash', c.heat && 'hot')} />
      <circle cx="250" cy="88" r="2" className={cx('eg-dot', c.heat ? 'hot' : 'off')} />

      {/* Discharge Piping: tank drain -> pump -> valve -> packaging */}
      <rect x="84" y="157" width="8" height="5" rx="1" className={cx('eg-b', c.pump && 'on')} />
      <Wire d="M88 162 V186 H139" on={c.pump} thick />

      {/* Inline Transfer Pump P-101 */}
      <circle cx="152" cy="186" r="13" className={cx('eg-b', c.pump && 'on')} />
      <g className={cx(c.pump && 'eg-spin')}>
        <path d="M152 186 L152 178 M152 186 L159 190 M152 186 L145 190" className={cx('eg-w thick', c.pump && 'on')} />
      </g>
      <circle cx="152" cy="186" r="2" className={cx('eg-dot', c.pump ? 'ok' : 'off')} />
      <Txt x="152" y="210" anchor="middle" cls="sm dim" style={{ fontSize: '8px' }}>P-101</Txt>

      {/* Pump to Valve Pipe */}
      <Wire d="M165 186 H208" on={c.pump} thick />

      {/* Control Valve FV-103 */}
      <Valve x={218} y={186} on={c.pump} open={c.pump} label="" />
      <Txt x="218" y="210" anchor="middle" cls="sm dim" style={{ fontSize: '8px' }}>FV-103</Txt>

      {/* Valve to Packaging Line */}
      <Wire d="M228 186 H330" on={c.pump} thick />
      <Arrow x={260} y={186} rot={0} on={c.pump} />

      {/* Inline Temperature Sensor TT-102: mounted solidly to process stream */}
      <rect x="289" y="182" width="6" height="8" rx="1" className={cx('eg-b', c.heat && 'hot')} />
      <Wire d="M292 182 V152" thin on={c.heat} />
      <Bubble x={292} y={142} tag="TT" num="102" on={c.heat} tone={c.hot ? 'hot' : undefined} r={10} />

      <Txt x="330" y="174" anchor="end" cls="sm hi" style={{ fontSize: '8.5px', fontWeight: 600 }}>TO PACKAGING →</Txt>

      {/* Right Process Telemetry Card */}
      <rect x="356" y="14" width="168" height="202" rx="6" className="eg-b deep" />
      <circle cx="372" cy="32" r="3" className="eg-dot ok" />
      <Txt x="382" y="36" cls="sm hi" style={{ letterSpacing: '0.04em' }}>PROCESS CONTROL</Txt>
      <Txt x="510" y="36" anchor="end" cls="sm ok" style={{ fontSize: '8px', fontWeight: 600 }}>ACTIVE</Txt>

      <path d="M368 44 H512" className="eg-axis" />

      {/* Active Phase Pill */}
      <rect x="368" y="52" width="144" height="24" rx="3" className="eg-b on lit" />
      <Txt x="440" y="67" anchor="middle" cls="sm cu" style={{ fontWeight: 600, fontSize: '9px' }}>
        {`PHASE 0${step + 1}: ${PSTAGES[step]} SEQUENCE`}
      </Txt>

      <Txt x="372" y="93" cls="sm dim" style={{ fontSize: '8px' }}>BATCH RUN</Txt>
      <Txt x="510" y="93" anchor="end" cls="sm hi num" style={{ fontSize: '8.5px' }}>{`#${batch}`}</Txt>

      <path d="M368 100 H512" className="eg-axis" />

      {rows.map(([tag, val], i) => (
        <g key={tag}>
          <Txt x="372" y={118 + i * 19} cls="sm dim" style={{ fontSize: '8px' }}>{tag}</Txt>
          <Txt x="510" y={118 + i * 19} anchor="end" cls={cx('sm num', i === 1 && c.hot ? 'hot' : 'hi')} style={{ fontSize: '9px' }}>{val}</Txt>
        </g>
      ))}

      {/* Status footer pill */}
      <rect x="368" y="184" width="144" height="22" rx="3" className="eg-b deep" />
      <Txt x="440" y="199" anchor="middle" cls="sm ok" style={{ fontSize: '8px', fontWeight: 500 }}>
        ● RECIPE IN SPECIFICATION
      </Txt>
    </Svg>
  )
}

/* =========================================================================
   4 · Energy Monitoring: Clean power distribution single-line diagram
   ========================================================================= */
const FEEDER_NAMES = ['CNC', 'PRESS', 'HVAC', 'PUMP', 'OVEN', 'AUX']

function EnergyViz({ reduce }) {
  const [bars, setBars] = useState([42, 54, 34, 62, 48, 68])
  const total = useLiveValue({ base: 124.6, jitter: 3.5, min: 105, max: 145, interval: 3200, reduce })

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      setBars((b) => b.map((h) => Math.min(76, Math.max(22, h + (Math.random() - 0.5) * 14))))
    }, 3600)
    return () => clearInterval(t)
  }, [reduce])

  const xs = [112, 154, 196, 238, 280, 322]
  const BASE_Y = 168
  const TRACK_H = 88
  const PEAK = 60
  const peakY = BASE_Y - Math.round((PEAK / 100) * (TRACK_H - 6))
  const anyHot = bars.some((h) => h > PEAK)

  return (
    <Svg viewBox={VB} className="appviz" label="Power distribution single-line diagram with metered feeder channels">
      {/* 415V Grid Incomer Badge */}
      <rect x="14" y="30" width="62" height="25" rx="4" className="eg-b on lit" />
      <Txt x="45" y="42" anchor="middle" cls="sm hi" style={{ fontWeight: 600 }}>415V GRID</Txt>
      <Txt x="45" y="51" anchor="middle" cls="sm ok" style={{ fontSize: '7.5px' }}>● 3-PHASE</Txt>

      {/* Main Busbar & Incomer Feed */}
      <Wire d="M76 42 H96" thick on />
      <Node x="96" y="42" r="2.4" />
      <Wire d="M96 42 H336" thick on />
      <Txt x="214" y="27" anchor="middle" cls="sm dim" style={{ letterSpacing: '0.08em' }}>MAIN DISTRIBUTION BUSBAR · 415 V</Txt>

      {/* 6 Feeder Drops */}
      {xs.map((x, i) => {
        const val = bars[i]
        const isHot = val > PEAK
        const fillH = Math.min(TRACK_H - 6, Math.max(10, Math.round((val / 100) * (TRACK_H - 6))))
        return (
          <g key={x}>
            {/* Busbar tap node and drop wire */}
            <Node x={x} y="42" r="2.2" />
            <Wire d={`M${x} 42 V54`} on />

            {/* Clean inline disconnect/breaker unit */}
            <rect x={x - 8} y="54" width="16" height="12" rx="2" className="eg-b" />
            <circle cx={x} cy="60" r="1.8" className="eg-dot ok" />

            <Wire d={`M${x} 66 V78`} on />

            {/* Feeder load column track & active fill */}
            <rect x={x - 11} y="78" width="22" height={TRACK_H} rx="3" className="eg-b deep" />
            <rect
              x={x - 9}
              y={BASE_Y - fillH}
              width="18"
              height={fillH}
              rx="2"
              className={cx('eg-b', isHot ? 'hot lithot' : 'on lit')}
              style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
            />

            {/* Feeder metadata */}
            <Txt x={x} y="182" anchor="middle" cls="sm hi">{`F${i + 1}`}</Txt>
            <Txt x={x} y="195" anchor="middle" cls="sm dim" style={{ fontSize: '8px' }}>{FEEDER_NAMES[i]}</Txt>
            <Txt x={x} y="208" anchor="middle" cls={cx('sm num', isHot ? 'hot' : 'dim')} style={{ fontSize: '8.5px' }}>
              {`${(val * 0.42).toFixed(1)}k`}
            </Txt>
          </g>
        )
      })}

      {/* Peak demand threshold */}
      <path d={`M98 ${peakY} H336`} className="eg-limit" strokeDasharray="3 3" />
      <rect x="66" y={peakY - 8} width="30" height="16" rx="2" className="eg-b deep hot" />
      <Txt x="81" y={peakY + 3} anchor="middle" cls="sm hot" style={{ fontSize: '8px', fontWeight: 600 }}>PEAK</Txt>

      {/* Right Digital Power Analyzer Card: clean, balanced typography */}
      <rect x="356" y="24" width="168" height="190" rx="6" className="eg-b deep" />
      <circle cx="372" cy="42" r="3" className="eg-dot ok" />
      <Txt x="382" y="46" cls="sm hi" style={{ letterSpacing: '0.05em' }}>PM-6 ANALYZER</Txt>
      <Txt x="510" y="46" anchor="end" cls="sm ok" style={{ fontSize: '8.5px' }}>LIVE</Txt>

      <path d="M368 56 H512" className="eg-axis" />
      <Txt x="440" y="73" anchor="middle" cls="sm dim" style={{ letterSpacing: '0.04em' }}>TOTAL FEED DEMAND</Txt>
      <Txt x="440" y="106" anchor="middle" cls={cx('big num', anyHot ? 'hot' : 'hi')} style={{ fontSize: '30px', fontWeight: 700 }}>
        {total.toFixed(1)}
      </Txt>
      <Txt x="440" y="121" anchor="middle" cls="sm dim">KILOWATTS (kW)</Txt>

      {/* Phase Telemetry Readout */}
      <rect x="368" y="132" width="44" height="26" rx="3" className="eg-b deep" />
      <Txt x="390" y="143" anchor="middle" cls="sm dim" style={{ fontSize: '7.5px' }}>VOLTS</Txt>
      <Txt x="390" y="154" anchor="middle" cls="sm hi num" style={{ fontSize: '9px' }}>415 V</Txt>

      <rect x="418" y="132" width="44" height="26" rx="3" className="eg-b deep" />
      <Txt x="440" y="143" anchor="middle" cls="sm dim" style={{ fontSize: '7.5px' }}>FREQ</Txt>
      <Txt x="440" y="154" anchor="middle" cls="sm hi num" style={{ fontSize: '9px' }}>50.0 Hz</Txt>

      <rect x="468" y="132" width="44" height="26" rx="3" className="eg-b deep" />
      <Txt x="490" y="143" anchor="middle" cls="sm dim" style={{ fontSize: '7.5px' }}>P.F.</Txt>
      <Txt x="490" y="154" anchor="middle" cls="sm hi num" style={{ fontSize: '9px' }}>0.98</Txt>

      {/* Operational State Badge */}
      <rect x="368" y="166" width="144" height="24" rx="4" className={cx('eg-b', anyHot ? 'hot lithot' : 'deep')} />
      <Txt x="440" y="182" anchor="middle" cls={cx('sm', anyHot ? 'hot' : 'ok')} style={{ fontWeight: 600 }}>
        {anyHot ? '▲ PEAK APPROACHED' : '● WITHIN CAPACITY'}
      </Txt>
    </Svg>
  )
}

/* =========================================================================
   5 · Predictive Maintenance: Vibration spectrum and remaining useful life
   ========================================================================= */
const BINS = 20
const DRIFT_BIN = 12

function PredictiveViz({ reduce }) {
  const hot = useAnomaly(10000, 3000, reduce)
  const rulDays = hot ? 28 : 42

  const val = (i) => {
    let v = 0.15 + Math.sin(i * 0.72) * 0.08
    if (i === DRIFT_BIN) v = hot ? 0.92 : 0.24
    if (i === DRIFT_BIN - 1 || i === DRIFT_BIN + 1) v += hot ? 0.28 : 0
    return Math.min(1, Math.max(0.1, v))
  }

  return (
    <Svg viewBox={VB} className="appviz" label="Predictive maintenance: drive train vibration analysis with FFT spectrum and health index">
      {/* Left: Drive Train Diagnostic Module */}
      <rect x="14" y="12" width="202" height="206" rx="6" className="eg-b deep" />

      {/* Header */}
      <circle cx="28" cy="27" r="3" className={cx('eg-dot', hot ? 'hot' : 'ok')} />
      <Txt x="38" y="30" cls="sm hi" style={{ letterSpacing: '0.06em' }}>DRIVE TRAIN MONITOR</Txt>
      <Txt x="202" y="30" anchor="end" cls={cx('sm', hot ? 'hot' : 'ok')} style={{ fontSize: '8px', fontWeight: 600 }}>
        {hot ? 'ANOMALY' : 'NORMAL'}
      </Txt>
      <path d="M24 38 H204" className="eg-axis" />

      {/* Drive Train Mechanical Assembly: Centered around y = 84 */}
      {/* Baseplate with mounting bolts */}
      <rect x="26" y="110" width="178" height="7" rx="2" className="eg-b" />
      <circle cx="34" cy="113.5" r="1.6" className="eg-hole" />
      <circle cx="196" cy="113.5" r="1.6" className="eg-hole" />

      {/* Motor M2 */}
      <rect x="38" y="103" width="26" height="7" rx="1.5" className="eg-b on" />
      <Motor x={51} y={82} r={18} on label="M2" phase="3~" />

      {/* Shaft with Coupling */}
      <Wire d="M69 82 H154" thick on />
      <rect x="80" y="74" width="8" height="16" rx="1.5" className="eg-b deep on" />
      <path d="M84 74 V90" className="eg-w thin" />

      {/* Monitored Bearing Block (6205) */}
      <rect x="99" y="103" width="30" height="7" rx="1.5" className="eg-b" />
      <rect x="101" y="69" width="26" height="34" rx="3" className="eg-b on" />
      <circle cx="114" cy="82" r="7" className="eg-b deep" />
      <circle cx="114" cy="82" r="2.5" className={cx('eg-dot', hot ? 'hot' : 'ok')} />

      {/* Load Fan Impeller */}
      <rect x="150" y="103" width="28" height="7" rx="1.5" className="eg-b" />
      <circle cx="164" cy="82" r="15" className="eg-b deep on" />
      <Fan x={164} y={82} r={12} on run />

      {/* Vibration Accelerometer (ACC-02) */}
      <rect x="109" y="58" width="10" height="11" rx="1.5" className={cx('eg-b', hot ? 'hot lithot' : 'on')} />
      <Txt x="114" y="53" anchor="middle" cls="sm hi" style={{ fontSize: '7.5px', fontWeight: 600 }}>ACC-02</Txt>
      {hot && (
        <path d="M123 60 C126 62 126 65 123 67 M125 58 C129 61 129 67 125 69" className="eg-w thin hot" />
      )}

      {/* Shielded signal lead to AI Edge Processor */}
      <path d="M119 63 H146 V48 H158" className={cx('eg-w thin', hot ? 'hot' : 'on')} />
      <rect x="158" y="41" width="44" height="15" rx="2" className={cx('eg-b deep', hot ? 'hot' : 'ok')} />
      <Txt x="180" y="51" anchor="middle" cls={cx('sm', hot ? 'hot' : 'ok')} style={{ fontSize: '7.5px', fontWeight: 700 }}>
        AI EDGE
      </Txt>

      {/* Diagnostic Readouts */}
      <path d="M24 125 H204" className="eg-axis" />
      <Txt x="26" y="140" cls="sm dim" style={{ fontSize: '7.5px' }}>BEARING</Txt>
      <Txt x="202" y="140" anchor="end" cls="sm hi num" style={{ fontSize: '8px' }}>SKF 6205 · 1750 RPM</Txt>

      <Txt x="26" y="156" cls="sm dim" style={{ fontSize: '7.5px' }}>VIB VELOCITY</Txt>
      <Txt x="202" y="156" anchor="end" cls={cx('sm num', hot ? 'hot' : 'ok')} style={{ fontSize: '8.5px', fontWeight: 600 }}>
        {hot ? '4.82 mm/s' : '1.45 mm/s'}
      </Txt>

      {/* Status Banner */}
      <rect x="24" y="168" width="182" height="22" rx="3" className={cx('eg-b', hot ? 'hot lithot' : 'deep')} />
      <Txt x="115" y="182" anchor="middle" cls={cx('sm', hot ? 'hot' : 'ok')} style={{ fontWeight: 600, fontSize: '8px' }}>
        {hot ? '▲ BEARING FAULT DETECTED' : '● VIBRATION NORMAL'}
      </Txt>
      <Txt x="115" y="200" anchor="middle" cls="sm dim" style={{ fontSize: '7px' }}>ISO 10816-3 CLASS II</Txt>

      {/* Right Top Frame: FFT Vibration Frequency Spectrum */}
      <ScopeFrame x={226} y={12} w={300} h={100}>
        <Txt x="10" y="14" cls="sm hi">FFT · VIBRATION SPECTRUM</Txt>
        <Txt x="290" y="14" anchor="end" cls="sm ok" style={{ fontSize: '7.5px' }}>LIVE · 0–1000 Hz</Txt>

        {/* Amplitude Y-Axis */}
        <path d="M20 74 H290" className="eg-axis" />
        <Txt x="16" y="32" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>4g</Txt>
        <Txt x="16" y="53" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>2g</Txt>
        <Txt x="16" y="74" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>0</Txt>

        {/* Spectrum Bins */}
        {Array.from({ length: 20 }).map((_, i) => {
          const isFault = i === DRIFT_BIN
          const barH = isFault ? (hot ? 52 : 16) : Math.max(6, Math.round(val(i) * 38))
          const bx = 26 + i * 13
          return (
            <g key={i}>
              <rect
                x={bx}
                y={74 - barH}
                width="8"
                height={barH}
                rx="1.5"
                className={cx('sbar', isFault && hot ? 'hot' : '')}
                style={{ transition: 'height 0.4s ease, y 0.4s ease' }}
              />
            </g>
          )
        })}

        {/* Harmonic Fault Peak Indicator */}
        {hot && (
          <g>
            <path d="M182 24 V74" className="eg-w thin hot dash" />
            <rect x="156" y="14" width="52" height="13" rx="2" className="eg-b deep hot" />
            <Txt x="182" y="23" anchor="middle" cls="sm hot" style={{ fontSize: '7px', fontWeight: 700 }}>
              BPFO 284 Hz
            </Txt>
          </g>
        )}

        {/* Frequency X-Axis */}
        <Txt x="26" y="86" cls="sm dim" style={{ fontSize: '6.5px' }}>0 Hz</Txt>
        <Txt x="92" y="86" anchor="middle" cls="sm dim" style={{ fontSize: '6.5px' }}>250 Hz</Txt>
        <Txt x="157" y="86" anchor="middle" cls="sm dim" style={{ fontSize: '6.5px' }}>500 Hz</Txt>
        <Txt x="222" y="86" anchor="middle" cls="sm dim" style={{ fontSize: '6.5px' }}>750 Hz</Txt>
        <Txt x="286" y="86" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>1 kHz</Txt>
      </ScopeFrame>

      {/* Right Bottom Frame: Health Index & RUL Trend */}
      <ScopeFrame x={226} y={118} w={300} h={100}>
        <Txt x="10" y="14" cls="sm hi">HEALTH INDEX & REMAINING USEFUL LIFE</Txt>
        <rect x="214" y="5" width="76" height="15" rx="3" className={cx('eg-b', hot ? 'hot lithot' : 'ok litok')} />
        <Txt x="252" y="15.5" anchor="middle" cls={cx('sm num', hot ? 'hot' : 'ok')} style={{ fontWeight: 700, fontSize: '8px' }}>
          {`RUL ≈ ${rulDays} DAYS`}
        </Txt>

        {/* Health Index Y-Axis */}
        <path d="M20 74 H290" className="eg-axis" />
        <Txt x="16" y="26" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>100%</Txt>
        <Txt x="16" y="50" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>50%</Txt>
        <Txt x="16" y="74" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>0%</Txt>

        {/* Maintenance Threshold Line (No Overlapping!) */}
        <path d="M20 60 H290" className="eg-limit" strokeDasharray="3 3" />
        <rect x="22" y="52" width="76" height="12" rx="2" className="eg-b deep hot" />
        <Txt x="60" y="60.5" anchor="middle" cls="sm hot" style={{ fontSize: '6.5px', fontWeight: 600 }}>
          ALARM LIMIT (20%)
        </Txt>

        {/* Historical Degradation Curve */}
        <path d="M22 24 C70 24 110 32 152 42" className={cx('eg-trace', hot && 'hot')} strokeWidth="2" />

        {/* Projected Future Path */}
        {hot ? (
          <path d="M152 42 C180 50 200 56 218 60" className="eg-w thin hot dash" strokeWidth="1.8" />
        ) : (
          <path d="M152 42 C190 48 230 54 265 60" className="eg-w thin on dash" strokeWidth="1.8" />
        )}

        {/* Current Inspection Point */}
        <circle cx="152" cy="42" r="3.5" className={cx('eg-dot', hot ? 'hot' : 'ok')} />
        <rect x="139" y="25" width="26" height="12" rx="2" className="eg-b deep on" />
        <Txt x="152" y="33.5" anchor="middle" cls="sm hi" style={{ fontSize: '7px', fontWeight: 700 }}>NOW</Txt>

        {/* Time Horizon X-Axis */}
        <Txt x="22" y="86" cls="sm dim" style={{ fontSize: '6.5px' }}>DAY 0</Txt>
        <Txt x="152" y="86" anchor="middle" cls="sm dim" style={{ fontSize: '6.5px' }}>DAY 180 (CURRENT)</Txt>
        <Txt x="286" y="86" anchor="end" cls="sm dim" style={{ fontSize: '6.5px' }}>365 DAYS</Txt>
      </ScopeFrame>
    </Svg>
  )
}

/* =========================================================================
   6 · Robotics: 2-axis servo arm with smooth joint telemetry
   ========================================================================= */
function RoboticsViz({ reduce }) {
  const [t, setT] = useState(2.78)

  useEffect(() => {
    if (reduce) return
    let animId
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      setT((prev) => prev + dt * 0.84)
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [reduce])

  const { u, q1, q2 } = solveArm(t)
  const open = 10 - 5 * u * u * (3 - 2 * u)

  return (
    <Svg viewBox={VB} className="appviz" label="Two-axis robotic articulated arm with live servo angle readouts">
      {/* Reusable Robot Arm Assembly with kinematics, conveyor & workpiece */}
      <RobotArmGraphic t={t} transform="translate(-10, 16) scale(0.70)" />

      {/* Joint Readout Panel */}
      <rect x="360" y="32" width="165" height="166" rx="6" className="eg-b deep" />
      <Txt x="376" y="55" cls="sm hi">ROBOT ARM TELEMETRY</Txt>
      <Txt x="376" y="70" cls="sm dim">2-AXIS SERVO POSITION</Txt>
      <path d="M376 79 H510" className="eg-axis" />
      <Txt x="376" y="102" cls="sm dim">SHOULDER (A1)</Txt>
      <Txt x="510" y="102" anchor="end" cls="sm num hi">{fmt(deg(q1))}</Txt>
      <Txt x="376" y="124" cls="sm dim">ELBOW (A2)</Txt>
      <Txt x="510" y="124" anchor="end" cls="sm num hi">{fmt(deg(q2))}</Txt>
      <Txt x="376" y="146" cls="sm dim">GRIPPER</Txt>
      <Txt x="510" y="146" anchor="end" cls="sm num hi">{Math.round(open * 2)} mm</Txt>
      <rect x="382" y="162" width="122" height="24" rx="3" className="eg-b" />
      <Txt x="443" y="178" anchor="middle" cls="sm ok">● AUTO CYCLE ACTIVE</Txt>
    </Svg>
  )
}

/* =========================================================================
   7 · Industrial Control: PLC deterministic scan cycle
   ========================================================================= */
const PLC_INPUTS = [
  { tag: 'I0.0', name: 'E-STOP' },
  { tag: 'I0.1', name: 'GUARD' },
  { tag: 'I0.2', name: 'SENSOR' },
  { tag: 'I0.3', name: 'START' },
]

const PLC_OUTPUTS = [
  { tag: 'Q0.0', name: 'MOTOR' },
  { tag: 'Q0.1', name: 'SAFETY' },
  { tag: 'Q0.2', name: 'VALVE' },
  { tag: 'Q0.3', name: 'BEACON' },
]

// 4-step sequence simulating realistic deterministic safety and interlock behavior
const PLC_STATES = [
  { inp: [true, true, true, true], label: 'NORMAL RUNNING' },
  { inp: [true, true, false, true], label: 'PART TRANSFER' },
  { inp: [true, false, false, false], label: 'GUARD OPEN (TRIP)' },
  { inp: [true, true, true, true], label: 'INTERLOCK RESTORED' },
]

function ControlViz({ reduce }) {
  const [step, setStep] = useState(0)
  const [scan, setScan] = useState(1240)
  const [stage, setStage] = useState(1)

  useEffect(() => {
    if (reduce) return
    // State machine steps through interlock demo sequence every 2.8s
    const stepTimer = setInterval(() => {
      setStep((s) => (s + 1) % PLC_STATES.length)
    }, 2800)

    // Live scan counter increments rapidly, reflecting deterministic execution
    const scanTimer = setInterval(() => {
      setScan((s) => s + 1)
      setStage((st) => (st + 1) % 3)
    }, 450)

    return () => {
      clearInterval(stepTimer)
      clearInterval(scanTimer)
    }
  }, [reduce])

  const curState = PLC_STATES[step]
  const inp = curState.inp

  // Deterministic Boolean Interlock Logic executed by the PLC:
  const isSafe = inp[0] && inp[1] // E-Stop AND Safety Guard must be closed
  const motorOn = isSafe && inp[3] // Motor contactor requires safety loop AND start
  const safetyRelay = isSafe
  const valveOn = motorOn && inp[2] // Solenoid clamp actuates when part present
  const beaconOn = isSafe // Status beacon green when safety loop healthy
  const out = [motorOn, safetyRelay, valveOn, beaconOn]

  // Symmetrically spaced columns centered at x = 182
  const tx = [95, 153, 211, 269]

  return (
    <Svg viewBox={VB} className="appviz" label="Deterministic PLC scan cycle with field digital inputs, internal execution pipeline, and actuator outputs">
      {/* +24V DC Supply Power Bus */}
      <Wire d="M34 18 H274" on thick />
      <Txt x="30" y="21" anchor="end" cls="sm cu">+24V</Txt>
      <Node x={34} y={18} />

      {/* Field Digital Inputs (Top) */}
      {tx.map((x, i) => (
        <g key={`in-${x}`}>
          {/* Feed wire from +24V bus */}
          <Wire d={`M${x} 18 V32`} on thick />
          <Node x={x} y={18} />

          {/* Stationary contact pad */}
          <path d={`M${x - 4} 32 H${x + 4}`} className="eg-w on" />

          {/* Switch blade (animated between closed vertical and open angle) */}
          <path
            d={inp[i] ? `M${x} 62 V33` : `M${x} 62 L${x - 8} 34`}
            className={cx('eg-w thick', inp[i] && 'on')}
            style={{ transition: 'd 0.3s ease' }}
          />
          {/* Pivot terminal */}
          <circle cx={x} cy={62} r="1.8" className={cx('eg-dot', inp[i] ? '' : 'off')} />

          {/* Wire from switch to PLC input terminal */}
          <Wire d={`M${x} 62 V86`} on={inp[i]} />

          {/* Input Address & Functional Label */}
          <Txt x={x + 6} y={43} cls="sm hi">{PLC_INPUTS[i].tag}</Txt>
          <Txt x={x + 6} y={53} cls="sm dim">{PLC_INPUTS[i].name}</Txt>

          {/* Terminal screw port & channel LED on PLC top rail */}
          <circle cx={x} cy={86} r="2.2" className="eg-b deep" />
          <circle cx={x} cy={92} r={inp[i] ? 2.5 : 1.8} className={cx('eg-led', inp[i] && 'on ok')} />
        </g>
      ))}

      {/* PLC Controller Chassis (Centered at x = 182) */}
      <rect x="38" y="86" width="288" height="72" rx="4" className="eg-b on" />

      {/* PLC Header & Status */}
      <Txt x="48" y="104" cls="mid hi">ARMTRONIX PLC</Txt>
      <Txt x="156" y="104" cls="sm dim">CPU-1200</Txt>
      <circle cx="212" cy="101" r="2.2" className="eg-dot ok" />
      <Txt x="219" y="104" cls="sm ok">RUN</Txt>
      <Txt x="316" y="104" anchor="end" cls="sm num hi">{`SCAN #${scan}`}</Txt>

      {/* 3-Stage Deterministic Cyclic Execution Pipeline */}
      {/* Stage 1: Input Scan */}
      <rect x="48" y="112" width="78" height="18" rx="2" className={cx('eg-b', stage === 0 ? 'on lit' : 'deep')} />
      <Txt x="87" y="125" anchor="middle" cls={cx('sm', stage === 0 ? 'hi' : 'dim')}>1. READ IN</Txt>

      {/* Pipeline arrow 1 -> 2 */}
      <path d="M128 121 H136 M134 119 L136.5 121 L134 123" className="eg-w thin on" />

      {/* Stage 2: Logic Solve */}
      <rect x="138" y="112" width="88" height="18" rx="2" className={cx('eg-b', stage === 1 ? 'on lit' : 'deep')} />
      <Txt x="182" y="125" anchor="middle" cls={cx('sm', stage === 1 ? 'hi' : 'dim')}>2. SOLVE LOGIC</Txt>

      {/* Pipeline arrow 2 -> 3 */}
      <path d="M228 121 H236 M234 119 L236.5 121 L234 123" className="eg-w thin on" />

      {/* Stage 3: Output Write */}
      <rect x="238" y="112" width="78" height="18" rx="2" className={cx('eg-b', stage === 2 ? 'on lit' : 'deep')} />
      <Txt x="277" y="125" anchor="middle" cls={cx('sm', stage === 2 ? 'hi' : 'dim')}>3. WRITE OUT</Txt>

      {/* Pipeline caption */}
      <Txt x="182" y="145" anchor="middle" cls="sm cu">DETERMINISTIC SCAN CYCLE · &lt;10 ms EDGE DECISION</Txt>

      {/* Field Digital Outputs (Bottom) */}
      {tx.map((x, i) => (
        <g key={`out-${x}`}>
          {/* Bottom Channel LED Indicator & terminal screw port on PLC rail */}
          <circle cx={x} cy={152} r={out[i] ? 2.5 : 1.8} className={cx('eg-led cu', out[i] && 'on')} />
          <circle cx={x} cy={158} r="2.2" className="eg-b deep" />

          {/* Wire from PLC output terminal to field coil */}
          <Wire d={`M${x} 158 V172`} on={out[i]} />

          {/* IEC Actuator / Relay Coil Box */}
          <rect x={x - 11} y={172} width="22" height="18" rx="2" className={cx('eg-b', out[i] && 'on lit')} />
          <path d={`M${x} 170 V172 M${x} 190 V192`} className={cx('eg-w', out[i] && 'on')} />

          {/* Output Address & Functional Label */}
          <Txt x={x + 14} y={178} cls="sm hi">{PLC_OUTPUTS[i].tag}</Txt>
          <Txt x={x + 14} y={188} cls="sm dim">{PLC_OUTPUTS[i].name}</Txt>

          {/* Return wire from coil to 0V ground bus */}
          <Wire d={`M${x} 192 V202`} on={out[i]} />
          <Node x={x} y={202} tone={out[i] ? '' : 'off'} />
        </g>
      ))}

      {/* 0V DC Common Return Ground Bus */}
      <Wire d="M34 202 H274" on thick />
      <Txt x="30" y="205" anchor="end" cls="sm dim">0V (COM)</Txt>
      <Ground x={34} y={202} on />

      {/* Right Telemetry & Status HUD Panel */}
      <rect x="360" y="20" width="165" height="188" rx="6" className="eg-b deep" />
      <Txt x="375" y="40" cls="sm hi">LOGIC STATUS</Txt>
      <Txt x="375" y="54" cls="sm dim">DETERMINISTIC 1 MS SCAN</Txt>
      <path d="M375 62 H510" className="eg-axis" />

      <Txt x="375" y="80" cls="sm dim">CYCLE TIME</Txt>
      <Txt x="510" y="80" anchor="end" cls="sm num hi">0.84 ms (&lt;10 ms)</Txt>

      <Txt x="375" y="98" cls="sm dim">SCAN CYCLE</Txt>
      <Txt x="510" y="98" anchor="end" cls="sm num hi">{`#${scan}`}</Txt>

      <Txt x="375" y="116" cls="sm dim">SAFETY LOOP</Txt>
      <Txt x="510" y="116" anchor="end" cls={cx('sm num', isSafe ? 'ok' : 'hot')}>
        {isSafe ? 'CLOSED · PASS' : 'TRIPPED · OPEN'}
      </Txt>

      <Txt x="375" y="134" cls="sm dim">RUNG 001 [INTERLOCK]</Txt>
      <Txt x="510" y="134" anchor="end" cls={cx('sm', isSafe ? 'ok' : 'hot')}>
        {isSafe ? 'ACTIVE' : 'TRIPPED'}
      </Txt>

      <Txt x="375" y="152" cls="sm dim">RUNG 002 [MOTOR]</Txt>
      <Txt x="510" y="152" anchor="end" cls={cx('sm', out[0] ? 'ok' : 'dim')}>
        {out[0] ? 'ENERGIZED' : 'SAFE STOP'}
      </Txt>

      <rect x="372" y="166" width="141" height="24" rx="3" className="eg-b" />
      <circle cx="384" cy="178" r="2.5" className={cx('eg-dot', isSafe ? 'ok' : 'bad')} />
      <Txt x="450" y="182" anchor="middle" cls={cx('sm', isSafe ? 'ok' : 'bad')}>
        {isSafe ? '● PLC RUN MODE' : '▲ SAFETY INTERRUPT'}
      </Txt>
    </Svg>
  )
}

/* =========================================================================
   8 · Connected Equipment: Industrial assets networked to an IoT hub
   ========================================================================= */
function EquipmentViz({ reduce }) {
  const nodes = [
    { name: 'CNC MILL', x: 80, kind: 'cnc' },
    { name: 'PRESS 02', x: 195, kind: 'press' },
    { name: 'PUMP 03', x: 310, kind: 'lathe' },
  ]
  const BUS_Y = 160

  return (
    <Svg viewBox={VB} className="appviz" label="Connected equipment assets linked to a central IoT hub">
      {/* 3 Connected Legacy Machines */}
      {nodes.map((n) => (
        <g key={n.name}>
          {/* Machine Header */}
          <Txt x={n.x} y="38" anchor="middle" cls="sm hi">{n.name}</Txt>

          {/* Machine Elevation */}
          <Machine x={n.x} y={72} kind={n.kind} />

          {/* Bolt-On Retrofit Sensor Adapter */}
          <rect x={n.x - 26} y="98" width="52" height="18" rx="3" className="eg-b deep" />
          <circle cx={n.x - 18} cy="107" r="1.8" className="eg-led on ok" />
          <Txt x={n.x + 4} y="110" anchor="middle" cls="sm ok" style={{ fontSize: '7.5px', fontWeight: 600 }}>+ SENSOR</Txt>

          {/* Drop line from sensor to common bus */}
          <Wire d={`M${n.x} 116 V${BUS_Y}`} on />
          <Node x={n.x} y={BUS_Y} r={2.5} />
        </g>
      ))}

      {/* Retrofit Sensor Fieldbus Line */}
      <Wire d={`M40 ${BUS_Y} H430`} on thick />
      <Txt x="40" y={BUS_Y + 18} cls="sm dim" style={{ fontSize: '7.5px' }}>
        RETROFIT SENSOR BUS · ZERO DOWNTIME
      </Txt>

      {/* Industrial IoT Gateway */}
      <Gateway x={445} y={BUS_Y} on />
      <Txt x={445} y={BUS_Y + 22} anchor="middle" cls="sm hi">IOT GATEWAY</Txt>
      <Txt x={445} y={BUS_Y + 32} anchor="middle" cls="sm ok" style={{ fontSize: '7px' }}>24/7 ONLINE</Txt>

      {/* Uplink wire to Cloud */}
      <Wire d={`M445 ${BUS_Y - 14} V78`} on dash />
      <Txt x="453" y="114" cls="sm dim" style={{ fontSize: '7px' }}>MQTT / TLS</Txt>

      {/* Cloud Uplink */}
      <Cloud x={445} y={56} on />
      <Txt x={445} y="34" anchor="middle" cls="sm hi">CLOUD</Txt>
    </Svg>
  )
}

const VIZ = {
  factory: FactoryViz,
  monitoring: MonitoringViz,
  process: ProcessViz,
  energy: EnergyViz,
  predictive: PredictiveViz,
  'robotics-app': RoboticsViz,
  control: ControlViz,
  equipment: EquipmentViz,
}

export default function ApplicationExplorer() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState('factory')
  const [shown, phase] = useSwap(active, reduce)
  const cur = applications.find((a) => a.id === active) || applications[0]
  const shownApp = applications.find((a) => a.id === shown) || applications[0]
  const metric = useMetricMorph(cur.metric[0], reduce)
  const tabsRef = useRef(null)


  const onKeys = (e) => {
    const ids = applications.map((a) => a.id)
    const i = ids.indexOf(active)
    const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight'
    const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft'
    if (!fwd && !back) return
    e.preventDefault()
    const n = (i + (fwd ? 1 : -1) + ids.length) % ids.length
    setActive(ids[n])
    tabsRef.current?.querySelector(`[data-id="${ids[n]}"]`)?.focus()
  }

  const VizComp = VIZ[shown] || FactoryViz
  const activeIdx = applications.findIndex((a) => a.id === shown)

  return (
    <Section id="applications" index="06" label="Applications"
      title="Intelligence built for real industrial environments."
      lede="One system bench, many floors - select an environment and the visualization, telemetry and description follow as one continuous system.">
      <div className="app">
        {/* Left vertical navigation rail */}
        <div className="app__rail" role="tablist" aria-label="Industrial applications" ref={tabsRef} onKeyDown={onKeys}>
          {applications.map((a, i) => (
            <button key={a.id} data-id={a.id} role="tab" aria-selected={active === a.id}
              className={`app__tab ${active === a.id ? 'is-active' : ''}`}
              onClick={() => setActive(a.id)}>
              <span className="app__n">{String(i + 1).padStart(2, '0')}</span>
              <span>{a.name}</span>
            </button>
          ))}
        </div>

        {/* Right stage card */}
        <div className="app__stage" aria-live="polite">
          {/* Top aligned header */}
          <div className={`vizswap vizswap--${phase}`}>
            <div className="app__stage-head">
              <div>
                <span className="app__stage-kicker">APPLICATION {String(activeIdx + 1).padStart(2, '0')} · {shownApp.name}</span>
                <h3 className="app__stage-title">{shownApp.desc}</h3>
              </div>
              <div className="app__stage-metric">
                <span className="app__stage-val">{shown === active ? metric : shownApp.metric[0]}</span>
                <span className="app__stage-unit">{shownApp.metric[1]} · simulated</span>
              </div>
            </div>
          </div>

          {/* Clean diagram */}
          <div key={shown} className={`app__stage-viz vizswap vizswap--${phase}`}>
            <VizComp reduce={reduce} />
          </div>

          {/* Bottom aligned status footer */}
          <div className="app__stage-foot">
            <span className="app__stage-status">Live Telemetry Feed Online</span>
            <span className="app__stage-sub">Cell AX-{String(activeIdx + 1).padStart(2, '0')} · 1 Hz Feed</span>
          </div>
        </div>
      </div>
    </Section>
  )
}
