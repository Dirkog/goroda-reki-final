import React, { useEffect, useRef, useState } from 'react'
import { nav, contacts, site, waText } from '../data/site'
import { track } from '../lib/analytics'

export default function Header({ page }) {
  const [open, setOpen] = useState(false)
  // На главной шапка лежит поверх кинематографического кадра и «проявляется»
  // в плотную строку после прокрутки.
  const [solid, setSolid] = useState(page !== 'home')
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setSolid(page !== 'home' || window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [page])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll('a[href], button:not([disabled])')
        if (!focusables.length) return
        const first = focusables[0], last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    const t = setTimeout(() => panelRef.current?.querySelector('a, button')?.focus(), 60)
    document.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <header className={`header ${solid ? 'is-solid' : 'is-transparent'}`}>
      <a className="brand" href="/" aria-label="Личный турагент Ольга Дударева — на главную">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="26" height="26" fill="none">
            <path d="M5 40c6-8 13-8 19 0s13 8 19 0 9-6 16 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M5 51c6-8 13-8 19 0s13 8 19 0 9-6 16 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".6" />
            <path d="M21 12h12l6 11h8v11H21z" fill="currentColor" />
            <rect x="26" y="29" width="6" height="6" fill="var(--paper)" />
            <rect x="36" y="29" width="6" height="6" fill="var(--paper)" />
          </svg>
        </span>
        <span><b>Личный турагент</b></span>
      </a>

      <nav className="nav" aria-label="Основная навигация">
        {nav.map(item => (
          <a key={item.id} href={item.path} className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined}>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className="header-cta" href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'header' })}>Написать</a>

      <button
        ref={toggleRef}
        className="nav-toggle"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(v => !v)}
      >
        <span className={open ? 'is-open' : ''} aria-hidden="true" />
      </button>

      <div className={`mobile-wrap ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="menu-scrim" onClick={() => setOpen(false)} />
        <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Меню навигации" ref={panelRef}>
          <p className="mobile-menu-label">Навигация</p>
          <nav className="mobile-nav">
            {nav.map(item => (
              <a key={item.id} href={item.path} className={page === item.id ? 'active' : ''} onClick={() => setOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <div className="mobile-menu-contacts">
            <a className="btn light mobile-menu-cta" href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'menu' })}>Написать в Telegram</a>
            <a className="btn ghost mobile-menu-cta" href={waText('Здравствуйте! Хочу подобрать тур.')} onClick={() => track('click_whatsapp', { place: 'menu' })}>WhatsApp</a>
            <a className="mobile-menu-phone" href={site.phoneHref}>{site.phone}</a>
            <p className="mobile-menu-hours">{site.workHours}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
