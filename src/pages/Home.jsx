import React, { useEffect, useState } from 'react'
import { Page } from '../components/Page'
import LeadForm from '../components/LeadForm'
import { TripImage } from '../components/Media'
import { contacts, heroVideo, site, steps, tripCards, faq, pastTrips, team, waText } from '../data/site'
import { track } from '../lib/analytics'

// Видео грузим только там, где оно не вредит: не на мобильных, не при экономии трафика,
// не при отключённой анимации — и только после того, как страница отрисовалась.
function HeroMedia() {
  const [videoOn, setVideoOn] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 760px)').matches
    const conn = navigator.connection || {}
    const saveData = conn.saveData || /2g|slow-2g|3g/.test(conn.effectiveType || '')
    if (reduce || small || saveData) return
    const start = () => setVideoOn(true)
    if (window.requestIdleCallback) window.requestIdleCallback(start, { timeout: 2500 })
    else setTimeout(start, 1500)
  }, [])

  return (
    <div className="flight-hero">
      <img className="hero-photo" src={heroVideo.poster} alt="Вид с высоты на реку, лесистые берега и город" width="1920" height="1080" fetchpriority="high" decoding="async" />
      {videoOn && !failed && (
        <video className="flight-video" autoPlay muted loop playsInline preload="none" poster={heroVideo.poster} onError={() => setFailed(true)} aria-hidden="true">
          <source src={heroVideo.mp4} type="video/mp4" />
        </video>
      )}
      <div className="horizon-glow" aria-hidden="true" />
    </div>
  )
}

export default function Home() {
  return (
    <Page className="home-page">
      <section className="home-hero">
        <HeroMedia />
        <div className="hero-content">
          <p className="eyebrow">официальное турагентство · РТА 0005142</p>
          <h1>Путешествия, которые хочется вспоминать</h1>
          <p className="hero-lead">
            Подбираем и бронируем туры для семей, пар, компаний и корпоративных групп: море, города, круизы, события.
            Договор до оплаты, оплата на расчётный счёт, поддержка до возвращения домой.
          </p>
          <div className="hero-actions">
            <a className="btn light" href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_whatsapp', { place: 'hero' })}>Написать в WhatsApp</a>
            <a className="btn glass" href="/napravleniya/">Смотреть направления</a>
          </div>
          <p className="hero-note">Отвечаем в течение 15 минут в рабочее время. Подбор — бесплатно.</p>
        </div>
        <nav className="hero-search" aria-label="Быстрый переход">
          <div><span>Куда</span><b>море · город · круиз</b></div>
          <div><span>Когда</span><b>даты или месяц</b></div>
          <div><span>Кто едет</span><b>семья · пара · команда</b></div>
          <a className="hero-search-go" href="/napravleniya/">Подобрать тур</a>
        </nav>
      </section>

      <aside className="home-trust" aria-label="Ключевые факты">
        {[
          ['РТА 0005142', 'агентство в реестре турагентов'],
          ['Договор до оплаты', 'оплата на расчётный счёт и чек'],
          ['11 менеджеров', 'свой специалист по направлению'],
          ['Связь 24/7', 'помогаем и в поездке, не только до'],
          ['Документы заранее', 'за 4–7 дней до выезда'],
          ['Работаем из любой страны', 'маршруты на регулярных рейсах']
        ].map(([b, s]) => <div key={b}><b>{b}</b><span>{s}</span></div>)}
      </aside>

      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">направления</p>
            <h2>Что подбираем чаще всего</h2>
          </div>
          <a className="section-link" href="/napravleniya/">Все направления →</a>
        </div>
        <div className="trip-grid home-grid">
          {tripCards.slice(0, 6).map((card, i) => (
            <a className="trip-teaser" key={card.slug} href="/napravleniya/">
              <TripImage card={card} eager={i === 0} />
              <span className="trip-teaser-body">
                <em>{card.category}</em>
                <b>{card.title}</b>
                <small>{card.region}</small>
                <span className="trip-teaser-price">{card.budget}<i>{card.budgetNote}</i></span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">как это работает</p>
            <h2>Четыре шага до поездки</h2>
          </div>
          <a className="section-link" href="/kak-rabotaem/">Подробно о процессе →</a>
        </div>
        <div className="steps-track home-steps">
          {steps.slice(0, 4).map(([num, title, text]) => (
            <article className="step" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="home-section home-lead-block">
        <div className="home-lead-copy">
          <p className="eyebrow">заявка на подбор</p>
          <h2>Расскажите о поездке — подберём варианты</h2>
          <p>Заполните короткую форму: направление, даты, состав и бюджет. Первые варианты пришлём в течение дня, в рабочее время — обычно за 1–2 часа.</p>
          <ul className="check-list">
            <li>Подбор и консультация — бесплатно, без обязательств</li>
            <li>Сравниваем перелёты, отели и условия, объясняем разницу</li>
            <li>Договор оформляем до оплаты, оплата — на расчётный счёт</li>
          </ul>
          <p className="home-lead-alt">Удобнее сразу в мессенджер: <a href={contacts.telegram}>Telegram</a> · <a href={contacts.vk}>ВКонтакте</a> · <a href={contacts.max}>MAX</a> · <a href={site.phoneHref}>{site.phone}</a></p>
        </div>
        <LeadForm compact />
      </section>

      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">опыт команды</p>
            <h2>Что мы уже организовали</h2>
          </div>
          <a className="section-link" href="/komanda/">О команде →</a>
        </div>
        <div className="experience-grid">
          <article><b>События и фестивали</b><p>{pastTrips.events.slice(0, 5).join(' · ')}</p></article>
          <article><b>Круизы</b><p>По рекам России, Персидский залив, Средиземное море, Норвежские фьорды.</p></article>
          <article><b>Корпоративные выезды</b><p>{pastTrips.corporate.join(' · ')}</p></article>
          <article><b>Семейный отдых</b><p>{pastTrips.family.join(' · ')}</p></article>
        </div>
        <p className="experience-note">
          {team.lead} — {team.leadRole.toLowerCase()}, {team.leadExperience}. Команда сама путешествует 1–2 раза в месяц,
          поэтому советуем только проверенное лично.
        </p>
      </section>

      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">частые вопросы</p>
            <h2>Отвечаем честно</h2>
          </div>
        </div>
        <div className="faq-list">
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className="faq-more">Не нашли ответ? <a href="/kontakty/">Задайте вопрос — ответим без обязательств</a>.</p>
      </section>
    </Page>
  )
}
