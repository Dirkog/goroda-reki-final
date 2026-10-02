import Logo from './Logo'
import React from 'react'
import { contacts, site, legal, nav, tgText } from '../data/site'
import { withBase } from '../lib/router'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <a className="footer-logo" href={withBase('/')}>
          <Logo size={46} />
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
          <a href={tgText('Здравствуйте! Хочу подобрать тур.')}>Telegram</a>
          <a href={contacts.max}>MAX</a>
          <a href={contacts.vk}>ВКонтакте</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <div>
          <b>Разделы</b>
          {nav.filter(n => n.id !== 'home').map(n => <a key={n.id} href={withBase(n.path)}>{n.label}</a>)}
          <a href={withBase('/oferta/')}>Договор и оферта</a>
          <a href={withBase('/politika-konfidencialnosti/')}>Политика конфиденциальности</a>
          <a href={withBase('/istochniki-foto/')}>Источники фотографий</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Все права защищены.</span>
        <span>Режим работы: {site.workHours}</span>
      </div>
    </footer>
  )
}
