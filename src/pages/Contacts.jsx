import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'
import LeadForm from '../components/LeadForm'
import { contacts, site, tgText, legal } from '../data/site'
import { track } from '../lib/analytics'

export default function Contacts() {
  return (
    <Page className="contacts-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Контакты' }]} />
      <SplitTitle
        title="Напишите мне напрямую"
        text="Быстрее всего — в Telegram. Можно позвонить или оставить заявку: отвечу сама, без передачи стажёрам и ожидания на линии."
      />

      <div className="contact-layout">
        <div className="contact-side">
          <div className="contact-grid">
            <a href={tgText('Здравствуйте, Ольга! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_telegram', { place: 'contacts' })}>Telegram <span>@Olgagorodareki</span></a>
            <a href={site.phoneHref} onClick={() => track('click_phone', { place: 'contacts' })}>Телефон <span>{site.phone}</span></a>
            <a href={`mailto:${site.email}`}>Почта <span>{site.email}</span></a>
            <a href={contacts.vk} target="_blank" rel="noopener noreferrer">ВКонтакте <span>vk.com/gorodareki</span></a>
          </div>
          <p className="contact-hours"><b>Когда отвечаю:</b> {site.workHours} В поездке на связи круглосуточно.</p>

          <h2 className="contact-side-title">Как всё устроено</h2>
          <ol className="contact-promises">
            <li><b>Договор до оплаты.</b> Даты, отель, перелёт и условия — на бумаге, прежде чем вы внесёте деньги.</li>
            <li><b>Оплата на расчётный счёт</b> с чеком. Никаких переводов на карты физических лиц.</li>
            <li><b>Я в вашем чате до возвращения домой:</b> помогу с регистрацией, багажом и вопросами на месте.</li>
            <li><b>Я в реестре турагентов</b> — РТА 0005142, проверить можно на сайте Минэкономразвития.</li>
          </ol>
        </div>
        <div>
          <h2 className="contact-form-title">Заявка на подбор тура</h2>
          <p className="contact-form-hint">Чем точнее детали, тем быстрее будет расчёт: куда и когда, сколько человек (и сколько лет детям), из какого города вылет, какой бюджет.</p>
          <LeadForm />
        </div>
      </div>
    </Page>
  )
}
