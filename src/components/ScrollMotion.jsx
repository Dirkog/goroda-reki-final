import { useEffect } from 'react'

/* Появление сцен при прокрутке. Вариант «водопад» (?anim=waterfall) добавляет
   каскад элементам списков. Анимируются только transform и opacity. */

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
        return
      }
      const io = new IntersectionObserver(entries => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
        }
      }, { rootMargin: '-5% 0px -8% 0px', threshold: 0.05 })
      items.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el) })
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
