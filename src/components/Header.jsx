import React from 'react'
import { motion } from 'framer-motion'
import { nav } from '../data/site'

export default function Header({ page, setPage }) {
  return (
    <header className="header">
      <button className="brand" onClick={() => setPage('home')}>
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
    </header>
  )
}
