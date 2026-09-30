import React, { useEffect, useRef, useState } from 'react'

/* «Фильм по прокрутке»: кадры видео рисуются на холсте по мере прокрутки.
   Видео не проигрывается само — кадр задаёт прокрутка, поэтому картинка идёт
   ровно и с тем же качеством, что в исходном видео, а на телефоне это дешевле
   автоплея. При системном «уменьшить движение» показывается один кадр. */

const COUNT = 216          // кадров в манифесте (18 с × 12 к/с)
const COARSE_STEP = 6      // шаг черновой подгрузки

export default function HeroFilm({ children }) {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const [ready, setReady] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const canvas = canvasRef.current
    if (!wrap || !sticky || !canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 820
    const dir = small ? '/frames/640' : '/frames/1280'
    const ctx = canvas.getContext('2d')

    // размеры холста под экран (с учётом плотности пикселей, но не больше 2×)
    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(window.innerWidth * dpr)
      const h = Math.round(window.innerHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; draw(lastIndex) }
    }

    const url = i => `${dir}/f${String(i).padStart(3, '0')}.webp`
    const frames = Array.from({ length: COUNT }, () => ({ img: null, ready: false }))

    const load = (i) => {
      if (i < 0 || i >= COUNT) return
      const f = frames[i]
      if (f.img) return
      const img = new Image()
      img.decoding = 'async'
      img.src = url(i)
      f.img = img
      const done = () => { f.ready = true; setReady(n => n + 1) }
      if (img.decode) img.decode().then(done).catch(done)
      else img.onload = done
    }

    // ближнее окно грузим сразу, остальное — «черновым» проходом в простое
    for (let i = 0; i < 14; i++) load(i)
    const coarse = () => { for (let i = 0; i < COUNT; i += COARSE_STEP) load(i) }
    if (window.requestIdleCallback) window.requestIdleCallback(coarse, { timeout: 4000 })
    else setTimeout(coarse, 1400)

    let lastIndex = 0
    const best = (i) => {                       // ближайший загруженный кадр
      if (frames[i].ready) return i
      for (let d = 1; d < 40; d++) {
        if (frames[i - d] && frames[i - d].ready) return i - d
        if (frames[i + d] && frames[i + d].ready) return i + d
      }
      return -1
    }

    const draw = (i) => {
      const f = frames[i]
      if (!ctx || !f || !f.ready) return
      const img = f.img
      const cw = canvas.width, ch = canvas.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)   // как object-fit: cover
      const w = img.naturalWidth * s, h = img.naturalHeight * s
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      canvas.dataset.frame = String(i)
    }

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const total = wrap.offsetHeight - vh
      const p = total > 0 ? Math.min(1, Math.max(0, (window.scrollY - wrap.offsetTop) / total)) : 0
      sticky.style.setProperty('--bridge', p.toFixed(4))
      const idx = Math.round(p * (COUNT - 1))
      const near = Math.max(0, idx - 8)
      for (let i = near; i < Math.min(COUNT, idx + 14); i++) load(i)
      if (idx !== lastIndex || !canvas.dataset.frame) {
        lastIndex = idx
        const b = best(idx)
        if (b >= 0) draw(b)
      }
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => { sizeCanvas(); onScroll() }

    sizeCanvas()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    if (!reduce) draw(0)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={`hero-film ${ready > 0 ? 'is-ready' : ''}`} ref={wrapRef}>
      <div className="home-frame" ref={stickyRef}>
        <div className="cinema-media">
          {/* первый кадр — обычная картинка: виден мгновенно, работает без JS и при «уменьшить движение» */}
          <img className="hero-frame-img" src="/videos/hero-frame0.jpg" alt="Теплоход уходит в туман на закате" width="1280" height="720" fetchpriority="high" decoding="async" />
          <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
        </div>
        <div className="cinema-grade" aria-hidden="true" />
        <span className="frame-spill" aria-hidden="true" />
        <svg className="frame-tear" viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,84 C90,44 168,104 268,84 C372,63 448,108 560,88 C668,68 742,112 860,90 C968,70 1042,110 1150,88 C1256,66 1330,104 1440,74 L1440,130 L0,130 Z" fill="#f4f1ea" />
        </svg>
        <div className="cinema-inner">{children}</div>
        <span className="film-progress" aria-hidden="true" />
      </div>
    </div>
  )
}
