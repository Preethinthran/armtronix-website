import { useId } from 'react'
import { useReducedMotion } from 'framer-motion'
import './eng.css'

/* Engineering symbol library - IEC 60617 / ISA-5.1 drafting conventions.
   Every symbol is a <g> positioned by x / y / rot around its own origin, so a
   diagram is just components wired together with <Wire> paths. Colour and
   state come from eng.css (.on = energised, .hot = caution, .bad = fault). */

const cx = (...a) => a.filter(Boolean).join(' ')
const state = (on, tone) => (on ? (tone || 'on') : '')

export function G({ x = 0, y = 0, rot = 0, s = 1, children, className, ...rest }) {
  const t = `translate(${x} ${y})${rot ? ` rotate(${rot})` : ''}${s !== 1 ? ` scale(${s})` : ''}`
  return <g transform={t} className={className} {...rest}>{children}</g>
}

/* ---------- drawing primitives ---------- */

export function Svg({ viewBox, label, children, className, ...rest }) {
  return (
    <svg viewBox={viewBox} className={cx('eg', className)} role={label ? 'img' : undefined}
      aria-label={label} aria-hidden={label ? undefined : 'true'} {...rest}>
      {children}
    </svg>
  )
}

export function Txt({ x, y, children, anchor = 'start', cls = '', rot = 0, ...rest }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={cx('eg-t', cls)}
      transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} {...rest}>
      {children}
    </text>
  )
}

export function Wire({ d, on, tone, flow, rev, thin, thick, dash, className }) {
  return <path d={d} className={cx('eg-w', state(on, tone), flow && on && 'flow', rev && 'rev', thin && 'thin', thick && 'thick', dash && 'dash', className)} />
}

/* Signal packet travelling a path. Skipped under reduced motion. */
export function Packet({ d, dur = 2.4, begin = 0, r = 2.4, tone = '' }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <circle r={r} className={cx('eg-dot', tone)}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
    </circle>
  )
}

export function Node({ x, y, r = 2.6, tone = '', className }) {
  return <circle cx={x} cy={y} r={r} className={cx('eg-dot', tone, className)} />
}

/* Blueprint grid backdrop sized to a viewBox. */
export function Grid({ w, h, step = 20, x0 = 0, y0 = 0 }) {
  const v = [], hz = []
  for (let x = x0; x <= x0 + w; x += step) v.push(<line key={`v${x}`} x1={x} y1={y0} x2={x} y2={y0 + h} className="eg-grid" />)
  for (let y = y0; y <= y0 + h; y += step) hz.push(<line key={`h${y}`} x1={x0} y1={y} x2={x0 + w} y2={y} className="eg-grid" />)
  return <g aria-hidden="true">{v}{hz}</g>
}

/* ---------- passive + discrete components (IEC) ---------- */

export function Resistor({ x, y, rot, len = 44, on, label, value }) {
  const h = len / 2
  return (
    <G x={x} y={y} rot={rot}>
      <path d={`M${-h} 0 H-12 M12 0 H${h}`} className={cx('eg-w', state(on))} />
      <rect x="-12" y="-4.5" width="24" height="9" className={cx('eg-b', state(on))} />
      {label && <Txt x="0" y="-9" anchor="middle" cls="sm" rot={-(rot || 0)}>{label}</Txt>}
      {value && <Txt x="0" y="17" anchor="middle" cls="sm dim lc" rot={-(rot || 0)}>{value}</Txt>}
    </G>
  )
}

