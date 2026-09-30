import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'
import LeadForm from '../components/LeadForm'
import { contacts, site, waText } from '../data/site'
import { track } from '../lib/analytics'

export default function Contacts() {
  return (
    <Page className="contacts-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Контакты' }]} />
      <SplitTitle
        eyebrow="контакты"
        title="Оставьте заявку удобным способом"
        text="Заполните форму — ответим в течение 15 минут в рабочее время. Или напишите в мессенджер: в первом сообщении достаточно направления, дат, состава поездки, города вылета и бюджета."
      />

      <div className="contact-layout">
        <div>
          <div className="contact-grid">
            <a href={waText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_whatsapp_contacts')}>WhatsApp <span>{site.phone}</span></a>
            <a href={contacts.telegram}>Telegram <span>@Olgagorodareki</span></a>
            <a href={contacts.max}>MAX <span>написать в мессенджере</span></a>
            <a href={contacts.vk}>ВКонтакте <span>vk.com/gorodareki</span></a>
            <a href={site.phoneHref} onClick={() => track('click_phone_contacts')}>Телефон <span>{site.phone}</span></a>
            <a href={`mailto:${site.email}`}>Почта <span>{site.email}</span></a>
          </div>
          <p className="contact-hours"><b>Режим работы:</b> {site.workHours}</p>
          <p className="contact-manager">Заявку ведёт {site.manager} — {site.managerRole}.</p>
        </div>
        <div>
          <h2 className="contact-form-title">Заявка на подбор тура</h2>
          <LeadForm />
        </div>
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
          <article><b>Быстрый ответ</b><span>В рабочее время — как правило, в течение 15–60 минут; вне часов работы отвечаем утром.</span></article>
          <article><b>Полностью онлайн</b><span>Всё общение, подбор и оформление проходят в мессенджере — приезжать в офис не нужно.</span></article>
          <article><b>Без спешки</b><span>Не давим на решение: спокойно сравниваем варианты и объясняем условия.</span></article>
          <article><b>Личный менеджер</b><span>За вашим запросом закрепляется менеджер по нужному направлению.</span></article>
        </div>
      </section>
    </Page>
  )
}
