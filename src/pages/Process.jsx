import React from 'react'
import { steps } from '../data/site'
import { Page, SplitTitle } from '../components/Page'

export default function Process({ setPage }) {
  return (
    <Page className="process-page inner-page">
      <SplitTitle eyebrow="полностью онлайн" title="Как мы оформляем тур" text="Процесс прозрачный: сначала выбор и договор, затем официальная оплата и документы перед путешествием." />
      <div className="steps-track">
        {steps.map(([num, title, text]) => <article className="step" key={num}><span>{num}</span><h2>{title}</h2><p>{text}</p></article>)}
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

      <section className="page-cta">
        <div className="page-cta-copy">
          <h2>Готовы начать подбор?</h2>
          <p>Оставьте заявку — соберём варианты под ваши даты, состав и бюджет, а дальше пройдём все шаги вместе.</p>
        </div>
        <button className="btn glass" onClick={() => setPage('contacts')}>Оставить заявку</button>
      </section>
    </Page>
  )
}
