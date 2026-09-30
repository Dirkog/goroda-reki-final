import React from 'react'

// Страницы больше не прячутся за JS-анимацией: контент виден сразу,
// появление — лёгкая CSS-анимация (и она отключается при prefers-reduced-motion).
export function Page({ children, className = '' }) {
  return <section className={`page ${className}`}>{children}</section>
}

export function SplitTitle({ eyebrow, title, text }) {
  return (
    <div className="split-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      {text && <p className="split-title-text">{text}</p>}
    </div>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      {items.map((it, i) => (
        <span key={it.label}>
          {it.path ? <a href={it.path}>{it.label}</a> : <b>{it.label}</b>}
          {i < items.length - 1 && <i aria-hidden="true">/</i>}
        </span>
      ))}
    </nav>
  )
}
