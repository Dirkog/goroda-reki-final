import React from 'react'
import { Page } from '../components/Page'
import LeadForm from '../components/LeadForm'
import EventsCalendar from '../components/EventsCalendar'
import { TripImage } from '../components/Media'
import HeroFilm from '../components/HeroFilm'
import { contacts, site, steps, tripCards, faq, pastTrips, team, tgText } from '../data/site'
import { track } from '../lib/analytics'
import { withBase } from '../lib/router'

// Каждая секция страницы — «сцена»: номер слева, заголовок на одной линии во всех сценах,
// одинаковая ширина колонки и один и тот же вертикальный ритм.
function Scene({ num, kicker, title, note, children, id, kind }) {
  return (
    <section className={`scene reveal ${kind || ''}`} id={id}>
      <div className="scene-head">
        <span className="scene-num">{num}</span>
        <div>
          {kicker && <p className="eyebrow">{kicker}</p>}
          <h2>{title}</h2>
        </div>
      </div>
      {note && <p className="scene-note" style={{ marginBottom: '28px' }}>{note}</p>}
      {children}
    </section>
  )
}

// Широкие полосы между сценами: отдельные снимки 21:9, чтобы не повторять карточки
const B = import.meta.env.BASE_URL
const stripKruiz = { image: `${B}images/strips/fjord.jpg`, imageWebp: `${B}images/strips/fjord.webp`, title: 'Норвежские фьорды', region: 'Согнефьорд, Норвегия' }
const stripSakura = { image: `${B}images/strips/tulips.jpg`, imageWebp: `${B}images/strips/tulips.webp`, title: 'Фестиваль тюльпанов', region: 'Болленстрек, Нидерланды' }

