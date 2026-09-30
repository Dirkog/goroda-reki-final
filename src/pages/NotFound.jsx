import React from 'react'
import { Page } from '../components/Page'
import { nav, waText } from '../data/site'

export default function NotFound() {
  return (
    <Page className="notfound-page inner-page">
      <div className="notfound">
        <p className="eyebrow">ошибка 404</p>
        <h1>Такой страницы нет</h1>
        <p>Возможно, ссылка устарела. Посмотрите разделы ниже или напишите нам — подскажем, где искать нужное.</p>
        <div className="notfound-links">
          {nav.map(n => <a key={n.id} href={n.path}>{n.label}</a>)}
        </div>
        <a className="btn light" href={waText('Здравствуйте! Не нашёл(ла) нужную информацию на сайте: ___')}>Написать в WhatsApp</a>
      </div>
    </Page>
  )
}
