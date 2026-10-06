import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { IntelligenceDiagram } from '../components/diagrams'
import { advantage } from '../data/company'
import './Solutions.css'

const GLYPHS = [
  (active) => (
    <svg viewBox="0 0 64 40" aria-hidden="true"><circle cx="32" cy="20" r="10" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.5" /><circle cx="32" cy="20" r="3" fill={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} /><line x1="0" y1="20" x2="16" y2="20" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.25" /><line x1="48" y1="20" x2="64" y2="20" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.25" /></svg>
  ),
  (active) => (
    <svg viewBox="0 0 64 40" aria-hidden="true"><rect x="8" y="8" width="24" height="24" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.5" /><rect x="32" y="8" width="24" height="24" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.25" strokeDasharray="3 2" /><line x1="20" y1="32" x2="44" y2="20" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.25" /></svg>
  ),
  (active) => (
    <svg viewBox="0 0 64 40" aria-hidden="true"><path d="M4 30 L20 30 L26 14 L34 34 L40 22 L60 22" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  (active) => (
    <svg viewBox="0 0 64 40" aria-hidden="true"><rect x="20" y="6" width="24" height="28" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.5" /><circle cx="32" cy="16" r="2.5" fill={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} /><line x1="26" y1="26" x2="38" y2="26" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.25" /></svg>
  ),
  (active) => (
    <svg viewBox="0 0 64 40" aria-hidden="true"><circle cx="32" cy="20" r="14" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.5" strokeDasharray="4 3" /><path d="M32 12 V20 L38 25" fill="none" stroke={active ? 'var(--primary-hover)' : 'rgba(8,20,38,0.4)'} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
]

export default function Solutions() {
  const [active, setActive] = useState(0)
  const cur = advantage[active]

  return (
    <section className="section why" id="advantage">
      <div className="wrap">
        <SectionHeader
          eyebrow="Advantage - engineered intelligence"
          title="Infrastructure designed to think ahead."
          lede="How physical structure, energy and networks converge into one data layer - and what that convergence buys you."
        />
        <div className="why__diagram">
          <IntelligenceDiagram />
        </div>
        <div className="why__rows" role="tablist" aria-label="Advantages">
          {advantage.map((a, i) => {
            const on = active === i
            return (
              <button
                key={a.n}
                role="tab"
                aria-selected={on}
                aria-expanded={on}
                className={`why__row ${on ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="why__n">{a.n}</span>
                <span className="why__tt">{a.title}</span>
                <span className="why__glyph" aria-hidden="true">{GLYPHS[i](on)}</span>
                <span className={`why__desc ${on ? 'is-on' : ''}`}>{a.desc}</span>
              </button>
            )
          })}
        </div>
        <p className="why__active sr-only" aria-live="polite">{cur.title} - {cur.desc}</p>
      </div>
    </section>
  )
}
