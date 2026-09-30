import React, { useEffect, useState } from 'react'
import { site } from '../data/site'

export default function CookieNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('gr_cookie_ok')) setShow(true)
    } catch {}
  }, [])

  if (!show) return null

  const accept = () => {
    try { localStorage.setItem('gr_cookie_ok', '1') } catch {}
    setShow(false)
  }

  return (
    <div className="cookie-notice" role="dialog" aria-label="Использование cookie">
      <p>
        Мы используем cookie и обезличенную статистику, чтобы сайт работал корректно и был удобнее.
        Подробнее — в <a href="/politika-konfidencialnosti/">политике обработки персональных данных</a>.
      </p>
      <button className="btn light" onClick={accept}>Понятно</button>
    </div>
  )
}
