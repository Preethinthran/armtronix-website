import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Section } from '../components/primitives'
import {
  Svg, G, Txt, Wire, Packet, Node, Grid, LadderContact, LadderCoil, OpAmp, Motor, Fan, Heater, Probe,
  PressureTx, Accel, CT, Cloud, Database, Gateway, IC, Terminals, Rj45, Relay, Valve, DinModule, ScopeFrame,
} from '../components/eng/Symbols'
import { RobotArmGraphic, solveArm, deg, fmt } from '../components/eng/RobotArm'
import { technologies } from '../data/site'
import './TechnologyExplorer.css'

const cx = (...a) => a.filter(Boolean).join(' ')

/* Drawing-sheet furniture: border + title block, like a real engineering print. */
function Frame({ fig, title }) {
  return (
    <g aria-hidden="true">
      <rect x="2" y="2" width="516" height="316" rx="3" className="eg-w thin" style={{ opacity: 0.55 }} />
      <path d="M372 318 V298 H518" className="eg-w thin" style={{ opacity: 0.55 }} />
      <Txt x="380" y="311" cls="sm dim tx-fig">FIG {fig}</Txt>
      <Txt x="510" y="311" anchor="end" cls="sm cu">{title}</Txt>
    </g>
  )
}

function Arrow({ x, y, rot = 0 }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M0 0 L-6 -3 V3 Z" className="eg-dot" />
    </G>
  )
}

/* IEC signal lamp */
function Lamp({ x, y, s = 1 }) {
  return (
    <G x={x} y={y} s={s}>
      <circle r="9" className="eg-b on lit" />
      <path d="M-6.3 -6.3 L6.3 6.3 M6.3 -6.3 L-6.3 6.3" className="eg-w on" />
    </G>
  )
}

const Sheet = ({ children, label }) => (
  <Svg viewBox="0 0 520 320" label={label} className="txviz">
    <Grid w={520} h={320} step={40} />
    {children}
  </Svg>
)

/* ---------------------------------------------------------------- IIoT */
function IIoTViz() {
  return (
    <Sheet label="Industrial IoT data path: RTD probe and pressure transmitter wired into an edge gateway, which publishes over MQTT with TLS to a cloud, a time-series database and a live dashboard">
      <Frame fig="01" title="IIOT DATA PATH" />
      <Txt x="56" y="30" anchor="middle" cls="cu">FIELD</Txt>
      <Txt x="216" y="30" anchor="middle" cls="cu">EDGE</Txt>
      <Txt x="372" y="30" anchor="middle" cls="cu">CLOUD</Txt>
      <Txt x="475" y="30" anchor="middle" cls="cu">APPS</Txt>

      <Probe x={56} y={76} on />
      <Txt x="56" y="124" anchor="middle" cls="sm dim">RTD · PT100</Txt>
      <PressureTx x={56} y={205} on />
      <Txt x="56" y="244" anchor="middle" cls="sm dim">PRESSURE TX</Txt>

      <Wire d="M63 52 H130 V150 H172" on />
      <Wire d="M67 195 H150 V170 H172" on />
      <Txt x="74" y="46" cls="sm hi num">4–20 mA</Txt>
      <Txt x="74" y="189" cls="sm hi num">0–10 V</Txt>

      {/* edge gateway with antenna radiating */}
      <Gateway x={216} y={160} w={88} h={40} on />
      <path d="M247 126 A7 7 0 0 1 257 126" className="eg-w thin on" />
      <path d="M243.5 122.5 A12 12 0 0 1 260.5 122.5" className="eg-w thin on" />
      <path d="M240 119 A17 17 0 0 1 264 119" className="eg-w thin on" />
      <Txt x="216" y="212" anchor="middle" cls="sm dim lc">Modbus RTU · RS-485</Txt>

      <Wire d="M260 160 H290 V98 H322" on />
      <Packet d="M260 160 H290 V98 H322" dur={2.2} tone="ok" />
      <Txt x="298" y="148" cls="sm cu">MQTT</Txt>
      <Txt x="298" y="159" cls="sm cu">TLS 1.3</Txt>
      <rect x="299" y="168" width="10" height="8" rx="1.5" className="eg-b on lit" />
      <path d="M301 168 V165 a3 3 0 0 1 6 0 V168" className="eg-w thin on" />

      <Cloud x={372} y={100} s={2.2} on />
      <Txt x="370" y="104" anchor="middle" cls="sm hi">BROKER</Txt>

      <Wire d="M372 131 V208" on />
      <G x={372} y={232} s={1.5}><Database on /></G>
      <Txt x="372" y="272" anchor="middle" cls="sm dim">TIME-SERIES DB</Txt>

      <Wire d="M414 96 H440" on />
      <ScopeFrame x={440} y={66} w={70} h={64} label="LIVE">
        <path d="M4 44 L14 36 L24 40 L34 22 L44 30 L54 16 L66 20" className="eg-trace ok" />
        <path d="M0 24 H70" className="eg-limit" />
      </ScopeFrame>
      <Txt x="475" y="146" anchor="middle" cls="sm dim">DASHBOARD</Txt>
    </Sheet>
  )
}

