// Разбор дат событий и сборка файлов подписки: календарь (.ics) и лента (RSS).
// Никаких выдуманных дат: в файл подписки попадают только события, у которых
// в тексте есть и месяц, и число, и год. Остальные ждут сверки и на странице
// помечены как «уточняется».

const MONTHS = [
  ['январ', 1], ['феврал', 2], ['март', 3], ['апрел', 4], ['ма', 5],
  ['июн', 6], ['июл', 7], ['август', 8], ['сентябр', 9], ['октябр', 10],
  ['ноябр', 11], ['декабр', 12]
]

const monthByName = (word) => {
  const w = word.toLowerCase()
  if (MONTHS[4][0] === 'ма' && /^ма[йя]$/.test(w)) return 5
  for (const [stem, num] of MONTHS) {
    if (stem.length > 2 && w.startsWith(stem)) return num
  }
  return 0
}

// Находит пары «число + месяц» и год в произвольном тексте дат.
export function parseDates(text) {
  const raw = String(text || '')
  const years = raw.match(/\b(20\d{2})\b/g) || []
  const year = Number(years[years.length - 1]) || 0
  // годы убираем из текста: иначе «2027 — 2 мая» читается как «27 … 2»
  const src = raw.replace(/\b20\d{2}\b/g, ' ')
  const pairs = []
  // «15–18 апреля», «18 марта — 9 мая», «2 мая» — число, возможно диапазон, месяц
  const re = /(\d{1,2})?\s*(?:[–—-]\s*(\d{1,2}))?\s*([А-Яа-яЁё]+)/g
  let m
  while ((m = re.exec(src))) {
    const month = monthByName(m[3])
    if (!month) continue
    const from = m[1] ? Number(m[1]) : 0
    const to = m[2] ? Number(m[2]) : 0
    if (from) pairs.push({ day: from, month })
    if (to) pairs.push({ day: to, month })
  }
  if (!year || !pairs.length) return null
  const iso = (p) => `${year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
  const start = iso(pairs[0])
  const end = iso(pairs[pairs.length - 1])
  return { start, end: end < start ? start : end, exact: pairs.length > 0 }
}

const stamp = (iso) => iso.replace(/-/g, '')
const nextDay = (iso) => {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

const escXml = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const byteLen = (s) => new TextEncoder().encode(s).length

const fold = (line) => {
  // iCalendar: строка не длиннее 75 байт, продолжение — с пробела
  if (byteLen(line) <= 73) return line
  const out = []
  let cur = ''
  for (const ch of line) {
    if (byteLen(cur + ch) > 73) { out.push(cur); cur = ' ' + ch }
    else cur += ch
  }
  out.push(cur)
  return out.join('\r\n')
}

export function eventTitle(ev) {
  return `${ev.title} — ${ev.place}`
}

export function eventDescription(ev, origin) {
  const parts = [
    `Даты: ${ev.dates}`,
    `Место: ${ev.place}`,
    ev.status ? `Статус: ${ev.status}` : '',
    ev.note || '',
    ev.source ? `Источник: ${ev.source}` : '',
    origin ? `Поездку под эти даты подбирает личный турагент Ольга Дударева: ${origin}` : ''
  ]
  return parts.filter(Boolean).join('\n')
}

// Ссылка «добавить в Google Календарь» для события с точными датами.
export function googleCalendarLink(ev) {
  const p = parseDates(ev.dates)
  if (!p) return ''
  const dates = `${stamp(p.start)}/${stamp(nextDay(p.end))}`
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(ev),
    dates,
    details: eventDescription(ev),
    location: ev.place || ''
  })
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

// Файл календаря со всеми событиями, у которых даты подтверждены текстом.
export function buildIcs(events, { origin = '', updated = '' } = {}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Личный турагент Ольга Дударева//Календарь событий//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:События и фестивали — Личный турагент',
    'X-WR-TIMEZONE:Europe/Moscow'
  ]
  let count = 0
  for (const ev of events) {
    const p = parseDates(ev.dates)
    if (!p) continue
    count += 1
    const uid = `event-${count}-${stamp(p.start)}@olgatour`
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${updated ? stamp(updated) : stamp(new Date().toISOString().slice(0, 10))}T000000Z`,
      `DTSTART;VALUE=DATE:${stamp(p.start)}`,
      `DTEND;VALUE=DATE:${stamp(nextDay(p.end))}`,
      fold(`SUMMARY:${esc(eventTitle(ev))}`),
      fold(`DESCRIPTION:${esc(eventDescription(ev, origin))}`),
      fold(`LOCATION:${esc(ev.place)}`),
      ev.source ? fold(`URL:${esc(ev.source)}`) : '',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    )
  }
  lines.push('END:VCALENDAR')
  return { ics: lines.filter(Boolean).join('\r\n') + '\r\n', count }
}

// Лента новостей календаря (RSS 2.0) — для программ чтения и подписки.
export function buildRss(events, { origin = '', updated = '', feedUrl = '' } = {}) {
  const items = events.map(ev => `    <item>
      <title>${escXml(eventTitle(ev))}</title>
      <link>${escXml(ev.source || origin)}</link>
      <guid isPermaLink="false">${escXml(ev.title)}</guid>
      <description>${escXml(eventDescription(ev, origin))}</description>
      ${ev.verified ? `<pubDate>${new Date(ev.verified + 'T09:00:00Z').toUTCString()}</pubDate>` : ''}
    </item>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>События и фестивали — календарь личного турагента</title>
    <link>${escXml(origin)}</link>
    <description>Фестивали, парады, цветение и сезонные события с точными датами и источниками. Обновляется вручную после сверки.</description>
    <language>ru-ru</language>
    <lastBuildDate>${new Date((updated || new Date().toISOString().slice(0, 10)) + 'T09:00:00Z').toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escXml(feedUrl || origin)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
