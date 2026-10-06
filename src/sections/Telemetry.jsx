import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Section, Status } from '../components/primitives'
import { telemetry } from '../data/site'
import './Telemetry.css'

function useTick(m, paused, reduce) {
  const [v, setV] = useState(m.base)
  useEffect(() => {
    if (paused || reduce) return
    const t = setInterval(() => {
      setV((p) => {
        const n = p + (Math.random() - 0.5) * m.jitter + (m.base - p) * 0.08
        return Math.min(m.max, Math.max(m.min, n))
      })
    }, 1400)
    return () => clearInterval(t)
  }, [paused, reduce, m])
  return v
}

/* Panel-meter style readout: value, unit and a bar gauge with a caution zone. */
function Metric({ m, paused, reduce }) {
  const v = useTick(m, paused, reduce)
  const pct = Math.round(((v - m.min) / (m.max - m.min)) * 100)
  const caution = pct > 86 || pct < 8
  return (
    <div className={`tm ${caution ? 'is-caution' : ''}`}>
      <p className="tlabel">{m.label}</p>
      <p className="tm__val">{v.toFixed(m.decimals)}<small>{m.unit}</small></p>
      <div className="tm__bar" role="presentation">
        <span className="tm__fill" style={{ width: `${pct}%` }} />
        <i className="tm__zone" />
      </div>
    </div>
  )
}

const N = 90
const LIMIT = 4.2
const YMAX = 6
const TICK_S = 0.9

const step = (last) => Math.min(5.6, Math.max(0.8, last + (Math.random() - 0.5) * 1.1 + (2.4 - last) * 0.12))
const seed = () => {
  const out = [2.4]
  while (out.length < N) out.push(step(out[out.length - 1]))
  return out
}

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/* Trend recorder: gridded plot, y axis in mm/s, limit line, hover crosshair. */
function Trend({ reduce, paused }) {
  const ref = useRef(null)
  const buf = useRef(null)
  if (buf.current === null) buf.current = seed()
  const hover = useRef(null)

  const draw = useCallback(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(c.clientWidth * dpr)
    const h = Math.round(c.clientHeight * dpr)
    if (!w || !h) return
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h }
    const d = (n) => n * dpr
    const ink = css('--ink'), muted = css('--muted'), faint = css('--faint')
    const sig = css('--signal'), warn = css('--warn'), ok = css('--ok'), line = css('--line-strong')
    const font = '"Inter", system-ui, sans-serif'
    const L = d(44), R = w - d(12), T = d(14), B = h - d(24)
    const X = (i) => L + (i / (N - 1)) * (R - L)
    const Y = (v) => B - (v / YMAX) * (B - T)
    ctx.clearRect(0, 0, w, h)

    // minor + major grid
    ctx.lineWidth = dpr
    for (let v = 0; v <= YMAX; v += 1) {
      ctx.strokeStyle = v % 2 === 0 ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.035)'
      ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke()
    }
    for (let i = 0; i < N; i += 10) {
      ctx.strokeStyle = 'rgba(255,255,255,0.035)'
      ctx.beginPath(); ctx.moveTo(X(i), T); ctx.lineTo(X(i), B); ctx.stroke()
    }
    // axes + labels
    ctx.strokeStyle = line
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke()
    ctx.fillStyle = faint
    ctx.font = `500 ${d(10)}px ${font}`
    ctx.textAlign = 'right'
    for (let v = 0; v <= YMAX; v += 2) ctx.fillText(String(v), L - d(8), Y(v) + d(3.5))
    ctx.textAlign = 'center'
    ;[0, 30, 60, N - 1].forEach((i) => {
      const s = Math.round((N - 1 - i) * TICK_S)
      ctx.fillText(i === N - 1 ? 'now' : `−${s} s`, X(i), h - d(8))
    })

    // limit
    ctx.strokeStyle = warn
    ctx.globalAlpha = 0.75
    ctx.setLineDash([d(5), d(4)])
    ctx.beginPath(); ctx.moveTo(L, Y(LIMIT)); ctx.lineTo(R, Y(LIMIT)); ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    ctx.fillStyle = warn
    ctx.textAlign = 'right'
    ctx.fillText('LIMIT 4.2', R - d(4), Y(LIMIT) - d(6))

    // signal, segments above the limit switch to caution colour
    const b = buf.current
    ctx.lineWidth = d(1.9)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    for (let i = 1; i < N; i++) {
      ctx.strokeStyle = Math.max(b[i - 1], b[i]) > LIMIT ? warn : sig
      ctx.beginPath(); ctx.moveTo(X(i - 1), Y(b[i - 1])); ctx.lineTo(X(i), Y(b[i])); ctx.stroke()
    }
    const last = b[N - 1]
    ctx.fillStyle = last > LIMIT ? warn : ok
    ctx.beginPath(); ctx.arc(X(N - 1), Y(last), d(3.4), 0, Math.PI * 2); ctx.fill()

    // hover crosshair + readout
    const hi = hover.current
    if (hi !== null) {
      const i = Math.max(0, Math.min(N - 1, hi))
      const v = b[i]
      ctx.strokeStyle = muted
      ctx.lineWidth = dpr
      ctx.setLineDash([d(3), d(3)])
      ctx.beginPath(); ctx.moveTo(X(i), T); ctx.lineTo(X(i), B); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = ink
      ctx.beginPath(); ctx.arc(X(i), Y(v), d(3.6), 0, Math.PI * 2); ctx.fill()
      const label = `${v.toFixed(2)} mm/s · ${i === N - 1 ? 'now' : `−${Math.round((N - 1 - i) * TICK_S)} s`}`
      ctx.font = `600 ${d(11)}px ${font}`
      const tw = ctx.measureText(label).width + d(16)
      let tx = X(i) + d(10)
      if (tx + tw > R) tx = X(i) - d(10) - tw
      const ty = Math.min(Math.max(Y(v) - d(26), T), B - d(24))
      ctx.fillStyle = css('--surface-2')
      ctx.strokeStyle = line
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, d(22), d(3)); ctx.fill(); ctx.stroke()
      ctx.fillStyle = ink
      ctx.textAlign = 'left'
      ctx.fillText(label, tx + d(8), ty + d(15))
    }
  }, [])

  useEffect(() => {
    draw()
    if (reduce || paused) return
    const t = setInterval(() => {
      const b = buf.current
      b.push(step(b[b.length - 1])); b.shift()
      draw()
    }, TICK_S * 1000)
    return () => clearInterval(t)
  }, [reduce, paused, draw])

  useEffect(() => {
    const c = ref.current
    if (!c || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => draw())
    ro.observe(c)
    return () => ro.disconnect()
  }, [draw])

  const move = (e) => {
    const c = ref.current
    const r = c.getBoundingClientRect()
    const fx = (e.clientX - r.left - 44) / (r.width - 44 - 12)
    hover.current = Math.round(fx * (N - 1))
    draw()
  }
  const leave = () => { hover.current = null; draw() }

  return (
    <canvas ref={ref} className="tgraph" role="img" tabIndex={0}
      aria-label="Simulated vibration trend, mm/s, with a 4.2 mm/s alert limit. Hover or touch to read values."
      onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave} />
  )
}

