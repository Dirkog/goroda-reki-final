import React from 'react'
import { Page } from '../components/Page'
import LeadForm from '../components/LeadForm'
import EventsCalendar from '../components/EventsCalendar'
import { TripImage } from '../components/Media'
import HeroFilm from '../components/HeroFilm'
import { contacts, site, tripCards, team, tgText } from '../data/site'
import { track } from '../lib/analytics'
import { withBase } from '../lib/router'

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

const B = import.meta.env.BASE_URL
const stripKruiz = { image: `${B}images/strips/fjord.jpg`, imageWebp: `${B}images/strips/fjord.webp`, title: 'Норвежские фьорды', region: 'Согнефьорд, Норвегия' }

export default function Home() {
  return (
    <Page className="home-page">
      {/* Кинематографический экран: живое видео, спокойный темп, личный заголовок */}
      <HeroFilm>
        <div className="cinema-copy">
          <h1 className="cinema-title">Подберу поездку<br />и останусь на связи</h1>
          <p className="cinema-lead">
            Здравствуйте! Я Ольга Дударева — ваш личный турагент. Подбираю путешествия для семей, пар и небольших компаний. 
            Никаких безликих операторов: общаемся напрямую, договор до оплаты, остаюсь на связи в мессенджере вплоть до возвращения домой.
          </p>
          <div className="cinema-actions">
            <a className="btn light" href={tgText('Здравствуйте, Ольга! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_telegram', { place: 'hero' })}>Написать в Telegram</a>
            <a className="btn glass" href="#scene-directions">Выбрать направление</a>
          </div>
          <div className="cinema-sign">
            <b>Ольга Дударева</b>
            <span>личный турагент · проверенные маршруты</span>
            <a href={site.phoneHref} onClick={() => track('click_phone', { place: 'hero' })}>{site.phone}</a>
          </div>
        </div>

        <div className="cinema-foot">
          <div><b>РТА 0005142</b><span>в реестре турагентов РФ</span></div>
          <div><b>Договор до оплаты</b><span>безналичный расчёт, чек ФНС</span></div>
          <div><b>Индивидуальный подбор</b><span>под ваш бюджет и ритм</span></div>
          <div><b>Лично на связи</b><span>помощь в поездке 24/7</span></div>
          <span className="cinema-scroll" aria-hidden="true">листайте<i /></span>
        </div>
      </HeroFilm>

      {/* Сцена 1: Куда поехать (Направления) */}
      <Scene num="01" id="scene-directions" kicker="направления" title="Куда сейчас хорошо поехать"
        note="Ориентиры по сезонам и бюджетам. Сравню проверенные отели и удобные рейсы под ваши даты.">
        <figure className="interlude reveal">
          <span className="interlude-media" aria-hidden="true">
            <picture>
              {stripKruiz.imageWebp && <source type="image/webp" srcSet={stripKruiz.imageWebp} />}
              <img src={stripKruiz.image} alt={`${stripKruiz.title} — ${stripKruiz.region}`} width="1800" height="771" loading="lazy" decoding="async" />
            </picture>
          </span>
          <span className="interlude-scrim" aria-hidden="true" />
          <figcaption>
            <em>выбор сезона</em>
            <b>{stripKruiz.title}</b>
            <span>{stripKruiz.region} · круизы и видовые маршруты</span>
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

      {/* Сцена 2: События и фестивали */}
      <Scene num="02" id="scene-events" kicker="события и фестивали" title="Поездки с ярким поводом"
        note="Фестивали, сезонное цветение и культурные праздники с точными датами. Подберу тур так, чтобы попасть в эпицентр событий.">
        <EventsCalendar bare limit={4} />
        <a className="section-link" href={withBase('/kalendar/')}>Смотреть весь календарь событий →</a>
      </Scene>

      {/* Сцена 3: Понятный процесс без канцелярита */}
      <Scene num="03" id="scene-steps" kicker="порядок работы" title="Как мы готовим ваше путешествие"
        note="Никакой бюрократии: спокойный диалог в мессенджере и прозрачные этапы.">
        <div className="steps-track home-steps">
          <article className="step">
            <span>01</span>
            <h3>Диалог и пожелания</h3>
            <p>Вы рассказываете в Telegram или по телефону о планах, датах, составе семьи и комфортном бюджете.</p>
          </article>
          <article className="step">
            <span>02</span>
            <h3>Персональный расчет</h3>
            <p>Готовлю 2–4 подходящих варианта с прямыми рейсами, реальными отзывами об отелях и понятной стоимостью.</p>
          </article>
          <article className="step">
            <span>03</span>
            <h3>Договор и оплата</h3>
            <p>Оформляем официальный договор до внесения денег. Оплата на банковский счёт с выдачей электронного чека.</p>
          </article>
          <article className="step">
            <span>04</span>
            <h3>Документы и забота</h3>
            <p>Высылаю билеты, ваучеры и страховку за 4–7 дней. Напоминаю об онлайн-регистрации и на связи в поездке.</p>
          </article>
        </div>
      </Scene>

      {/* Сцена 4: Форма заявки */}
      <Scene num="04" kicker="заявка на подбор" title="Расскажите о вашей поездке"
        note="Напишите желаемое направление, примерные даты и бюджет. Отвечу лично в течение рабочего дня (обычно 15–30 минут).">
        <div className="home-lead-block">
          <div className="home-lead-copy">
            <p><b>Ольга Дударева</b> · Личный турагент</p>
            <p>Всегда на связи в Telegram и по телефону. Помогу выбрать отель, перепроверю правила въезда и избавлю от предпраздничной суеты.</p>
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