export function Capacitor({ x, y, rot, len = 36, on, label }) {
  const h = len / 2
  return (
    <G x={x} y={y} rot={rot}>
      <path d={`M${-h} 0 H-3 M3 0 H${h}`} className={cx('eg-w', state(on))} />
      <path d="M-3 -8 V8 M3 -8 V8" className={cx('eg-w thick', state(on))} />
      {label && <Txt x="0" y="-12" anchor="middle" cls="sm" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

export function Inductor({ x, y, rot, len = 56, on, label }) {
  const h = len / 2
  return (
    <G x={x} y={y} rot={rot}>
      <path d={`M${-h} 0 H-16 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 H${h}`} className={cx('eg-w', state(on))} />
      {label && <Txt x="0" y="-9" anchor="middle" cls="sm" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

export function Diode({ x, y, rot, len = 36, on, label }) {
  const h = len / 2
  return (
    <G x={x} y={y} rot={rot}>
      <path d={`M${-h} 0 H-6 M6 0 H${h} M6 -6 V6`} className={cx('eg-w', state(on))} />
      <path d="M-6 -6 L-6 6 L6 0 Z" className={cx('eg-b', state(on))} />
      {label && <Txt x="0" y="-11" anchor="middle" cls="sm" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

export function Ground({ x, y, on }) {
  return (
    <G x={x} y={y}>
      <path d="M0 0 V6 M-8 6 H8 M-5 10 H5 M-2 14 H2" className={cx('eg-w', state(on))} />
    </G>
  )
}

export function Fuse({ x, y, rot, len = 44, on, label }) {
  const h = len / 2
  return (
    <G x={x} y={y} rot={rot}>
      <path d={`M${-h} 0 H-13 M13 0 H${h} M-13 0 H13`} className={cx('eg-w', state(on))} />
      <rect x="-13" y="-4" width="26" height="8" className={cx('eg-b', state(on))} />
      {label && <Txt x="0" y="-9" anchor="middle" cls="sm" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

/* ---------- switching: relay / contactor / ladder ---------- */

/* Relay or contactor coil, IEC rectangle. Vertical by default. */
export function CoilBox({ x, y, rot = 0, on, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M0 -22 V-11 M0 11 V22" className={cx('eg-w', state(on))} />
      <rect x="-8" y="-11" width="16" height="22" className={cx('eg-b', state(on), on && 'lit')} />
      {label && <Txt x="14" y="3" cls="sm hi" rot={-rot}>{label}</Txt>}
    </G>
  )
}

/* Single-pole contact. closed=true draws the blade made. */
export function Contact({ x, y, rot = 0, closed, on, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M0 -22 V-9 M0 9 V22" className={cx('eg-w', state(on))} />
      <path d={closed ? 'M0 9 V-9' : 'M0 9 L-9 -5'} className={cx('eg-w thick', state(on, on && !closed ? '' : 'on'))} style={{ transition: 'all 0.35s ease' }} />
      <circle cx="0" cy="9" r="1.8" className={cx('eg-dot', on ? '' : 'off')} />
      <path d="M-3.5 -9 H3.5" className={cx('eg-w', state(on))} />
      {label && <Txt x="14" y="3" cls="sm hi" rot={-rot}>{label}</Txt>}
    </G>
  )
}

/* Ladder-diagram contact (NO or NC). Horizontal. */
export function LadderContact({ x, y, nc, on, len = 56, label, tag }) {
  const h = len / 2
  return (
    <G x={x} y={y}>
      <path d={`M${-h} 0 H-5 M5 0 H${h}`} className={cx('eg-w', state(on))} />
      <path d="M-5 -9 V9 M5 -9 V9" className={cx('eg-w thick', state(on))} />
      {nc && <path d="M-9 9 L9 -9" className={cx('eg-w', state(on))} />}
      {label && <Txt x="0" y="-15" anchor="middle" cls="sm hi">{label}</Txt>}
      {tag && <Txt x="0" y="22" anchor="middle" cls="sm dim lc">{tag}</Txt>}
    </G>
  )
}

export function LadderCoil({ x, y, on, len = 56, label, tag }) {
  const h = len / 2
  return (
    <G x={x} y={y}>
      <path d={`M${-h} 0 H-9 M9 0 H${h}`} className={cx('eg-w', state(on))} />
      <path d="M-3 -10 A11 11 0 0 0 -3 10 M3 -10 A11 11 0 0 1 3 10" className={cx('eg-w thick', state(on))} />
      {label && <Txt x="0" y="-16" anchor="middle" cls="sm hi">{label}</Txt>}
      {tag && <Txt x="0" y="24" anchor="middle" cls="sm dim lc">{tag}</Txt>}
    </G>
  )
}

export function OpAmp({ x, y, rot, on, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M-30 -8 H-14 M-30 8 H-14 M16 0 H32" className={cx('eg-w', state(on))} />
      <path d="M-14 -16 L-14 16 L16 0 Z" className={cx('eg-b', state(on))} />
      <text x="-11" y="-5.5" className="eg-t sm hi" style={{ letterSpacing: 0 }}>+</text>
      <text x="-11" y="12" className="eg-t sm hi" style={{ letterSpacing: 0 }}>−</text>
      {label && <Txt x="-2" y="-21" anchor="middle" cls="sm">{label}</Txt>}
    </G>
  )
}

/* ---------- ISA-5.1 instrument bubble ---------- */

export function Bubble({ x, y, tag, num, on, tone, panel, r = 13 }) {
  return (
    <G x={x} y={y}>
      <circle r={r} className={cx('eg-b', state(on, tone))} />
      {panel && <path d={`M${-r} 0 H${r}`} className="eg-w thin" />}
      <text y={panel ? -2.5 : -0.5} textAnchor="middle" className="eg-t hi" style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.04em' }}>{tag}</text>
      {num && <text y={panel ? 9 : 8} textAnchor="middle" className="eg-t dim" style={{ fontSize: 6.5, letterSpacing: '0.04em' }}>{num}</text>}
    </G>
  )
}

/* ---------- field devices ---------- */

export function Motor({ x, y, rot, on, run, label = 'M', phase = '3~', r = 16 }) {
  return (
    <G x={x} y={y} rot={rot}>
      <circle r={r} className={cx('eg-b', state(on))} />
      {run && <g className="eg-spin slow"><circle r={r - 4} className="eg-w thin dash" /></g>}
      <text y="2" textAnchor="middle" className="eg-t hi" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0 }}>{label}</text>
      <text y="11" textAnchor="middle" className="eg-t dim" style={{ fontSize: 7, letterSpacing: 0 }}>{phase}</text>
    </G>
  )
}

export function Pump({ x, y, rot, on, run, r = 15 }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d={`M${-r} 0 H${-r - 10} M0 ${-r} V${-r - 8} H${r + 10}`} className={cx('eg-w', state(on))} />
      <circle r={r} className={cx('eg-b', state(on))} />
      <g className={cx(run && 'eg-spin')}>
        <path d="M0 0 L0 -9 M0 0 L7.8 4.5 M0 0 L-7.8 4.5" className={cx('eg-w thick', state(on))} />
      </g>
      <circle r="2.2" className={cx('eg-dot', on ? '' : 'off')} />
    </G>
  )
}

export function Fan({ x, y, on, run, r = 15 }) {
  return (
    <G x={x} y={y}>
      <circle r={r} className={cx('eg-b', state(on))} />
      <g className={cx(run && 'eg-spin fast')}>
        {[0, 120, 240].map((a) => (
          <ellipse key={a} cx="0" cy="-6.5" rx="3.6" ry="6.5" transform={`rotate(${a})`} className={cx('eg-b deep', state(on))} />
        ))}
      </g>
      <circle r="2" className={cx('eg-dot', on ? '' : 'off')} />
    </G>
  )
}

export function Valve({ x, y, rot, on, open = true, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <path d="M-10 -7 L0 0 L-10 7 Z M10 -7 L0 0 L10 7 Z" className={cx('eg-b', state(on), open && on && 'lit')} />
      <path d="M0 0 V-13" className={cx('eg-w', state(on))} />
      <path d="M-7 -13 A7 7 0 0 1 7 -13 Z" className={cx('eg-b', state(on))} />
      {label && <Txt x="0" y="22" anchor="middle" cls="sm">{label}</Txt>}
    </G>
  )
}

export function Tank({ x, y, level = 0.6, on, w = 40, h = 58, label }) {
  const id = useId().replace(/:/g, "")
  const lh = (h - 8) * level
  return (
    <G x={x} y={y}>
      <clipPath id={id}><rect x={-w / 2} y={-h / 2 + 4} width={w} height={h - 8} rx="6" /></clipPath>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="8" className={cx('eg-b deep', state(on))} />
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2} y={h / 2 - 4 - lh} width={w} height={lh} fill="rgba(var(--primary-rgb), 0.18)" style={{ transition: 'all 0.8s var(--ease)' }} />
        <path d={`M${-w / 2} ${h / 2 - 4 - lh} H${w / 2}`} className="eg-w on thin" style={{ transition: 'all 0.8s var(--ease)' }} />
      </g>
      {label && <Txt x="0" y={h / 2 + 14} anchor="middle" cls="sm">{label}</Txt>}
    </G>
  )
}

export function Heater({ x, y, on, hot }) {
  return (
    <G x={x} y={y}>
      <rect x="-15" y="-9" width="30" height="18" rx="2" className={cx('eg-b', state(on, hot ? 'hot' : 'on'))} />
      <path d="M-10 0 l3 -5 l4 10 l4 -10 l4 10 l3 -5" className={cx('eg-w', state(on, hot ? 'hot' : 'on'))} />
    </G>
  )
}

/* Temperature probe (RTD / thermocouple) with head + thermowell. */
export function Probe({ x, y, rot, on, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <rect x="-7" y="-30" width="14" height="11" rx="1.5" className={cx('eg-b', state(on))} />
      <rect x="-2.5" y="-19" width="5" height="40" className={cx('eg-b deep', state(on))} />
      <circle cy="23" r="3" className={cx('eg-dot', on ? 'ok' : 'off')} />
      <path d="M-7 -24 H7" className="eg-w thin" />
      {label && <Txt x="12" y="-22" cls="sm hi" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

export function PressureTx({ x, y, rot, on, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <rect x="-11" y="-20" width="22" height="26" rx="3" className={cx('eg-b', state(on))} />
      <rect x="-7" y="-16" width="14" height="8" rx="1" className="eg-b deep" />
      <path d="M-5 -12 H5" className={cx('eg-w thin', state(on))} />
      <path d="M-6 6 V10 H6 V6 M-3 10 V20 M3 10 V20" className={cx('eg-w', state(on))} />
      {label && <Txt x="16" y="-6" cls="sm hi" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

/* Accelerometer / vibration sensor on a stud. */
export function Accel({ x, y, rot, on, label }) {
  return (
    <G x={x} y={y} rot={rot}>
      <rect x="-10" y="-8" width="20" height="14" rx="2" className={cx('eg-b', state(on))} />
      <path d="M-4 6 V12 M4 6 V12 M-7 12 H7" className={cx('eg-w', state(on))} />
      <path d="M14 -5 q4 5 0 10 M19 -8 q6 8 0 16" className={cx('eg-w thin', state(on, 'hot'))} />
      {label && <Txt x="0" y="-13" anchor="middle" cls="sm hi" rot={-(rot || 0)}>{label}</Txt>}
    </G>
  )
}

/* Clamp-on current transformer around a conductor. */
export function CT({ x, y, on, label }) {
  return (
    <G x={x} y={y}>
      <path d="M-28 0 H28" className={cx('eg-w thick', state(on))} />
      <circle r="12" className={cx('eg-b deep', state(on))} />
      <circle r="6" className="eg-w thin" style={{ fill: 'var(--bg-0)' }} />
      <path d="M0 12 V22" className={cx('eg-w', state(on))} />
      {label && <Txt x="0" y="-18" anchor="middle" cls="sm hi">{label}</Txt>}
    </G>
  )
}

/* ---------- network / compute ---------- */

export function Cloud({ x, y, on, s = 1 }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-18 14 H16 A9 9 0 0 0 18 -4 A12 12 0 0 0 -4 -10 A12 12 0 0 0 -22 -2 A8 8 0 0 0 -18 14 Z" className={cx('eg-b', state(on))} />
    </G>
  )
}

export function Database({ x, y, on, label }) {
  return (
    <G x={x} y={y}>
      <path d="M-14 -10 V10 a14 5 0 0 0 28 0 V-10" className={cx('eg-b', state(on))} />
      <ellipse cy="-10" rx="14" ry="5" className={cx('eg-b', state(on))} />
      <path d="M-14 0 a14 5 0 0 0 28 0" className={cx('eg-w thin', state(on))} />
      {label && <Txt x="0" y="29" anchor="middle" cls="sm">{label}</Txt>}
    </G>
  )
}

export function Gateway({ x, y, on, w = 56, h = 26, label }) {
  return (
    <G x={x} y={y}>
      <path d={`M${-w / 2 + 8} ${-h / 2} V${-h / 2 - 9} M${w / 2 - 8} ${-h / 2} V${-h / 2 - 9}`} className={cx('eg-w', state(on))} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="3" className={cx('eg-b', state(on))} />
      {[-w / 2 + 9, -w / 2 + 17, -w / 2 + 25].map((lx, i) => (
        <circle key={lx} cx={lx} cy={-2} r="1.8" className={cx('eg-led', on && 'on', i === 1 && 'blink')} />
      ))}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={w / 2 - 36 + i * 8 + 12} y={h / 2 - 9} width="6" height="5" rx="0.8" className="eg-b deep" />)}
      {label && <Txt x="0" y={h / 2 + 15} anchor="middle" cls="sm">{label}</Txt>}
    </G>
  )
}

/* ---------- PCB-level parts ---------- */

/* IC package: quad (QFP) or dual (SOIC). Centered on x,y. */
export function IC({ x, y, w = 56, h = 56, pins = 8, kind = 'quad', on, label, sub, pinLen = 7, hot }) {
  const pitch = (n, len) => Array.from({ length: n }, (_, i) => -len / 2 + (len / (n + 1)) * (i + 1))
  const px = pitch(pins, w), py = pitch(pins, h)
  const pin = 'eg-pad'
  return (
    <G x={x} y={y}>
      {px.map((p) => <rect key={`t${p}`} x={p - 1.1} y={-h / 2 - pinLen} width="2.2" height={pinLen} className={pin} />)}
      {px.map((p) => <rect key={`b${p}`} x={p - 1.1} y={h / 2} width="2.2" height={pinLen} className={pin} />)}
      {kind === 'quad' && py.map((p) => <rect key={`l${p}`} x={-w / 2 - pinLen} y={p - 1.1} width={pinLen} height="2.2" className={pin} />)}
      {kind === 'quad' && py.map((p) => <rect key={`r${p}`} x={w / 2} y={p - 1.1} width={pinLen} height="2.2" className={pin} />)}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" className={cx('eg-ic', state(on, hot && 'hot'))} />
      <circle cx={-w / 2 + 6} cy={-h / 2 + 6} r="2" className="eg-hole" style={{ fill: 'none' }} />
      {on && <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" className="eg-glow pulse" />}
      {label && <text y={sub ? -1 : 3} textAnchor="middle" className="eg-t hi" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'var(--font-display)' }}>{label}</text>}
      {sub && <text y="11" textAnchor="middle" className="eg-t dim sm">{sub}</text>}
    </G>
  )
}

/* Screw terminal block, PCB top view. */
export function Terminals({ x, y, n = 4, pitch = 14, labels, tone, on, rot, w = 14, h = 20 }) {
  const total = n * pitch
  return (
    <G x={x} y={y} rot={rot}>
      <rect x="0" y="0" width={total} height={h} rx="1.5" className={cx('eg-b', state(on, tone))} />
      {Array.from({ length: n }).map((_, i) => {
        const cxp = pitch / 2 + i * pitch
        return (
          <g key={i}>
            <circle cx={cxp} cy={h * 0.4} r={w * 0.26} className="eg-b deep" />
            <path d={`M${cxp - 2.4} ${h * 0.4 - 2.4} L${cxp + 2.4} ${h * 0.4 + 2.4}`} className="eg-w thin" />
            {i > 0 && <path d={`M${i * pitch} 2 V${h - 2}`} className="eg-w thin" style={{ opacity: 0.5 }} />}
            {labels?.[i] && <text x={cxp} y={h + 10} textAnchor="middle" className="eg-t sm dim">{labels[i]}</text>}
          </g>
        )
      })}
    </G>
  )
}

export function Rj45({ x, y, on, rot }) {
  return (
    <G x={x} y={y} rot={rot}>
      <rect x="-17" y="-14" width="34" height="28" rx="2" className={cx('eg-b', state(on))} />
      <rect x="-11" y="-6" width="22" height="16" rx="1" className="eg-b deep" />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${-9.5 + i * 2.7} -4 V3`} className="eg-w thin" style={{ stroke: 'var(--gold)', opacity: 0.8 }} />)}
      <circle cx="-9" cy="-10.5" r="1.5" className={cx('eg-led', on && 'on')} />
      <circle cx="9" cy="-10.5" r="1.5" className={cx('eg-led cu blink', on && 'on')} />
    </G>
  )
}

export function Relay({ x, y, on, label }) {
  return (
    <G x={x} y={y}>
      <rect x="-16" y="-12" width="32" height="24" rx="2" className={cx('eg-ic', state(on))} />
      <path d="M-9 -4 h5 v8 h-5 z M4 6 l6 -9" className="eg-silk" />
      <rect x="-18" y="-8" width="2.4" height="4" className="eg-pad" />
      <rect x="-18" y="4" width="2.4" height="4" className="eg-pad" />
      <rect x="15.6" y="-8" width="2.4" height="4" className="eg-pad" />
      <rect x="15.6" y="4" width="2.4" height="4" className="eg-pad" />
      <circle cx="11" cy="-7" r="1.4" className={cx('eg-led cu', on && 'on')} />
      {label && <Txt x="0" y="22" anchor="middle" cls="sm dim">{label}</Txt>}
    </G>
  )
}

/* SMD chip (0603-ish) with gold end-caps. */
export function Smd({ x, y, rot, w = 9, h = 4.4, tone }) {
  return (
    <G x={x} y={y} rot={rot}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} className="eg-ic" style={{ stroke: tone ? 'var(--primary)' : undefined }} />
      <rect x={-w / 2} y={-h / 2} width="2" height={h} className="eg-pad" />
      <rect x={w / 2 - 2} y={-h / 2} width="2" height={h} className="eg-pad" />
    </G>
  )
}

export function Crystal({ x, y, rot }) {
  return (
    <G x={x} y={y} rot={rot}>
      <rect x="-9" y="-5" width="18" height="10" rx="2" className="eg-b" />
      <rect x="-9" y="-5" width="4" height="10" className="eg-pad" />
      <rect x="5" y="-5" width="4" height="10" className="eg-pad" />
      <path d="M-2 -3 V3 M2 -3 V3" className="eg-w thin" />
    </G>
  )
}

export function MountHole({ x, y, r = 5 }) {
  return (
    <G x={x} y={y}>
      <circle r={r + 2.5} className="eg-silk" />
      <circle r={r} className="eg-hole" />
    </G>
  )
}

export function Via({ x, y, dim, r = 2.6 }) {
  return <circle cx={x} cy={y} r={r} className={cx('eg-via', dim && 'dim')} />
}

/* DIN-rail controller module, front view. */
export function DinModule({ x, y, w = 130, h = 120, on, label, sub, ledsOn = [true, true, false], tops = 6, bots = 6 }) {
  const tw = (w - 16) / tops, bw = (w - 16) / bots
  return (
    <G x={x} y={y}>
      <rect x="-6" y={h / 2 - 2} width={w + 12} height="6" className="eg-b deep" transform={`translate(${-w / 2} 0)`} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="4" className={cx('eg-b', state(on))} />
      {Array.from({ length: tops }).map((_, i) => (
        <g key={`t${i}`}>
          <rect x={-w / 2 + 8 + i * tw + 1.5} y={-h / 2 + 3} width={tw - 3} height="12" rx="1.5" className="eg-b deep" />
          <circle cx={-w / 2 + 8 + i * tw + tw / 2} cy={-h / 2 + 9} r="2.2" className="eg-w thin" />
        </g>
      ))}
      {Array.from({ length: bots }).map((_, i) => (
        <g key={`b${i}`}>
          <rect x={-w / 2 + 8 + i * bw + 1.5} y={h / 2 - 15} width={bw - 3} height="12" rx="1.5" className="eg-b deep" />
          <circle cx={-w / 2 + 8 + i * bw + bw / 2} cy={h / 2 - 9} r="2.2" className="eg-w thin" />
        </g>
      ))}
      <rect x={-w / 2 + 10} y={-h / 2 + 24} width={w - 20} height={h - 54} rx="2" className="eg-b deep" />
      {label && <text x={-w / 2 + 18} y={-h / 2 + 42} className="eg-t hi" style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>{label}</text>}
      {sub && <text x={-w / 2 + 18} y={-h / 2 + 55} className="eg-t dim sm">{sub}</text>}
      {ledsOn.map((l, i) => <circle key={i} cx={w / 2 - 20 - i * 10} cy={-h / 2 + 34} r="2.2" className={cx('eg-led', l && on && 'on', i === 1 && 'blink')} />)}
    </G>
  )
}

/* Mini oscilloscope / trend recorder frame. */
export function ScopeFrame({ x, y, w, h, children, label }) {
  return (
    <G x={x} y={y}>
      <rect width={w} height={h} rx="4" className="eg-b deep" />
      <Grid w={w} h={h} step={Math.max(16, Math.round(w / 8))} />
      {children}
      {label && <Txt x="8" y={h - 7} cls="sm dim">{label}</Txt>}
    </G>
  )
}
