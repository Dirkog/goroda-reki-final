import React from 'react'
import { contacts, site, legal, nav, waText } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <a className="footer-logo" href="/">{site.name}</a>
        <p>Онлайн-турагентство для семейных поездок, событийных маршрутов, круизов, индивидуальных туров и корпоративных выездов. Работаем по договору, оплата — на расчётный счёт.</p>
        <p className="footer-registry">
          <b>{site.registry.label}</b> — <a href={site.registry.url} target="_blank" rel="noopener noreferrer">проверить в реестре турагентов</a>
        </p>
      </div>
      <div className="footer-cols">
        <div>
          <b>Официально</b>
          <span>{legal.entity}</span>
          <span>ИНН {legal.inn} · ОГРН {legal.ogrn}</span>
          <span>Адрес: {legal.address}</span>
        </div>
        <div>
          <b>Связаться</b>
          <a href={waText('Здравствуйте! Хочу подобрать тур.')}>WhatsApp</a>
          <a href={contacts.telegram}>Telegram</a>
          <a href={contacts.max}>MAX</a>
          <a href={contacts.vk}>ВКонтакте</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <div>
          <b>Разделы</b>
          {nav.filter(n => n.id !== 'home').map(n => <a key={n.id} href={n.path}>{n.label}</a>)}
          <a href="/oferta/">Договор и оферта</a>
          <a href="/politika-konfidencialnosti/">Политика обработки данных</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Все права защищены.</span>
        <span>Режим работы: {site.workHours}</span>
      </div>
    </footer>
  )
}
