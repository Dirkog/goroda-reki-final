import React, { useState } from 'react'
import { Page, Breadcrumbs } from '../components/Page'
import EventsCalendar from '../components/EventsCalendar'
import { events, eventsUpdated, site, tgText } from '../data/site'
import { parseDates, googleCalendarLink } from '../lib/ics'
import { withBase } from '../lib/router'
import { basePath } from '../lib/head'
import { track } from '../lib/analytics'

/* Раздел «Календарь»: те же события, но с подпиской.
   Подписка сделана на честных вещах, которые работают без сторонних сервисов:
     • файл календаря (.ics) — подписка в телефоне или компьютере;
     • лента (RSS) — для программ чтения новостей;
     • письмо-напоминание — заявка через ту же форму, что и остальные обращения. */

const fmtDate = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${Number(d)}.${Number(m)}.${y}`
}

export default function Calendar() {
  const base = basePath()
  const icsUrl = base + 'events.ics'
  const rssUrl = base + 'events.xml'
  const webcal = (typeof site !== 'undefined' && site.origin ? site.origin : '') + icsUrl

  const confirmed = events.filter(ev => parseDates(ev.dates))
  const pending = events.filter(ev => !parseDates(ev.dates))
  const [sent, setSent] = useState(false)
  const [mail, setMail] = useState('')
  const [error, setError] = useState('')

  const subscribeByMail = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())) { setError('Проверьте адрес почты.'); return }
    setError('')
    track('calendar_subscribe', {})
    const body = new URLSearchParams({
      name: 'Подписка на календарь',
      contact: mail.trim(),
      direction: 'Напоминания о событиях и фестивалях',
      comment: 'Человек подписался на обновления календаря событий.',
      subject: 'Подписка на календарь событий',
      from_name: `Сайт «${site.name}»`,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      source: 'calendar'
    })
    try {
      await fetch(withBase('/api/lead'), { method: 'POST', body })
    } catch {}
    if (site.web3formsKey) {
      try {
        const fd = new FormData()
        fd.append('access_key', site.web3formsKey)
        for (const [k, v] of body.entries()) fd.append(k, v)
        await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      } catch {}
    }
    setSent(true)
  }

  return (
    <Page className="page-calendar">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Календарь событий' }]} />

      <section className="calendar-hero">
        <p className="eyebrow">календарь событий</p>
        <h1>Куда ехать за впечатлениями</h1>
        <p className="calendar-hero-text">
          Фестивали, парады, цветение и сезонные события с точными датами и ссылками на первоисточники.
          Выберите месяц, чтобы увидеть, что происходит в это время, — и подпишитесь, чтобы не пропустить
          новое: даты сверяю вручную и обновляю календарь.
        </p>
        <p className="calendar-updated">
          <b>Данные обновлены</b> {fmtDate(eventsUpdated)} · в календарь подписки попало {confirmed.length} из {events.length} событий
        </p>
      </section>

      {/* --- подписка --- */}
      <section className="subscribe" aria-labelledby="subscribe-title">
        <div className="subscribe-copy">
          <h2 id="subscribe-title">Подписка на календарь</h2>
          <p>
            Добавьте события в свой календарь — напоминание придёт заранее, когда ещё есть выбор отелей и билетов.
            Или подпишитесь на ленту: она обновляется, когда я подтверждаю новые даты.
          </p>
          <ul className="subscribe-list">
            <li><b>{confirmed.length}</b> события с подтверждёнными датами уже в файле подписки</li>
            <li><b>{pending.length}</b> с пометкой «уточняется» — добавлю после сверки с организаторами</li>
            <li>Источники указаны у каждого события — даты всегда можно проверить</li>
          </ul>
        </div>
        <div className="subscribe-actions">
          <a className="btn light" href={icsUrl} download onClick={() => track('calendar_ics', {})}>Скачать файл календаря (.ics)</a>
          <a className="btn ghost" href={webcal.replace(/^https?:/, 'webcal:')} onClick={() => track('calendar_subscribe_webcal', {})}>
            Подписаться по ссылке (webcal)
          </a>
          <a className="subscribe-link" href={rssUrl} onClick={() => track('calendar_rss', {})}>Лента событий (RSS)</a>
        </div>
      </section>

      <section className="subscribe-mail">
        {sent ? (
          <div className="subscribe-done">
            <b>Подписка оформлена</b>
            <span>Пришлю письмо, когда в календаре появятся новые подтверждённые даты. Отписаться можно в один клик — ответом на письмо.</span>
          </div>
        ) : (
          <form onSubmit={subscribeByMail} noValidate>
            <label>
              <span>Напомнить о событиях по почте</span>
              <input type="email" value={mail} onChange={e => setMail(e.target.value)} placeholder="ваша@почта.ru" autoComplete="email" />
            </label>
            <button className="btn light" type="submit">Подписаться</button>
            {error && <p className="subscribe-error" role="alert">{error}</p>}
            <p className="subscribe-note">
              Почту использую только для напоминаний о событиях. Персональные данные — по{' '}
              <a href={withBase('/politika-konfidencialnosti/')}>политике конфиденциальности</a>.
            </p>
          </form>
        )}
      </section>

      {/* --- сам календарь --- */}
      <EventsCalendar />

      <section className="calendar-explain">
        <h2>Как я работаю с датами</h2>
        <div>
          <article>
            <b>Сверяю по первоисточникам</b>
            <span>Даты фестивалей и сезонов беру с официальных сайтов организаторов — ссылка стоит у каждого события.</span>
          </article>
          <article>
            <b>Проверяю перед оплатой</b>
            <span>Перед бронированием ещё раз подтверждаю даты: если событие перенесли, вы узнаете об этом заранее.</span>
          </article>
          <article>
            <b>Обновляю календарь</b>
            <span>Новые события добавляю по мере анонсов; подписчикам приходит уведомление, ничего не теряется.</span>
          </article>
          <article>
            <b>Собираю поездку под дату</b>
            <span>Билеты, отель, трансфер и программа вокруг события: пришлите состав и бюджет — соберу 2–3 варианта.</span>
          </article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Хотите поездку под конкретное событие?</h2>
          <p>Напишите, какое событие и какие даты интересны, — подберу перелёт, отель и программу вокруг него.</p>
        </div>
        <a className="btn glass" href={tgText('Здравствуйте! Хочу поездку под событие. Событие: ___, даты: ___, состав: ___.')}>
          Написать в Telegram
        </a>
      </section>
    </Page>
  )
}
