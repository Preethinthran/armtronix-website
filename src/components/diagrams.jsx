import './diagrams.css'

/* Shared frame: blueprint grid + coordinates + crosshair markers. */
export function DiagramFrame({ children, label, viewBox = '0 0 400 240', ratio = '400 / 240' }) {
  return (
    <figure className="dg" style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <svg className="dg__grid" viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="dg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" className="dg__gridline" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="400" height="240" fill="url(#dg-grid)" />
      </svg>
      <svg className="dg__art" viewBox={viewBox} aria-hidden="true">
        {children}
      </svg>
      <span className="dg__cross dg__cross--tl" aria-hidden="true" />
      <span className="dg__cross dg__cross--tr" aria-hidden="true" />
      <span className="dg__cross dg__cross--bl" aria-hidden="true" />
      <span className="dg__cross dg__cross--br" aria-hidden="true" />
    </figure>
  )
}

const L = 'rgba(8,20,38,0.45)'
const B = 'var(--primary-hover)'
const TXT = { fontSize: 10, letterSpacing: '0.14em', fill: 'rgba(8,20,38,0.6)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }

/* 02 Engineering: power / cooling / M&E converging on the facility. */
export function SystemDiagram() {
  return (
    <DiagramFrame label="Engineering systems converging on the facility">
      <g stroke={L} strokeWidth="1.25" fill="none">
        <line x1="20" y1="60" x2="240" y2="60" />
        <line x1="20" y1="120" x2="240" y2="120" className="dg__flow" stroke={B} />
        <line x1="20" y1="180" x2="240" y2="180" />
        <line x1="240" y1="60" x2="240" y2="180" />
        <line x1="240" y1="120" x2="330" y2="120" stroke={B} strokeWidth="1.5" />
      </g>
      <g fill={B}>
        <circle cx="20" cy="60" r="3" />
        <circle cx="20" cy="120" r="3" />
        <circle cx="20" cy="180" r="3" />
        <circle cx="240" cy="120" r="3.5" fill="#fff" stroke={B} strokeWidth="1.5" />
      </g>
      <g {...TXT}>
        <text x="30" y="52">POWER</text>
        <text x="30" y="112">COOLING</text>
        <text x="30" y="172">M&amp;E</text>
        <text x="252" y="112" fill={B}>FACILITY</text>
      </g>
      <rect x="248" y="96" width="120" height="48" fill="none" stroke={B} strokeWidth="1" strokeDasharray="4 3" />
    </DiagramFrame>
  )
}

/* 03 Transmission: meshed network with capacity annotation. */
export function NetworkDiagram() {
  const nodes = [[60, 70], [200, 70], [340, 70], [60, 170], [200, 170], [340, 170]]
  return (
    <DiagramFrame label="Transmission network topology">
      <g stroke={L} strokeWidth="1.25">
        <line x1="60" y1="70" x2="340" y2="70" />
        <line x1="60" y1="170" x2="340" y2="170" />
        <line x1="60" y1="70" x2="60" y2="170" />
        <line x1="200" y1="70" x2="200" y2="170" className="dg__flow" stroke={B} />
        <line x1="340" y1="70" x2="340" y2="170" />
      </g>
      <g>
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={i === 4 ? B : '#fff'} stroke={i === 4 ? B : L} strokeWidth="1.5" />
        ))}
      </g>
      <g {...TXT}>
        <text x="60" y="45">DATA</text>
        <text x="200" y="45" fill={B}>POWER</text>
        <text x="340" y="45" textAnchor="end">FIBER</text>
        <text x="200" y="205" textAnchor="middle">HIGH CAPACITY - UP TO 400G</text>
      </g>
    </DiagramFrame>
  )
}

/* 04 Technologies: sensors → data → intelligence → automation. */
export function DataFlowDiagram() {
  const rows = ['SENSORS', 'DATA', 'INTELLIGENCE', 'AUTOMATION']
  return (
    <DiagramFrame label="Intelligence data flow">
      <line x1="200" y1="30" x2="200" y2="210" stroke={L} strokeWidth="1.25" />
      {rows.map((r, i) => {
        const y = 40 + i * 52
        const last = i === rows.length - 1
        return (
          <g key={r}>
            <circle cx="200" cy={y} r="4" fill={last ? B : '#fff'} stroke={last ? B : L} strokeWidth="1.5" />
            <text x="216" y={y + 4} fontSize="10" letterSpacing="0.14em" fontFamily="Inter, sans-serif" fontWeight="500" fill={last ? B : 'rgba(8,20,38,0.6)'}>
              {r}
            </text>
            {i < rows.length - 1 && (
              <path d={`M200 ${y + 10} V${y + 34}`} stroke={B} strokeWidth="1.25" className="dg__flow" strokeDasharray="3 3" markerEnd="url(#dg-arrow)" />
            )}
          </g>
        )
      })}
      <defs>
        <marker id="dg-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill={B} />
        </marker>
      </defs>
      <g fontSize="9" letterSpacing="0.12em" fontFamily="Inter, sans-serif" fill="rgba(8,20,38,0.45)">
        <text x="24" y="36">TELEMETRY ● LIVE</text>
        <text x="24" y="216">60% FASTER - AUTOMATED OPS</text>
      </g>
    </DiagramFrame>
  )
}

