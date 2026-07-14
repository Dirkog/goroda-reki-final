import React from 'react'
import { contacts } from '../data/site'

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <button className="footer-logo" onClick={() => setPage('home')}>Города и реки</button>
        <p>Онлайн-турагентство для семейных поездок, событийных маршрутов, круизов, индивидуальных туров и корпоративных выездов.</p>
      </div>
      <div className="footer-cols">
        <div><b>Официально</b><span>РТА 0005142</span><span>Договор до оплаты</span><span>Оплата на расчётный счёт</span></div>
        <div><b>Связаться</b><a href={contacts.whatsapp}>WhatsApp</a><a href={contacts.telegram}>Telegram</a><a href={contacts.max}>MAX</a><a href={contacts.vk}>ВКонтакте</a></div>
        <div><b>Разделы</b><button onClick={() => setPage('trips')}>Путешествия</button><button onClick={() => setPage('process')}>Как работаем</button><button onClick={() => setPage('trust')}>Надёжность</button></div>
      </div>
    </footer>
  )
}
