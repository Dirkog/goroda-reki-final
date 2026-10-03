import React from 'react'
import { Page } from '../components/Page'
import { nav, tgText } from '../data/site'
import { withBase } from '../lib/router'

export default function NotFound() {
  return (
    <Page className="notfound-page inner-page">
      <div className="notfound">
        
        <h1>Такой страницы нет</h1>
        <p>Возможно, ссылка устарела. Посмотрите разделы ниже или напишите нам — подскажем, где искать нужное.</p>
        <div className="notfound-links">
          {nav.map(n => <a key={n.id} href={withBase(n.path)}>{n.label}</a>)}
        </div>
        <a className="btn light" href={tgText('Здравствуйте! Не нашёл(ла) нужную информацию на сайте: ___')}>Написать в Telegram</a>
      </div>
    </Page>
  )
}
