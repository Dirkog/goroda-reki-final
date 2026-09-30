#!/usr/bin/env python3
"""Стили: переход «кадр → сцены», вариант «водопад», карточки с фото как фоном."""
SITE = '/home/user/work/site'

# --- разметка: элемент-«мост» внутри кадра + водопадные элементы ---
p = f'{SITE}/src/pages/Home.jsx'
t = open(p, encoding='utf-8').read()
if 'frame-spill' not in t:
    t = t.replace("""        <div className="cinema-grade" aria-hidden="true" />""",
                  """        <div className="cinema-grade" aria-hidden="true" />
        <span className="frame-spill" aria-hidden="true" />""", 1)
    open(p, 'w', encoding='utf-8').write(t)
    print('мост добавлен в разметку')

# --- движок: водопадная раскладка элементов ---
p = f'{SITE}/src/components/ScrollMotion.jsx'
t = open(p, encoding='utf-8').read()
if 'wf-item' not in t:
    t = t.replace("""      const items = document.querySelectorAll('.reveal')""",
"""      // «водопад»: элементы списков идут каскадом — каждый следующий чуть позже
      if (variant === 'waterfall' && !reduce) {
        document.querySelectorAll('.trip-grid, .steps-track, .experience-grid, .calendar-list, .contact-grid, .trust-list, .facts-grid')
          .forEach(g => [...g.children].forEach((c, i) => {
            c.classList.add('wf-item')
            c.style.transitionDelay = (i * 55) + 'ms'
          }))
      }

      const items = document.querySelectorAll('.reveal')""", 1)
    open(p, 'w', encoding='utf-8').write(t)
    print('водопад добавлен в движок')

