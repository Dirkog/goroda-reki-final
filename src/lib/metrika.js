// Яндекс.Метрика.
// Основной счётчик вставляется прямо в <head> каждой страницы при сборке
// (см. scripts/prerender.mjs) — данные собираются сразу, без ожидания JS.
// Здесь — только переходы внутри сайта: SPA меняет URL без перезагрузки,
// поэтому каждый переход отправляем как отдельный просмотр.

export function metrikaHit(url, title) {
  try {
    const id = window.__ymId
    if (!id || typeof window.ym !== 'function') return
    window.ym(id, 'hit', url || window.location.href, {
      title: title || document.title,
      referrer: window.location.href
    })
  } catch {}
}

export function initMetrika(id) {
  // Резерв: если страница отдана без встроенного счётчика (например, локальная разработка)
  if (typeof window === 'undefined' || !id || window.__ymInlined) return
  window.__ymId = id
  ;(function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) }
    m[i].l = 1 * new Date()
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) return }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + id, 'ym')
  window.ym(id, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer', accurateTrackBounce: true, trackLinks: true })
}
