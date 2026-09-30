// Приём заявок средствами самого сайта (Cloudflare Pages Function).
// Работает на том же домене → нет CORS, нет сторонних сервисов, бесплатно.
// Заявка уходит в Telegram (если заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID).
//
// Переменные задаются в Cloudflare Pages → Settings → Variables:
//   TELEGRAM_BOT_TOKEN  — токен бота от @BotFather
//   TELEGRAM_CHAT_ID    — id чата/канала, куда присылать заявки

const FIELD_LABELS = {
  name: 'Имя',
  contact: 'Контакт',
  direction: 'Что интересует',
  dates: 'Даты',
  people: 'Состав',
  comment: 'Комментарий',
  source: 'Источник',
  page: 'Страница',
}

function esc(s) {
  return String(s == null ? '—' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
}

export async function onRequestPost({ request, env }) {
  let data
  try {
    const ct = request.headers.get('content-type') || ''
    if (ct.includes('application/json')) data = await request.json()
    else {
      const fd = await request.formData()
      data = Object.fromEntries(fd.entries())
    }
  } catch (e) {
    return json({ ok: false, error: 'bad_request' }, 400)
  }

  // защита от автоматического спама
  if (data.botcheck) return json({ ok: true, skipped: true })

  if (!data.name || !data.contact) return json({ ok: false, error: 'missing_fields' }, 422)

  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    // Telegram ещё не настроен — фронтенд сам уйдёт на резервный канал
    return json({ ok: false, error: 'not_configured' }, 501)
  }

  const lines = ['🧭 <b>Новая заявка с сайта</b>']
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (data[key]) lines.push(`${label}: ${esc(data[key])}`)
  }
  lines.push(`Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`)

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
  })
  const tgBody = await tg.text()
  if (!tg.ok) return json({ ok: false, error: 'telegram_error', detail: tgBody.slice(0, 300) }, 502)

  return json({ ok: true })
}

export async function onRequestGet() {
  return json({ ok: true, info: 'Приём заявок «Города и реки». Отправляйте POST с полями name, contact, direction, dates, people, comment.' })
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })
}
