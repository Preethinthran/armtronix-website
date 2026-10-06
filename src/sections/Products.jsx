import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { stages } from '../data/company'
import SectionHeader from '../components/SectionHeader'
import { SystemDiagram, NetworkDiagram, DataFlowDiagram } from '../components/diagrams'
import './Products.css'

const STAGE_META = [
  { href: 'https://armtronix.com/integrated', cta: 'Explore construction' },
  { href: 'https://armtronix.com/engineering_excellence', cta: 'Explore engineering' },
  { href: 'https://armtronix.com/power_transmission', cta: 'Explore transmission' },
  { href: 'https://armtronix.com/intelligence', cta: 'Explore technologies' },
]

function StageVisual({ stage, index }) {
  if (index === 0) {
    return (
      <div className="eco__imgwrap">
        <img className="eco__img" src={stage.img} alt={stage.alt} loading="lazy" />
        <svg className="eco__overlay" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="rgba(255,255,255,0.65)" strokeWidth="1">
            <line x1="0" y1="40" x2="400" y2="40" strokeDasharray="5 5" />
            <line x1="0" y1="220" x2="400" y2="220" strokeDasharray="5 5" />
            <line x1="40" y1="0" x2="40" y2="260" strokeDasharray="5 5" />
            <line x1="360" y1="0" x2="360" y2="260" strokeDasharray="5 5" />
          </g>
        </svg>
        <span className="eco__dim eco__dim--w" aria-hidden="true">120.0 M</span>
        <span className="eco__dim eco__dim--h" aria-hidden="true">64.0 M</span>
        <span className="eco__coord" aria-hidden="true">X:040 · Y:220 - GRID A1</span>
        <span className="eco__num" aria-hidden="true">{stage.n}</span>
      </div>
    )
  }
  return (
    <div className="eco__diagram">
      {index === 1 && <SystemDiagram />}
      {index === 2 && <NetworkDiagram />}
      {index === 3 && <DataFlowDiagram />}
    </div>
  )
}

export default function Products() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const sync = () => setEnabled(mq.matches && !reduce)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const update = () => {
      raf = 0
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return
      const rect = section.getBoundingClientRect()
      const total = Math.max(rect.height - window.innerHeight, 1)
      const p = Math.min(Math.max(-rect.top / total, 0), 1)
      const max = Math.max(track.scrollWidth - window.innerWidth, 0)
      track.style.transform = `translate3d(${-p * max}px, 0, 0)`
      setIndex(Math.min(Math.floor(p * stages.length), stages.length - 1))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  return (
    <section
      className={`eco ${enabled ? 'eco--h' : 'eco--v'}`}
      id="ecosystem"
      ref={sectionRef}
      aria-label="Ecosystem: four stages of the infrastructure lifecycle"
    >
      <div className="eco__sticky">
        <div className="eco__head">
          <SectionHeader
            eyebrow="Ecosystem - one integrated lifecycle"
            title="From foundation to intelligence."
            lede="Four divisions operating as one connected system - each stage feeds the next, from physical structure to digital automation."
          />
          <p className="eco__count" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
          </p>
        </div>
        <div className="eco__viewport">
          <div className="eco__track" ref={trackRef}>
            {stages.map((s, i) => (
              <article className="eco__stage" key={s.n} aria-label={`Stage ${s.n}: ${s.name}`}>
                <StageVisual stage={s} index={i} />
                <div className="eco__body">
                  <p className="eco__phase">{s.n} - {s.phase}</p>
                  <h3 className="eco__name">{s.name}</h3>
                  <p className="eco__desc">{s.desc}</p>
                  <details className="eco__more">
                    <summary>Key capability</summary>
                    <p>{s.capability}</p>
                  </details>
                  <a className="eco__link" href={STAGE_META[i].href} target="_blank" rel="noreferrer">
                    {STAGE_META[i].cta} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