# --- стили ---
CSS = """

/* =========================================================
   ДВИЖЕНИЕ (v4): мягкое слияние кадра и сцен + вариант «водопад»
   Анимируются только transform и opacity — всё считает композитор.
   ========================================================= */

/* появление сцен: мягкое всплывание */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s ease, transform .9s cubic-bezier(.16, 1, .3, 1); }
.reveal.is-in { opacity: 1; transform: none; }

/* мост «кадр → первая сцена» */
.home-frame { --bridge: 0; }
.home-frame .cinema-media { transform: scale(calc(1 + var(--bridge) * 0.05)); transform-origin: 50% 42%; will-change: transform; }
.home-frame .cinema-inner { opacity: calc(1 - var(--bridge) * 1.25); transform: translateY(calc(var(--bridge) * -30px)); }
.home-frame .cinema-grade { opacity: calc(1 - var(--bridge) * 0.3); }
.frame-spill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 46vh;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(244, 241, 234, 0) 0%, rgba(244, 241, 234, 0.55) 52%, var(--paper) 100%);
  opacity: var(--bridge);
  transform: translateY(calc(46% - var(--bridge) * 46%));
}
/* первая сцена чуть поднимается навстречу кадру — стык читается как продолжение */
.home-page .scene:first-of-type { margin-top: 84px; }

/* вариант «водопад»: кадр уходит мягче, сцены опускаются сверху, элементы — каскадом */
html[data-anim="waterfall"] .home-frame .cinema-inner { opacity: calc(1 - var(--bridge) * 1.4); transform: translateY(calc(var(--bridge) * -46px)); }
html[data-anim="waterfall"] .reveal { transform: translateY(-30px); transition-duration: 1s; }
html[data-anim="waterfall"] .reveal.is-in { transform: none; }
html[data-anim="waterfall"] .wf-item { opacity: 0; transform: translateY(-22px); transition: opacity .7s ease, transform .85s cubic-bezier(.16, 1, .3, 1); }
html[data-anim="waterfall"] .reveal.is-in .wf-item { opacity: 1; transform: none; }
html[data-anim="waterfall"] .calendar-list .wf-item { transform: translateY(-14px); }

/* =========================================================
   КАРТОЧКИ: фотография — фон, а не отдельная картинка в рамке
   ========================================================= */
.trip-grid, .trip-grid.home-grid, .trip-grid.catalog { gap: 18px; background: none; border: 0; }
.trip-teaser {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 340px;
  padding: 0;
  overflow: hidden;
  background: var(--ink);
  border: 0;
  isolation: isolate;
}
.trip-media { position: absolute; inset: 0; z-index: 0; display: block; }
.trip-media picture, .trip-media img { display: block; width: 100%; height: 100%; }
.trip-media img { object-fit: cover; aspect-ratio: auto; transform: scale(1.001); transition: transform 1.1s cubic-bezier(.16, 1, .3, 1); }
.trip-teaser:hover .trip-media img { transform: scale(1.045); }
.trip-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(10, 12, 14, 0.06) 0%, rgba(10, 12, 14, 0.34) 48%, rgba(10, 12, 14, 0.86) 100%);
  pointer-events: none;
}
.trip-teaser-body {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 8px;
  width: 100%;
  padding: 26px 24px 24px;
  color: #fff;
}
.trip-teaser-body em { color: var(--accent-soft); }
.trip-teaser-body b { color: #fff; font-size: 21px; }
.trip-teaser-body small { color: rgba(255, 255, 255, 0.78); }
.trip-teaser-price { margin-top: 10px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.26); color: #fff; }
.trip-teaser-price i { color: rgba(255, 255, 255, 0.7); }

/* каталог: фото становится фоном всей карточки, текст лежит на нём */
.trip-card.rich {
  position: relative;
  isolation: isolate;
  justify-content: flex-end;
  min-height: 520px;
  padding: 0;
  background: var(--ink);
  border: 0;
  overflow: hidden;
}
.trip-card.rich > .trip-media { position: absolute; inset: 0; z-index: 0; }
.trip-card.rich > .trip-media img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.001); transition: transform 1.1s cubic-bezier(.16, 1, .3, 1); }
.trip-card.rich:hover > .trip-media img { transform: scale(1.04); }
.trip-card.rich > .trip-scrim {
  background: linear-gradient(180deg, rgba(10, 12, 14, 0.22) 0%, rgba(10, 12, 14, 0.6) 40%, rgba(10, 12, 14, 0.92) 100%);
}
.trip-card.rich .trip-top { position: relative; z-index: 2; color: rgba(255, 255, 255, 0.75); padding: 22px 24px 0; }
.trip-card.rich .trip-top span { color: var(--accent-soft); }
.trip-card.rich .trip-top b { color: #fff; font-weight: 500; }
.trip-card.rich .trip-body { position: relative; z-index: 2; padding: 14px 24px 26px; color: #fff; }
.trip-card.rich .trip-body h2 { color: #fff; }
.trip-card.rich .trip-body > p { color: rgba(255, 255, 255, 0.82); }
.trip-card.rich .trip-body dt { color: rgba(255, 255, 255, 0.62); }
.trip-card.rich .trip-body dd { color: #fff; }
.trip-card.rich .trip-body dd small { color: rgba(255, 255, 255, 0.68); }
.trip-card.rich .tag-row em { background: rgba(255, 255, 255, 0.14); color: rgba(255, 255, 255, 0.88); }
.trip-card.rich .btn.light { background: #fff; color: var(--primary); }
.trip-card.rich .btn.light:hover { background: rgba(255, 255, 255, 0.88); }
.trip-card.rich .trip-actions-alt { color: #fff; border-bottom: 1px solid rgba(255, 255, 255, 0.5); }
.trip-card.rich:hover { background: var(--ink); }

@media (max-width: 900px) {
  .trip-teaser { min-height: 300px; }
  .trip-card.rich { min-height: 460px; }
}
@media (max-width: 680px) {
  .trip-teaser { min-height: 260px; }
  .trip-card.rich { min-height: 420px; }
  .frame-spill { height: 34vh; }
}
@media (prefers-reduced-motion: reduce) {
  .trip-media img, .home-frame .cinema-media, .home-frame .cinema-inner { transition: none !important; transform: none !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
  .frame-spill { display: none; }
}
"""

p = f'{SITE}/src/styles.css'
t = open(p, encoding='utf-8').read()
if 'ДВИЖЕНИЕ (v4)' not in t:
    open(p, 'w', encoding='utf-8').write(t + CSS)
    print('стили добавлены')
else:
    print('стили уже на месте')
