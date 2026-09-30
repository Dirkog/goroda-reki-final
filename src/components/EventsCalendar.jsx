import React, { useState } from 'react'
import { events, eventsUpdated, site, waText } from '../data/site'
import { track } from '../lib/analytics'

/* Календарь событий — своя полезная штука вместо «калькулятора тура».
   Логика: человек выбирает месяц и видит, что происходит в мире в это время,
   с датами, местом и ссылкой на первоисточник. Под каждым событием — кнопка
   «подобрать поездку под эти даты»: заявка приходит сразу с контекстом. */

const MONTH_ORDER = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

function monthOf(ev) {
  const raw = String(ev.month || ev.dates || '').toLowerCase()
  return MONTH_ORDER.find(m => raw.includes(m.slice(0, 5))) || ''
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'источник' }
}

function fmtDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${Number(d)}.${Number(m)}.${y}`
}

export default function EventsCalendar({ limit, bare = false }) {
  const [month, setMonth] = useState('все')
  const list = (limit ? events.slice(0, limit) : events).map(ev => ({ ...ev, _month: monthOf(ev) }))
  const months = ['все', ...MONTH_ORDER.filter(m => list.some(e => e._month === m))]
  const shown = month === 'все' ? list : list.filter(e => e._month === month)

  return (
    <div className="calendar">
      <div className={bare ? 'calendar-head is-bare' : 'calendar-head'}>
        <div>
          {!bare && <p className="eyebrow">календарь событий</p>}
          {!bare && <h2>Куда ехать за впечатлениями</h2>}
          {!bare ? (
            <p>
              Фестивали, парады, цветение и сезонные события с точными датами. Выберите месяц — покажу,
              что происходит в это время, и подберу поездку под эти даты. Источники указаны у каждого события.
            </p>
          ) : (
            <p className="calendar-intro">Источники указаны у каждого события: даты всегда можно проверить.</p>
          )}
        </div>
        <p className="calendar-updated">
          <b>Данные обновлены</b>
          {fmtDate(eventsUpdated)}
        </p>
      </div>

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

      <div className="calendar-bar">
        <span className="calendar-count">{shown.length} {shown.length === 1 ? 'событие' : (shown.length < 5 ? 'события' : 'событий')}{month !== 'все' ? ` · ${month}` : ' · все месяцы'}</span>
        <span className="calendar-sort">сначала ближайшие</span>
      </div>

      <div className="calendar-list">
        {shown.map(ev => {
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
        })        })}
      </div>

      <div className="calendar-foot">
        <span>
          Даты сверяю с официальными источниками и обновляю календарь вручную — если событие перенесут, вы узнаете об этом до оплаты.
        </span>
        <a href={waText('Здравствуйте! Хочу поездку под событие. Событие: ___, даты: ___')} onClick={() => track('click_whatsapp', { place: 'calendar' })}>
          Подобрать под событие в WhatsApp
        </a>
      </div>
    </div>
  )
}
