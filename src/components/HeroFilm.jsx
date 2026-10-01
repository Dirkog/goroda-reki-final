import React, { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../data/site'

/* «Фильм по прокрутке»: картинка фильма меняется по мере прокрутки, без автоплея.
   Фильм — пляж с высоты: бирюзовая вода, песок.
   Два источника одного и того же фильма:
     • video  — один файл (2 МБ), кадр берётся перемоткой и рисуется на canvas;
     • frames — 288 отдельных кадров (36 МБ), загружаются окном вокруг текущего.
   Видео в десятки раз легче, поэтому на медленной сети оно и должно быть основным;
   кадры остаются запасным путём — если видео не открылось, режим переключается сам.
   Выбор режима: ?anim=video | ?anim=frames (запоминается в браузере). */

const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/'
// метка версии: файлы кадров и фильма кэшируются браузером надолго,
// при замене фильма достаточно поменять r2 → r3
const VER = 'v=r3'
const SET_BIG = `${BASE}frames/1600`
const SET_SMALL = `${BASE}frames/1024`
const COUNT_FALLBACK = 288   // если манифест не прочитался: /frames/manifest.json
const AHEAD = 12             // держим готовыми вперёд
const BEHIND = 3             // и чуть назад — на случай прокрутки вверх
const POOL_MAX = 22          // предел изображений в памяти одновременно
const STORAGE_KEY = 'gr_anim'

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Выбор режима вручную (ссылка или прошлый выбор в этом браузере).
function forcedMode() {
  if (typeof window === 'undefined') return null
  const q = new URLSearchParams(window.location.search).get('anim')
  if (q === 'video' || q === 'frames') {
    try { localStorage.setItem(STORAGE_KEY, q) } catch {}
    return q
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'frames' || saved === 'video') return saved
  } catch {}
  return null
}

// Автоматический выбор: видео — если сервер умеет отдавать часть файла (перемотку).
// На площадках, которые отдают файл только целиком, остаёмся на кадрах.
async function probeServerForVideo(url) {
  try {
    const r = await fetch(url, { headers: { Range: 'bytes=0-1' }, cache: 'force-cache' })
    return r.status === 206
  } catch {
    return false
  }
}

