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

const plural = (n) => {
  const t = n % 10, h = n % 100
  const w = t === 1 && h !== 11 ? 'событие' : (t >= 2 && t <= 4 && (h < 12 || h > 14) ? 'события' : 'событий')
  return `${n} ${w}`
}

export default function Calendar() {
  const base = basePath()
  const icsUrl = base + 'events.ics'
  const rssUrl = base + 'events.xml'
  const webcal = (typeof site !== 'undefined' && site.origin ? site.origin : '') + icsUrl

  const confirmed = events.filter(ev => parseDates(ev.dates))
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
    <Page className="page-calendar inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'События' }]} />

      <header className="calendar-hero">
        <h1>События, ради которых стоит поехать</h1>
        <p className="calendar-hero-text">
          Цветение, парады и праздники ближайшего сезона. У каждого — даты, место и ссылка на организаторов.
          Понравилось что-то — я соберу поездку под эти числа.
        </p>
        <p className="calendar-updated"><b>Данные обновлены</b> {fmtDate(eventsUpdated)}</p>
      </header>

      <EventsCalendar head={false} />

      {/* --- подписка: один компактный блок --- */}
      <section className="subscribe" aria-labelledby="subscribe-title">
        <div className="subscribe-copy">
          <h2 id="subscribe-title">Чтобы не пропустить даты</h2>
          <p>
            Добавьте события в календарь телефона — напомню заранее, пока есть выбор отелей и билетов.
            В файле {plural(confirmed.length)} с подтверждёнными датами; остальные добавлю после сверки с организаторами.
          </p>
          <div className="subscribe-actions">
            <a className="btn light" href={icsUrl} download onClick={() => track('calendar_ics', {})}>Скачать календарь (.ics)</a>
            <a className="btn ghost" href={webcal.replace(/^https?:/, 'webcal:')} onClick={() => track('calendar_subscribe_webcal', {})}>Подписаться (webcal)</a>
            <a className="subscribe-link" href={rssUrl} onClick={() => track('calendar_rss', {})}>RSS-лента</a>
          </div>
        </div>
        <div className="subscribe-mail">
          {sent ? (
            <div className="subscribe-done">
              <b>Подписка оформлена</b>
              <span>Пришлю письмо, когда появятся новые подтверждённые даты. Отписаться можно ответом на письмо.</span>
            </div>
          ) : (
            <form onSubmit={subscribeByMail} noValidate>
              <label>
                <span>Или напомнить по почте</span>
                <input type="email" value={mail} onChange={e => setMail(e.target.value)} placeholder="ваша@почта.ru" autoComplete="email" />
              </label>
              <button className="btn light" type="submit">Подписаться</button>
              {error && <p className="subscribe-error" role="alert">{error}</p>}
              <p className="subscribe-note">
                Почту использую только для напоминаний. Данные — по{' '}
                <a href={withBase('/politika-konfidencialnosti/')}>политике конфиденциальности</a>.
              </p>
            </form>
          )}
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Нужна поездка под конкретное событие?</h2>
          <p>Напишите, какое событие и какие даты — подберу перелёт, отель и программу вокруг него.</p>
        </div>
        <a className="btn glass" href={tgText('Здравствуйте! Хочу поездку под событие. Событие: ___, даты: ___, состав: ___.')}>
          Написать в Telegram
        </a>
      </section>
    </Page>
  )
}
