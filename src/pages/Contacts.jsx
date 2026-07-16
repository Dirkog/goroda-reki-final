import React from 'react'
import { contacts } from '../data/site'
import { Page } from '../components/Page'

export default function Contacts() {
  return (
    <Page className="contacts-page inner-page">
      <div className="contact-copy">
        <p className="eyebrow">контакты</p>
        <h1>Чтобы оставить запрос — напишите в удобный мессенджер</h1>
        <p>В первом сообщении укажите направление, даты, количество взрослых и детей, город вылета, бюджет и что важно в отдыхе. Если направление пока не выбрано — опишите настроение поездки.</p>
      </div>
      <div className="contact-grid">
        <a href={contacts.whatsapp}>WhatsApp <span>+7 915 054-74-07</span></a>
        <a href={contacts.telegram}>Telegram <span>@Olgagorodareki</span></a>
        <a href={contacts.max}>MAX <span>написать</span></a>
        <a href={contacts.vk}>ВКонтакте <span>gorodareki</span></a>
      </div>

      <section className="travel-info-block">
        <h2>Что указать в первом сообщении</h2>
        <div>
          <article><b>Направление и даты</b><span>Страна или город и примерные даты — либо длительность и месяц поездки.</span></article>
          <article><b>Состав поездки</b><span>Сколько взрослых и детей, возраст детей, едете семьёй, парой или командой.</span></article>
          <article><b>Город вылета и бюджет</b><span>Откуда удобно лететь и ориентир по бюджету на человека или на всю поездку.</span></article>
          <article><b>Настроение отдыха</b><span>Что важно: пляж, экскурсии, спокойствие, активность, гастрономия или события.</span></article>
        </div>
      </section>

      <section className="travel-info-block">
        <h2>Как мы отвечаем</h2>
        <div>
          <article><b>Быстрый ответ</b><span>Отвечаем в течение дня, в рабочие часы — как правило, в течение пары часов.</span></article>
          <article><b>Полностью онлайн</b><span>Всё общение, подбор и оформление проходят в мессенджере — приезжать в офис не нужно.</span></article>
          <article><b>Без спешки</b><span>Не давим на решение: спокойно сравниваем варианты и объясняем условия.</span></article>
          <article><b>Личный менеджер</b><span>За вашим запросом закрепляется менеджер по нужному направлению.</span></article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Ещё не выбрали направление?</h2>
          <p>Напишите пару слов о желаемом отдыхе — предложим идеи под ваши даты, состав и бюджет.</p>
        </div>
        <a className="btn glass" href={contacts.whatsapp}>Написать в WhatsApp</a>
      </section>
    </Page>
  )
}