/* Engineered intelligence: structure / energy / network → data → intelligence → automation. */
export function IntelligenceDiagram() {
  return (
    <DiagramFrame label="Engineered intelligence system diagram" viewBox="0 0 440 260" ratio="440 / 260">
      <g stroke={L} strokeWidth="1.25" fill="none">
        <line x1="70" y1="40" x2="70" y2="110" />
        <line x1="220" y1="40" x2="220" y2="110" className="dg__flow" stroke={B} />
        <line x1="370" y1="40" x2="370" y2="110" />
        <line x1="70" y1="110" x2="370" y2="110" />
        <line x1="220" y1="110" x2="220" y2="150" stroke={B} />
        <line x1="220" y1="196" x2="220" y2="236" stroke={B} />
      </g>
      <g>
        {[[70, 110], [370, 110]].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r="3.5" fill="#fff" stroke={L} strokeWidth="1.5" />
        ))}
        <circle cx="220" cy="110" r="4" fill={B} />
      </g>
      <g fontSize="10" letterSpacing="0.14em" fontFamily="Inter, sans-serif" fontWeight="500" fill="rgba(8,20,38,0.6)" textAnchor="middle">
        <text x="70" y="28">STRUCTURE</text>
        <text x="220" y="28" fill={B}>ENERGY</text>
        <text x="370" y="28">NETWORK</text>
        <text x="220" y="140">DATA LAYER</text>
      </g>
      <rect x="140" y="150" width="160" height="46" fill="none" stroke={B} strokeWidth="1.25" />
      <text x="220" y="178" textAnchor="middle" fontSize="11" letterSpacing="0.18em" fontFamily="Inter, sans-serif" fontWeight="600" fill={B}>
        INTELLIGENCE
      </text>
      <text x="220" y="252" textAnchor="middle" fontSize="10" letterSpacing="0.18em" fontFamily="Inter, sans-serif" fontWeight="500" fill="rgba(8,20,38,0.6)">
        AUTOMATION
      </text>
    </DiagramFrame>
  )
}

/* Delivery stage visual: 5 nodes, active highlighted with coordinates. */
export function DeliveryViz({ stages, active }) {
  const n = stages.length
  const x = (i) => 30 + (i * 340) / (n - 1)
  return (
    <DiagramFrame label={`Delivery progress: stage ${active + 1} of ${n}`}>
      <line x1="30" y1="120" x2="370" y2="120" stroke={L} strokeWidth="1.25" />
      <line x1="30" y1="120" x2={x(active)} y2="120" stroke={B} strokeWidth="2" className="dg__draw" />
      {stages.map((s, i) => (
        <g key={s}>
          <circle
            cx={x(i)} cy="120" r={i === active ? 7 : 4.5}
            fill={i === active ? B : i < active ? '#fff' : '#fff'}
            stroke={i <= active ? B : L}
            strokeWidth={i === active ? 2 : 1.5}
          />
          {i === active && <circle cx={x(i)} cy="120" r="12" fill="none" stroke={B} strokeWidth="1" opacity="0.35" />}
          <text
            x={x(i)} y="160" textAnchor="middle" fontSize="9" letterSpacing="0.12em"
            fontFamily="Inter, sans-serif" fontWeight={i === active ? 600 : 500}
            fill={i === active ? B : 'rgba(8,20,38,0.55)'}
          >
            {s.toUpperCase()}
          </text>
          <text x={x(i)} y="80" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fill="rgba(8,20,38,0.4)">
            0{i + 1}
          </text>
        </g>
      ))}
      <text x="30" y="210" fontSize="9" letterSpacing="0.12em" fontFamily="Inter, sans-serif" fill="rgba(8,20,38,0.45)">
        STAGE {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} - {stages[active].toUpperCase()}
      </text>
      <text x="370" y="210" textAnchor="end" fontSize="9" letterSpacing="0.12em" fontFamily="Inter, sans-serif" fill="rgba(8,20,38,0.45)">
        X:{Math.round((x(active) / 400) * 1000)} · Y:120
      </text>
    </DiagramFrame>
  )
}
