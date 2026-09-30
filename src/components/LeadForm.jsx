import React, { useState } from 'react'
import { site, waText } from '../data/site'
import { track, leadSource } from '../lib/analytics'

// Форма заявки. Если задан formEndpoint — отправляем POST,
// иначе открываем WhatsApp с готовым текстом (без бэкенда это надёжный путь).
const DIRECTIONS = ['Море / пляж', 'Город и экскурсии', 'Круиз', 'Событие (концерт, фестиваль)', 'Природа / маршрут', 'Корпоративный выезд', 'Пока не решил(а)']

export default function LeadForm({ preset = {}, compact = false }) {
  const [form, setForm] = useState({ name: '', contact: '', direction: preset.direction || DIRECTIONS[0], dates: preset.dates || '', people: '', comment: preset.comment || '', consent: false })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const message = () =>
    [
      `Заявка с сайта ${site.name}`,
      `Имя: ${form.name || '—'}`,
      `Контакт: ${form.contact || '—'}`,
      `Формат: ${form.direction}`,
      form.dates ? `Даты: ${form.dates}` : '',
      form.people ? `Состав: ${form.people}` : '',
      form.comment ? `Комментарий: ${form.comment}` : '',
      leadSource() ? `Источник: ${leadSource()}` : ''
    ].filter(Boolean).join('\n')

  const endpoint = site.formEndpoint || (site.web3formsKey ? 'https://api.web3forms.com/submit' : '')

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.contact.trim()) { setError('Заполните имя и контакт — как с вами связаться.'); return }
    if (!form.consent) { setError('Нужно согласие на обработку персональных данных.'); return }
    setError('')
    track('lead_submit', { direction: form.direction })
    // Порядок каналов: свой приём заявок на сайте → Web3Forms → WhatsApp.
    // Заявка уходит в первый, который ответил; если все молчат — открываем WhatsApp.
    const payload = () => {
      const fd = new FormData()
      if (site.web3formsKey && !site.formEndpoint) fd.append('access_key', site.web3formsKey)
      fd.append('subject', 'Заявка с сайта «Города и реки»')
      fd.append('from_name', 'Сайт «Города и реки»')
      fd.append('name', form.name)
      fd.append('contact', form.contact)
      fd.append('direction', form.direction)
      fd.append('dates', form.dates)
      fd.append('people', form.people)
      fd.append('comment', form.comment)
      fd.append('source', leadSource())
      fd.append('page', typeof window !== 'undefined' ? window.location.pathname : '')
      fd.append('botcheck', '')
      return fd
    }

    // Отправляем сразу во все доступные каналы: свой приём (Telegram) и почта.
    // Так заявка не потеряется, даже если один из сервисов недоступен.
    const channels = [
      { url: '/api/lead', name: 'telegram' },
      { url: endpoint, name: 'email' }
    ].filter(c => c.url)

    const results = await Promise.all(channels.map(async (c) => {
      try {
        const r = await fetch(c.url, { method: 'POST', body: payload() })
        if (r.ok) { track('lead_delivered', { channel: c.name }); return true }
        return false
      } catch (e) { return false }
    }))

    if (!results.some(Boolean)) {
      // ни один канал не ответил — заявку не теряем, уводим в WhatsApp
      track('lead_fallback_whatsapp', {})
      window.open(waText(message()), '_blank', 'noopener')
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="lead-form lead-form-done">
        <h3>Заявка отправлена</h3>
        <p>Ответим в течение 15 минут в рабочее время. Если удобнее письмом — напишите на <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <a className="btn light" href={waText(message())} target="_blank" rel="noopener noreferrer">Продолжить в WhatsApp</a>
      </div>
    )
  }

  return (
    <form className={`lead-form ${compact ? 'compact' : ''}`} onSubmit={submit} noValidate>
      <div className="lead-form-row">
        <label><span>Как вас зовут *</span><input value={form.name} onChange={set('name')} autoComplete="name" placeholder="Имя" required /></label>
        <label><span>Телефон, WhatsApp или Telegram *</span><input value={form.contact} onChange={set('contact')} autoComplete="tel" placeholder="+7 ... или @ник" required /></label>
      </div>
      <div className="lead-form-row">
        <label><span>Что интересует</span>
          <select value={form.direction} onChange={set('direction')}>{DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
        </label>
        <label><span>Даты поездки</span><input value={form.dates} onChange={set('dates')} placeholder="например, 12–19 марта или «конец июня»" /></label>
      </div>
      <label><span>Состав поездки</span><input value={form.people} onChange={set('people')} placeholder="2 взрослых + ребёнок 7 лет, вылет из Москвы" /></label>
      <label><span>Комментарий</span><textarea value={form.comment} onChange={set('comment')} rows={compact ? 3 : 4} placeholder="Бюджет, важные пожелания, что нельзя не учесть" /></label>
      <label className="lead-form-consent">
        <input type="checkbox" checked={form.consent} onChange={set('consent')} />
        <span>Согласен(на) с <a href="/politika-konfidencialnosti/" target="_blank" rel="noopener noreferrer">политикой обработки персональных данных</a></span>
      </label>
      {error && <p className="lead-form-error" role="alert">{error}</p>}
      <button className="btn light" type="submit">{endpoint ? 'Отправить заявку' : 'Отправить в WhatsApp'}</button>
      <p className="lead-form-note">Паспортные данные не нужны до выбора тура и оформления договора.</p>
    </form>
  )
}
