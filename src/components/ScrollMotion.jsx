import { useEffect } from 'react'

/* Анимации при прокрутке — только transform и opacity (композитор, без дёрганья).
   Переход «кадр → сцены»: вариант по умолчанию — мягкое слияние (dissolve),
   второй вариант — «водопад» (?anim=waterfall). При системном «уменьшить движение»
   всё показывается сразу. */

export default function ScrollMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement

    const setup = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const variant = new URLSearchParams(window.location.search).get('anim') === 'waterfall' ? 'waterfall' : 'dissolve'
      root.dataset.anim = variant

      // «водопад»: элементы списков идут каскадом — каждый следующий чуть позже
      if (variant === 'waterfall' && !reduce) {
        document.querySelectorAll('.trip-grid, .steps-track, .experience-grid, .calendar-list, .contact-grid, .trust-list, .facts-grid')
          .forEach(g => [...g.children].forEach((c, i) => {
            c.classList.add('wf-item')
            c.style.transitionDelay = (i * 55) + 'ms'
          }))
      }

      const items = document.querySelectorAll('.reveal')
      if (reduce || !('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-in'))
      } else {
        const io = new IntersectionObserver(entries => {
          for (const e of entries) {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
          }
        }, { rootMargin: '-5% 0px -8% 0px', threshold: 0.05 })
        items.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el) })
      }

      // «мост» между кадром и первой сценой: одна переменная --bridge, остальное делает CSS
      const frame = document.querySelector('.home-frame')
      if (!frame || reduce || frame.dataset.bridge === 'on') return
      frame.dataset.bridge = 'on'
      let raf = 0
      const update = () => {
        raf = 0
        const h = frame.offsetHeight || window.innerHeight
        const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.7)))
        frame.style.setProperty('--bridge', p.toFixed(3))
      }
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    }

    setup()
    const onNav = () => setTimeout(setup, 60)
    window.addEventListener('gr:navigate', onNav)
    window.addEventListener('popstate', onNav)
    return () => {
      window.removeEventListener('gr:navigate', onNav)
      window.removeEventListener('popstate', onNav)
    }
  }, [])

  return null
}
