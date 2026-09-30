import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import StickyCta from './components/StickyCta'
import CookieNotice from './components/CookieNotice'
import Home from './pages/Home'
import Olga from './pages/Olga'
import Trips from './pages/Trips'
import Process from './pages/Process'
import Trust from './pages/Trust'
import Corporate from './pages/Corporate'
import Contacts from './pages/Contacts'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import { normalize, routeByPath } from './lib/router'
import { applyMeta } from './lib/seo'
import { track } from './lib/analytics'
import { metrikaHit } from './lib/metrika'

const PAGES = { home: Home, olga: Olga, trips: Trips, process: Process, trust: Trust, corporate: Corporate, contacts: Contacts, oferta: Legal, privacy: Legal }

const NOT_FOUND = {
  id: 'notfound', path: '/404', label: 'Страница не найдена',
  title: 'Страница не найдена — Личный турагент',
  description: 'Такой страницы нет. Вернитесь на главную или напишите нам — подберём тур.',
  noindex: true
}

// url передаётся только при пререндере (сборке). В браузере маршрут берётся из адреса.
export default function App({ url }) {
  const [current, setCurrent] = useState(() => url || (typeof window !== 'undefined' ? normalize(window.location.pathname) : '/'))
  const first = React.useRef(!url)

  useEffect(() => {
    if (url) return // при пререндере слушатели не нужны
    const onPop = () => setCurrent(normalize(window.location.pathname))
    window.addEventListener('popstate', onPop)
    window.addEventListener('gr:navigate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('gr:navigate', onPop)
    }
  }, [url])

  const { route, found } = routeByPath(current)
  const active = found ? route : NOT_FOUND
  const Page = PAGES[active.id] || NotFound

  useEffect(() => {
    if (url || typeof document === 'undefined') return
    applyMeta(active)
    if (first.current) {
      first.current = false
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
      // каждый переход внутри сайта — отдельный просмотр для Метрики
      metrikaHit(window.location.href, active.title || document.title)
    }
  }, [current, url])

  return (
    <div className={`site page-${active.id}`}>
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <Header page={active.id} />
      <main id="main">
        <Page route={active} />
      </main>
      <Footer />
      <StickyCta />
      <CookieNotice />
    </div>
  )
}
