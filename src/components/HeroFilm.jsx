import React, { useEffect, useRef, useState } from 'react'

/* «Фильм по прокрутке»: кадры видео рисуются на холсте по мере прокрутки.
   Видео не проигрывается само — кадр задаёт прокрутка, поэтому картинка идёт
   ровно, без пережатия потоком, и на телефоне это дешевле автоплея.
   При системном «уменьшить движение» остаётся один статичный кадр. */

const COUNT = 212           // кадров в наборе (манифест /frames/manifest.json)
const SET_BIG = '/frames/1600'
const SET_SMALL = '/frames/1024'
const LOOKAHEAD = 26        // сколько кадров вперёд держим готовыми
const AHEAD_KEEP = 8        // сколько кадров назад оставляем

// мягкие рампы: без изломов на краях, поэтому ничего не «дёргается»
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function HeroFilm({ children }) {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const canvas = canvasRef.current
    if (!wrap || !sticky || !canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dir = window.innerWidth < 820 ? SET_SMALL : SET_BIG
    const ctx = canvas.getContext('2d')
    const frames = Array.from({ length: COUNT }, () => ({ img: null, ready: false }))
    let drawn = -1
    let wrapTop = wrap.offsetTop
    let span = Math.max(1, wrap.offsetHeight - window.innerHeight)

    const url = i => `${dir}/f${String(i).padStart(3, '0')}.webp`

    const load = (i) => {
      if (i < 0 || i >= COUNT) return
      const f = frames[i]
      if (f.img) return
      const img = new Image()
      img.decoding = 'async'
      img.src = url(i)
      f.img = img
      const done = () => { if (!f.ready) { f.ready = true; setReady(n => n + 1) } }
      if (img.decode) img.decode().then(done).catch(done)
      else img.onload = done
    }

    // фоновая подгрузка: идём от текущего кадра вперёд небольшими порциями,
    // чтобы к моменту прокрутки кадр уже лежал в памяти
    let cursor = 0
    let idle = 0
    const pump = () => {
      let n = 0
      while (n < 3 && cursor < COUNT) { load(cursor); cursor += 1; n += 1 }
      if (cursor < COUNT) idle = (window.requestIdleCallback || window.setTimeout)(pump, 220)
    }
    if (!reduce) idle = (window.requestIdleCallback || window.setTimeout)(pump, 300)

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(window.innerWidth * dpr)
      const h = Math.round(window.innerHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        if (drawn >= 0) drawFrame(drawn, true)
      }
    }

    const best = (i) => {                     // ближайший готовый кадр
      if (frames[i] && frames[i].ready) return i
      for (let d = 1; d < 60; d++) {
        if (frames[i - d] && frames[i - d].ready) return i - d
        if (frames[i + d] && frames[i + d].ready) return i + d
      }
      return -1
    }

    const drawFrame = (i, force) => {
      const f = frames[i]
      if (!ctx || !f || !f.ready) return
      if (!force && i === drawn) return
      const img = f.img
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      const cw = canvas.width, ch = canvas.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)  // как object-fit: cover
      const w = img.naturalWidth * s, h = img.naturalHeight * s
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      drawn = i
      canvas.dataset.frame = String(i)
    }

    let raf = 0
    const update = () => {
      raf = 0
      const p = Math.min(1, Math.max(0, (window.scrollY - wrapTop) / span))
      // всё движение считаем здесь, один раз на кадр, — рампы совпадают идеально
      sticky.style.setProperty('--bridge', p.toFixed(4))
      // движение видно сразу: наезд идёт «на выходе» (быстро в начале, мягко в конце)
      const easeOut = 1 - (1 - p) * (1 - p)
      sticky.style.setProperty('--zoom', (1 + easeOut * 0.07).toFixed(4))
      sticky.style.setProperty('--pan', (easeOut * -1.6).toFixed(3))
      sticky.style.setProperty('--fade', smoothstep(0, 0.24, p).toFixed(4))
      sticky.style.setProperty('--spill', smoothstep(0.42, 0.86, p).toFixed(4))
      sticky.style.setProperty('--tear', smoothstep(0.6, 1, p).toFixed(4))

      const idx = Math.round(p * (COUNT - 1))
      for (let i = idx - AHEAD_KEEP; i <= Math.min(COUNT - 1, idx + LOOKAHEAD); i++) load(i)
      if (reduce) { drawFrame(0); return }
      const b = best(idx)
      if (b >= 0) drawFrame(b)
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => {
      wrapTop = wrap.offsetTop
      span = Math.max(1, wrap.offsetHeight - window.innerHeight)
      sizeCanvas()
      onScroll()
    }

    sizeCanvas()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (idle) (window.cancelIdleCallback || window.clearTimeout)(idle)
    }
  }, [])

  return (
    <div className={`hero-film ${ready > 0 ? 'is-ready' : ''}`} ref={wrapRef}>
      <div className="home-frame" ref={stickyRef}>
        <div className="cinema-media">
          {/* первый кадр — обычная картинка: виден мгновенно, работает без JS и при «уменьшить движение» */}
          <img className="hero-frame-img" src="/videos/hero-frame0.jpg" alt="Зелёная река и лес с высоты" width="1600" height="900" fetchpriority="high" decoding="async" />
          <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
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
