import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { nav, contacts } from '../data/site'

export default function Header({ page, setPage }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (id) => { setPage(id); setOpen(false) }

  return (
    <header className="header">
      <button className="brand" onClick={() => go('home')}>
        <span className="brand-mark">гр</span>
        <span><b>Города и реки</b><small>онлайн-турагентство</small></span>
      </button>

      <nav className="nav">
        {nav.map(item => (
          <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}>
            {page === item.id && <motion.i layoutId="activeNav" />}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="header-cta" onClick={() => setPage('contacts')}>Запрос</button>

      <button
        className="nav-toggle"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(v => !v)}
      >
        <span className={open ? 'is-open' : ''} aria-hidden="true" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="menu-scrim"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              id="mobile-menu"
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Меню навигации"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mobile-menu-label">Навигация</p>
              <nav className="mobile-nav">
                {nav.map(item => (
                  <button
                    key={item.id}
                    className={page === item.id ? 'active' : ''}
                    onClick={() => go(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <a className="btn light mobile-menu-cta" href={contacts.whatsapp}>Написать в WhatsApp</a>
              <button className="btn ghost mobile-menu-cta" onClick={() => go('contacts')}>Оставить запрос</button>
            </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  )
}
