#!/usr/bin/env python3
"""Правки по замечаниям: анимация перехода (dissolve + waterfall), фото как фон,
кнопка «Написать» → Telegram. Скрипт идемпотентный: повторный запуск ничего не ломает."""
import sys, re

SITE = '/home/user/work/site'
missed, done = [], []

def edit(path, pairs, optional=False):
    p = f'{SITE}/{path}'
    t = open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in t:
            if not optional:
                missed.append((path, old[:70].replace('\n', ' ')))
            continue
        t = t.replace(old, new, 1)
        done.append(path)
    open(p, 'w', encoding='utf-8').write(t)

# ---------- 1. подключение движка анимаций ----------
edit('src/App.jsx', [
    ("import CookieNotice from './components/CookieNotice'",
     "import CookieNotice from './components/CookieNotice'\nimport ScrollMotion from './components/ScrollMotion'"),
    ("      <StickyCta />", "      <StickyCta />\n      <ScrollMotion />"),
])

# ---------- 2. кнопки: «Написать» в Telegram ----------
edit('src/components/Header.jsx', [
    (""">Написать Ольге</a>""", """>Написать</a>"""),
    ("""href={waText(`Здравствуйте! Хочу подобрать тур. Направление: ___, даты: ___, состав: ___.`)} onClick={() => track('click_whatsapp', { place: 'header' })}>Написать""",
     """href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'header' })}>Написать"""),
    ("""<a className="btn light mobile-menu-cta" href={waText('Здравствуйте! Хочу подобрать тур.')} onClick={() => track('click_whatsapp', { place: 'menu' })}>WhatsApp</a>
            <a className="btn ghost mobile-menu-cta" href={contacts.telegram}>Telegram</a>""",
     """<a className="btn light mobile-menu-cta" href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'menu' })}>Написать в Telegram</a>
            <a className="btn ghost mobile-menu-cta" href={waText('Здравствуйте! Хочу подобрать тур.')} onClick={() => track('click_whatsapp', { place: 'menu' })}>WhatsApp</a>"""),
])

edit('src/components/StickyCta.jsx', [
    ("""href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, взрослых ___, детей ___.')} onClick={() => track('click_whatsapp', { place: 'sticky' })}>""",
     """href={contacts.telegram} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'sticky' })}>"""),
    ("""<b>Подобрать тур</b><small>ответим за 15 минут</small>""",
     """<b>Написать</b><small>отвечу в рабочее время</small>"""),
    ("""<a className="sticky-cta-alt" href={contacts.telegram} onClick={() => track('click_telegram', { place: 'sticky' })} aria-label="Написать в Telegram">TG</a>""",
     """<a className="sticky-cta-alt" href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___.')} onClick={() => track('click_whatsapp', { place: 'sticky' })} aria-label="Написать в WhatsApp">WA</a>"""),
])

# ---------- 3. разметка: фото как фон + мост перехода ----------
edit('src/pages/Home.jsx', [
    ("""function Scene({ num, kicker, title, note, children, id }) {""",
     """function Scene({ num, kicker, title, note, children, id, kind }) {"""),
    ("""    <section className="scene" id={id}>""",
     """    <section className={`scene reveal ${kind || ''}`} id={id}>"""),
    ("""      <section className="home-frame">""", """      <section className="home-frame">"""),
    ("""              <TripImage card={card} eager={false} />
              <span className="trip-teaser-body">
                <em>{card.category}</em>
                <b>{card.title}</b>
                <small>{card.region}</small>
                <span className="trip-teaser-price">{card.budget}<i>{card.budgetNote}</i></span>
              </span>""",
     """              <span className="trip-media"><TripImage card={card} eager={false} /></span>
              <span className="trip-scrim" aria-hidden="true" />
              <span className="trip-teaser-body">
                <em>{card.category}</em>
                <b>{card.title}</b>
                <small>{card.region}</small>
                <span className="trip-teaser-price">{card.budget}<i>{card.budgetNote}</i></span>
              </span>"""),
])

edit('src/pages/Trips.jsx', [
    ("""      <TripImage card={card} />""",
     """      <span className="trip-media"><TripImage card={card} /></span>
      <span className="trip-scrim" aria-hidden="true" />"""),
])

print('файлов затронуто:', len(set(done)))
if missed:
    print('НЕ найдено:')
    for p, s in missed:
        print('  ✗', p, '→', s)
else:
    print('все замены применены')
