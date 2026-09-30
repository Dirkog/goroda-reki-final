// Роутер на History API: реальные URL вместо #/hash.
import { routes } from '../data/site'

export const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/'

export function withBase(path) {
  const b = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE
  return b + (path.startsWith('/') ? path : '/' + path)
}

export function normalize(pathname) {
  let p = pathname || '/'
  // убираем базовый путь (GitHub Pages подпапка), если он есть
  const b = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE
  if (b && b !== '/' && p.startsWith(b)) p = p.slice(b.length) || '/'
  if (!p.startsWith('/')) p = '/' + p
  // /napravleniya и /napravleniya/ — одно и то же
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p || '/'
}

export function routeById(id) {
  return routes.find(r => r.id === id) || null
}

export function routeByPath(pathname) {
  const p = normalize(pathname)
  const exact = routes.find(r => normalize(r.path) === p)
  if (exact) return { route: exact, found: true }
  return { route: routeById('home'), found: false }
}

export function canonicalUrl(route, origin) {
  const b = BASE.endsWith('/') ? BASE : BASE + '/'
  const tail = route.path === '/' ? '' : route.path.replace(/^\//, '')
  return origin.replace(/\/$/, '') + b + tail
}

// Старые ссылки с #/trips продолжают работать: переводим hash → путь.
const LEGACY = { '#/home': '/', '#/olga': '/komanda/', '#/trips': '/napravleniya/', '#/process': '/kak-rabotaem/', '#/trust': '/nadezhnost/', '#/corporate': '/korporativnym/', '#/contacts': '/kontakty/' }

export function migrateLegacyHash() {
  if (typeof window === 'undefined') return false
  const h = window.location.hash
  if (!h || !h.startsWith('#/')) return false
  const target = LEGACY[h.split('?')[0]] || routes.map(r => '#/' + r.id).includes(h) ? (LEGACY[h] || '/') : '/'
  window.history.replaceState(null, '', withBase(target))
  return true
}

export function navigate(id, { replace = false } = {}) {
  const route = routeById(id)
  if (!route) return
  const url = withBase(route.path)
  if (replace) window.history.replaceState({ id }, '', url)
  else window.history.pushState({ id }, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
