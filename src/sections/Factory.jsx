import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { DeliveryViz } from '../components/diagrams'
import { deliveryStages } from '../data/company'
import './Factory.css'

const STAGE_NOTES = [
  'Requirements, constraints and continuity targets defined up front.',
  'Civil, systems and network design aligned in one framework.',
  'Coordinated engineering, utility planning and lifecycle detailing.',
  'Mission-critical construction with integrated systems installation.',
  'Commissioning, monitoring and lifecycle performance optimization.',
]

export default function Factory() {
  const [active, setActive] = useState(0)

  return (
    <section className="section deliver" id="delivery">
      <div className="wrap">
        <SectionHeader
          eyebrow="Delivery - how we deliver"
          title="Discovery to optimization, one timeline."
          lede="A structured framework aligning strategy, engineering, construction, systems integration and operational readiness."
        />
        <div className="deliver__timeline" role="tablist" aria-label="Delivery stages">
          <div className="deliver__line" aria-hidden="true">
            <span style={{ width: `${(active / (deliveryStages.length - 1)) * 100}%` }} />
          </div>
          {deliveryStages.map((d, i) => (
            <button
              key={d.name}
              role="tab"
              aria-selected={active === i}
              className={`deliver__node ${active === i ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="deliver__dot" aria-hidden="true" />
              <span className="deliver__n">0{i + 1}</span>
              <span className="deliver__t">{d.name}</span>
            </button>
          ))}
        </div>
        <div className="deliver__detail" aria-live="polite">
          <DeliveryViz stages={deliveryStages.map((d) => d.name)} active={active} />
          <div>
            <p className="deliver__stage">Stage 0{active + 1} - {deliveryStages[active].name}</p>
            <p className="deliver__desc">{STAGE_NOTES[active]}</p>
            <a className="eco__link" href="#contact">Start at {deliveryStages[active].name.toLowerCase()} →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
