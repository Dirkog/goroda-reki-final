import React from 'react'
import { Page } from '../components/Page'

export default function Trust() {
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
    </Page>
  )
}
