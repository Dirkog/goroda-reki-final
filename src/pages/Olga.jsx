import React from 'react'
import { Page, SplitTitle } from '../components/Page'

export default function Olga({ setPage }) {
  return (
    <Page className="olga-page inner-page">
      <SplitTitle eyebrow="команда и подход" title="Личный контакт внутри сильной команды" text="«Города и реки» — онлайн-турагентство под руководством Анны Рогалёвой. В команде 11 менеджеров, и каждая отвечает за свои направления и форматы путешествий." />
      <div className="olga-grid">
        <article className="editorial-card big"><p>Мы работаем с туристами из разных городов России и из-за рубежа. География не ограничивает: из городов РФ можно организовать любые туры, а из других стран — маршруты на регулярных рейсах.</p><p>Команда сама часто путешествует, поэтому подбор строится не только по параметрам отеля. Важны компания, темп, логистика, настроение поездки и ощущение безопасности.</p></article>
        <blockquote>«Хороший тур — это когда детали не мешают отдыху»</blockquote>
        <article className="editorial-card accent"><b>11 экспертов</b><span>Семейный отдых, индивидуальные маршруты, круизы, события и корпоративные выезды.</span></article>
      </div>
      <button className="btn light" onClick={() => setPage('process')}>Как оформляется тур</button>
    </Page>
  )
}
