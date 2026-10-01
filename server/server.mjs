// Сервер сайта «Личный турагент Ольга Дударева».
// Отдаёт статику (с поддержкой перемотки видео — Range/206) и принимает заявки.
// Зависимостей нет: только встроенные модули Node.js (18+).
//
// Запуск:   PORT=8787 HOST=127.0.0.1 node server/server.mjs
// Переменные:
//   SITE_ROOT           — папка со статикой (по умолчанию ./dist)
//   TELEGRAM_BOT_TOKEN  — токен бота для приёма заявок
//   TELEGRAM_CHAT_ID    — один или несколько id чатов через запятую
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(process.env.SITE_ROOT || path.join(HERE, '..', 'dist'))
const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '127.0.0.1'
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TG_CHATS = (process.env.TELEGRAM_CHAT_ID || '').split(',').map(s => s.trim()).filter(Boolean)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ics': 'text/calendar; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
}
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json|javascript)|image\/svg)/

const cacheFor = (rel) => {
  if (rel.startsWith('assets/')) return 'public, max-age=31536000, immutable'
  if (/^(frames|images|videos|fonts)\//.test(rel)) return 'public, max-age=86400'
  if (rel.endsWith('.html') || !path.extname(rel)) return 'no-cache'
  return 'public, max-age=86400'
}

// --- безопасное превращение URL в путь внутри ROOT -----------------------------
function resolveFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  if (rel.endsWith('/')) rel += 'index.html'
  if (rel === '') rel = 'index.html'
  const abs = path.resolve(ROOT, '.' + path.posix.normalize(rel))
  if (!abs.startsWith(ROOT)) return null
  return { abs, rel: path.relative(ROOT, abs).split(path.sep).join('/') }
}

function pickFile({ abs, rel }) {
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return { abs, rel }
  // адрес без расширения → ищем index.html в папке и .html-файл
  if (!path.extname(rel)) {
    const asDir = path.join(abs, 'index.html')
    if (fs.existsSync(asDir)) return { abs: asDir, rel: rel + '/index.html' }
    const asHtml = abs + '.html'
    if (fs.existsSync(asHtml)) return { abs: asHtml, rel: rel + '.html' }
  }
  return null
}

const notFoundPage = () => path.join(ROOT, '404.html')

// --- отдача файла с поддержкой Range (перемотка видео) -------------------------
function sendFile(req, res, file, status = 200) {
  const stat = fs.statSync(file)
  const ext = path.extname(file).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const rel = path.relative(ROOT, file).split(path.sep).join('/')
  const etag = `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`
  const headers = {
    'Content-Type': type,
    'Cache-Control': cacheFor(rel),
    ETag: etag,
    'Last-Modified': stat.mtime.toUTCString(),
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff'
  }
  if (req.headers['if-none-match'] === etag && req.method === 'GET') {
    res.writeHead(304, headers); return res.end()
  }

  const range = req.headers.range
  let start = 0
  let end = stat.size - 1
  let code = status
  if (range && /^bytes=/.test(range)) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.replace(/^bytes=/, 'bytes='))
    if (m) {
      if (m[1]) start = Number(m[1])
      if (m[2]) end = Number(m[2])
      if (!m[1] && m[2]) { start = Math.max(0, stat.size - Number(m[2])); end = stat.size - 1 }
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end()
      }
      code = 206
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`
    }
  }
  const length = end - start + 1
  headers['Content-Length'] = String(length)

  const compress = COMPRESSIBLE.test(type) && length > 1024 &&
    /\bgzip\b/.test(req.headers['accept-encoding'] || '') && code === 200
  if (compress) {
    delete headers['Content-Length']
    headers['Content-Encoding'] = 'gzip'
    headers.Vary = 'Accept-Encoding'
  }

  res.writeHead(code, headers)
  if (req.method === 'HEAD') return res.end()
  const stream = fs.createReadStream(file, { start, end })
  if (compress) stream.pipe(zlib.createGzip({ level: 6 })).pipe(res)
  else stream.pipe(res)
  stream.on('error', () => res.destroy())
}

// --- заявки -------------------------------------------------------------------
const LABELS = {
  name: 'Имя', contact: 'Контакт', direction: 'Что интересует', dates: 'Даты',
  people: 'Состав', comment: 'Комментарий', source: 'Источник', page: 'Страница'
}
const esc = (s) => String(s == null ? '—' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

function readBody(req, limit = 200 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > limit) { reject(new Error('too_large')); req.destroy(); return }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function parseBody(raw, contentType = '') {
  if (contentType.includes('application/json')) {
    try { return JSON.parse(raw) } catch { return {} }
  }
  return Object.fromEntries(new URLSearchParams(raw).entries())
}

async function sendTelegram(text) {
  if (!TG_TOKEN || !TG_CHATS.length) return false
  let ok = false
  for (const chat of TG_CHATS) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true })
      })
      if (r.ok) ok = true
      else console.warn('telegram:', chat, r.status, (await r.text()).slice(0, 200))
    } catch (e) {
      console.warn('telegram: сеть недоступна', String(e).slice(0, 160))
    }
  }
  return ok
}

function leadText(d) {
  const rows = ['<b>Новая заявка с сайта</b>']
  for (const [k, label] of Object.entries(LABELS)) {
    const v = String(d[k] || '').trim()
    if (v) rows.push(`${label}: ${esc(v)}`)
  }
  rows.push('', `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`)
  return rows.join('\n')
}

const json = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

// --- сервер -------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = req.url || '/'

  if (url.startsWith('/api/')) {
    if (url.startsWith('/api/health')) {
      return json(res, 200, {
        ok: true,
        static: fs.existsSync(ROOT),
        telegram: !!(TG_TOKEN && TG_CHATS.length),
        time: new Date().toISOString()
      })
    }
    if (url.startsWith('/api/lead')) {
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' })
      let data = {}
      try {
        data = parseBody(await readBody(req), req.headers['content-type'] || '')
      } catch (e) {
        return json(res, 400, { ok: false, error: 'bad_request' })
      }
      if (data.botcheck) return json(res, 200, { ok: true, skipped: true })
      if (!data.name || !data.contact) return json(res, 422, { ok: false, error: 'missing_fields' })
      const sent = await sendTelegram(leadText(data))
      console.log('заявка:', data.name, '| telegram:', sent ? 'отправлено' : 'нет канала')
      return json(res, 200, { ok: true, delivered: sent })
    }
    return json(res, 404, { ok: false, error: 'not_found' })
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD, POST' }); return res.end()
  }
  const target = resolveFile(url)
  if (target) {
    const file = pickFile(target)
    if (file) return sendFile(req, res, file.abs)
  }
  const nf = notFoundPage()
  if (fs.existsSync(nf)) return sendFile(req, res, nf, 404)
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('404')
})

server.listen(PORT, HOST, () => {
  console.log(`сервер запущен: http://${HOST}:${PORT} | статика: ${ROOT}`)
  console.log(`телеграм: ${TG_TOKEN && TG_CHATS.length ? `включён (${TG_CHATS.length} чата)` : 'выключен — нет токена'}`)
})
