import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'
import { site, team, pastTrips, tgText } from '../data/site'

export default function Olga() {
  return (
    <Page className="olga-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Команда' }]} />
      <SplitTitle
        eyebrow="команда и подход"
        title="Личный контакт внутри сильной команды"
        text="Я личный турагент: работаю в команде онлайн-турагентства «Города и реки» под руководством Анны Рогалёвой. В команде 11 менеджеров, и каждая отвечает за свои направления и форматы путешествий."
      />

      <div className="olga-grid">
        <article className="editorial-card big">
          <p>
            Меня зовут <b>{team.lead}</b>, я менеджер команды «Города и реки»: {team.leadExperience} подбираю путешествия
            для моих туристов. Работаю онлайн — офиса с очередями нет, зато есть личный контакт с тем, кто ведёт вашу поездкуициально — под руководством {team.owner},
            {' '}{team.ownerRole}.
          </p>
          <p>
            Мои туристы живут в разных городах России и за её пределами, поэтому география не ограничивает:
            из городов РФ можно организовать любой тур, из других стран — маршруты на регулярных рейсах.
          </p>
          <p>
            Я сама постоянно в пути — {team.ownTravels.toLowerCase()}. Поэтому советуем не
            по параметрам отеля, а по тому, что проверено лично: какие переезды комфортны, где стоит брать экскурсии,
            как построить темп поездки, чтобы детали не мешали отдыху.
          </p>
        </article>
        <blockquote>«Хороший тур — это когда детали не мешают отдыху»</blockquote>
        <article className="editorial-card accent">
          <b>{team.managers} экспертов</b>
          <span>Семейный отдых, индивидуальные маршруты, круизы, события и корпоративные выезды.</span>
        </article>
      </div>

      <section className="travel-info-block">
        <h2>Направления, за которые отвечает команда</h2>
        <div>
          <article><b>Семейный отдых</b><span>{pastTrips.family.slice(0, 8).join(', ')} и другие направления с понятной логистикой.</span></article>
          <article><b>Событийные поездки</b><span>Концерты, фестивали и чемпионаты: подбираем отель и перелёт под дату события.</span></article>
          <article><b>Круизы</b><span>{pastTrips.cruises.join(', ')} — речные и морские маршруты.</span></article>
          <article><b>Корпоративные выезды</b><span>{pastTrips.corporate.join(', ')} — для команд, клиентов и партнёров.</span></article>
        </div>
      </section>

      <section className="travel-info-block">
        <h2>Что я уже организовала</h2>
        <div className="facts-grid">
          <article>
            <b>События</b>
            <ul className="plain-list">{pastTrips.events.map(x => <li key={x}>{x}</li>)}</ul>
          </article>
          <article>
            <b>Круизы и корпоративы</b>
            <ul className="plain-list">
              {pastTrips.cruises.map(x => <li key={x}>Круиз {x}</li>)}
              {pastTrips.corporate.map(x => <li key={x}>Корпоративный выезд: {x}</li>)}
            </ul>
          </article>
          <article>
            <b>Семейные поездки</b>
            <ul className="plain-list">{pastTrips.family.map(x => <li key={x}>{x}</li>)}</ul>
          </article>
          <article>
            <b>Как я работаю</b>
            <ul className="plain-list">
              <li>Договор оформляем до оплаты</li>
              <li>Оплата — на расчётный счёт, чек на почту</li>
              <li>Документы за 4–7 дней до выезда</li>
              <li>Связь с вами до возвращения домой</li>
              <li>Номер агентства в реестре: {site.registry.label}</li>
            </ul>
          </article>
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
        <a className="btn light" href={tgText('Здравствуйте! Хочу подобрать тур. Направление: ___, даты: ___.')}>Написать в Telegram</a>
      </section>
    </Page>
  )
}
