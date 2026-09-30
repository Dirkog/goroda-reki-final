import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'
import { steps, waText } from '../data/site'

export default function Process() {
  return (
    <Page className="process-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Как работаем' }]} />
      <SplitTitle
        eyebrow="полностью онлайн"
        title="Как мы оформляем тур"
        text="Процесс прозрачный: сначала выбор и договор, затем официальная оплата и документы перед путешествием."
      />
      <div className="steps-track">
        {steps.map(([num, title, text]) => (
          <article className="step" key={num}><span>{num}</span><h2>{title}</h2><p>{text}</p></article>
        ))}
      </div>

      <section className="travel-info-block">
        <h2>Что важно знать заранее</h2>
        <div>
          <article><b>Данные — после выбора</b><span>Паспортные данные нужны только после согласования тура и оформления договора.</span></article>
          <article><b>Прозрачная оплата</b><span>Предоплата вносится на расчётный счёт агентства, чек приходит на почту.</span></article>
          <article><b>Без скрытых условий</b><span>Объясняем плюсы и ограничения каждого варианта, чтобы решение было спокойным.</span></article>
          <article><b>Связь до возвращения</b><span>Остаёмся на связи весь маршрут и помогаем, если что-то меняется в поездке.</span></article>
        </div>
      </section>

      <section className="travel-info-block">
        <h2>Сроки, к которым стоит готовиться</h2>
        <div>
          <article><b>Подбор вариантов</b><span>Первые предложения — в течение дня, обычно 1–2 часа в рабочее время.</span></article>
          <article><b>Бронирование</b><span>После согласования бронь подтверждается туроператором — обычно в течение суток.</span></article>
          <article><b>Оплата и документы</b><span>Оплата по договору, чек — сразу после платежа, документы — за 4–7 дней до выезда.</span></article>
          <article><b>Перед поездкой</b><span>Присылаем памятку: маршрут, время вылета, трансфер, важные детали направления.</span></article>
        </div>
      </section>

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Готовы начать подбор?</h2>
          <p>Оставьте заявку — соберём варианты под ваши даты, состав и бюджет, а дальше пройдём все шаги вместе.</p>
        </div>
        <a className="btn glass" href={waText('Здравствуйте! Готов(а) начать подбор тура. Направление: ___, даты: ___')}>Оставить заявку</a>
      </section>
    </Page>
  )
}
