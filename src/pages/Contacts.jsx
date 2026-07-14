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
    </Page>
  )
}
