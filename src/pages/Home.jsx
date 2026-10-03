import React from 'react'
import { Page } from '../components/Page'
import LeadForm from '../components/LeadForm'
import EventsCalendar from '../components/EventsCalendar'
import { TripImage } from '../components/Media'
import HeroFilm from '../components/HeroFilm'
import { site, tripCards, tgText } from '../data/site'
import { track } from '../lib/analytics'
import { withBase } from '../lib/router'

function Scene({ title, note, children, id, kind }) {
  return (
    <section className={`scene reveal ${kind || ''}`} id={id}>
      <div className="scene-head">
        <h2>{title}</h2>
      </div>
      {note && <p className="scene-note" style={{ marginBottom: '28px' }}>{note}</p>}
      {children}
    </section>
  )
}

const B = import.meta.env.BASE_URL
const stripKruiz = { image: `${B}images/strips/fjord.jpg`, imageWebp: `${B}images/strips/fjord.webp`, title: 'Норвежские фьорды', region: 'Согнефьорд, Норвегия' }

const ROWS = [
  {
    path: '/bystryy-tur/',
    title: 'Быстрый тур',
    text: 'Вылет через неделю или раньше? Напишите даты, город вылета и бюджет. В течение рабочего дня пришлю варианты, которые есть в наличии.'
  },
  {
    path: '/tury-iz-vashego-goroda/',
    title: 'Тур из вашего города',
    text: 'Скажите, откуда летите и куда хотите. Соберу маршрут целиком: перелёт, трансфер, отель, страховка. Если прямого рейса нет, найду удобную пересадку.'
  },
  {
    path: '/turagent/',
    title: 'Личный турагент вместо колл-центра',
    text: 'Один человек от первого сообщения до возвращения домой: знает ваш запрос, считает варианты и отвечает сам, когда что-то пошло не так.'
  }
]

const STEPS = [
  ['Вы пишете, что хочется', 'Куда, когда, сколько человек, сколько лет детям, из какого города вылет и какой бюджет. Хватит нескольких строк в Telegram или звонка.'],
  ['Я считаю варианты', 'Присылаю 2–4 варианта с рейсами, отелями и итоговой ценой, рассказываю, чем они отличаются и где подвох.'],
  ['Договор и оплата', 'Сначала договор, потом деньги. Оплата на расчётный счёт, после неё приходит электронный чек.'],
  ['Документы и поездка', 'Билеты, ваучеры и страховку отправляю за 4–7 дней до вылета. В поездке на связи, если что-то нужно изменить или уточнить.']
]

export default function Home() {
  return (
    <Page className="home-page">
      <HeroFilm>
        <div className="cinema-copy">
          <h1 className="cinema-title">Личный турагент Ольга</h1>
          <p className="cinema-sub">Подберу поездку и останусь на связи</p>
          <p className="cinema-lead">
            Здравствуйте, меня зовут Ольга. Подбираю путешествия для семей, пар и небольших компаний: от быстрого тура на ближайшие даты до круиза или поездки на фестиваль. Вы пишете мне напрямую, а не в колл-центр. Договор до оплаты, на связи до возвращения домой.
          </p>
          <div className="cinema-actions">
            <a className="btn light" href={tgText('Здравствуйте, Ольга! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_telegram', { place: 'hero' })}>Написать в Telegram</a>
            <a className="btn glass" href="#scene-directions">Выбрать направление</a>
          </div>
          <p className="cinema-phone">
            Или позвоните: <a href={site.phoneHref} onClick={() => track('click_phone', { place: 'hero' })}>{site.phone}</a>
          </p>
        </div>

        <p className="cinema-facts">
          <span>В реестре турагентов, {site.registry.label}</span>
          <span>Договор до оплаты</span>
          <span>Ежедневно 10:00–21:00 МСК</span>
        </p>
      </HeroFilm>

      <Scene id="scene-directions" title="Куда поехать"
        note="Несколько направлений с ориентирами по сезону и бюджету. Цены примерные, точный расчёт делаю под ваши даты.">
        <figure className="interlude reveal">
          <span className="interlude-media" aria-hidden="true">
            <picture>
              {stripKruiz.imageWebp && <source type="image/webp" srcSet={stripKruiz.imageWebp} />}
              <img src={stripKruiz.image} alt={`${stripKruiz.title}, ${stripKruiz.region}`} width="1800" height="771" loading="lazy" decoding="async" />
            </picture>
          </span>
          <span className="interlude-scrim" aria-hidden="true" />
          <figcaption>
            <b>{stripKruiz.title}</b>
            <span>{stripKruiz.region}</span>
          </figcaption>
        </figure>
        <div className="trip-grid home-grid">
          {tripCards.slice(0, 6).map((card) => (
            <a className="trip-teaser" key={card.slug} href={withBase('/napravleniya/')}>
              <span className="trip-media"><TripImage card={card} eager={false} /></span>
              <span className="trip-scrim" aria-hidden="true" />
              <span className="trip-teaser-body">
                <em>{card.category}</em>
                <b>{card.title}</b>
                <small>{card.region}</small>
                <span className="trip-teaser-price">{card.budget}<i>{card.budgetNote}</i></span>
              </span>
            </a>
          ))}
        </div>
        <p className="scene-note" style={{ marginTop: '24px' }}>
          <a className="section-link" href={withBase('/napravleniya/')}>Все направления, фильтры и цены →</a>
        </p>
      </Scene>

      <Scene id="scene-events" title="Поездки на фестивали и события"
        note="Цветение, парады, праздники. Даты сверяю с сайтами организаторов и обновляю календарь.">
        <EventsCalendar bare limit={4} />
        <a className="section-link" href={withBase('/kalendar/')}>Смотреть весь календарь событий →</a>
      </Scene>

      <Scene id="scene-help" title="С чем ко мне приходят">
        <ul className="rows">
          {ROWS.map(r => (
            <li key={r.path}>
              <a href={withBase(r.path)}>
                <b>{r.title}</b>
                <span>{r.text}</span>
                <i aria-hidden="true">→</i>
              </a>
            </li>
          ))}
        </ul>
      </Scene>

      <Scene id="scene-steps" title="Как всё проходит">
        <ol className="how-list">
          {STEPS.map(([t, d]) => (
            <li key={t}><b>{t}</b><span>{d}</span></li>
          ))}
        </ol>
      </Scene>

      <Scene id="scene-request" title="Расскажите о вашей поездке"
        note="Напишите направление, примерные даты и бюджет. Отвечу в течение рабочего дня, обычно через 15–30 минут.">
        <div className="home-lead-block">
          <div className="home-lead-copy">
            <p>Если проще написать в мессенджер, пишите туда: сообщение приходит мне лично. Помогу выбрать отель, проверю правила въезда и сроки документов.</p>
            <div className="home-lead-contacts">
              <a href={tgText('Здравствуйте, Ольга! Помогите подобрать тур.')} className="btn light">Написать в Telegram</a>
              <a href={site.phoneHref} className="btn glass">{site.phone}</a>
            </div>
          </div>
          <div className="home-lead-form">
            <LeadForm />
          </div>
        </div>
      </Scene>
    </Page>
  )
}
