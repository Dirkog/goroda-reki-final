// Единая точка отправки событий: Яндекс.Метрика (если настроена) + dataLayer.
export function track(event, params = {}) {
  try {
    if (typeof window === 'undefined') return
    const payload = { event, ...params }
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
    if (typeof window.ym === 'function' && window.__ymId) {
      window.ym(window.__ymId, 'reachGoal', event, params)
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.debug('[track]', payload)
    }
  } catch {}
}

export function leadSource() {
  try {
    const utm = sessionStorage.getItem('gr_utm')
    if (utm) return utm
  } catch {}
  return ''
}
