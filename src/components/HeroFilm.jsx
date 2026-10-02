import React, { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../data/site'

/* «Кинематографический главный экран»: 
   Роскошное, плавное видео высокого качества (без покадровых рывков и ступенек).
   Видео воспроизводится плавно в фоне с кинематографическим параллаксом и затемнением при скролле,
   а текст мягко поднимается и растворяется при погружении в контент сайта.
*/

const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/'
const VER = 'v=r4'

export default function HeroFilm({ children }) {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const video = videoRef.current
    if (!wrap || !sticky) return

    let raf = 0
    let wrapTop = wrap.offsetTop
    let span = Math.max(1, wrap.offsetHeight - window.innerHeight)

    const update = () => {
      raf = 0
      const p = Math.min(1, Math.max(0, (window.scrollY - wrapTop) / span))
      sticky.style.setProperty('--bridge', p.toFixed(4))
      const easeOut = 1 - (1 - p) * (1 - p)
      sticky.style.setProperty('--zoom', (1 + easeOut * 0.08).toFixed(4))
      sticky.style.setProperty('--pan', (easeOut * -2.2).toFixed(3))
      sticky.style.setProperty('--fade', Math.min(1, Math.max(0, p * 2.8)).toFixed(4))
      sticky.style.setProperty('--spill', Math.min(1, Math.max(0, (p - 0.35) * 2.5)).toFixed(4))
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => {
      wrapTop = wrap.offsetTop
      span = Math.max(1, wrap.offsetHeight - window.innerHeight)
      onScroll()
    }

    // Запуск видео
    if (video) {
      video.play().then(() => setIsPlaying(true)).catch(() => {
        // если браузер заблокировал автоплей, видео запустится при первом взаимодействии
        const kick = () => {
          video.play().then(() => setIsPlaying(true)).catch(() => {})
          window.removeEventListener('click', kick)
          window.removeEventListener('touchstart', kick)
        }
        window.addEventListener('click', kick, { once: true })
        window.addEventListener('touchstart', kick, { once: true })
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={`hero-film ${isPlaying ? 'is-ready' : ''} mode-cinematic`} ref={wrapRef}>
      <div className="home-frame" ref={stickyRef}>
        <div className="cinema-media">
          {/* Качественный фоновый постер для мгновенного появления без белого экрана */}
          <img 
            className="hero-frame-img" 
            src={`${BASE}videos/hero-frame0.jpg?${VER}`} 
            alt="Пляж с бирюзовой водой и золотистым песком" 
            width="1600" 
            height="900" 
            fetchpriority="high" 
            decoding="async" 
          />
          {/* Живое плавное видео 60/24fps без рывков */}
          <video 
            className="hero-ambient-video" 
            ref={videoRef} 
            src={heroVideo.mp4} 
            poster={heroVideo.poster}
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto" 
            aria-hidden="true" 
            onPlaying={() => setIsPlaying(true)}
          />
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
