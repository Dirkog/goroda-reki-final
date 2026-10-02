import React, { useEffect, useMemo, useState } from 'react'
import { Page, SplitTitle } from '../components/Page'
import { tripCards, tgText, contacts } from '../data/site'
import { track } from '../lib/analytics'
import { TripImage } from '../components/Media'
import { withBase } from '../lib/router'

const FILTERS = ['Все', 'Море', 'Сезоны', 'События', 'Круизы', 'Корпоративным', 'Природа']

function TripCard({ card, index }) {
  const request = () => track('click_request_tour', { tour: card.title })
  const msg = `Здравствуйте, Ольга! Интересует «${card.title}» (${card.region}). Даты: ___, состав: ___. Пришлите варианты и расчет.`
  return (
    <article className="trip-card rich" id={card.slug}>
      <span className="trip-media"><TripImage card={card} /></span>
      <span className="trip-scrim" aria-hidden="true" />
      <div className="trip-top"><span>{card.category}</span><b>{card.duration}</b></div>
      <div className="trip-body">
        <h2>{card.title}</h2>
        <p>{card.text}</p>
        <dl>
          <div><dt>Регион</dt><dd>{card.region}</dd></div>
          <div><dt>Сезон</dt><dd>{card.season}</dd></div>
          <div><dt>Бюджет</dt><dd>{card.budget}<small>{card.budgetNote}</small></dd></div>
        </dl>
        <div className="tag-row">{card.tags.map(tag => <em key={tag}>{tag}</em>)}</div>
        <div className="trip-actions">
          <a className="btn light" href={tgText(msg)} target="_blank" rel="noopener noreferrer" onClick={request}>Запросить этот тур</a>
          <a className="trip-actions-alt" href={contacts.telegram}>или в Telegram</a>
        </div>
      </div>
    </article>
  )
}

export default function Trips() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Все')
  const [sort, setSort] = useState('popular')

  useEffect(() => {
    try {
      const cat = new URLSearchParams(window.location.search).get('cat')
      if (cat && FILTERS.includes(cat)) setFilter(cat)
    } catch {}
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = tripCards
      .map((card, i) => ({ card, i }))
      .filter(({ card }) => {
        const inFilter = filter === 'Все' || card.category === filter
        const hay = `${card.title} ${card.category} ${card.region} ${card.text} ${card.tags.join(' ')}`.toLowerCase()
        return inFilter && (!q || hay.includes(q))
      })
    if (sort === 'az') list.sort((a, b) => a.card.title.localeCompare(b.card.title, 'ru'))
    else if (sort === 'budget') list.sort((a, b) => (parseInt(a.card.budget.replace(/\D/g, ''), 10) || 9e9) - (parseInt(b.card.budget.replace(/\D/g, ''), 10) || 9e9))
    else list.sort((a, b) => a.i - b.i)
    return list.map(x => x.card)
  }, [query, filter, sort])

  return (
    <Page className="trips-page inner-page">
      <SplitTitle
        title="Куда поехать: проверенные направления"
        text="Витрина идей с понятным бюджетом, сезоном и длительностью. Подберу конкретные отели, перелеты и подготовлю расчет под ваши даты."
      />

      <div className="trips-tools">
        <label className="trips-search">
          <span>Поиск по направлениям</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Япония, море, круиз, команда…" type="search" />
        </label>
        <label className="trips-sort">
          <span>Порядок</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="popular">Рекомендуемые</option>
            <option value="az">По алфавиту</option>
            <option value="budget">Сначала доступные</option>
          </select>
        </label>
        <a className="trips-calendar-link" href={withBase('/kalendar/')}>
          Посмотреть события и фестивали →
        </a>
      </div>

      <div className="filter-row" role="tablist" aria-label="Фильтр по формату">
        {FILTERS.map(item => (
          <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'active' : ''} onClick={() => { setFilter(item); track('filter_trips', { filter: item }) }}>{item}</button>
        ))}
      </div>

      <div className="trip-grid catalog">
        {visible.map((card, i) => <TripCard card={card} key={card.slug} index={i} />)}
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <h2>Ничего не нашлось</h2>
          <p>Напишите мне в Telegram — соберу индивидуальный маршрут под ваш запрос.</p>
          <a className="btn light" href={tgText('Здравствуйте, Ольга! Не нашёл(ла) нужное направление на сайте. Ищу: ___')}>Написать в Telegram</a>
        </div>
      )}

      {/* Объединенный блок корпоративных поездок (бывшая страница /korporativnym/) */}
      <section className="travel-info-block" id="corporate-section" style={{ marginTop: '56px' }}>
        <h2>Организация выездов для компаний и команд</h2>
        <div>
          <article>
            <b>Инсентив и тимбилдинг</b>
            <span>Выезды для сотрудников и партнёров: подбор комфортного отеля с инфраструктурой, закрывающие документы для бухгалтерии.</span>
          </article>
          <article>
            <b>Стратегические сессии и конференции</b>
            <span>Оборудованные площадки, логистика перелётов для участников из разных городов, единый координатор на всем маршруте.</span>
          </article>
          <article>
            <b>Полный пакет закрывающих документов</b>
            <span>Работа по безналичному расчёту с юридическими лицами (договор, счёт, акты, отчётность по перелётам и проживанию).</span>
          </article>
          <article>
            <b>Индивидуальный сценарий</b>
            <span>Сочетание деловой программы с экскурсиями, активным отдыхом или гастрономическими ужинами.</span>
          </article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Нужен нестандартный или сложный тур?</h2>
          <p>Скомбинирую несколько городов, подберу удобные стыковки и учту все пожелания семьи или компании.</p>
        </div>
        <a className="btn glass" href={tgText('Здравствуйте, Ольга! Хочу подобрать индивидуальный маршрут: направление ___, даты ___, пожелания ___')}>Написать в Telegram</a>
      </section>
    </Page>
  )
}