export default function Telemetry() {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [stamps, setStamps] = useState([])

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      setStamps((s) => [new Date(), ...s].slice(0, 4))
    }, 5000)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <Section id="intelligence" index="03" label="Live system - simulated demo"
      title="See the system thinking in real time."
      lede="An illustrative simulation of an Armtronix telemetry feed - sensor nodes, data paths and status, rendered live in your browser.">
      <div className="tele">
        <div className="tele__head">
          <Status state="ok">Online - simulation</Status>
          <p className="tlabel">Cell AX-01 · 1 Hz demo feed</p>
          <button className="btn btn--ghost btn--sm" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
            {paused ? '▶ Resume' : '❚❚ Pause'}
          </button>
        </div>
        <div className="tele__grid">
          {telemetry.map((m) => <Metric key={m.id} m={m} paused={paused} reduce={reduce} />)}
        </div>
        <Trend reduce={reduce} paused={paused} />
        <div className="tele__foot">
          <p className="tlabel">Vibration · mm/s · dashed line = alert limit · hover the trend to read a value</p>
          <ul className="tele__stamps" aria-label="Simulated event timestamps">
            {stamps.length === 0 && <li className="tlabel">awaiting simulated events…</li>}
            {stamps.map((d, i) => (
              <li key={i} className="tlabel">▲ packet {d.toLocaleTimeString('en-GB', { hour12: false })} · node {['T-01', 'P-02', 'V-03', 'C-04'][i % 4]}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
