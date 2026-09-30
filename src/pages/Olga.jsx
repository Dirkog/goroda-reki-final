import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'
import { site, waText } from '../data/site'

export default function Olga() {
  return (
    <Page className="olga-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Команда' }]} />
      <SplitTitle
        eyebrow="команда и подход"
        title="Личный контакт внутри сильной команды"
        text="«Города и реки» — онлайн-турагентство под руководством Анны Рогалёвой. В команде 11 менеджеров, и каждая отвечает за свои направления и форматы путешествий."
      />
      <div className="olga-grid">
        <article className="editorial-card big">
          <p>Мы работаем с туристами из разных городов России и из-за рубежа. География не ограничивает: из городов РФ можно организовать любые туры, а из других стран — маршруты на регулярных рейсах.</p>
          <p>Команда сама часто путешествует, поэтому подбор строится не только по параметрам отеля. Важны компания, темп, логистика, настроение поездки и ощущение безопасности.</p>
        </article>
        <blockquote>«Хороший тур — это когда детали не мешают отдыху»</blockquote>
        <article className="editorial-card accent">
          <b>11 экспертов</b>
          <span>Семейный отдых, индивидуальные маршруты, круизы, события и корпоративные выезды.</span>
        </article>
      </div>

      <section className="travel-info-block">
        <h2>Направления, за которые отвечает команда</h2>
        <div>
          <article><b>Семейный отдых</b><span>Пляжные направления с понятной логистикой, отелями для детей и удобными перелётами.</span></article>
          <article><b>Индивидуальные маршруты</b><span>Авторские поездки под ваш темп: города, переезды, гастрономия и впечатления.</span></article>
          <article><b>Круизы и события</b><span>Речные и морские круизы, концерты, фестивали и выезды под конкретную дату.</span></article>
          <article><b>Корпоративные выезды</b><span>Поездки для команд, клиентов и партнёров с деловой частью и отдыхом.</span></article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Хотите узнать, как оформляется тур?</h2>
          <p>Покажем весь путь — от первой заявки до документов перед вылетом и связи в поездке.</p>
        </div>
        <a className="btn glass" href="/kak-rabotaem/">Как оформляется тур</a>
      </section>

      <section className="page-cta light-cta">
        <div className="page-cta-copy">
          <h2>Или сразу к делу</h2>
          <p>Напишите, куда и когда хотите поехать — вернёмся с вариантами.</p>
        </div>
        <a className="btn light" href={waText(`Здравствуйте! Хочу подобрать тур.`)}>Написать в WhatsApp</a>
      </section>
      <p className="page-note">Официально: {site.registry.label} — проверить можно в <a href={site.registry.url} target="_blank" rel="noopener noreferrer">{site.registry.note.toLowerCase()}</a>.</p>
    </Page>
  )
}
