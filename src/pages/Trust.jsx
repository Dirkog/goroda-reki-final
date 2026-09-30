import React from 'react'
import { Page, Breadcrumbs } from '../components/Page'
import { site, legal } from '../data/site'

export default function Trust() {
  return (
    <Page className="trust-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Надёжность' }]} />
      <div className="registry-hero">
        <p className="eyebrow">надёжность</p>
        <h1>{site.registry.label}</h1>
        <p>Меня и агентство можно проверить в Едином федеральном реестре турагентов. Мы работаем полностью онлайн и полностью официально.</p>
        <p className="registry-hero-actions">
          <a className="btn light" href={site.registry.url} target="_blank" rel="noopener noreferrer">Проверить в реестре турагентов</a>
        </p>
      </div>

      <div className="trust-list">
        <article><b>Договор до оплаты</b><span>Предоплата производится только на основании договора.</span></article>
        <article><b>Расчётный счёт</b><span>Оплата идёт на расчётный счёт агентства, не на личные карты.</span></article>
        <article><b>Чек на почту</b><span>После оплаты чек отправляется на электронную почту туриста.</span></article>
        <article><b>Документы заранее</b><span>Полный комплект документов приходит за 4–7 дней до путешествия.</span></article>
      </div>

      <section className="travel-info-block">
        <h2>Документы, которые вы получаете</h2>
        <div>
          <article><b>Договор</b><span>Официальный договор с условиями тура, оформляется до внесения предоплаты.</span></article>
          <article><b>Чек об оплате</b><span>Фискальный чек приходит на электронную почту сразу после оплаты.</span></article>
          <article><b>Брони и билеты</b><span>Подтверждения отелей, авиабилеты и ваучеры на трансферы и экскурсии.</span></article>
          <article><b>Памятка перед вылетом</b><span>Маршрут, важные детали направления и контакты для связи в поездке.</span></article>
        </div>
      </section>

      <section className="travel-info-block">
        <h2>Как проверить нас самостоятельно</h2>
        <div>
          <article><b>Реестр турагентов</b><span>Найдите номер {site.registry.label} в Едином федеральном реестре турагентов по ИНН или названию.</span></article>
          <article><b>Реквизиты в договоре</b><span>Все данные исполнителя указаны в договоре, который вы получаете до оплаты, — их легко сверить с реестром турагентов.</span></article>
          <article><b>Оплата на счёт</b><span>Платёж проходит на расчётный счёт компании, а не на личные карты.</span></article>
          <article><b>Отзывы и соцсети</b><span>Реальные отзывы туристов и мои направления открыты в соцсетях и на картах.</span></article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Остались вопросы о безопасности сделки?</h2>
          <p>Расскажем, как проходит договор, оплата и оформление документов — без обязательств.</p>
        </div>
        <a className="btn glass" href="/kontakty/">Задать вопрос</a>
      </section>
      <p className="page-note">
        Документы и условия: <a href="/oferta/">договор и публичная оферта</a>, <a href="/politika-konfidencialnosti/">политика обработки персональных данных</a>.
      </p>
    </Page>
  )
}
