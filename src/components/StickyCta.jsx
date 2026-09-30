import React, { useEffect, useState } from 'react'
import { contacts, site, waText } from '../data/site'
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
      <a className="sticky-cta-main" href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, взрослых ___, детей ___.')} onClick={() => track('click_whatsapp_sticky')}>
        <span className="sticky-cta-icon" aria-hidden="true">✆</span>
        <span><b>Подобрать тур</b><small>ответим за 15 минут</small></span>
      </a>
      <a className="sticky-cta-alt" href={contacts.telegram} onClick={() => track('click_telegram_sticky')} aria-label="Написать в Telegram">TG</a>
      <a className="sticky-cta-alt" href={site.phoneHref} onClick={() => track('click_phone_sticky')} aria-label={`Позвонить ${site.phone}`}>☎</a>
      <button className="sticky-cta-close" aria-label="Скрыть панель" onClick={() => { setClosed(true); try { sessionStorage.setItem('gr_cta_closed', '1') } catch {} }}>×</button>
    </div>
  )
}
