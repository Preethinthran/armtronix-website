import { useEffect, useState } from 'react'
import { nav } from '../data/site'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 24)

      // Top of page (Hero section) -> clear active link
      if (scrollY < 180) {
        setActive('')
        return
      }

      // Reached bottom of page -> activate last link (Contact)
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        const last = nav[nav.length - 1]
        if (last) setActive(last.href.slice(1))
        return
      }

      // Check sections in chronological page order
      // Fixed navbar is ~72px, trigger threshold at 130px ensures seamless transition
      const trigger = scrollY + 130
      const items = nav.map((l) => ({
        id: l.href.slice(1),
        el: document.getElementById(l.href.slice(1)),
      })).filter((item) => item.el !== null)

      let currentId = ''
      for (let i = 0; i < items.length; i++) {
        if (items[i].el.offsetTop <= trigger) {
          currentId = items[i].id
        } else {
          break
        }
      }

      setActive(currentId)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const handleNavClick = (id) => {
    setOpen(false)
    setActive(id)
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner">
        <a className="brand" href="#top" aria-label="Armtronix home" onClick={() => { setOpen(false); setActive('') }}>
          <span className="brand__mark" aria-hidden="true">A</span>
          ARMTRONIX
        </a>
        <nav aria-label="Primary">
          {nav.map((l) => {
            const id = l.href.slice(1)
            return (
              <a key={l.href} href={l.href} onClick={() => handleNavClick(id)}
                className={active === id ? 'is-active' : ''}
                aria-current={active === id ? 'true' : undefined}>
                {l.label}
              </a>
            )
          })}
        </nav>
        <div className="nav__actions">
          <a className="btn btn--primary btn--sm" href="#contact" onClick={() => handleNavClick('contact')}>
            <span className="nav__cta-full">Talk to an engineer</span>
            <span className="nav__cta-short" aria-hidden="true">Contact →</span>
          </a>
          <button className="nav__toggle" aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
