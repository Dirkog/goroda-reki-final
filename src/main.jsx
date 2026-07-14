import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import './styles.css'
import { nav } from './data/site'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Olga from './pages/Olga'
import Trips from './pages/Trips'
import Process from './pages/Process'
import Trust from './pages/Trust'
import Corporate from './pages/Corporate'
import Contacts from './pages/Contacts'

const pages = { home: Home, olga: Olga, trips: Trips, process: Process, trust: Trust, corporate: Corporate, contacts: Contacts }

function getPage() {
  const id = window.location.hash.replace('#/', '') || 'home'
  return nav.some(item => item.id === id) ? id : 'home'
}

function App() {
  const [page, setPageState] = useState(getPage)
  const Component = pages[page]
  const setPage = (id) => { setPageState(id); window.history.pushState(null, '', `#/${id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  useEffect(() => { const onPop = () => setPageState(getPage()); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop) }, [])

  return (
    <div className={`site page-${page}`}>
      <Header page={page} setPage={setPage} />
      <AnimatePresence mode="wait"><Component key={page} setPage={setPage} /></AnimatePresence>
      {page !== 'home' && <Footer setPage={setPage} />}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
