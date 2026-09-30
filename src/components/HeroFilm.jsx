import React, { useEffect, useRef, useState } from 'react'

/* «Фильм по прокрутке»: кадры видео сменяются по мере прокрутки, без автоплея.
   Память держим под контролем: одновременно живёт небольшое окно кадров
   (сзади 3, впереди 12), остальные отпускаем — иначе браузеру не хватит памяти
   на телефоне. Кадры после первой прокрутки лежат в кеше браузера. */

const COUNT = 212            // кадров в наборе (/frames/manifest.json)
const SET_BIG = '/frames/1600'
const SET_SMALL = '/frames/1024'
const AHEAD = 12             // держим готовыми вперёд
const BEHIND = 3             // и чуть назад — на случай прокрутки вверх
const POOL_MAX = 22          // предел изображений в памяти одновременно

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function HeroFilm({ children }) {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const frontRef = useRef(null)
  const backRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    let front = frontRef.current
    let back = backRef.current
    if (!wrap || !sticky || !front || !back) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dir = window.innerWidth < 820 ? SET_SMALL : SET_BIG
    const url = i => `${dir}/f${String(i).padStart(3, '0')}.webp`

    const pool = new Map()            // idx → { img, ready }
    let shown = -1                    // что сейчас на экране
    let raf = 0
    let wrapTop = wrap.offsetTop
    let span = Math.max(1, wrap.offsetHeight - window.innerHeight)

    const release = (i) => {
      const e = pool.get(i)
      if (!e) return
      pool.delete(i)
      try { e.img.removeAttribute('src') } catch {}
    }

    const trim = (center) => {
      // отпускаем кадры, которые далеко от текущего положения
      for (const i of [...pool.keys()]) {
        if (i < center - BEHIND - 6 || i > center + AHEAD + 8) release(i)
      }
      if (pool.size > POOL_MAX) {
        const far = [...pool.keys()].sort((a, b) => Math.abs(b - center) - Math.abs(a - center))
        for (const i of far.slice(0, pool.size - POOL_MAX)) release(i)
      }
    }

    const want = (i) => {
      if (i < 0 || i >= COUNT || pool.has(i)) return
      const img = new Image()
      img.decoding = 'async'
      const entry = { img, ready: false }
      pool.set(i, entry)
      img.src = url(i)
      const done = () => { entry.ready = true; if (i === wanted && wanted !== shown) paint(i) }
      if (img.decode) img.decode().then(done).catch(done)
      else img.onload = done
    }

    // два слоя-картинки: показываем новый кадр только когда он готов — мигания нет
    const paint = (i) => {
      const e = pool.get(i)
      if (!e || !e.ready) return
      back.src = url(i)
      back.alt = ''
      back.classList.add('is-front')
      front.classList.remove('is-front')
      const t = front
      front = back
      back = t
      shown = i
      if (!ready) setReady(true)
      sticky.dataset.frame = String(i)
    }

    let wanted = 0
    const update = () => {
      raf = 0
      const p = Math.min(1, Math.max(0, (window.scrollY - wrapTop) / span))
      sticky.style.setProperty('--bridge', p.toFixed(4))
      const easeOut = 1 - (1 - p) * (1 - p)
      sticky.style.setProperty('--zoom', (1 + easeOut * 0.07).toFixed(4))
      sticky.style.setProperty('--pan', (easeOut * -1.6).toFixed(3))
      sticky.style.setProperty('--fade', smoothstep(0, 0.24, p).toFixed(4))
      sticky.style.setProperty('--spill', smoothstep(0.42, 0.86, p).toFixed(4))
      sticky.style.setProperty('--tear', smoothstep(0.6, 1, p).toFixed(4))

      if (reduce) return
      wanted = Math.round(p * (COUNT - 1))
      // не создаём десятки запросов разом: по три новых кадра за кадр прокрутки
      let started = 0
      for (let d = 1; d <= AHEAD && started < 3; d++) {
        if (!pool.has(wanted + d)) { want(wanted + d); started += 1 }
      }
      for (let d = 0; d <= BEHIND && started < 4; d++) {
        if (!pool.has(wanted - d)) { want(wanted - d); started += 1 }
      }
      if (pool.has(wanted) && pool.get(wanted).ready) paint(wanted)
      trim(wanted)
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => {
      wrapTop = wrap.offsetTop
      span = Math.max(1, wrap.offsetHeight - window.innerHeight)
      onScroll()
    }

    if (reduce) {
      // при системном «уменьшить движение» остаётся постер, ничего не грузим
      front.src = url(0)
      front.alt = 'Зелёная река и лес с высоты'
      front.classList.add('is-front')
    } else {
      want(0)
      update()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      for (const i of [...pool.keys()]) release(i)
    }
  }, [])

  return (
    <div className={`hero-film ${ready ? 'is-ready' : ''}`} ref={wrapRef}>
      <div className="home-frame" ref={stickyRef}>
        <div className="cinema-media">
          {/* постер виден мгновенно и работает без JS */}
          <img className="hero-frame-img" src="/videos/hero-frame0.jpg" alt="Зелёная река и лес с высоты" width="1600" height="900" fetchpriority="high" decoding="async" />
          <img className="hero-layer" ref={frontRef} alt="" aria-hidden="true" decoding="async" />
          <img className="hero-layer" ref={backRef} alt="" aria-hidden="true" decoding="async" />
        </div>
        <div className="cinema-grade" aria-hidden="true" />
        <div className="cinema-grain" aria-hidden="true" />
        <span className="frame-spill" aria-hidden="true" />
        <svg className="frame-tear" viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 76.00 C61.20 97.00 118.80 97.00 180.00 76.00 C241.20 55.00 298.80 55.00 360.00 76.00 C421.20 97.00 478.80 97.00 540.00 76.00 C601.20 55.00 658.80 55.00 720.00 76.00 C781.20 97.00 838.80 97.00 900.00 76.00 C961.20 55.00 1018.80 55.00 1080.00 76.00 C1141.20 97.00 1198.80 97.00 1260.00 76.00 C1321.20 55.00 1378.80 55.00 1440.00 76.00 L1440.00 130 L0 130 Z" fill="#f4f1ea" />
        </svg>
        <div className="cinema-inner">{children}</div>
        <span className="film-progress" aria-hidden="true" />
      </div>
    </div>
  )
}
