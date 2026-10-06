import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Section } from '../components/primitives'
import {
  Svg, G, Txt, Wire, Packet, Node, Resistor, Crystal, CoilBox, Contact, Bubble, Motor, Pump, Fan,
  Probe, Cloud, Database, Gateway, IC, Rj45, ScopeFrame,
} from '../components/eng/Symbols'
import { journey } from '../data/site'
import './SignalJourney.css'

const cx = (...a) => a.filter(Boolean).join(' ')

/* filled arrowhead pointing along +x, rotated by `rot` */
function Arrow({ x, y, rot = 0, on }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M0 0 L-6 -3 V3 Z" className={cx('eg-dot', !on && 'off')} />
    </G>
  )
}

/* status LED in the corner of every stage drawing */
const Led = ({ on }) => <circle cx="309" cy="9" r="2.4" className={cx('eg-led', on && 'on')} />

/* Each stage is a small engineering drawing (viewBox 320x110) built from the
   shared symbol library. `on` powers the wires, LEDs and animation. */
function StageVisual({ id, on }) {
  if (id === 'sensor') return (
    <Svg viewBox="0 0 320 110" label="RTD temperature probe in a pipe, ISA transmitter bubble and a 4 to 20 milliamp loop across a 250 ohm shunt resistor">
      <path d="M6 60 H74 M6 88 H74" className="eg-w thin" />
      <path d="M12 74 H30" className="eg-w thin dash" />
      <Arrow x={34} y={74} on={on} />
      <Probe x={36} y={42} on={on} />
      <Txt x="36" y="102" anchor="middle" cls="sm dim">PT100 RTD</Txt>
      <Wire d="M43 17 H83" on={on} />
      <Bubble x={96} y={17} tag="TT" num="101" on={on} />
      <Wire d="M109 17 H262 V34" on={on} />
      <Resistor x={262} y={56} rot={90} len={44} on={on} />
      <Txt x="272" y="54" cls="sm hi num">250 Ω</Txt>
      <Txt x="272" y="65" cls="sm dim num">1–5 V</Txt>
      <Wire d="M262 78 V90 H184 M176 90 H96 V30" on={on} />
      <path d="M176 81 V99 M184 86 V94" className={cx('eg-w thick', on && 'on')} />
      <Txt x="180" y="108" anchor="middle" cls="sm dim num">24 V</Txt>
      <Txt x="186" y="11" anchor="middle" cls="sm cu">4–20 mA LOOP</Txt>
      <Node x={262} y={17} tone={on ? '' : 'off'} />
      {on && <Packet d="M109 17 H262 V34" dur={2.2} />}
      <Led on={on} />
    </Svg>
  )

  if (id === 'controller') return (
    <Svg viewBox="0 0 320 110" label="Microcontroller IC package with analog input and digital output pins and a crystal oscillator">
      <IC x={160} y={52} w={44} h={44} pins={4} pinLen={8} on={on} label="MCU" sub="ARM M4" />
      {[38.8, 47.6, 56.4, 65.2].map((y, i) => (
        <g key={y}>
          <Wire d={`M130 ${y} H58`} on={on} thin />
          <Txt x="50" y={y + 2.6} anchor="end" cls="sm dim">AI{i}</Txt>
          <Wire d={`M190 ${y} H262`} on={on} dash thin />
          <Txt x="270" y={y + 2.6} cls="sm dim">DO{i}</Txt>
          <Node x={58} y={y} r={1.8} tone={on ? '' : 'off'} />
          <circle cx="262" cy={y} r="1.8" className={cx('eg-led', on && 'on')} />
        </g>
      ))}
      <Wire d="M164.4 22 V14" on={on} />
      <Txt x="164.4" y="10" anchor="middle" cls="sm cu">3V3</Txt>
      <Wire d="M155.6 82 V91 M164.4 82 V91" on={on} thin />
      <Crystal x={160} y={96} />
      <Txt x="174" y="99" cls="sm dim num">16 MHz</Txt>
      <Txt x="58" y="25" anchor="middle" cls="sm cu">ADC IN</Txt>
      <Txt x="266" y="25" anchor="middle" cls="sm cu">GPIO OUT</Txt>
      <Led on={on} />
    </Svg>
  )

  if (id === 'gateway') return (
    <Svg viewBox="0 0 320 110" label="RS485 differential A and B pair with 120 ohm terminators between a field node and an Ethernet gateway">
      <rect x="12" y="26" width="42" height="58" rx="3" className={cx('eg-b', on && 'on')} />
      <Txt x="33" y="52" anchor="middle" cls="sm hi">NODE</Txt>
      <Txt x="33" y="64" anchor="middle" cls="sm dim">RS485</Txt>
      <circle cx="22" cy="75" r="1.8" className={cx('eg-led', on && 'on')} />
      <Wire d="M54 44 H242" on={on} />
      <Wire d="M54 68 H242" on={on} />
      <Txt x="150" y="38" anchor="middle" cls="sm hi">A (D+)</Txt>
      <Txt x="150" y="81" anchor="middle" cls="sm hi">B (D−)</Txt>
      <Txt x="150" y="18" anchor="middle" cls="sm cu">RS-485 · 115 kbps</Txt>
      {[78, 218].map((x) => (
        <g key={x}>
          <Resistor x={x} y={56} rot={90} len={24} on={on} />
          <Node x={x} y={44} r={2} tone={on ? '' : 'off'} />
          <Node x={x} y={68} r={2} tone={on ? '' : 'off'} />
        </g>
      ))}
      <Txt x="86" y="59" cls="sm dim num">120 Ω</Txt>
      <Txt x="210" y="59" anchor="end" cls="sm dim num">120 Ω</Txt>
      <Gateway x={270} y={56} w={56} h={26} on={on} />
      <Wire d="M270 69 V84" on={on} dash />
      <Rj45 x={270} y={98} on={on} />
      <Txt x="292" y="101" cls="sm dim">ETH</Txt>
      {on && <Packet d="M54 44 H242" dur={2.4} />}
      <Led on={on} />
    </Svg>
  )

  if (id === 'cloud') return (
    <Svg viewBox="0 0 320 110" label="Edge devices publishing over MQTT to a cloud broker and a time-series database">
      {[26, 55, 84].map((y, i) => (
        <g key={y}>
          <rect x="8" y={y - 8} width="28" height="16" rx="2" className={cx('eg-b', on && 'on')} />
          <Txt x="22" y={y + 2.6} anchor="middle" cls="sm hi">D{i + 1}</Txt>
          <Wire d={`M36 ${y} H58 V55 H78`} on={on} dash thin />
        </g>
      ))}
      <Arrow x={79} y={55} on={on} />
      <Cloud x={118} y={52} s={1.9} on={on} />
      <Txt x="116" y="50" anchor="middle" cls="sm hi">MQTT</Txt>
      <Txt x="116" y="60" anchor="middle" cls="sm dim">BROKER</Txt>
      <Wire d="M154 44 H238" on={on} dash />
      <Arrow x={240} y={44} on={on} />
      <Wire d="M240 64 H156" on={on} dash thin />
      <Arrow x={152} y={64} rot={180} on={on} />
      <Txt x="196" y="38" anchor="middle" cls="sm cu">PUB telemetry</Txt>
      <Txt x="196" y="76" anchor="middle" cls="sm dim">SUB commands</Txt>
      <G x={272} y={54} s={1.25}><Database on={on} /></G>
      <Txt x="272" y="88" anchor="middle" cls="sm dim">TSDB</Txt>
      {on && <Packet d="M154 44 H238" dur={2} />}
      <Led on={on} />
    </Svg>
  )

  if (id === 'analytics') return (
    <Svg viewBox="0 0 320 110" label="Trend recorder with a signal trace, a dashed alarm threshold and an FFT spectrum bar chart">
      <ScopeFrame x={10} y={8} w={190} h={94} label="TREND · 24 H">
        <path d="M0 24 H190" className="eg-limit" />
        <Txt x="186" y="20" anchor="end" cls="sm hot">THR</Txt>
        <path d="M6 66 L26 58 L44 63 L62 46 L80 52 L98 32 L116 40 L134 14 L152 30 L170 22 L184 28"
          pathLength="1" className={cx('sj-trace', on ? 'eg-trace ok is-on' : 'eg-w')} />
        <circle cx="134" cy="14" r="3" className={cx('eg-dot', on ? 'hot' : 'off')} />
      </ScopeFrame>
      <rect x="212" y="8" width="98" height="94" rx="4" className="eg-b deep" />
      <path d="M220 86 H302" className="eg-axis" />
      {[16, 28, 54, 22, 40, 14, 24, 10].map((h, i) => (
        <rect key={i} x={222 + i * 10} y={86 - h} width="6" height={h} rx="1"
          className={cx('eg-dot', !on && 'off', on && i === 2 && 'hot')} style={{ opacity: on ? 1 : 0.6 }} />
      ))}
      <Txt x="220" y="21" cls="sm hi">FFT</Txt>
      <Txt x="302" y="21" anchor="end" cls="sm dim num">1.2 kHz</Txt>
      <Txt x="261" y="98" anchor="middle" cls="sm dim">SPECTRUM</Txt>
      <Led on={on} />
    </Svg>
  )

  /* automation */
  return (
    <Svg viewBox="0 0 320 110" label="Contactor coil K1 closing a power contact that drives a motor, a fan and a pump">
      <Wire d="M24 33 V18 H8" on={on} thin />
      <Wire d="M24 77 V100 H8" on={on} thin />
      <Txt x="30" y="14" cls="sm cu">24 V DC</Txt>
      <Txt x="30" y="104" cls="sm dim">0 V</Txt>
      <CoilBox x={24} y={55} on={on} label="K1" />
      <path d="M40 55 H76" className="eg-w thin dash" />
      <Contact x={84} y={55} closed={on} on={on} label="K1" />
      <Wire d="M84 33 V18 H280 V33" on={on} />
      <Wire d="M84 77 V100 H280 V72 M170 100 V72 M225 100 V71" on={on} />
      <Wire d="M170 18 V40 M225 18 V41" on={on} />
      <Txt x="102" y="14" cls="sm cu">L1 · 400 V</Txt>
      <Motor x={170} y={56} on={on} label="M1" phase="3~" r={16} />
      <Fan x={225} y={56} on={on} />
      <Pump x={280} y={56} on={on} />
      <Txt x="176" y="92" cls="sm dim">MOTOR</Txt>
      <Txt x="231" y="92" cls="sm dim">FAN</Txt>
      <Txt x="286" y="92" cls="sm dim">PUMP</Txt>
      <Led on={on} />
    </Svg>
  )
}

export default function SignalJourney() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(Math.max((vh * 0.7 - rect.top) / rect.height, 0), 1)
      setActive(Math.min(Math.floor(p * journey.length), journey.length - 1))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [reduce])

  const pct = ((active + 1) / journey.length) * 100

  return (
    <Section id="journey" index="02" label="Connected systems"
      title="From signal to intelligence."
      lede="One continuous system - each stage a different physical reality, all speaking the same signal language.">
      <div className="journey" ref={ref} aria-label="System journey from sensor to automation">
        <div className="journey__spine" aria-hidden="true">
          <span className="journey__fill" style={{ height: `${pct}%` }} />
        </div>
        <ol className="journey__list">
          {journey.map((s, i) => (
            <li key={s.id} className={`journey__stage ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}>
              <span className="journey__node" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="journey__body">
                <h3>{s.name}</h3>
                <p className="small">{s.desc}</p>
              </div>
              <div className="journey__viz"><StageVisual id={s.id} on={i <= active} /></div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
