import Reveal from '../components/Reveal'
import './TrustStrip.css'

const NODES = ['Foundation', 'Systemization', 'Connectivity', 'Intelligence']

export default function TrustStrip() {
  return (
    <section className="section section--tight glance" aria-label="Positioning">
      <Reveal className="wrap glance__wrap">
        <p className="glance__statement">Four divisions. One integrated lifecycle.</p>
        <ol className="glance__flow" aria-label="Lifecycle: Foundation to Intelligence">
          {NODES.map((n, i) => (
            <li key={n}>
              {i > 0 && <span className="glance__arrow" aria-hidden="true">→</span>}
              <span>{n}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
