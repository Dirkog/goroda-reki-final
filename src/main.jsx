import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './fonts.css'
import './styles.css'
import App from './App'
import { migrateLegacyHash, navigate } from './lib/router'
import { contacts, site } from './data/site'

// --- самовосстановление: если страница не поднялась, пробуем один раз перезагрузить ---
// Правила, чтобы перезагрузка не превратилась в бесконечный цикл (так уже случалось):
//   1) повтор разрешён ровно один раз за сеанс и не чаще, чем раз в минуту;
//   2) метка попытки НЕ стирается в начале загрузки, а снимается только тогда,
//      когда страница прожила 12 секунд без единой ошибки — то есть действительно работает;
//   3) перезагружаемся только из-за сбоя скриптов (наш сайт), но никогда из-за
//      посторонних запросов: шрифты, метрика, чужой файл по ссылке.
const RELOAD_FLAG = 'gr_selfheal'
const RELOAD_COOLDOWN = 60 * 1000

function selfHeal(reason) {
  let tried = 0
  try {
    tried = Number(sessionStorage.getItem(RELOAD_FLAG) || 0)
  } catch { return false }
  if (tried && Date.now() - tried < RELOAD_COOLDOWN) return false
  try { sessionStorage.setItem(RELOAD_FLAG, String(Date.now())) } catch { return false }
  console.warn('[Города и реки] самовосстановление:', reason)
  window.location.reload()
  return true
}

// Страница работает: снимаем метку попытки, чтобы следующая неудача снова
// получила право на один повтор. Проверяем не сразу, а после спокойного времени.
function markHealthy() {
  window.setTimeout(() => {
    if (errorSeen) return
    try { sessionStorage.removeItem(RELOAD_FLAG) } catch {}
  }, 12000)
}
let errorSeen = false

window.addEventListener('error', (e) => {
  const t = e && e.target
  const msg = String((e && e.message) || '')
  // ошибка чужого файла по ссылке (картинка, шрифт, счётчик) — не повод перезагружаться
  if (t && t.tagName && t.tagName !== 'SCRIPT') return
  if (t && t.tagName === 'SCRIPT') { errorSeen = true; selfHeal('не загрузился скрипт'); return }
  if (/Importing a module script failed|dynamically imported module|ChunkLoadError|Loading chunk/i.test(msg)) {
    errorSeen = true
    selfHeal('не загрузился модуль страницы')
  }
}, true)
window.addEventListener('load', markHealthy)
window.addEventListener('vite:preloadError', () => { errorSeen = true; selfHeal('не догрузился модуль') })
window.addEventListener('unhandledrejection', (e) => {
  const msg = String((e && e.reason && (e.reason.message || e.reason)) || '')
  if (/Importing a module script failed|dynamically imported module|Loading chunk|ChunkLoadError/i.test(msg)) {
    errorSeen = true
    selfHeal('оборвался запрос к скрипту')
  }
})

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, tried: false }
  }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) {
    console.error('[Города и реки] ошибка рендера:', error)
    // один автоматический повтор: часто причина — нехватка памяти или обрыв загрузки
    if (!this.state.tried) {
      this.setState({ tried: true })
      setTimeout(() => { if (!selfHeal('ошибка рендера')) this.setState({ error }) }, 600)
    }
  }
  render() {
    if (!this.state.error) return this.props.children
    const tg = contacts.telegram || 'https://t.me/Olgagorodareki'
    return (
      <div style={{ minHeight: '100svh', display: 'grid', placeContent: 'center', gap: '18px', padding: '40px 24px', textAlign: 'center', background: '#f4f1ea', color: '#15282b', font: '400 17px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <h1 style={{ margin: 0, font: '600 clamp(26px, 4vw, 38px)/1.15 Georgia, "Times New Roman", serif' }}>Страница не открылась</h1>
        <p style={{ margin: 0, maxWidth: '46ch', color: '#4a5b5e' }}>
          Обычно помогает обновление — страница перезагрузится сама. Если не помогло,
          напишите мне в Telegram: подберу тур и отвечу на вопросы.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => { try { sessionStorage.removeItem(RELOAD_FLAG) } catch {} window.location.reload() }}
            style={{ cursor: 'pointer', border: '0', borderRadius: '999px', padding: '14px 26px', background: '#15282b', color: '#f4f1ea', font: '600 15px/1 system-ui, sans-serif' }}
          >
            Обновить страницу
          </button>
          <a
            href={tg}
            target="_blank"
            rel="noopener"
            style={{ borderRadius: '999px', padding: '14px 26px', border: '1px solid #15282b', color: '#15282b', textDecoration: 'none', font: '600 15px/1 system-ui, sans-serif' }}
          >
            Написать в Telegram
          </a>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#7b8a8c' }}>
          {site.name || 'Личный турагент'} · {contacts.phone || ''}
        </p>
      </div>
    )
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
if (!el) {
  selfHeal('нет корневого узла')
} else {
  const app = <ErrorBoundary><App /></ErrorBoundary>
  try {
    if (el.hasChildNodes()) hydrateRoot(el, app)
    else createRoot(el).render(app)
  } catch (error) {
    console.warn('[Города и реки] гидратация не удалась, собираем заново:', error)
    createRoot(el).render(app)
  }
  // Аналитика подключается лениво и только если задан счётчик
  if (site.metrikaId) import('./lib/metrika.js').then(m => m.initMetrika(site.metrikaId)).catch(() => {})
}
