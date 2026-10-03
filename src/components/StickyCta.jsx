import React, { useEffect, useState } from 'react'
import { site, tgText } from '../data/site'
import { track } from '../lib/analytics'

// Липкая панель связи: главный источник заявок на мобильных.
// Появляется после первого экрана, не перекрывает контент, закрывается на сессию.
export default function StickyCta() {
  const [visible, setVisible] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    try { if (sessionStorage.getItem('gr_cta_closed') === '1') setClosed(true) } catch {}
    const onScroll = () => setVisible(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (closed) return null

  return (
    <div className={`sticky-cta ${visible ? 'is-visible' : ''}`} role="region" aria-label="Быстрая связь">
      <a className="sticky-cta-main" href={tgText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___.')} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'sticky' })}>
        <span className="sticky-cta-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4 3 11l6 2.2L11 20l3-4.5 4.5 3.3z"/><path d="m9 13.2 12-9.2"/></svg></span>
        <span><b>Написать</b><small>отвечу в рабочее время</small></span>
      </a>
      <a className="sticky-cta-alt" href={site.phoneHref} onClick={() => track('click_phone', { place: 'sticky' })} aria-label={`Позвонить ${site.phone}`}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>
      <button className="sticky-cta-close" aria-label="Скрыть панель" onClick={() => { setClosed(true); try { sessionStorage.setItem('gr_cta_closed', '1') } catch {} }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>
  )
}
