import React from 'react'
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
import { routeByPath, routeById } from './lib/router'

const PAGES = { home: Home, olga: Olga, trips: Trips, process: Process, trust: Trust, corporate: Corporate, contacts: Contacts, oferta: Legal, privacy: Legal }

// url — используется при пререндере (сборке). На клиенте берётся из location.
export default function App({ url }) {
  const { route, found } = url ? routeByPath(url) : { route: routeById('home'), found: true }
  const id = found ? route.id : 'notfound'
  const Page = PAGES[id] || NotFound
  const active = found ? route : routeById('home')

  return (
    <div className={`site page-${id}`}>
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
