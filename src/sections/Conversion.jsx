import { useState } from 'react'
import { Section } from '../components/primitives'
import { enquiryTracks } from '../data/site'
import './Conversion.css'

export default function Conversion() {
  const [track, setTrack] = useState('Machine monitoring')
  const [about, setAbout] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid work email so an engineer can reply with a scoped plan.')
      return
    }
    setError('')
    const ref = `AX-${Date.now().toString(36).toUpperCase().slice(-6)}`
    setDone(`Enquiry ${ref} logged - “${track}”. An engineer will reply to ${email} with next steps.`)
  }

  return (
    <Section id="contact" index="08" label="Enquiry"
      title="Talk to an engineer."
      lede="A short professional pathway - no generic marketing form. Pick what you are building, describe the system, connect.">
      <div className="conversion__grid">
        <form className="funnel" onSubmit={submit} noValidate aria-label="Solution enquiry">
          <div className="funnel__step">
            <p className="tlabel">01 - What are you building?</p>
            <div className="funnel__tracks" role="radiogroup" aria-label="Project type">
              {enquiryTracks.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={track === t}
                  className={`funnel__track ${track === t ? 'is-active' : ''}`}
                  onClick={() => setTrack(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="funnel__step">
            <p className="tlabel">02 - Tell us about your system</p>
            <div className="field">
              <label htmlFor="f-about">Machines, signals, environment <span className="small">(e.g. 8 CNC spindles, temp + vibration, RS485 available)</span></label>
              <textarea id="f-about" rows={3} value={about} onChange={(e) => setAbout(e.target.value)}
                placeholder="Describe the machine, the signals you need, and the outcome you want…" />
            </div>
          </div>
          <div className="funnel__step">
            <p className="tlabel">03 - Connect with Armtronix</p>
            <div className="funnel__row">
              <div className="field funnel__email">
                <label htmlFor="f-email">Work email</label>
                <input id="f-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com" autoComplete="email" aria-invalid={!!error} />
              </div>
              <div className="funnel__ctas">
                <button className="btn btn--primary" type="submit">Request a solution <span className="arr" aria-hidden="true">→</span></button>
                <a className="btn btn--ghost" href="#top">Discuss application <span className="arr" aria-hidden="true">→</span></a>
              </div>
            </div>
            {error ? <p className="field__msg" role="alert">{error}</p> : null}
            {done && <p className="funnel__done" role="status">✓ {done}</p>}
          </div>
        </form>

        {/* Sidebar providing direct engineer channel and filling the grid */}
        <aside className="conversion__sidebar" aria-label="Direct engineering engagement details">
          <div className="cside__card">
            <p className="cside__kicker">Direct Engineering Channel</p>
            <h3 className="cside__title">Technical architecture response within 4 hours.</h3>
            <p className="cside__desc">
              Every request is reviewed directly by an industrial IoT hardware and embedded systems engineer.
            </p>

            <ul className="cside__specs">
              <li>
                <span className="cside__key">Reviewers</span>
                <span className="cside__val">Systems & Hardware Engineers</span>
              </li>
              <li>
                <span className="cside__key">Deliverable</span>
                <span className="cside__val">Block Diagram + Signal Scope</span>
              </li>
              <li>
                <span className="cside__key">Direct Channel</span>
                <span className="cside__val">engineering@armtronix.com</span>
              </li>
              <li>
                <span className="cside__key">NDA Support</span>
                <span className="cside__val">Standard Mutual NDA Available</span>
              </li>
            </ul>

            <div className="cside__badge">
              <span className="cside__dot" />
              <span>Lab AX-01 Hardware Bench Active</span>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  )
}
