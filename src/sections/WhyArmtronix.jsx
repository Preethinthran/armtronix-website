import { useState } from 'react'
import { Section } from '../components/primitives'
import { Svg, Wire, Packet, Node, Fuse, Ground, CoilBox, Contact, IC } from '../components/eng/Symbols'
import { whyRows } from '../data/site'
import './WhyArmtronix.css'

const cx = (...a) => a.filter(Boolean).join(' ')

/* One small engineering glyph per statement (120x32). Dim at rest, copper-lit when the row is active. */
function Glyph({ i, on }) {
  return (
    <Svg viewBox="0 0 120 32" className={cx('whynew__glyph', on && 'is-on')}>
      {i === 0 && (
        <>
          <path d="M0 16 H34 M86 16 H120" className={cx('eg-cu', on ? 'on' : 'dim')} />
          <IC x={60} y={16} w={44} h={18} pins={5} kind="dual" pinLen={6} on={on} />
          <Node x={0} y={16} r={2} tone={on ? '' : 'off'} />
          <Node x={120} y={16} r={2} tone={on ? '' : 'off'} />
        </>
      )}
      {i === 1 && (
        <>
          <Wire d="M2 24 H118" on={on} thick />
          <path d="M2 18 V30 M118 18 V30" className={cx('eg-w', on && 'on')} />
          {[24, 60, 96].map((x) => (
            <g key={x}>
              <Wire d={`M${x} 24 V13`} on={on} />
              <rect x={x - 8} y="2" width="16" height="11" rx="2" className={cx('eg-b', on && 'on')} />
              <circle cx={x} cy="7.5" r="1.6" className={cx('eg-led', on && 'on')} />
              <Node x={x} y={24} r={2} tone={on ? '' : 'off'} />
            </g>
          ))}
          {on && <Packet d="M2 24 H118" dur={2} r={2} />}
        </>
      )}
      {i === 2 && (
        <>
          <Fuse x={30} y={10} len={48} on={on} />
          <Wire d="M54 10 H118" on={on} />
          <Wire d="M82 10 V17" on={on} />
          <Node x={82} y={10} r={2} tone={on ? '' : 'off'} />
          <Ground x={82} y={17} on={on} />
          <Node x={6} y={10} r={2} tone={on ? '' : 'off'} />
          <Node x={118} y={10} r={2} tone={on ? 'ok' : 'off'} />
        </>
      )}
      {i === 3 && (
        <>
          <Wire d="M0 16 H4" on={on} />
          <CoilBox x={26} y={16} rot={90} on={on} />
          <path d="M26 3 H92 M26 3 V8 M92 3 V8" className={cx('eg-w thin dash', on && 'on')} />
          <Contact x={92} y={16} rot={90} closed={on} on={on} />
          <Wire d="M114 16 H120" on={on} />
        </>
      )}
      {i === 4 && (
        <>
          <rect x="0" y="27" width="120" height="4" className="eg-b deep" />
          {[0, 1, 2, 3, 4].map((k) => {
            const live = on || k < 3
            return (
              <g key={k} style={{ opacity: live ? 1 : 0.28, transition: `opacity 0.4s ease ${k * 0.07}s` }}>
                <rect x={5 + k * 23} y="5" width="17" height="21" rx="2" className={cx('eg-b', on && 'on')} />
                <rect x={8 + k * 23} y="8" width="11" height="6" rx="1" className="eg-b deep" />
                <circle cx={13.5 + k * 23} cy="21" r="1.6" className={cx('eg-led', on && 'on', k === 2 && 'blink')} />
              </g>
            )
          })}
        </>
      )}
    </Svg>
  )
}

export default function WhyArmtronix() {
  const [active, setActive] = useState(0)

  return (
    <Section id="about" index="07" label="Why Armtronix"
      title="Engineered for the physical world.">
      <div className="whynew">
        {whyRows.map((w, i) => {
          const on = active === i
          return (
            <div key={w.statement} className={`whynew__row ${on ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <button className="whynew__head" onClick={() => setActive(i)}
                aria-expanded={on} aria-label={`${w.statement} - ${w.desc}`}>
                <span className="whynew__n">0{i + 1}</span>
                <span className="whynew__s">{w.statement}</span>
                <Glyph i={i} on={on} />
              </button>
              <p className={`whynew__desc ${on ? 'is-on' : ''}`}>{w.desc}</p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
