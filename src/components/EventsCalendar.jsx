import React, { useState } from 'react'
import { events, eventsUpdated, site, tgText } from '../data/site'
import { track } from '../lib/analytics'

/* Календарь событий — своя полезная штука вместо «калькулятора тура».
   Логика: человек выбирает месяц и видит, что происходит в мире в это время,
   с датами, местом и ссылкой на первоисточник. Под каждым событием — кнопка
   «подобрать поездку под эти даты»: заявка приходит сразу с контекстом. */

const MONTH_ORDER = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

// Месяцы, которые охватывает событие (по датам начала и конца): Кёкенхоф идёт с марта по май —
// значит, виден и в «марте», и в «апреле», и в «мае».
function monthsOf(ev) {
  if (!ev.start) return []
  const from = new Date(ev.start + 'T00:00:00Z')
  const to = new Date((ev.end || ev.start) + 'T00:00:00Z')
  const res = []
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1))
  while (d <= to) { res.push(MONTH_ORDER[d.getUTCMonth()]); d.setUTCMonth(d.getUTCMonth() + 1) }
  return res
}

function hostOf(url) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, '')
    return h.includes('xn--') ? 'сайт организаторов' : h
  } catch { return '' }
}

const isUrl = (v) => /^https?:\/\//i.test(String(v || ''))

function fmtDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${Number(d)}.${Number(m)}.${y}`
}

export default function EventsCalendar({ limit, bare = false, head = true }) {
  const [month, setMonth] = useState('все')
  const sorted = [...events].sort((x, y) => String(x.start).localeCompare(String(y.start)))
  const list = (limit ? sorted.slice(0, limit) : sorted).map(ev => ({ ...ev, _months: monthsOf(ev) }))
  const months = ['все', ...MONTH_ORDER.filter(m => list.some(e => e._months.includes(m)))]
  const shown = month === 'все' ? list : list.filter(e => e._months.includes(month))
  const Title = bare ? 'h3' : 'h2' // на главной над списком уже есть h2, на отдельной странице заголовки идут сразу после h1

  return (
    <div className="calendar">
      {!bare && head && (
        <div className="calendar-head">
          <div>
            <h2>Календарь событий</h2>
            <p>Выберите месяц — покажу, что происходит в это время. Источник указан у каждого события.</p>
          </div>
          <p className="calendar-updated"><b>Данные обновлены</b>{fmtDate(eventsUpdated)}</p>
        </div>
      )}

      {!bare && (
        <div className="calendar-months" role="tablist" aria-label="Месяц события">
          {months.map(m => (
            <button
              key={m}
              role="tab"
              aria-selected={month === m}
              className={month === m ? 'active' : ''}
              onClick={() => { setMonth(m); track('calendar_filter', { month: m }) }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      <div className="calendar-list">
        {shown.map(ev => {
          const src = hostOf(ev.source)
          return (
            <article className="event-row" key={ev.title}>
              {ev.image && (
                <div className="event-photo">
                  <img src={`${import.meta.env.BASE_URL}images/events/${ev.image}.webp`} alt={`${ev.title} — ${ev.place}`} width="960" height="640" loading="lazy" decoding="async" />
                  <em className={ev.status === 'анонс' ? 'event-badge' : 'event-badge is-soft'}>{ev.status}</em>
                </div>
              )}
              <div className="event-body">
                <p className="event-when"><b>{ev.dates}</b><span>{ev.place}</span></p>
                <Title>{ev.title}</Title>
                <p className="event-note">{ev.note}</p>
                <div className="event-actions">
                  <a
                    className="event-cta"
                    href={tgText(`Здравствуйте! Интересует событие: ${ev.title} (${ev.dates}, ${ev.place}). Хочу поездку под эти даты. Состав: ___, бюджет: ___.`)}
                    onClick={() => track('click_request_tour', { place: 'calendar', event: ev.title })}
                  >
                    Подобрать поездку →
                  </a>
                  {isUrl(ev.source) && src ? (
                    <a className="event-src" href={ev.source} target="_blank" rel="noopener noreferrer">{src} ↗</a>
                  ) : (ev.source ? <span className="event-src is-text">Даты: {ev.source}</span> : null)}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
