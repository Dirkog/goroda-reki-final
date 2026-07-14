import React from 'react'
import { Page } from '../components/Page'

export default function Corporate({ setPage }) {
  return (
    <Page className="corporate-page inner-page">
      <div className="corporate-photo"><img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Корпоративный выезд" /></div>
      <div className="corporate-copy">
        <p className="eyebrow">командам и партнёрам</p>
        <h1>Корпоративный выезд как событие</h1>
        <p>Будь то поездка для команды, клиентов или партнёров — мы подберём направление, перелёты, размещение, программу и официальный порядок оформления.</p>
        <div className="mini-list"><span>Красная Поляна</span><span>Турция</span><span>Куба</span><span>Индонезия</span><span>Марокко</span><span>Таиланд</span></div>
        <button className="btn light" onClick={() => setPage('contacts')}>Обсудить выезд</button>
      </div>
    </Page>
  )
}
