import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'
import { landings, CITIES } from '../content/landings'
import { tgText, site } from '../data/site'
import { track } from '../lib/analytics'
import { withBase } from '../lib/router'

function Section({ s }) {
  return (
    <section className="landing-section">
      <h2>{s.h2}</h2>
      {s.p && s.p.map((t, i) => <p key={i}>{t}</p>)}
      {s.cities && <ul className="city-list">{CITIES.map(c => <li key={c}>{c}</li>)}</ul>}
      {s.after && <p>{s.after}</p>}
      {s.quotes && <ul className="quote-list">{s.quotes.map(q => <li key={q}>{q}</li>)}</ul>}
      {s.note && <p className="landing-note">{s.note}</p>}
      {s.list && (
        <ul className="fact-list">
          {s.list.map(([b, t]) => <li key={b}><b>{b}</b> {t}</li>)}
        </ul>
      )}
      {s.steps && (
        <ol className="how-list">
          {s.steps.map(([b, t]) => <li key={b}><b>{b}</b><span>{t}</span></li>)}
        </ol>
      )}
      {s.links && (
        <p className="landing-links">
          {s.links.map(l => <a key={l.path} className="section-link" href={withBase(l.path)}>{l.label} →</a>)}
        </p>
      )}
    </section>
  )
}

export default function Landing({ route }) {
  const data = landings[route.landing]
  return (
    <Page className="landing-page inner-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: route.label }]} />
      <SplitTitle title={data.h1} text={data.lead} />
      <div className="landing-body">
        {data.sections.map(s => <Section key={s.h2} s={s} />)}

        <section className="landing-section">
          <h2>Частые вопросы</h2>
          <div className="faq-list">
            {data.faq.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </section>

        <section className="page-cta">
          <div className="page-cta-copy">
            <h2>Напишите мне</h2>
            <p>Отвечаю лично, в рабочее время обычно через 15–30 минут. Телефон: <a href={site.phoneHref}>{site.phone}</a>.</p>
          </div>
          <a className="btn glass" href={tgText(data.msg)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'landing-' + route.landing })}>Написать в Telegram</a>
        </section>
      </div>
    </Page>
  )
}
