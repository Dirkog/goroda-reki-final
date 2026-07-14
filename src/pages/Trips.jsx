import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { tripCards } from '../data/site'
import { Page, SplitTitle } from '../components/Page'

const filters = ['Все', 'Море', 'Сезоны', 'События', 'Круизы', 'Корпоративным', 'Природа']

function TripCard({ card }) {
  const videoRef = useRef(null)
  const play = () => { const v = videoRef.current; if (v) { v.currentTime = 0; v.play().catch(() => {}) } }
  const stop = () => { const v = videoRef.current; if (v) v.pause() }
  return (
    <motion.article className="trip-card rich" layout onMouseEnter={play} onMouseLeave={stop}>
      <img src={card.image} alt={card.title} loading="lazy" />
      <video ref={videoRef} muted playsInline loop preload="none"><source src={card.video} type="video/mp4" /></video>
      <div className="trip-top"><span>{card.category}</span><b>{card.duration}</b></div>
      <div className="trip-body">
        <h2>{card.title}</h2>
        <p>{card.text}</p>
        <dl><div><dt>Регион</dt><dd>{card.region}</dd></div><div><dt>Сезон</dt><dd>{card.season}</dd></div><div><dt>Бюджет</dt><dd>{card.budget}</dd></div></dl>
        <div className="tag-row">{card.tags.map(tag => <em key={tag}>{tag}</em>)}</div>
      </div>
    </motion.article>
  )
}

export default function Trips({ setPage }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Все')
  const [sort, setSort] = useState('popular')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tripCards.filter(card => {
      const inFilter = filter === 'Все' || card.category === filter
      const hay = `${card.title} ${card.category} ${card.region} ${card.text} ${card.tags.join(' ')}`.toLowerCase()
      return inFilter && (!q || hay.includes(q))
    }).sort((a,b) => sort === 'az' ? a.title.localeCompare(b.title, 'ru') : 0)
  }, [query, filter, sort])

  return (
    <Page className="trips-page inner-page">
      <SplitTitle eyebrow="каталог идей" title="Поиск тура начинается с настроения" text="Это не полный прайс, а витрина направлений. Фильтруйте по формату, смотрите сценарии и отправляйте запрос — менеджер соберёт конкретные варианты под даты и бюджет." />
      <div className="tour-search-panel">
        <label><span>Поиск</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Япония, море, круиз, команда…" /></label>
        <label><span>Сортировка</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="popular">Рекомендуемые</option><option value="az">По алфавиту</option></select></label>
        <button onClick={() => setPage('contacts')}>Оставить запрос</button>
      </div>
      <div className="filter-row">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <motion.div className="trip-grid catalog" layout>
        {visible.map(card => <TripCard card={card} key={card.title} />)}
      </motion.div>
      {visible.length === 0 && <div className="empty-state"><h2>Ничего не найдено</h2><p>Попробуйте другой запрос или напишите команде — часто направление можно собрать индивидуально.</p></div>}
      <section className="travel-info-block">
        <h2>Что можно запросить дополнительно</h2>
        <div><article><b>Комбинация стран</b><span>Маршрут с несколькими городами, пересадками и разным ритмом поездки.</span></article><article><b>Семейные нюансы</b><span>Возраст детей, питание, пляж, трансферы, детская инфраструктура.</span></article><article><b>Событие под дату</b><span>Концерт, фестиваль, спорт, праздник или сезон цветения.</span></article><article><b>Регулярные рейсы</b><span>Если вы находитесь не в России, можно собрать маршрут в любую точку мира.</span></article></div>
      </section>
    </Page>
  )
}
