import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { migrateLegacyHash, navigate } from './lib/router'
import { site } from './data/site'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { console.error('[Города и реки] ошибка рендера:', error) }
  render() {
    if (this.state.error) {
      return (
        <div className="fatal-error">
          <h1>Страница не загрузилась</h1>
          <p>Обновите страницу или напишите нам в WhatsApp — поможем с подбором тура.</p>
          <a className="btn light" href="https://wa.me/79150547407">Написать в WhatsApp</a>
        </div>
      )
    }
    return this.props.children
  }
}

// Перехват внутренних ссылок: переход без перезагрузки, но с реальными URL.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const el = e.target.closest && e.target.closest('a[href], [data-route]')
  if (!el) return

  if (el.hasAttribute('data-route')) {
    e.preventDefault()
    navigate(el.getAttribute('data-route'))
    return
  }
  const href = el.getAttribute('href') || ''
  if (!href || el.target === '_blank' || el.hasAttribute('download') || href.startsWith('#')) return
  if (/^(https?:|mailto:|tel:)/.test(href)) return
  const url = new URL(el.href, window.location.href)
  if (url.origin !== window.location.origin) return

  e.preventDefault()
  if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
    window.history.pushState(null, '', url.pathname + url.search + url.hash)
    window.dispatchEvent(new Event('gr:navigate'))
  }
})

// Старые ссылки вида #/trips → нормальный путь + UTM-метки сессии
migrateLegacyHash()
try {
  const utm = new URLSearchParams(window.location.search)
  if ([...utm.keys()].some(k => k.startsWith('utm_') || k === 'yclid' || k === 'gclid')) {
    sessionStorage.setItem('gr_utm', window.location.search)
  }
} catch {}

const el = document.getElementById('root')
const app = <ErrorBoundary><App /></ErrorBoundary>
if (el.hasChildNodes()) hydrateRoot(el, app)
else createRoot(el).render(app)

// Аналитика подключается лениво и только если задан счётчик
if (site.metrikaId) import('./lib/metrika.js').then(m => m.initMetrika(site.metrikaId))