/* --------------------------------------------------------- Controllers */
function ControllersViz() {
  const reduce = useReducedMotion()

  return (
    <Sheet label="Industrial Automation Controller: Field sensors connect to digital inputs on top, deterministic RTOS executes 1ms control logic, and drives field actuators at the bottom">
      <Frame fig="02" title="DIN I/O MODULE" />
      <Txt x="245" y="15" anchor="middle" cls="cu">FIELD I/O ARCHITECTURE · 24V DC</Txt>

      {/* 24 V DC Power Supply (Left) */}
      <g transform="translate(42, 136)">
        <rect x="0" y="0" width="56" height="46" rx="3" className="eg-b on" />
        <Txt x="28" y="20" anchor="middle" cls="sm hi">24 V DC</Txt>
        <Txt x="28" y="33" anchor="middle" cls="sm dim">PSU</Txt>
      </g>
      <Wire d="M98 149 H157" on thin />
      <Wire d="M98 169 H157" on thin />
      <Node x={157} y={149} r={2} />
      <Node x={157} y={169} r={2} />
      <Txt x="148" y="145" anchor="end" cls="sm hi">L+</Txt>
      <Txt x="148" y="165" anchor="end" cls="sm hi">M</Txt>

      {/* Controller DIN-rail Mount Bracket (Behind) */}
      <rect x="151" y="153" width="188" height="12" rx="2" className="eg-b deep" />

      {/* Controller Housing Body */}
      <rect x="157" y="78" width="176" height="162" rx="4" className="ctrl-housing" />

      {/* Top Terminal Block (3 Clean Input Channels) */}
      <rect x="165" y="82" width="160" height="16" rx="2" className="eg-b deep" />
      {[195, 245, 295].map((x, i) => (
        <g key={`t-in-${i}`}>
          <rect x={x - 12} y="84" width="24" height="12" rx="1.5" className="eg-b" />
          <circle cx={x} cy="90" r="2.2" className="eg-w thin" />
          <text x={x} y="106" textAnchor="middle" className="eg-t sm dim">DI{i + 1}</text>
        </g>
      ))}

      {/* Bottom Terminal Block (3 Clean Output Channels) */}
      <rect x="165" y="220" width="160" height="16" rx="2" className="eg-b deep" />
      {[195, 245, 295].map((x, i) => (
        <g key={`t-out-${i}`}>
          <rect x={x - 12} y="222" width="24" height="12" rx="1.5" className="eg-b" />
          <circle cx={x} cy="228" r="2.2" className="eg-w thin" />
          <text x={x} y="216" textAnchor="middle" className="eg-t sm dim">DO{i + 1}</text>
        </g>
      ))}

      {/* Controller Front Display Plate */}
      <rect x="167" y="112" width="156" height="92" rx="3" className="ctrl-plate" />

      {/* Brand & Model */}
      <text x="178" y="129" className="ctrl-title">ARMTRONIX</text>
      <text x="178" y="140" className="ctrl-model">CTRL-24 · DETERMINISTIC I/O</text>

      {/* System Status Indicators (PWR, RUN, COM) */}
      <g transform="translate(290, 126)">
        <circle cx="0" cy="0" r="2.4" className="eg-led on" />
        <circle cx="12" cy="0" r="2.4" className="eg-led on">
          {!reduce && (
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="24" cy="0" r="2.4" className="eg-led cu on">
          {!reduce && (
            <animate attributeName="opacity" values="0.25;1;0.25" dur="0.9s" repeatCount="indefinite" />
          )}
        </circle>
        <text x="0" y="-5" textAnchor="middle" className="eg-t sm dim" style={{ fontSize: 5 }}>P</text>
        <text x="12" y="-5" textAnchor="middle" className="eg-t sm dim" style={{ fontSize: 5 }}>R</text>
        <text x="24" y="-5" textAnchor="middle" className="eg-t sm dim" style={{ fontSize: 5 }}>C</text>
      </g>

      {/* I/O Channel LED Indicators */}
      {/* Inputs (Row 1) */}
      <text x="178" y="161" className="ctrl-row-lbl">IN</text>
      {[195, 245, 295].map((x, i) => (
        <g key={`in-led-${i}`}>
          <circle
            cx={x}
            cy="158"
            r="3"
            className={`eg-led on ${i === 0 ? 'ctrl-pulse-dot' : ''}`}
            style={{ opacity: i === 0 ? 1 : 0.4 }}
          >
            {i === 0 && !reduce && (
              <animate
                attributeName="opacity"
                values="0.3;1;1;0.3"
                keyTimes="0;0.25;0.65;1"
                dur="3.6s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text x={x} y="169" textAnchor="middle" className="eg-t sm dim" style={{ fontSize: 6.5 }}>{i + 1}</text>
        </g>
      ))}

      {/* Outputs (Row 2) */}
      <text x="178" y="183" className="ctrl-row-lbl">OUT</text>
      {[195, 245, 295].map((x, i) => (
        <g key={`out-led-${i}`}>
          <circle
            cx={x}
            cy="180"
            r="3"
            className={`eg-led cu on ${i === 1 ? 'ctrl-pulse-dot' : ''}`}
            style={{ opacity: i === 1 ? 1 : 0.35 }}
          >
            {i === 1 && !reduce && (
              <animate
                attributeName="opacity"
                values="0.25;0.25;1;0.25"
                keyTimes="0;0.45;0.8;1"
                dur="3.6s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text x={x} y="191" textAnchor="middle" className="eg-t sm dim" style={{ fontSize: 6.5 }}>{i + 1}</text>
        </g>
      ))}

      {/* Deterministic Cycle Badge */}
      <rect x="176" y="194" width="138" height="7" rx="1.5" className="ctrl-engine-bg" />
      <text x="245" y="199.5" textAnchor="middle" className="ctrl-engine-txt">
        1.0 ms CYCLE · DETERMINISTIC RTOS
      </text>

      {/* ============================================================== */}
      {/* 3 FIELD INPUTS (TOP): Clean Sensors */}
      {/* ============================================================== */}

      {/* Input 1: Optical / Proximity Sensor */}
      <g transform="translate(195, 50)">
        <text y="-18" textAnchor="middle" className="ctrl-sensor-title">INDUCTIVE</text>
        <circle r="12" className="eg-b on" />
        <text y="3" textAnchor="middle" className="eg-t hi" style={{ fontSize: 7.5, fontWeight: 700 }}>PROX</text>
      </g>
      <Wire d="M195 62 V84" on thin />

      {/* Input 2: Temperature Sensor */}
      <g transform="translate(245, 50)">
        <text y="-18" textAnchor="middle" className="ctrl-sensor-title">RTD PT100</text>
        <circle r="12" className="eg-b on" />
        <text y="3" textAnchor="middle" className="eg-t hi" style={{ fontSize: 7.5, fontWeight: 700 }}>TEMP</text>
      </g>
      <Wire d="M245 62 V84" on thin />

      {/* Input 3: Pressure Switch */}
      <g transform="translate(295, 50)">
        <text y="-18" textAnchor="middle" className="ctrl-sensor-title">PRESSURE</text>
        <circle r="12" className="eg-b on" />
        <text y="3" textAnchor="middle" className="eg-t hi" style={{ fontSize: 7.5, fontWeight: 700 }}>PRESS</text>
      </g>
      <Wire d="M295 62 V84" on thin />

      {/* Minimal Input Animation Packet (Channel 1 fires into controller) */}
      {!reduce && (
        <circle r="2.8" className="eg-dot ok ctrl-pulse-dot">
          <animateMotion
            path="M 195 62 V 84"
            dur="3.6s"
            keyTimes="0;0.22;0.32;1"
            keyPoints="0;0;1;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* ============================================================== */}
      {/* 3 FIELD OUTPUTS (BOTTOM): Clean Actuators */}
      {/* ============================================================== */}

      {/* Output 1: Solenoid Valve */}
      <Wire d="M195 236 V268" on dash thin />
      <g transform="translate(195, 280)">
        <path d="M-8 -6 L0 0 L-8 6 Z M8 -6 L0 0 L8 6 Z" className="eg-b on" />
        <text y="18" textAnchor="middle" className="ctrl-load-title">VALVE</text>
      </g>

      {/* Output 2: 24V Drive Motor (Smooth Minimal Spin) */}
      <Wire d="M245 236 V268" on dash thin />
      <g transform="translate(245, 280)">
        <circle r="13" className="eg-b on" />
        <g>
          {!reduce && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
          <circle r="9" className="eg-w thin dash" />
          <line x1="-7" y1="0" x2="7" y2="0" className="eg-w thin" />
          <line x1="0" y1="-7" x2="0" y2="7" className="eg-w thin" />
        </g>
        <circle r="2.2" className="eg-dot" />
        <text y="21" textAnchor="middle" className="ctrl-load-title">24V MOTOR</text>
      </g>

      {/* Output 3: Relay Contact / Status Beacon */}
      <Wire d="M295 236 V268" on dash thin />
      <g transform="translate(295, 280)">
        <rect x="-8" y="-7" width="16" height="14" rx="2" className="eg-b on" />
        <path d="M-4 -2 h3 v4 h-3 z M2 3 l4 -6" className="eg-silk" />
        <text y="18" textAnchor="middle" className="ctrl-load-title">RELAY</text>
      </g>

      {/* Minimal Output Animation Packet (Controller drives Channel 2 Motor) */}
      {!reduce && (
        <circle r="2.8" className="eg-dot ctrl-pulse-dot" style={{ fill: 'var(--primary)' }}>
          <animateMotion
            path="M 245 236 V 268"
            dur="3.6s"
            keyTimes="0;0.5;0.65;1"
            keyPoints="0;0;1;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* ============================================================== */}
      {/* INDUSTRIAL CONNECTIVITY (RIGHT): Ethernet & RS-485 */}
      {/* ============================================================== */}
      {/* Ethernet RJ45 */}
      <Wire d="M333 125 H396" on dash thin />
      <Rj45 x={415} y={125} on />
      <Txt x={415} y={150} anchor="middle" cls="sm dim">10/100 ETH</Txt>

      {/* RS-485 Modbus Terminals */}
      <Wire d="M333 198 H390" on dash thin />
      <Terminals x={390} y={188} n={3} pitch={13} on labels={['A', 'B', 'G']} />
      <Txt x={410} y={178} anchor="middle" cls="sm dim">RS-485 MODBUS</Txt>
    </Sheet>
  )
}

/* ------------------------------------------------------------ Robotics */
function RoboticsViz() {
  const reduce = useReducedMotion()
  const [t, setT] = useState(2.78)

  useEffect(() => {
    if (reduce) return
    let animId
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // Gentle, calm industrial motion: 1 full cycle every ~7.5 seconds
      setT((prev) => prev + dt * 0.84)
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [reduce])

  const { u, q1, q2 } = solveArm(t)
  const open = 10 - 5 * u * u * (3 - 2 * u)

  return (
    <Sheet label="Two-axis articulated robot arm with servo motors at the shoulder and elbow, encoder rings and and a gripper positioned above a workpiece, with a joint angle readout">
      <Frame fig="03" title="2-AXIS ARM" />
      <Txt x="20" y="26" cls="cu">SERVO-DRIVEN · 2 DOF</Txt>

      <RobotArmGraphic t={t} />

      {/* telemetry readout */}
      <rect x="356" y="34" width="146" height="70" rx="4" className="eg-b deep" />
      <circle cx="366" cy="45" r="2.4" className="eg-dot ok" />
      <Txt x="373" y="48" cls="sm cu">SERVO ON · 4096 PPR</Txt>
      <path d="M356 54 H502" className="eg-w thin" style={{ opacity: 0.5 }} />
      <Txt x="366" y="68" cls="sm dim">A1</Txt>
      <Txt x="494" y="69" anchor="end" cls="mid hi num">{fmt(deg(q1))}</Txt>
      <Txt x="366" y="83" cls="sm dim">A2</Txt>
      <Txt x="494" y="84" anchor="end" cls="mid hi num">{fmt(deg(q2))}</Txt>
      <Txt x="366" y="98" cls="sm dim">GRIP</Txt>
      <Txt x="494" y="99" anchor="end" cls="mid hi num">{(open * 2).toFixed(0).padStart(2, '0')} mm</Txt>
    </Sheet>
  )
}

/* ------------------------------------------------------------- Sensors */
function SensorsViz() {
  const reduce = useReducedMotion()
  const cols = [95, 205, 315, 425]
  const sensors = [
    { name: 'TEMP · RTD', sig: '4–20 mA', afe: 'AFE FILTER', sub: 'RTD BUFFER' },
    { name: 'PRESSURE', sig: '0–10 V', afe: 'ATTENUATOR', sub: 'INSTR AMP' },
    { name: 'VIBRATION', sig: 'IEPE / mV', afe: 'CHARGE AMP', sub: 'BANDPASS' },
    { name: 'CURRENT · CT', sig: '0–5 A CT', afe: 'SHUNT / RMS', sub: 'ISOLATION' },
  ]

  return (
    <Sheet label="Industrial sensor interface signal chain: 4 physical sensor types conditioned through analog front-ends into a 4-to-1 low-noise multiplexer and 16-bit ADC to the microcontroller">
      <Frame fig="04" title="SIGNAL CHAIN" />
      <Txt x="260" y="16" anchor="middle" cls="cu">ANALOG FRONT-END · SENSOR SIGNAL CHAIN</Txt>

      {/* 4 Clean Columns: Sensor -> Conditioning -> MUX */}
      {cols.map((x, i) => {
        const s = sensors[i]
        return (
          <g key={s.name}>
            {/* Sensor Column Header */}
            <text x={x} y="36" textAnchor="middle" className="eg-t hi" style={{ fontSize: 8.5, fontWeight: 700 }}>
              {s.name}
            </text>

            {/* Sensor Component Icons */}
            {i === 0 && <Probe x={x} y={66} on />}
            {i === 1 && <PressureTx x={x} y={72} on />}
            {i === 2 && <Accel x={x} y={68} on />}
            {i === 3 && <CT x={x} y={72} on />}

            {/* Signal Standard Badge */}
            <text x={x} y="104" textAnchor="middle" className="sensor-sig-badge">
              {s.sig}
            </text>

            {/* Clean Vertical Wire into Conditioning Stage */}
            <Wire d={`M ${x} 110 V 132`} on thin />

            {/* AFE Conditioning & Buffer Block */}
            <rect x={x - 36} y="132" width="72" height="36" rx="3" className="sensor-afe-body" />
            <text x={x} y="148" textAnchor="middle" className="sensor-afe-title">{s.afe}</text>
            <text x={x} y="160" textAnchor="middle" className="sensor-afe-sub">{s.sub}</text>

            {/* Clean Vertical Wire from AFE into MUX */}
            <Wire d={`M ${x} 168 V 202`} on thin />
            <Node x={x} y={202} r={2.4} />
            <text x={x} y="196" textAnchor="middle" className="eg-t sm dim" style={{ fontSize: 6.8 }}>
              AIN{i}
            </text>
          </g>
        )
      })}

      {/* Symmetrical 4:1 Analog Multiplexer Funnel */}
      <polygon points="75,202 445,202 290,228 230,228" className="sensor-mux-plate" />
      <text x="260" y="217" textAnchor="middle" className="sensor-mux-title">
        4:1 LOW-NOISE ANALOG MUX
      </text>

      {/* Clean Wire from MUX into Precision ADC */}
      <Wire d="M 260 228 V 256" on thick />
      <Node x={260} y={228} r={2.5} />

      {/* 16-Bit ADC Chip */}
      <g transform="translate(260, 274)">
        <rect x="-55" y="-17" width="110" height="34" rx="3" className="eg-ic on" />
        {/* Top/Bottom IC Pins */}
        {[-36, -18, 0, 18, 36].map((p) => (
          <g key={p}>
            <rect x={p - 1.2} y="-21" width="2.4" height="4" className="eg-pad" />
            <rect x={p - 1.2} y="17" width="2.4" height="4" className="eg-pad" />
          </g>
        ))}
        <text y="-2" textAnchor="middle" className="eg-t hi" style={{ fontSize: 10, fontWeight: 800 }}>
          AX-ADC 16
        </text>
        <text y="9" textAnchor="middle" className="eg-t dim sm">
          16-BIT · 250 kSPS
        </text>
      </g>

      {/* High-Speed SPI Bus into MCU */}
      <Wire d="M 315 274 H 410" on dash thick />
      <Node x={315} y={274} r={2.5} />
      <text x="418" y="277" className="eg-t cu sm" style={{ fontWeight: 700 }}>
        SPI · TO MCU
      </text>

      {/* Minimal Dynamic Sampling Cycle Animation */}
      {!reduce && (
        <>
          {/* Signal 0 sampling flow (Probe -> AFE -> MUX) */}
          <circle r="2.8" className="eg-dot ok ctrl-pulse-dot">
            <animateMotion
              path="M 95 110 V 202"
              dur="3.2s"
              keyTimes="0;0.35;0.65;1"
              keyPoints="0;0;1;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>

          {/* MUX -> ADC digitized flow */}
          <circle r="2.8" className="eg-dot ok ctrl-pulse-dot">
            <animateMotion
              path="M 260 228 V 256"
              dur="3.2s"
              keyTimes="0;0.45;0.65;1"
              keyPoints="0;0;1;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>

          {/* ADC -> MCU SPI data burst */}
          <circle r="2.6" className="eg-dot ctrl-pulse-dot" style={{ fill: 'var(--primary)' }}>
            <animateMotion
              path="M 315 274 H 410"
              dur="3.2s"
              keyTimes="0;0.65;0.85;1"
              keyPoints="0;0;1;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </Sheet>
  )
}

/* ----------------------------------------------------------------- PLC */
function PlcViz() {
  return (
    <Sheet label="IEC 61131 ladder diagram: rung 1 is energised through START in parallel with a seal-in contact and a normally closed STOP to the MOTOR coil; rung 2 is an idle alarm rung">
      <Frame fig="05" title="LADDER LOGIC" />
      <Txt x="40" y="24" cls="cu">IEC 61131-3 · LD</Txt>
      <Txt x="470" y="24" anchor="end" cls="cu lc">SCAN 2 ms · RUN</Txt>

      <Wire d="M40 56 V250" on thick />
      <Wire d="M470 56 V250" on thick />
      <Txt x="40" y="48" anchor="middle" cls="hi">L1</Txt>
      <Txt x="470" y="48" anchor="middle" cls="hi">L2</Txt>

      {/* rung 1 - energised */}
      <Txt x="48" y="73" cls="sm dim num">001</Txt>
      <Wire d="M40 80 H92" on />
      <LadderContact x={120} y={80} on label="START" tag="I0.0" />
      <Wire d="M92 80 V135 M148 135 V80" on />
      <LadderContact x={120} y={135} on label="K1" tag="SEAL-IN" />
      <Wire d="M148 80 H207" on />
      <LadderContact x={235} y={80} on nc label="STOP" tag="I0.1" />
      <Wire d="M263 80 H372" on />
      <LadderCoil x={400} y={80} on label="MOTOR" tag="Q0.0" />
      <Wire d="M428 80 H470" on />
      <Node x={92} y={80} /><Node x={148} y={80} /><Node x={40} y={80} /><Node x={470} y={80} />
      <Packet d="M40 80 H470" dur={3} r={3} />

      {/* rung 2 - idle */}
      <Txt x="48" y="208" cls="sm dim num">002</Txt>
      <Wire d="M40 215 H92" />
      <LadderContact x={120} y={215} label="FAULT" tag="I0.2" />
      <Wire d="M148 215 H372" />
      <LadderCoil x={400} y={215} label="ALARM" tag="Q0.1" />
      <Wire d="M428 215 H470" />
      <Node x={40} y={215} tone="off" /><Node x={470} y={215} tone="off" />

      <Txt x="40" y="290" cls="sm dim">I0.0 START</Txt>
      <Txt x="140" y="290" cls="sm dim">I0.1 STOP</Txt>
      <Txt x="236" y="290" cls="sm dim">Q0.0 MOTOR / K1</Txt>
    </Sheet>
  )
}

/* ---------------------------------------------------------------- I4.0 */
const LAYERS = [
  { name: 'ERP', sub: 'Business planning', w: 220 },
  { name: 'MES', sub: 'Production · Quality', w: 270 },
  { name: 'SCADA', sub: 'Supervision · HMI', w: 320 },
  { name: 'CONTROL', sub: 'PLC · Controllers', w: 380 },
  { name: 'FIELD', sub: 'Sensors · Actuators', w: 440 },
]
const GAPS = ['REST · SQL', 'OPC UA', 'MODBUS', '4–20 mA']

function MiniBars({ x, y }) {
  return (
    <G x={x} y={y}>
      <path d="M0 24 H30" className="eg-axis" />
      {[10, 18, 13, 22].map((h, i) => <rect key={i} x={2 + i * 7} y={24 - h} width="5" height={h} rx="0.8" className="eg-dot" />)}
    </G>
  )
}

function I40Viz() {
  const top = (k) => 24 + k * 56
  const devs = [
    (x, y) => (<><G x={x - 34} y={y + 21} s={0.8}><Cloud on /></G><G x={x - 82} y={y + 18} s={0.7}><Database on /></G></>),
    (x, y) => (<><G x={x - 30} y={y + 18} s={0.8}><Database on /></G><MiniBars x={x - 82} y={y + 6} /></>),
    (x, y) => (
      <>
        <ScopeFrame x={x - 48} y={y + 6} w={38} h={24}><path d="M3 18 L10 12 L17 16 L24 6 L35 10" className="eg-trace ok" style={{ strokeWidth: 1.4 }} /></ScopeFrame>
        <ScopeFrame x={x - 96} y={y + 6} w={38} h={24}><path d="M4 20 V12 M10 20 V6 M16 20 V14 M22 20 V8 M28 20 V16" className="eg-w thick on" /></ScopeFrame>
      </>
    ),
    (x, y) => (
      <>
        <IC x={x - 26} y={y + 18} w={34} h={14} pins={3} kind="dual" pinLen={4} on />
        <G x={x - 70} y={y + 18} s={0.75}><Relay on /></G>
        <Terminals x={x - 128} y={y + 12} n={3} pitch={9} w={9} h={13} on />
      </>
    ),
    (x, y) => (
      <>
        <G x={x - 24} y={y + 20} s={0.55}><Probe on /></G>
        <G x={x - 64} y={y + 19} s={0.75}><PressureTx on /></G>
        <Motor x={x - 106} y={y + 18} on r={11} label="M" phase="" />
        <G x={x - 148} y={y + 22} s={0.8}><Valve on /></G>
      </>
    ),
  ]
  return (
    <Sheet label="ISA-95 automation pyramid: Field, Control, SCADA, MES and ERP layers stacked as engineering blocks with data flowing up and commands flowing down between them">
      <Frame fig="06" title="ISA-95 STACK" />
      <path d="M22 284 V28" className="eg-w thin on" />
      <Arrow x={22} y={24} rot={-90} />
      <Txt x="14" y="156" anchor="middle" cls="sm cu" rot={-90}>DATA UP · COMMANDS DOWN</Txt>

      {LAYERS.map((L, k) => {
        const x0 = 260 - L.w / 2
        const y = top(k)
        return (
          <g key={L.name}>
            <rect x={x0} y={y} width={L.w} height="36" rx="3" className="eg-b" />
            <rect x={x0} y={y} width="3" height="36" className="eg-dot" />
            <Txt x={x0 + 14} y={y + 16} cls="mid hi">{L.name}</Txt>
            <Txt x={x0 + 14} y={y + 28} cls="sm dim lc">{L.sub}</Txt>
            {devs[k](x0 + L.w - 6, y)}
          </g>
        )
      })}

      {GAPS.map((g, k) => {
        const yb = top(k) + 36
        const yt = top(k + 1)
        return (
          <g key={g}>
            <Wire d={`M235 ${yt} V${yb + 3}`} on thin />
            <Arrow x={235} y={yb} rot={-90} />
            <Wire d={`M285 ${yb} V${yt - 3}`} on thin />
            <Arrow x={285} y={yt} rot={90} />
            <Txt x="226" y={yb + 13.5} anchor="end" cls="sm cu">{g}</Txt>
          </g>
        )
      })}
    </Sheet>
  )
}

function TechVisual({ id }) {
  switch (id) {
    case 'iiot': return <IIoTViz />
    case 'controllers': return <ControllersViz />
    case 'robotics': return <RoboticsViz />
    case 'sensors': return <SensorsViz />
    case 'plc': return <PlcViz />
    default: return <I40Viz />
  }
}

export default function TechnologyExplorer() {
  const [active, setActive] = useState('iiot')
  const cur = technologies.find((t) => t.id === active)

  return (
    <Section id="technology" index="05" label="Technology"
      title="Built for the machines that industry."
      lede="One interactive bench - select a discipline and the schematic, description and signal path follow.">
      <div className="tx">
        <div className="tx__rail" role="tablist" aria-label="Technology areas">
          {technologies.map((t) => (
            <button key={t.id} role="tab" aria-selected={active === t.id}
              className={`tx__tab ${active === t.id ? 'is-active' : ''}`}
              onClick={() => setActive(t.id)}>
              {t.name}
            </button>
          ))}
        </div>
        <div className="tx__stage" aria-live="polite">
          <div key={cur.id} className="tx__vizwrap">
            <TechVisual id={cur.id} />
          </div>
          <div className="tx__info">
            <p className="tlabel">{cur.name}</p>
            <p className="tx__desc">{cur.desc}</p>
            <ul className="tx__points">
              {cur.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <a className="btn btn--ghost btn--sm" href="#contact">Discuss {cur.name.toLowerCase()} <span className="arr" aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </Section>
  )
}
