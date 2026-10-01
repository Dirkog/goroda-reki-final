import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render(url) {
  return renderToString(<App url={url} />)
}

// Данные для сборки (пререндер) — Node их читает напрямую из собранного SSR-бандла.
export { routes, site, faq, tripCards, contacts, events, eventsUpdated } from './data/site'
export { headFor, canonicalUrl, basePath } from './lib/head'
