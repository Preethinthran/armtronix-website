export default function SectionHeader({ eyebrow, title, lede }) {
  return (
    <div className="shead">
      <p className="shead__eyebrow">{eyebrow}</p>
      <h2 className="shead__title">{title}</h2>
      {lede ? <p className="shead__lede">{lede}</p> : null}
    </div>
  )
}
