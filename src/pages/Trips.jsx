import React, { useEffect, useMemo, useState } from 'react'
import { Page, SplitTitle } from '../components/Page'
import { tripCards, waText, contacts } from '../data/site'
import { track } from '../lib/analytics'
import { TripImage } from '../components/Media'

const FILTERS = ['Все', 'Море', 'Сезоны', 'События', 'Круизы', 'Корпоративным', 'Природа']

function TripCard({ card, index }) {
  const request = () => track('click_request_tour', { tour: card.title })
  const msg = `Здравствуйте! Интересует «${card.title}» (${card.region}). Даты: ___, состав: ___. Пришлите варианты и цены.`
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
          <a className="btn light" href={waText(msg)} target="_blank" rel="noopener noreferrer" onClick={request}>Запросить этот тур</a>
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

  // Фильтр можно задать ссылкой: /napravleniya/?cat=Море
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
    // «Рекомендуемые» = авторский порядок; «по алфавиту» — реальная сортировка
    if (sort === 'az') list.sort((a, b) => a.card.title.localeCompare(b.card.title, 'ru'))
    else if (sort === 'budget') list.sort((a, b) => (parseInt(a.card.budget.replace(/\D/g, ''), 10) || 9e9) - (parseInt(b.card.budget.replace(/\D/g, ''), 10) || 9e9))
    else list.sort((a, b) => a.i - b.i)
    return list.map(x => x.card)
  }, [query, filter, sort])

  return (
    <Page className="trips-page inner-page">
      <SplitTitle
        eyebrow="каталог идей"
        title="Направления: откуда начать"
        text="Это не прайс, а витрина: по каждому направлению видно сезон, бюджет и длительность. Выберите формат или напишите мне — соберу конкретные отели, даты и цены под вашу поездку."
      />

      <div className="trips-tools">
        <label className="trips-search">
          <span>Поиск по витрине</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Япония, море, круиз, команда…" type="search" />
        </label>
        <label className="trips-sort">
          <span>Порядок</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="popular">Рекомендуемые</option>
            <option value="az">По алфавиту</option>
            <option value="budget">Сначала дешевле</option>
          </select>
        </label>
        <a className="trips-calendar-link" href="/#scene-01">
          Сначала посмотреть календарь событий →
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
          <h2>Ничего не найдено</h2>
          <p>Попробуйте другой запрос или напишите команде — часто направление можно собрать индивидуально.</p>
          <a className="btn light" href={waText('Здравствуйте! Не нашёл(ла) подходящее направление на сайте. Ищу: ___')}>Написать в WhatsApp</a>
        </div>
      )}

      <section className="travel-info-block">
        <h2>Что можно запросить дополнительно</h2>
        <div>
          <article><b>Комбинация стран</b><span>Маршрут с несколькими городами, пересадками и разным ритмом поездки.</span></article>
          <article><b>Семейные нюансы</b><span>Возраст детей, питание, пляж, трансферы, детская инфраструктура.</span></article>
          <article><b>Событие под дату</b><span>Концерт, фестиваль, спорт, праздник или сезон цветения.</span></article>
          <article><b>Регулярные рейсы</b><span>Если вы находитесь не в России, можно собрать маршрут в любую точку мира.</span></article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Не нашли своё направление?</h2>
          <p>Опишите поездку в двух словах: месяц, состав, бюджет и настроение — предложим 2–3 варианта.</p>
        </div>
        <a className="btn glass" href={waText('Здравствуйте! Хочу тур. Направление: ___, даты: ___, бюджет: ___')}>Написать в WhatsApp</a>
      </section>
    </Page>
  )
}
