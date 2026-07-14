import React from 'react'
import { motion } from 'framer-motion'

export function Page({ children, className = '' }) {
  return (
    <motion.section
      className={`page ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  )
}

export function SplitTitle({ eyebrow, title, text }) {
  return (
    <div className="split-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {text && <p>{text}</p>}
    </div>
  )
}
