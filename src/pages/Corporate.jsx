import React from 'react'
import { Page } from '../components/Page'

export default function Corporate({ setPage }) {
  return (
    <Page className="corporate-page inner-page">
      <div className="corporate-photo"><img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Корпоративный выезд" /></div>
      <div className="corporate-copy">
        <p className="eyebrow">командам и партнёрам</p>
        <h1>Корпоративный выезд как событие</h1>
        <p>Будь то поездка для команды, клиентов или партнёров — мы подберём направление, перелёты, размещение, программу и официальный порядок оформления.</p>
        <div className="mini-list"><span>Красная Поляна</span><span>Турция</span><span>Куба</span><span>Индонезия</span><span>Марокко</span><span>Таиланд</span></div>
        <button className="btn light" onClick={() => setPage('contacts')}>Обсудить выезд</button>
      </div>

      <section className="travel-info-block" style={{ gridColumn: '1 / -1' }}>
        <h2>Форматы корпоративных поездок</h2>
        <div>
          <article><b>Тимбилдинг-ретрит</b><span>Выезд для сплочения команды: активности, неформальное общение и смена обстановки.</span></article>
          <article><b>Инсентив для клиентов</b><span>Мотивационная поездка для партнёров или лучших клиентов как знак признания.</span></article>
          <article><b>Конференция и отдых</b><span>Деловая программа с площадкой для встреч и продуманным досугом рядом.</span></article>
          <article><b>Партнёрский выезд</b><span>Совместная поездка с партнёрами: переговоры, презентации и общий отдых.</span></article>
        </div>
      </section>

      <section className="travel-info-block" style={{ gridColumn: '1 / -1' }}>
        <h2>Что мы берём на себя</h2>
        <div>
          <article><b>Перелёты и трансферы</b><span>Групповые перелёты, встреча в аэропорту и вся логистика на месте.</span></article>
          <article><b>Отели и площадки</b><span>Размещение под размер группы и залы для деловой части выезда.</span></article>
          <article><b>Программа и активности</b><span>Экскурсии, гастрономия, спорт и события под цель и настроение поездки.</span></article>
          <article><b>Документы и отчётность</b><span>Официальное оформление, договор и закрывающие документы для компании.</span></article>
        </div>
      </section>

      <section className="page-cta" style={{ gridColumn: '1 / -1' }}>
        <div className="page-cta-copy">
          <h2>Расскажите о вашей команде</h2>
          <p>Пришлите размер группы, город вылета, даты и цель выезда — подготовим варианты под задачу.</p>
        </div>
        <button className="btn glass" onClick={() => setPage('contacts')}>Обсудить выезд</button>
      </section>
    </Page>
  )
}
