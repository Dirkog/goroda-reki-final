#!/usr/bin/env python3
"""Логотип в навигации, порядок в сцене 01 (календарь), рваный край кадра (как на референсе)."""
import sys
SITE = '/home/user/work/site'
missed = []

def edit(path, pairs):
    p = f'{SITE}/{path}'
    t = open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in t:
            missed.append((path, old[:70].replace('\n', ' ')))
            continue
        t = t.replace(old, new, 1)
    open(p, 'w', encoding='utf-8').write(t)

# ---------- 1. логотип с волнами вместо «ОД» ----------
LOGO = """<span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="26" height="26" fill="none">
            <path d="M5 40c6-8 13-8 19 0s13 8 19 0 9-6 16 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M5 51c6-8 13-8 19 0s13 8 19 0 9-6 16 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".6" />
            <path d="M21 12h12l6 11h8v11H21z" fill="currentColor" />
            <rect x="26" y="29" width="6" height="6" fill="var(--paper)" />
            <rect x="36" y="29" width="6" height="6" fill="var(--paper)" />
          </svg>
        </span>"""
edit('src/components/Header.jsx', [
    ('<span className="brand-mark" aria-hidden="true">ОД</span>', LOGO),
])

# подвал: тот же знак рядом с именем
edit('src/components/Footer.jsx', [
    ("""        <a className="footer-logo" href="/">Ольга Дударева</a>""",
     """        <a className="footer-logo" href="/">
          <svg viewBox="0 0 64 64" width="30" height="30" fill="none" aria-hidden="true">
            <path d="M5 40c6-8 13-8 19 0s13 8 19 0 9-6 16 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M5 51c6-8 13-8 19 0s13 8 19 0 9-6 16 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".6" />
            <path d="M21 12h12l6 11h8v11H21z" fill="currentColor" />
          </svg>
          Ольга Дударева
        </a>"""),
])

# ---------- 2. рваный край кадра (слияние фото с бумагой) ----------
edit('src/pages/Home.jsx', [
    ("""        <span className="frame-spill" aria-hidden="true" />""",
     """        <span className="frame-spill" aria-hidden="true" />
        <svg className="frame-tear" viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,84 C90,44 168,104 268,84 C372,63 448,108 560,88 C668,68 742,112 860,90 C968,70 1042,110 1150,88 C1256,66 1330,104 1440,74 L1440,130 L0,130 Z" fill="#f4f1ea" />
        </svg>"""),
])

# ---------- 3. порядок в календаре: чистая строка события ----------
p = f'{SITE}/src/components/EventsCalendar.jsx'
t = open(p, encoding='utf-8').read()
old_start = t.find('        {shown.map(ev => {')
old_end = t.find('        })}', old_start)
if old_start == -1 or old_end == -1:
    missed.append(('EventsCalendar.jsx', 'блок списка событий'))
else:
    new_block = """        {shown.map(ev => {
          const hot = /идёт|сейчас/i.test(ev.status || '')
          return (
            <article className="event-row" key={ev.title}>
              <div className="event-when">
                <b>{ev.dates}</b>
                <span>{ev.place}</span>
                {ev.verified && <small>сверено {fmtDate(ev.verified)}</small>}
              </div>
              <div className="event-body">
                {hot && <span className="event-next">идёт сейчас</span>}
                <h3>{ev.title}</h3>
                <p className="event-note">{ev.note}</p>
                {ev.source && (
                  <a className="event-src" href={ev.source} target="_blank" rel="noopener noreferrer">
                    Источник: {hostOf(ev.source)} ↗
                  </a>
                )}
              </div>
              <div className="event-side">
                <em className={hot ? 'hot' : ''}>{ev.status}</em>
                <a
                  className="event-cta"
                  href={waText(`Здравствуйте! Интересует событие: ${ev.title} (${ev.dates}, ${ev.place}). Хочу поездку под эти даты. Состав: ___, бюджет: ___.`)}
                  onClick={() => track('click_request_tour', { place: 'calendar', event: ev.title })}
                >
                  Подобрать к дате →
                </a>
              </div>
            </article>
          )
        })"""
    t = t[:old_start] + new_block + t[old_end:]
    open(p, 'w', encoding='utf-8').write(t)

# строка «сколько событий и когда обновляли» над списком
p = f'{SITE}/src/components/EventsCalendar.jsx'
t = open(p, encoding='utf-8').read()
if 'calendar-count' not in t:
    t = t.replace("""      <div className="calendar-list">""",
"""      <div className="calendar-bar">
        <span className="calendar-count">{shown.length} {shown.length === 1 ? 'событие' : (shown.length < 5 ? 'события' : 'событий')}{month !== 'все' ? ` · ${month}` : ' · все месяцы'}</span>
        <span className="calendar-sort">сначала ближайшие</span>
      </div>

      <div className="calendar-list">""", 1)
    open(p, 'w', encoding='utf-8').write(t)

print('разметка:', 'ок' if not missed else 'ПРОПУСКИ')
for pth, s in missed:
    print('  ✗', pth, '→', s)
