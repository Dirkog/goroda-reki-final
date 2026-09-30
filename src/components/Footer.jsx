import React from 'react'
import { contacts, site, legal, nav, waText } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <a className="footer-logo" href="/">
          <svg viewBox="0 0 64 64" width="30" height="30" fill="none">
            <path d="M32 6 L50.5 26 H13.5 Z" fill="currentColor" />
            <rect x="19.5" y="26" width="25" height="24" fill="currentColor" />
            <rect x="24" y="30.5" width="5.2" height="6.4" fill="var(--paper)" />
            <rect x="34.8" y="30.5" width="5.2" height="6.4" fill="var(--paper)" />
            <path d="M2.00 45.50 C7.10 42.50 11.90 42.50 17.00 45.50 C22.10 48.50 26.90 48.50 32.00 45.50 C37.10 42.50 41.90 42.50 47.00 45.50 C52.10 48.50 56.90 48.50 62.00 45.50 L62.00 50.50 C56.90 53.50 52.10 53.50 47.00 50.50 C41.90 47.50 37.10 47.50 32.00 50.50 C26.90 53.50 22.10 53.50 17.00 50.50 C11.90 47.50 7.10 47.50 2.00 50.50 Z" fill="currentColor" opacity=".5" />
            <path d="M2.00 53.50 C7.10 50.50 11.90 50.50 17.00 53.50 C22.10 56.50 26.90 56.50 32.00 53.50 C37.10 50.50 41.90 50.50 47.00 53.50 C52.10 56.50 56.90 56.50 62.00 53.50 L62.00 62.00 C56.90 65.00 52.10 65.00 47.00 62.00 C41.90 59.00 37.10 59.00 32.00 62.00 C26.90 65.00 22.10 65.00 17.00 62.00 C11.90 59.00 7.10 59.00 2.00 62.00 Z" fill="currentColor" />
          </svg>
          Ольга Дударева
        </a>
        <p className="footer-role">Личный турагент · города и реки, море и круизы, события</p>
        <p>Личный турагент: подбираю и бронирую поездки для семей, пар и компаний — море, города, события, круизы, корпоративные выезды. Работаю по договору, оплата на расчётный счёт, документы заранее.</p>
        <p className="footer-registry">
          <b>{site.registry.label}</b> — <a href={site.registry.url} target="_blank" rel="noopener noreferrer">проверить в реестре турагентов</a>
        </p>
      </div>
      <div className="footer-cols">
        <div>
          <b>Официально</b>
          <span>{site.legalName} — реестр турагентов {site.registry.label}</span>
          <span>Реквизиты — в договоре, который вы получаете до оплаты</span>
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
          <a href="/politika-konfidencialnosti/">Политика конфиденциальности</a>
          <a href="/istochniki-foto/">Источники фотографий</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Все права защищены.</span>
        <span>Режим работы: {site.workHours}</span>
      </div>
    </footer>
  )
}
