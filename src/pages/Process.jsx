import React from 'react'
import { steps } from '../data/site'
import { Page, SplitTitle } from '../components/Page'

export default function Process() {
  return (
    <Page className="process-page inner-page">
      <SplitTitle eyebrow="полностью онлайн" title="Как мы оформляем тур" text="Процесс прозрачный: сначала выбор и договор, затем официальная оплата и документы перед путешествием." />
      <div className="steps-track">
        {steps.map(([num, title, text]) => <article className="step" key={num}><span>{num}</span><h2>{title}</h2><p>{text}</p></article>)}
      </div>
    </Page>
  )
}