export default function HeroFilm({ children }) {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const frontRef = useRef(null)
  const backRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState('pending')
  const [count, setCount] = useState(COUNT_FALLBACK)

  // сколько кадров в наборе — берём из манифеста, чтобы набор можно было
  // пересобрать без правки кода
  useEffect(() => {
    let alive = true
    fetch(`${BASE}frames/manifest.json?${VER}`, { cache: 'force-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(m => { if (alive && m && m.count > 1) setCount(m.count) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  // сначала выясняем, какой источник фильма уместен на этом сервере
  useEffect(() => {
    let alive = true
    const forced = forcedMode()
    if (forced) { setMode(forced); return () => { alive = false } }
    probeServerForVideo(heroVideo.mp4).then((canSeek) => {
      if (alive) setMode(canSeek ? 'video' : 'frames')
    })
    return () => { alive = false }
  }, [])

  // --- режим «видео»: кадр берётся из файла ---
  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'video') return
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const v = videoRef.current
    const cv = canvasRef.current
    if (!wrap || !sticky || !v || !cv) { setMode('frames'); return }
    const ctx = cv.getContext('2d', { alpha: false })
    if (!ctx) { setMode('frames'); return }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let wrapTop = wrap.offsetTop
    let span = Math.max(1, wrap.offsetHeight - window.innerHeight)
    let failed = false
    let seeking = false
    let pending = null
    let lastDrawn = -1

    const fail = (why) => {
      if (failed) return
      failed = true
      console.warn('[фильм] видео недоступно, перехожу на кадры:', why)
      setMode('frames')
    }

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.round(cv.clientWidth * dpr) || 1600
      const h = Math.round(cv.clientHeight * dpr) || 900
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h }
    }

    // как object-fit: cover, только средствами canvas
    const draw = () => {
      if (!v.videoWidth || !cv.width) return
      const scale = Math.max(cv.width / v.videoWidth, cv.height / v.videoHeight)
      const w = v.videoWidth * scale
      const h = v.videoHeight * scale
      ctx.drawImage(v, (cv.width - w) / 2, (cv.height - h) / 2, w, h)
    }

    const seek = (t) => {
      if (!v.duration) return
      const target = Math.min(v.duration - 0.02, Math.max(0, t))
      if (seeking) { pending = target; return }
      seeking = true
      v.currentTime = target
    }

    const onSeeked = () => {
      seeking = false
      if (lastDrawn !== v.currentTime) { lastDrawn = v.currentTime; draw() }
      if (pending != null) { const t = pending; pending = null; seek(t) }
    }
    const onReady = () => {
      fit()
      draw()
      if (!ready) setReady(true)
    }
    const onErr = () => fail(v.error ? `код ${v.error.code}` : 'ошибка загрузки')

    v.addEventListener('loadeddata', onReady)
    v.addEventListener('seeked', onSeeked)
    v.addEventListener('error', onErr)
    if (v.readyState >= 2) onReady()

    const update = () => {
      raf = 0
      const p = Math.min(1, Math.max(0, (window.scrollY - wrapTop) / span))
      sticky.style.setProperty('--bridge', p.toFixed(4))
      const easeOut = 1 - (1 - p) * (1 - p)
      sticky.style.setProperty('--zoom', (1 + easeOut * 0.07).toFixed(4))
      sticky.style.setProperty('--pan', (easeOut * -1.6).toFixed(3))
      sticky.style.setProperty('--fade', smoothstep(0, 0.24, p).toFixed(4))
      sticky.style.setProperty('--spill', smoothstep(0.40, 0.80, p).toFixed(4))
      sticky.dataset.frame = String(Math.round(p * (count - 1)))

      if (reduce || !v.duration) return
      const t = p * (v.duration - 0.03)
      if (Math.abs(v.currentTime - t) > 0.025) seek(t)
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => {
      wrapTop = wrap.offsetTop
      span = Math.max(1, wrap.offsetHeight - window.innerHeight)
      fit(); draw(); onScroll()
    }
    const tick = window.setInterval(() => { if (!failed && v.buffered.length && !seeking) draw() }, 500)

    fit()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.clearInterval(tick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      v.removeEventListener('loadeddata', onReady)
      v.removeEventListener('seeked', onSeeked)
      v.removeEventListener('error', onErr)
    }
  }, [mode, count])

  // --- режим «кадры»: запасной путь ---
  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'frames') return
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    let front = frontRef.current
    let back = backRef.current
    if (!wrap || !sticky || !front || !back) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tight = (navigator.deviceMemory || 8) < 4
    const ahead = tight ? 8 : AHEAD
    const poolMax = tight ? 14 : POOL_MAX
    const dir = window.innerWidth < 820 ? SET_SMALL : SET_BIG
    const url = i => `${dir}/f${String(i).padStart(3, '0')}.webp?${VER}`

    const pool = new Map()
    let shown = -1
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
      for (const i of [...pool.keys()]) {
        if (i < center - BEHIND - 6 || i > center + ahead + 8) release(i)
      }
      if (pool.size > poolMax) {
        const far = [...pool.keys()].sort((a, b) => Math.abs(b - center) - Math.abs(a - center))
        for (const i of far.slice(0, pool.size - poolMax)) release(i)
      }
    }

    const want = (i) => {
      if (i < 0 || i >= count || pool.has(i)) return
      const img = new Image()
      img.decoding = 'async'
      const entry = { img, ready: false }
      pool.set(i, entry)
      img.src = url(i)
      const done = () => { entry.ready = true; if (i === wanted && wanted !== shown) paint(i) }
      if (img.decode) img.decode().then(done).catch(done)
      else img.onload = done
    }

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
      sticky.style.setProperty('--spill', smoothstep(0.40, 0.80, p).toFixed(4))

      if (reduce) return
      wanted = Math.round(p * (count - 1))
      let started = 0
      for (let d = 1; d <= ahead && started < 3; d++) {
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
      front.src = url(0)
      front.alt = 'Пляж с бирюзовой водой и песком с высоты'
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
  }, [mode, count])

  return (
    <div className={`hero-film ${ready ? 'is-ready' : ''} mode-${mode}`} ref={wrapRef}>
      <div className="home-frame" ref={stickyRef}>
        <div className="cinema-media">
          {/* постер виден мгновенно и работает без JS */}
          <img className="hero-frame-img" src={`${BASE}videos/hero-frame0.jpg?${VER}`} alt="Пляж с бирюзовой водой и песком с высоты" width="1600" height="900" fetchpriority="high" decoding="async" />
          {mode === 'video' ? (
            <>
              <canvas className="hero-layer hero-canvas is-front" ref={canvasRef} aria-hidden="true" />
              {/* сам файл фильма: 1152p, без звука, начало файла готово к перемотке (faststart) */}
              <video className="hero-video-src" ref={videoRef} src={heroVideo.mp4} poster={heroVideo.poster}
                muted playsInline preload="auto" tabIndex={-1} aria-hidden="true" />
            </>
          ) : mode === 'frames' ? (
            <>
              <img className="hero-layer" ref={frontRef} alt="" aria-hidden="true" decoding="async" />
              <img className="hero-layer" ref={backRef} alt="" aria-hidden="true" decoding="async" />
            </>
          ) : null /* 'pending' — показываем только постер, выбор источника занимает доли секунды */}
        </div>
        <div className="cinema-grade" aria-hidden="true" />
        <div className="cinema-grain" aria-hidden="true" />
        <span className="frame-spill" aria-hidden="true" />
        <div className="cinema-inner">{children}</div>
        <span className="film-progress" aria-hidden="true" />
      </div>
    </div>
  )
}
