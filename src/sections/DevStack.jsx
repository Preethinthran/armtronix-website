import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { cases, industries, industryImagery, about } from '../data/company'
import './DevStack.css'

function Work() {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <SectionHeader
          eyebrow="Selected work - proof of capability"
          title="Infrastructure that performs."
          lede="Large-scale environments engineered for continuous operations - a selection of recent engagements."
        />
        <div className="work__list">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={0.05 * i}>
              <article className={`work__row ${i % 2 ? 'work__row--flip' : ''}`}>
                <div className="work__imgwrap">
                  <img src={c.img} alt={c.alt} loading="lazy" />
                </div>
                <div className="work__body">
                  <p className="work__type">{c.type}</p>
                  <h3 className="work__title">{c.title}</h3>
                  <dl className="work__meta">
                    <div><dt>Capability</dt><dd>{c.capability}</dd></div>
                    <div><dt>Outcome</dt><dd>{c.outcome}</dd></div>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Industries() {
  const [active, setActive] = useState(0)
  return (
    <section className="ind" id="industries" aria-label="Industries we power">
      <img
        key={active}
        className="ind__bg"
        src={industryImagery[active % industryImagery.length]}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <span className="ind__shade" aria-hidden="true" />
      <div className="wrap ind__inner">
        <SectionHeader
          eyebrow="Industries - coverage"
          title="Where our infrastructure operates."
        />
        <div className="ind__rail" role="tablist" aria-label="Industries">
          {industries.map((ind, i) => (
            <button
              key={ind}
              role="tab"
              aria-selected={active === i}
              className={`ind__item ${active === i ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="ind__n">{String(i + 1).padStart(2, '0')}</span>
              <span>{ind}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutBand() {
  return (
    <section className="section aboutband" id="about" aria-label="About Armtronix">
      <div className="wrap aboutband__grid">
        <SectionHeader
          eyebrow="About - mission-critical by design"
          title={about.heading}
          lede={about.body}
        />
        <Reveal delay={0.1}>
          <div className="aboutband__cols">
            <div>
              <p className="aboutband__h">Mission</p>
              <p className="small">{about.mission}</p>
            </div>
            <div>
              <p className="aboutband__h">Vision</p>
              <p className="small">{about.vision}</p>
            </div>
            <div>
              <p className="aboutband__h">Regions</p>
              <ul className="aboutband__regions">
                {about.regions.map((r) => (
                  <li key={r.place}><strong>{r.place}</strong><span>{r.role}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function DevStack() {
  return (
    <>
      <Work />
      <Industries />
      <AboutBand />
    </>
  )
}
