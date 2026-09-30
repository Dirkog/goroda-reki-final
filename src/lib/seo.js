// Применение метаданных на клиенте при переходах между страницами.
import { site } from '../data/site'
import { headFor } from './head'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applyMeta(route) {
  if (typeof document === 'undefined') return
  const head = headFor(route, site.origin)
  document.title = head.title
  for (const [attr, key, value] of head.metas) setMeta(attr, key, value)
  setLink('canonical', head.url)
  head.jsonLd.forEach((data, i) => {
    const id = 'ld-' + i
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data)
  })
}
