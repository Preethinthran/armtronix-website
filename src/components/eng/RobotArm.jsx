import { Svg, G, Txt, Wire, Motor } from './Symbols'

/* ------------------------------------------------------------
   RobotArm: Kinematics & Reusable 2-Axis Articulated Arm Graphic
   Shared between TechnologyExplorer (Fig 03) and ApplicationExplorer (App 06)
   ------------------------------------------------------------ */

export const S_BASE = { x: 150, y: 215 }
export const L1 = 125
export const L2 = 105
export const PA = { x: 250, y: 128 }
export const PB = { x: 330, y: 212 }

export const deg = (r) => (r * 180) / Math.PI
export const rad = (d) => (d * Math.PI) / 180
export const fmt = (v) => `${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(1).padStart(5, '0')}°`

/* 2-DOF planar inverse kinematics solver */
export function solveArm(t) {
  const u = 0.5 - 0.5 * Math.cos(t * 0.9)
  const w = { x: PA.x + (PB.x - PA.x) * u, y: PA.y + (PB.y - PA.y) * u }
  const wx = w.x - S_BASE.x
  const wy = S_BASE.y - w.y
  const c = Math.max(-1, Math.min(1, (wx * wx + wy * wy - L1 * L1 - L2 * L2) / (2 * L1 * L2)))
  const q2 = -Math.acos(c)
  const q1 = Math.atan2(wy, wx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2))
  const e = { x: S_BASE.x + L1 * Math.cos(q1), y: S_BASE.y - L1 * Math.sin(q1) }
  return { u, w, e, q1, q2 }
}

export function Link({ from, ang, len, r0 = 12 }) {
  return (
    <g transform={`translate(${from.x} ${from.y}) rotate(${-deg(ang)})`}>
      <rect x="0" y="-8" width={len} height="16" rx="8" className="eg-b on" />
      <path d={`M${r0 + 4} 0 H${len - r0 - 4}`} className="eg-w thin" />
    </g>
  )
}

export function Encoder({ at, ang, r, n }) {
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${-deg(ang)})`} aria-hidden="true">
      <circle r={r} className="eg-w thin" style={{ opacity: 0.6 }} />
      {Array.from({ length: n }).map((_, i) => (
        <path key={i} d={`M${r} 0 h${i % 4 === 0 ? 4.5 : 2.5}`} transform={`rotate(${(360 / n) * i})`} className="eg-w thin on" />
      ))}
    </g>
  )
}

/* Reusable 2-Axis Robot Arm Drawing Assembly */
export function RobotArmGraphic({
  t = 2.78,
  transform,
  showConveyor = true,
  showTrajectory = true,
  showAngles = true,
}) {
  const { u, w, e, q1, q2 } = solveArm(t)
  const ang2 = q1 + q2
  const open = 10 - 5 * u * u * (3 - 2 * u)
  const a1sweep = q1 > 0 ? 0 : 1
  const R1 = 36
  const R2 = 28
  const ext = { x: e.x + 40 * Math.cos(q1), y: e.y - 40 * Math.sin(q1) }
  const lab1 = { x: S_BASE.x + 52 * Math.cos(q1 / 2), y: S_BASE.y - 52 * Math.sin(q1 / 2) + 3 }
  const lab2 = { x: e.x + 44 * Math.cos(q1 + q2 / 2), y: e.y - 44 * Math.sin(q1 + q2 / 2) + 3 }

  return (
    <g transform={transform}>
      {/* Floor, base pedestal */}
      <path d="M40 276 H480" className="eg-w" />
      <rect x="132" y="231" width="36" height="39" className="eg-b deep" />
      <rect x="104" y="270" width="92" height="6" className="eg-b" />
      <circle cx="112" cy="273" r="1.6" className="eg-hole" />
      <circle cx="188" cy="273" r="1.6" className="eg-hole" />

      {/* Conveyor & Workpiece */}
      {showConveyor && (
        <>
          <rect x="282" y="264" width="190" height="12" rx="2" className="eg-b deep" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={294 + i * 21} cy="270" r="3" className="eg-w thin" />
          ))}
          <rect x="318" y="240" width="24" height="24" rx="2" className="eg-b" />
          <path d="M318 248 H342" className="eg-w thin" />
        </>
      )}

      {/* Reach envelope + programmed toolpath */}
      {showTrajectory && (
        <>
          <path d="M350 215 A200 200 0 0 0 265 51" className="eg-w thin dash" style={{ opacity: 0.45 }} />
          <path d={`M${PA.x} ${PA.y} L${PB.x} ${PB.y}`} className="eg-w thin dash on" />
          {[PA, PB].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" className="eg-w thin on" />
              <path d={`M${p.x - 7} ${p.y} H${p.x + 7} M${p.x} ${p.y - 7} V${p.y + 7}`} className="eg-w thin on" />
            </g>
          ))}
        </>
      )}

      {/* Angle construction lines & arcs */}
      {showAngles && (
        <>
          <path d={`M${S_BASE.x} ${S_BASE.y} H${S_BASE.x + 44}`} className="eg-w thin dash" />
          <path
            d={`M${S_BASE.x + R1} ${S_BASE.y} A${R1} ${R1} 0 0 ${a1sweep} ${S_BASE.x + R1 * Math.cos(q1)} ${S_BASE.y - R1 * Math.sin(q1)}`}
            className="eg-w thin hot"
          />
          <Txt x={lab1.x} y={lab1.y} cls="sm hot">A1</Txt>
          <path d={`M${e.x} ${e.y} L${ext.x} ${ext.y}`} className="eg-w thin dash" />
          <path
            d={`M${e.x + R2 * Math.cos(q1)} ${e.y - R2 * Math.sin(q1)} A${R2} ${R2} 0 0 1 ${e.x + R2 * Math.cos(ang2)} ${e.y - R2 * Math.sin(ang2)}`}
            className="eg-w thin hot"
          />
          <Txt x={lab2.x} y={lab2.y} cls="sm hot">A2</Txt>
        </>
      )}

      {/* Links, servo joints, encoder rings */}
      <Link from={S_BASE} ang={q1} len={L1} />
      <Link from={e} ang={ang2} len={L2} r0={10} />
      <Encoder at={S_BASE} ang={q1} r={21} n={32} />
      <Encoder at={e} ang={ang2} r={17} n={24} />
      <Motor x={S_BASE.x} y={S_BASE.y} on label="M1" phase="SERVO" r={16} />
      <Motor x={e.x} y={e.y} on label="M2" phase="" r={13} />

      {/* Wrist + gripper (stays vertical) */}
      <g transform={`translate(${w.x} ${w.y})`}>
        <circle r="6" className="eg-b on" />
        <rect x="-2.5" y="5" width="5" height="8" className="eg-b deep" />
        <path d={`M${-open - 4} 13 H${open + 4}`} className="eg-w thick on" />
        <path d={`M${-open} 13 V27 M${open} 13 V27`} className="eg-w thick on" />
        <path d={`M${-open} 27 h3 M${open} 27 h-3`} className="eg-w thick on" />
      </g>
    </g>
  )
}
