import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Section, Status } from '../components/primitives'
import { Svg, G, Wire, Node, Probe, Bubble, LadderContact, LadderCoil, Fan, Pump, Motor, Txt } from '../components/eng/Symbols'
import './AutomationFlow.css'

const OUTPUTS = ['Fan', 'Pump', 'Motor', 'Alert']

/* Output glyphs are the actual device symbols; they spin / glow when driven. */
function OutIcon({ name, on }) {
  return (
    <svg viewBox="0 0 44 36" className="auto__ico" aria-hidden="true">
      <G x={22} y={19} s={0.8}>
        {name === 'Fan' && <Fan on={on} run={on} />}
        {name === 'Pump' && <Pump on={on} run={on} />}
        {name === 'Motor' && <Motor on={on} run={on} />}
        {name === 'Alert' && (
          <g>
            <path d="M-9 8 V-1 A9 9 0 0 1 9 -1 V8 Z" className={`eg-b ${on ? 'hot lithot' : ''}`} />
            <path d="M-12 8 H12 M0 -14 V-10" className={`eg-w ${on ? 'hot' : ''}`} />
            <path d="M-5 -1 V-4" className={`eg-w thin ${on ? 'hot' : ''}`} />
          </g>
        )}
      </G>
    </svg>
  )
}

export default function AutomationFlow() {
  const reduce = useReducedMotion()
  const [temp, setTemp] = useState(72.4)
  const [tripped, setTripped] = useState(false)
  const [fired, setFired] = useState(null)
  const TH = 78

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      setTemp((p) => {
        const n = p + (Math.random() - 0.5) * 3 + (tripped ? -1.2 : 0.9)
        return Math.min(88, Math.max(64, n))
      })
    }, 1200)
    return () => clearInterval(t)
  }, [reduce, tripped])

  useEffect(() => {
    setTripped(temp > TH)
  }, [temp])

  useEffect(() => {
    if (!tripped) { setFired(null); return }
    const seq = ['Fan', 'Pump', 'Motor', 'Alert']
    let i = 0
    setFired(seq[0])
    if (reduce) { setFired('Alert'); return }
    const t = setInterval(() => {
      i += 1
      if (i >= seq.length) { clearInterval(t); return }
      setFired(seq[i])
    }, 700)
    return () => clearInterval(t)
  }, [tripped, reduce])

  const drive = (o) => {
    if (o === 'Fan') setTripped(false)
    setTemp((p) => (o === 'Fan' ? p - 4 : p))
  }

  return (
    <Section id="solutions" index="04" label="Automation"
      title="When data becomes action."
      lede="Armtronix does not merely collect data. A physical signal crosses a threshold, the controller decides, and physical outputs move. Watch it happen - or push the sensor yourself.">
      <div className="auto">
        <div className="auto__chain">
          {/* 01 · Temperature Sensor Card */}
          <div className={`auto__block ${tripped ? 'is-hot' : ''}`}>
            <div className="auto__card-head">
              <p className="tlabel">Temperature</p>
              <Svg viewBox="0 0 76 40" className="auto__sym">
                <Probe x={16} y={18} on rot={0} />
                <Wire d="M22 6 H36 V14 H44" on />
                <Bubble x={56} y={14} tag="TT" num="101" on tone={tripped ? 'hot' : ''} r={10} />
              </Svg>
            </div>
            <div className="auto__card-body">
              <p className="auto__big">{temp.toFixed(1)}<small>°C</small></p>
              <p className={`tlabel ${tripped ? 'auto__alert' : ''}`}>
                {tripped ? '▲ threshold detected · 78 °C' : '● nominal · threshold 78 °C'}
              </p>
            </div>
            <div className="auto__card-foot">
              <div className="auto__push">
                <button className="btn btn--ghost btn--sm" onClick={() => setTemp((p) => Math.min(88, p + 4))}>+ heat sensor</button>
                <button className="btn btn--ghost btn--sm" onClick={() => { setTemp(70); setTripped(false) }}>reset</button>
              </div>
            </div>
          </div>

          {/* Signal Wire 1 -> 2 */}
          <Svg viewBox="0 0 120 60" className="auto__wire">
            <Wire d="M0 30 H120" on={tripped} tone={tripped ? 'hot' : ''} flow />
            <Node x={60} y={30} r={4.5} tone={tripped ? 'hot' : 'off'} />
          </Svg>

          {/* 02 · Logic Controller Card */}
          <div className={`auto__block ${tripped ? 'is-hot' : ''}`}>
            <div className="auto__card-head">
              <p className="tlabel">Controller</p>
              <span className={`auto__chip ${tripped ? 'is-act' : ''}`}>
                {tripped ? 'TRIP COIL' : 'STANDBY'}
              </span>
            </div>
            <div className="auto__card-body">
              <Svg viewBox="0 0 170 44" className="auto__rung" label={`Ladder rung: temperature above 78 °C energises the output coil - currently ${tripped ? 'energised' : 'idle'}`}>
                <Wire d="M0 22 H20" on={tripped} />
                <LadderContact x={48} y={22} len={56} on={tripped} label="TT>78" />
                <Wire d="M76 22 H98" on={tripped} />
                <LadderCoil x={126} y={22} len={56} on={tripped} label="ACT" />
                <Wire d="M154 22 H170" on={tripped} />
              </Svg>
              <div className="auto__state-line">
                <p className="auto__big">{tripped ? 'ACT' : 'IDLE'}</p>
                <p className="tlabel auto__state-sub">
                  {tripped ? 'OUTPUT RELAYS CLOSED' : 'INPUTS NORMAL · NO TRIP'}
                </p>
              </div>
            </div>
            <div className="auto__card-foot">
              <Status state={tripped ? 'warn' : 'ok'}>
                {tripped ? 'deciding - outputs live' : 'monitoring - inputs normal'}
              </Status>
            </div>
          </div>

          {/* Signal Wire 2 -> 3 */}
          <Svg viewBox="0 0 120 60" className="auto__wire">
            <Wire d="M0 30 H120" on={tripped} tone={tripped ? 'hot' : ''} flow />
            <Node x={60} y={30} r={4.5} tone={tripped ? 'hot' : 'off'} />
          </Svg>

          {/* 03 · Action & Field Actuators Card */}
          <div className="auto__block">
            <div className="auto__card-head">
              <p className="tlabel">Action</p>
              <span className={`auto__chip ${tripped ? 'is-act' : ''}`}>
                {tripped ? '4 ACTIVE' : '0 ACTIVE'}
              </span>
            </div>
            <div className="auto__card-body auto__card-body--fill">
              <ul className="auto__outs">
                {OUTPUTS.map((o) => {
                  const lit = tripped && (fired === null || OUTPUTS.indexOf(o) <= OUTPUTS.indexOf(fired))
                  return (
                    <li key={o}>
                      <button className={`auto__out ${lit ? 'is-on' : ''}`} onClick={() => drive(o)}
                        aria-pressed={lit} aria-label={`${o} output ${lit ? 'active' : 'idle'} - activate to test`}>
                        <OutIcon name={o} on={lit} />
                        <div className="auto__out-meta">
                          <span className="auto__out-name">{o}</span>
                          <span className="auto__out-state">{lit ? 'ON' : 'OFF'}</span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="auto__card-foot">
              <Status state={tripped ? 'ok' : 'idle'}>
                {tripped ? 'field actuators energized' : 'field outputs standby'}
              </Status>
            </div>
          </div>
        </div>
        <p className="small auto__note">Illustrative control loop - sensor state drives the controller, the controller drives machine outputs. Select any output to force it and watch the loop respond.</p>
      </div>
    </Section>
  )
}
