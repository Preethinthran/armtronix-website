import './primitives.css'

export function Section({ id, label, index, title, lede, children, alt = false, wide = false }) {
  return (
    <section className={`section${alt ? ' section--alt' : ''}`} id={id} aria-label={title}>
      <div className="wrap">
        <p className="shead__label"><b>{index}</b> - {label}</p>
        <h2 className="h-lg">{title}</h2>
        {lede ? <p className="shead__lede">{lede}</p> : null}
        <div className="sec__body">{children}</div>
      </div>
      <div className="techgrid" aria-hidden="true" />
    </section>
  )
}

export function Status({ state = 'ok', children }) {
  return (
    <span className={`status status--${state}`}>
      <i aria-hidden="true" />{children}
    </span>
  )
}

export function Tlabel({ children }) {
  return <p className="tlabel">{children}</p>
}
