#!/usr/bin/env node
// Пререндер: превращает SPA в набор статических страниц с уникальными мета-тегами.
// Запускается после vite build (клиент) и vite build --ssr (серверный бандл).
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const MIRROR = !!process.env.PRERENDER_MIRROR   // зеркало (GitHub Pages) не выпускает robots/sitemap/llms
const dist = path.resolve('dist')
const ssr = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)
const { render, routes, site, contacts, headFor, basePath } = ssr

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const base = basePath()

// ВАЖНО: переносим из собранного Vite шаблона теги стилей и скриптов —
// иначе пререндер сотрёт подключение CSS и JS.
const cssTags = (template.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || []).join('\n    ')
const preloadTags = (template.match(/<link[^>]*rel="modulepreload"[^>]*>/g) || []).join('\n    ')
const scriptTags = (template.match(/<script[^>]*type="module"[^>]*>\s*<\/script>/g) || []).join('\n    ')

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildHead(route) {
  const head = headFor(route, site.origin)
  const metas = head.metas.map(([a, k, v]) => `<meta ${a}="${k}" content="${esc(v)}" />`).join('\n    ')
  const jsonLd = head.jsonLd.map((d, i) => `<script type="application/ld+json" id="ld-${i}">${JSON.stringify(d)}</script>`).join('\n    ')
  return `<title>${esc(head.title)}</title>
    ${metas}
    <link rel="canonical" href="${esc(head.url)}" />
    ${jsonLd}`
}

function fullHead(route) {
  const b = base
  return `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f4f7f8" />
    ${buildHead(route)}
    <link rel="icon" href="${b}favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="${b}icon.svg" />
    <link rel="apple-touch-icon" href="${b}apple-touch-icon.png" />
    <link rel="manifest" href="${b}manifest.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
    ${cssTags}
    ${preloadTags}
    <meta name="format-detection" content="telephone=no" />
  </head>`
}

function pageHtml(route, body) {
  return template
    .replace(/<head>[\s\S]*?<\/head>/, fullHead(route))
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace('</body>', `    ${scriptTags}\n  </body>`)
}

let count = 0
for (const route of routes) {
  const body = render(route.path)
  const html = pageHtml(route, body)
  const outDir = route.path === '/' ? dist : path.join(dist, route.path.replace(/^\//, ''))
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
  count++
  console.log('  prerender', route.path)
}

// 404 для GitHub Pages и любого статического хостинга
const notFound = { id: 'notfound', path: '/404', label: 'Страница не найдена', title: 'Страница не найдена — Города и реки', description: 'Такой страницы нет. Вернитесь на главную или напишите нам — подберём тур.', noindex: true }
fs.writeFileSync(path.join(dist, '404.html'), pageHtml(notFound, render('/404')))
console.log('  prerender /404')

// robots.txt
const origin = site.origin.replace(/\/$/, '')
if (!MIRROR) fs.writeFileSync(path.join(dist, 'robots.txt'), [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin/',
  'Disallow: /assets/',
  'Disallow: /*?utm_',
  'Disallow: /*?yclid=',
  'Disallow: /*?gclid=',
  '',
  'User-agent: Yandex',
  'Allow: /',
  'Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid',
  '',
  `Host: ${origin.replace(/^https?:\/\//, '')}`,
  `Sitemap: ${origin}${base}sitemap.xml`,
  ''
].join('\n'))

// sitemap.xml
const today = new Date().toISOString().slice(0, 10)
const urls = routes.map(r => {
  const loc = r.path === '/' ? `${origin}${base}` : `${origin}${base}${r.path.replace(/^\//, '')}`
  const priority = r.id === 'home' ? '1.0' : ['trips', 'contacts'].includes(r.id) ? '0.9' : '0.7'
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}).join('\n')
if (!MIRROR) fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

// llms.txt — краткая карточка сайта для AI-поиска
if (!MIRROR) fs.writeFileSync(path.join(dist, 'llms.txt'), [
  `# ${site.name}`,
  '',
  `> ${site.defaultDescription}`,
  '',
  '## Основное',
  ...routes.map(r => `- [${r.label}](${origin}${base}${r.path.replace(/^\//, '')}): ${r.description}`),
  '',
  '## Контакты',
  `- Телефон: ${site.phone}`,
  `- Telegram: ${contacts.telegram}`,
  `- Реестр турагентов: ${site.registry.label}`,
  ''
].join('\n'))

// Зеркало (GitHub Pages) не выпускает robots/sitemap/llms — это дело основного сайта

// Служебные файлы хостингов (Cloudflare Pages): заголовки кеша и безопасности
for (const f of ['_headers', '_redirects']) {
  const src = path.join('public', f)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, f))
}

// .nojekyll — чтобы GitHub Pages отдавал все файлы как есть
fs.writeFileSync(path.join(dist, '.nojekyll'), '')

console.log(`Готово: ${count} страниц + 404${MIRROR ? ' (зеркало: без robots/sitemap/llms)' : ', robots.txt, sitemap.xml, llms.txt'}`)
