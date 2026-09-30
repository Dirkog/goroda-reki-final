#!/usr/bin/env python3
"""Анимации перехода «кадр → сцены» (варианты dissolve и waterfall),
взрослые карточки направлений, кнопка «Написать» на Telegram."""
import sys

SITE = '/home/user/work/site'
missed = []

def edit(path, pairs):
    p = f'{SITE}/{path}'
    t = open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in t:
            missed.append((path, old[:80]))
            continue
        t = t.replace(old, new, 1)
    open(p, 'w', encoding='utf-8').write(t)

# ---------- 1. компонент анимации ----------
open(f'{SITE}/src/components/ScrollMotion.jsx', 'w', encoding='utf-8').write('''import { useEffect } from 'react'

/* Анимации при прокрутке — на композиторе (только transform и opacity).
   Вариант перехода «кадр → сцены» переключается адресом: ?anim=waterfall.
   При системном «уменьшить движение» всё показывается сразу, без анимации. */

export default function ScrollMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement

    const setup = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const variant = new URLSearchParams(window.location.search).get('anim') === 'waterfall' ? 'waterfall' : 'dissolve'
      root.dataset.anim = variant

      const items = document.querySelectorAll('.reveal')
      if (reduce || !('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-in'))
      } else {
        const io = new IntersectionObserver(entries => {
          for (const e of entries) {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
          }
        }, { rootMargin: '-6% 0px -10% 0px', threshold: 0.06 })
        items.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el) })
      }

      // мост «кадр → первая сцена»: одна переменная, дальше всё делает CSS
      const frame = document.querySelector('.home-frame')
      if (!frame || reduce || frame.dataset.bridge === 'on') return
      frame.dataset.bridge = 'on'
      let raf = 0
      const update = () => {
        raf = 0
        const h = frame.offsetHeight || window.innerHeight
        const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.72)))
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
''')

edit('src/App.jsx', [
    ("import CookieNotice from './components/CookieNotice'",
     "import CookieNotice from './components/CookieNotice'\nimport ScrollMotion from './components/ScrollMotion'"),
    ("      <StickyCta />", "      <StickyCta />\n      <ScrollMotion />"),
])

# ---------- 2. кнопки ----------
edit('src/components/Header.jsx', [
    ("""      <a className="header-cta" href={waText(`Здравствуйте! Хочу подобрать тур. Направление: ___, даты: ___, состав: ___.`)} onClick={() => track('click_whatsapp', { place: 'header' })}>Написать Ольге</a>""",
     """      <a className="header-cta" href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'header' })}>Написать</a>"""),
    ("""            <a className="btn light mobile-menu-cta" href={waText('Здравствуйте! Хочу подобрать тур.')} onClick={() => track('click_whatsapp', { place: 'menu' })}>WhatsApp</a>
            <a className="btn ghost mobile-menu-cta" href={contacts.telegram}>Telegram</a>""",
     """            <a className="btn light mobile-menu-cta" href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'menu' })}>Написать в Telegram</a>
            <a className="btn ghost mobile-menu-cta" href={waText('Здравствуйте! Хочу подобрать тур.')} onClick={() => track('click_whatsapp', { place: 'menu' })}>WhatsApp</a>"""),
])

edit('src/components/StickyCta.jsx', [
    ("""      <a className="sticky-cta-main" href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, взрослых ___, детей ___.')} onClick={() => track('click_whatsapp', { place: 'sticky' })}>""",
     """      <a className="sticky-cta-main" href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'sticky' })}>"""),
    ("""        <span><b>Подобрать тур</b><small>ответим за 15 минут</small></span>""",
     """        <span><b>Написать</b><small>отвечу в рабочее время</small></span>"""),
    ("""      <a className="sticky-cta-alt" href={contacts.telegram} onClick={() => track('click_telegram', { place: 'sticky' })} aria-label="Написать в Telegram">TG</a>""",
     """      <a className="sticky-cta-alt" href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___.')} onClick={() => track('click_whatsapp', { place: 'sticky' })} aria-label="Написать в WhatsApp">WA</a>"""),
])

# ---------- 3. разметка карточек ----------
edit('src/pages/Home.jsx', [
    ("""              <TripImage card={card} eager={false} />
              <span className="trip-teaser-body">
                <em>{card.category}</em>
                <b>{card.title}</b>
                <small>{card.region}</small>
                <span className="trip-teaser-price">{card.budget}<i>{card.budgetNote}</i></span>
              </span>""",
     """              <span className="trip-media"><TripImage card={card} eager={false} /></span>
              <span className="trip-teaser-body">
                <em>{card.category}</em>
                <b>{card.title}</b>
                <small>{card.region}</small>
                <span className="trip-teaser-foot">
                  <span className="trip-teaser-price">{card.budget}<i>{card.budgetNote}</i></span>
                  <span className="trip-go" aria-hidden="true">→</span>
                </span>
              </span>"""),
    ("""      <section className="home-frame">""", """      <section className="home-frame reveal-frame">"""),
    ("""        <div className="cinema-inner">""", """        <div className="cinema-inner">
          <span className="frame-spill" aria-hidden="true" />"""),
    ("""    <section className="scene" id={id}>""", """    <section className={`scene reveal ${kind || ''}`} id={id}>"""),
    ("""function Scene({ num, kicker, title, note, children, id }) {""",
     """function Scene({ num, kicker, title, note, children, id, kind }) {"""),
])

edit('src/pages/Trips.jsx', [
    ("""      <TripImage card={card} />""", """      <span className="trip-media"><TripImage card={card} /></span>"""),
    ("""      <div className="trip-grid catalog">
        {visible.map((card, i) => <TripCard card={card} key={card.slug} index={i} />)}
      </div>""",
     """      <div className="trip-grid catalog">
        {visible.map((card, i) => <TripCard card={card} key={card.slug} index={i} />)}
      </div>"""),
])

print('правки разметки:', 'ок' if not missed else 'ЕСТЬ ПРОПУСКИ')
for p, s in missed:
    print('  ✗', p, '→', s)
