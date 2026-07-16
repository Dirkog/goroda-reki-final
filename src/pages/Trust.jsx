import React from 'react'
import { Page } from '../components/Page'

export default function Trust({ setPage }) {
  return (
    <Page className="trust-page inner-page">
      <div className="registry-hero">
        <p className="eyebrow">надёжность</p>
        <h1>РТА 0005142</h1>
        <p>Информацию о нас можно проверить в Едином федеральном реестре турагентов. Мы работаем полностью онлайн и полностью официально.</p>
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
          <article><b>Реестр турагентов</b><span>Найдите номер РТА 0005142 в Едином федеральном реестре турагентов.</span></article>
          <article><b>Реквизиты в договоре</b><span>Все данные агентства указаны в договоре — их легко сверить.</span></article>
          <article><b>Оплата на счёт</b><span>Платёж проходит на расчётный счёт компании, а не на личные карты.</span></article>
          <article><b>Отзывы и соцсети</b><span>Реальные отзывы туристов и наши направления открыты в соцсетях.</span></article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Остались вопросы о безопасности сделки?</h2>
          <p>Расскажем, как проходит договор, оплата и оформление документов — без обязательств.</p>
        </div>
        <button className="btn glass" onClick={() => setPage('contacts')}>Задать вопрос</button>
      </section>
    </Page>
  )
}
