import { Svg, Txt, Via, IC } from '../components/eng/Symbols'
import './Footer.css'

const PINS = [49, 63, 77, 91]
const TRACES = PINS.map((pinY, i) => {
  const y0 = 22 + i * 14
  return `M0 ${y0} H520 L${520 + (pinY - y0)} ${pinY} H858`
})

export default function Footer() {
  return (
    <>
      <section className="final" id="final" aria-label="Final call to action">
        <Svg viewBox="0 0 1200 140" className="final__circuit" preserveAspectRatio="xMaxYMax slice">
          {TRACES.map((d, i) => (
            <g key={i}>
              <path d={d} className={`eg-cu ${i % 2 ? 'dim' : 'on'}`} />
              <Via x={150 + i * 46} y={22 + i * 14} dim={i % 2 === 1} />
            </g>
          ))}
          {PINS.map((y, i) => <path key={`o${i}`} d={`M942 ${y} H1040`} className="eg-cu dim" />)}
          {PINS.map((y, i) => <circle key={`c${i}`} cx="1048" cy={y} r="5" className="eg-pad" />)}
          <IC x={900} y={70} w={70} h={70} pins={4} on label="MCU" />
          <Txt x="1060" y="130" cls="sm dim">J1 · I/O</Txt>
        </Svg>
        <div className="wrap final__inner">
          <p className="shead__label"><b>09</b> - Final</p>
          <h2 className="h-xl final__title">Have a machine, process or system to automate?</h2>
          <p className="lede">Let&apos;s engineer the connection between your physical systems and digital intelligence.</p>
          <div className="final__cta">
            <a className="btn btn--primary" href="#contact">Talk to an engineer <span className="arr" aria-hidden="true">→</span></a>
            <a className="btn btn--ghost" href="#contact">Request a solution <span className="arr" aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>
      <footer className="site" aria-label="Footer">
        <div className="wrap foot">
          <div className="foot__brand">
            <a className="brand" href="#top" aria-label="Armtronix home">
              <span className="brand__mark" aria-hidden="true">A</span>
              ARMTRONIX
            </a>
            <p className="small">Industrial IoT · Automation controllers · Robotics · Sensor interfaces · PLCs · Industry 4.0</p>
          </div>
          <nav className="foot__nav" aria-label="Footer">
            <a href="#hardware">Hardware</a>
            <a href="#intelligence">Intelligence</a>
            <a href="#solutions">Solutions</a>
            <a href="#technology">Technology</a>
            <a href="#applications">Applications</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="wrap foot__base">
          <span className="small">Armtronix concept site - telemetry shown is an illustrative simulation, not operational data.</span>
          <a href="#top" className="small foot__top">Back to top ↑</a>
        </div>
      </footer>
    </>
  )
}