export default function Home() {
  return (
    <Page className="home-page">
      {/* Кадр во весь экран: видео/фото, грейд, заголовок как титр, факты в нижней строке */}
      <HeroFilm>

          <div className="cinema-copy">
            <h1 className="cinema-title">Подберу поездку{' '}<br />и останусь на связи</h1>
            <p className="cinema-lead">
              Меня зовут Ольга Дударева. Подбираю и бронирую путешествия для семей, пар и компаний: море, города,
              события, круизы. Один человек от первого сообщения до возвращения домой — без «передаю ваш вопрос менеджеру».
            </p>
            <div className="cinema-actions">
              <a className="btn light" href={tgText('Здравствуйте, Ольга! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_telegram', { place: 'hero' })}>Написать в Telegram</a>
              <a className="btn glass" href="#scene-01">Календарь событий</a>
            </div>
            <div className="cinema-sign">
              <b>Ольга Дударева</b>
              <span>личный турагент · {team.leadExperience.toLowerCase()}</span>
              <a href={site.phoneHref} onClick={() => track('click_phone', { place: 'hero' })}>{site.phone}</a>
            </div>
          </div>

          <div className="cinema-foot">
            <div><b>РТА 0005142</b><span>агентство в реестре турагентов</span></div>
            <div><b>Договор до оплаты</b><span>оплата на расчётный счёт, чек</span></div>
            <div><b>{team.managers} специалистов</b><span>подключаю по сложным направлениям</span></div>
            <div><b>На связи в поездке</b><span>не только до вылета</span></div>
            <span className="cinema-scroll" aria-hidden="true">листайте<i /></span>
          </div>
      </HeroFilm>

      <Scene num="01" id="scene-01" kicker="календарь событий" title="Куда ехать за впечатлениями"
        note="Фестивали, парады, цветение и сезонные события с точными датами. Выберите месяц — покажу, что происходит в это время, и подберу поездку под эти даты.">
        <EventsCalendar bare limit={4} />
        <a className="section-link" href={withBase('/kalendar/')}>Весь календарь и подписка →</a>
      </Scene>

      <Scene num="02" kicker="направления" title="Что подбираю чаще всего"
        note="Витрина направлений: бюджет, сезон и длительность. Если нужного нет — соберу под ваш запрос, в том числе комбинированные маршруты.">
        <figure className="interlude reveal">
          <span className="interlude-media" aria-hidden="true">
            <picture>
              {stripKruiz.imageWebp && <source type="image/webp" srcSet={stripKruiz.imageWebp} />}
              <img src={stripKruiz.image} alt={`${stripKruiz.title} — ${stripKruiz.region}`} width="1800" height="771" loading="lazy" decoding="async" />
            </picture>
          </span>
          <span className="interlude-scrim" aria-hidden="true" />
          <figcaption>
            <em>направление месяца</em>
            <b>{stripKruiz.title}</b>
            <span>{stripKruiz.region} · маршруты от 6 дней, сезон с мая по сентябрь</span>
          </figcaption>
        </figure>
        <div className="trip-grid home-grid">
          {tripCards.slice(0, 6).map((card, i) => (
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
          <a className="section-link" href={withBase('/napravleniya/')}>Все направления и цены →</a>
        </p>
      </Scene>

      <Scene num="03" kicker="как проходит работа" title="Четыре шага до поездки"
        note="Никаких «оставьте заявку — менеджер свяжется»: работаем разговором и понятными шагами. Договор оформляем до оплаты, документы приходят заранее.">
        <div className="steps-track home-steps">
          {steps.slice(0, 4).map(([num, title, text]) => (
            <article className="step" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>

      </Scene>

      <Scene num="04" kicker="заявка на подбор" title="Расскажите о поездке — подберу варианты"
        note="Напишите направление, даты, состав и бюджет. Первые варианты пришлю в течение дня, в рабочее время — обычно за 1–2 часа.">
        <div className="home-lead-block">
          <div className="home-lead-copy">
            <ul className="check-list">
              <li>Подбор и консультация — бесплатно, без обязательств</li>
              <li>Сравниваю перелёты, отели и условия, объясняю разницу простыми словами</li>
              <li>Договор оформляем до оплаты, оплата — на расчётный счёт</li>
              <li>Отвечаю лично, обычно в течение 15 минут в рабочее время</li>
            </ul>
            <p className="home-lead-alt">
              Удобнее сразу в мессенджер: <a href={contacts.telegram}>Telegram</a> · <a href={contacts.vk}>ВКонтакте</a> · <a href={contacts.max}>MAX</a> · <a href={site.phoneHref}>{site.phone}</a>
            </p>
          </div>
          <LeadForm compact />
        </div>
      </Scene>

      <Scene num="05" kicker="опыт" title="Что уже организовано">
        <figure className="interlude reveal">
          <span className="interlude-media" aria-hidden="true">
            <picture>
              {stripSakura.imageWebp && <source type="image/webp" srcSet={stripSakura.imageWebp} />}
              <img src={stripSakura.image} alt={`${stripSakura.title} — ${stripSakura.region}`} width="1800" height="771" loading="lazy" decoding="async" />
            </picture>
          </span>
          <span className="interlude-scrim" aria-hidden="true" />
          <figcaption>
            <em>куда поехать за впечатлениями</em>
            <b>{stripSakura.title}</b>
            <span>{stripSakura.region} · весна и осень, 4–7 дней, удобно совместить с соседними городами</span>
          </figcaption>
        </figure>
        <div className="experience-grid">
          <article><b>События и фестивали</b><p>{pastTrips.events.slice(0, 5).join(' · ')}</p></article>
          <article><b>Круизы</b><p>По рекам России, Персидский залив, Средиземное море, Норвежские фьорды.</p></article>
          <article><b>Корпоративные выезды</b><p>{pastTrips.corporate.join(' · ')}</p></article>
          <article><b>Семейный отдых</b><p>{pastTrips.family.join(' · ')}</p></article>
        </div>
        <p className="experience-note">
          Веду поездки вместе с командой «Города и реки»: {team.owner} отвечает за договоры и оплату,
          коллеги-специалисты подключаются по сложным направлениям. Но общаетесь вы со мной — это моя работа,
          {team.ownTravels.toLowerCase()}.
        </p>
        <p className="scene-note" style={{ marginTop: '20px' }}>
          <a className="section-link" href={withBase('/komanda/')}>О команде →</a>
        </p>
      </Scene>

      <Scene num="06" kicker="частые вопросы" title="Отвечаю честно">
        <div className="faq-list">
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className="faq-more">Не нашли ответ? <a href={withBase('/kontakty/')}>Задайте вопрос — отвечу без обязательств</a>.</p>
      </Scene>
    </Page>
  )
}
