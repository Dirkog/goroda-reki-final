import React from 'react'
import { Page, Breadcrumbs } from '../components/Page'
import LeadForm from '../components/LeadForm'
import { waText } from '../data/site'
import { Img } from '../components/Media'

export default function Corporate() {
  return (
    <Page className="corporate-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Корпоративным' }]} />
      <div className="corporate-photo">
        <Img
          src={`${import.meta.env.BASE_URL}images/trips/corporate-team.jpg`}
          webp={`${import.meta.env.BASE_URL}images/trips/corporate-team.webp`}
          alt="Команда на корпоративном выезде" width="1200" height="800"
        />
      </div>
      <div className="corporate-copy">
        <p className="eyebrow">командам и партнёрам</p>
        <h1>Корпоративный выезд как событие</h1>
        <p>Поездка для команды, клиентов или партнёров: подберём направление, перелёты, размещение, программу и оформим всё официально — с договором и закрывающими документами для компании.</p>
        <div className="mini-list"><span>Красная Поляна</span><span>Турция</span><span>Куба</span><span>Индонезия</span><span>Марокко</span><span>Таиланд</span></div>
        <div className="corporate-actions">
          <a className="btn light" href={waText('Здравствуйте! Нужен корпоративный выезд. Группа: ___, даты: ___, задача: ___')}>Обсудить выезд</a>
          <a className="btn ghost" href="#brief">Прислать бриф</a>
        </div>
      </div>

      <section className="travel-info-block">
        <h2>Форматы корпоративных поездок</h2>
        <div>
          <article><b>Тимбилдинг-ретрит</b><span>Выезд для сплочения команды: активности, неформальное общение и смена обстановки.</span></article>
          <article><b>Инсентив для клиентов</b><span>Мотивационная поездка для партнёров или лучших клиентов как знак признания.</span></article>
          <article><b>Конференция и отдых</b><span>Деловая программа с площадкой для встреч и продуманным досугом рядом.</span></article>
          <article><b>Партнёрский выезд</b><span>Совместная поездка с партнёрами: переговоры, презентации и общий отдых.</span></article>
        </div>
      </section>

      <section className="travel-info-block">
        <h2>Что мы берём на себя</h2>
        <div>
          <article><b>Перелёты и трансферы</b><span>Групповые перелёты, встреча в аэропорту и вся логистика на месте.</span></article>
          <article><b>Отели и площадки</b><span>Размещение под размер группы и залы для деловой части выезда.</span></article>
          <article><b>Программа и активности</b><span>Экскурсии, гастрономия, спорт и события под цель и настроение поездки.</span></article>
          <article><b>Документы и отчётность</b><span>Официальное оформление, договор и закрывающие документы для компании и бухгалтерии.</span></article>
        </div>
      </section>

      <section className="corporate-brief" id="brief">
        <div>
          <h2>Пришлите бриф — подготовим варианты</h2>
          <p>Достаточно размера группы, города вылета, дат, бюджета и цели выезда. Обычно присылаем 2–3 варианта с разной логикой: «экономично», «сбалансированно», «максимальный опыт».</p>
          <ul className="check-list">
            <li>Считаем бюджет на группу и на человека</li>
            <li>Предлагаем площадки для деловой части</li>
            <li>Готовим договор, счёт и закрывающие документы</li>
          </ul>
        </div>
        <LeadForm compact preset={{ direction: 'Корпоративный выезд' }} />
      </section>
    </Page>
  )
}
