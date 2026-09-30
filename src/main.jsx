import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { applyMeta } from './lib/seo'
import { migrateLegacyHash, navigate, normalize, routeByPath, withBase } from './lib/router'
import { site } from './data/site'
import { track } from './lib/analytics'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { console.error('[Города и реки] ошибка рендера:', error) }
  render() {
    if (this.state.error) {
      return (
        <div className="fatal-error">
          <h1>Страница не загрузилась</h1>
          <p>Обновите страницу или напишите нам в WhatsApp — мы поможем с подбором тура.</p>
          <a className="btn light" href="https://wa.me/79150547407">Написать в WhatsApp</a>
        </div>
      )
    }
    return this.props.children
  }
}

function currentUrl() {
  return normalize(window.location.pathname)
}

function render() {
  const el = document.getElementById('root')
  const app = (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
  if (el.hasChildNodes()) hydrateRoot(el, app)
  else createRoot(el).render(app)
}

function syncMeta() {
  const { route, found } = routeByPath(currentUrl())
  applyMeta(found ? route : { id: 'notfound', title: 'Страница не найдена — Города и реки', description: 'Такой страницы нет. Вернитесь на главную или напишите нам — подберём тур.', path: '/404', noindex: true })
}

function onNavigate(path, { replace = false } = {}) {
  if (replace) window.history.replaceState(null, '', path)
  render()
  syncMeta()
  window.scrollTo({ top: 0, behavior: 'auto' })
  track('page_view', { path })
}

// Перехват внутренних ссылок: работают и обычные <a href>, и кнопки с data-route
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]')
  const btn = e.target.closest && e.target.closest('[data-route]')
  if (btn && !a) {
    e.preventDefault()
    navigate(btn.getAttribute('data-route'))
    return
  }
  if (!a) return
  const href = a.getAttribute('href')
  if (!href || a.target === '_blank' || a.hasAttribute('download')) return
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return
  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return
  e.preventDefault()
  const target = normalize(url.pathname)
  if (target === currentUrl()) return
  onNavigate(url.pathname)
})

window.addEventListener('popstate', () => { render(); syncMeta() })

// Первый запуск: чиним старые #/ссылки и сохраняем UTM-метки сессии
migrateLegacyHash()
try {
  const utm = new URLSearchParams(window.location.search)
  if ([...utm.keys()].some(k => k.startsWith('utm_') || k === 'yclid' || k === 'gclid')) {
    sessionStorage.setItem('gr_utm', window.location.search)
  }
} catch {}
render()
syncMeta()
track('page_view', { path: currentUrl() })

// Аналитика грузится лениво, чтобы не мешать отрисовке
if (site.metrikaId) import('./lib/metrika.js').then(m => m.initMetrika(site.metrikaId))
