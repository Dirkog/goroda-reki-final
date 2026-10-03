// Данные сайта. Контент живёт в src/content/*.json — его можно править
// через админку (адрес сайта + /admin/) или прямо в файлах.
//
//   src/content/settings.json — название, контакты, менеджер, реквизиты, документы
//   src/content/trips.json    — направления и цены
//   src/content/steps.json    — шаги оформления тура
//   src/content/faq.json      — частые вопросы
//   src/content/events.json   — события и фестивали (обновлять регулярно!)

import settings from '../content/settings.json'
import trips from '../content/trips.json'
import stepsData from '../content/steps.json'
import faqData from '../content/faq.json'
import eventsData from '../content/events.json'

const BASE = import.meta.env.BASE_URL

export const site = {
  ...settings.site,
  // Адрес сайта подставляется при сборке: Cloudflare Pages или GitHub Pages.
  origin: (import.meta.env && import.meta.env.VITE_SITE_ORIGIN) || 'https://olgatour.gitverse.site',
  ogImage: 'images/og-image.jpg'
}

export const team = settings.team
export const pastTrips = settings.pastTrips
export const legal = settings.legal
export const contacts = settings.contacts

// Telegram — основной канал: в чат уходит готовое первое сообщение.
export const tgText = (text) => contacts.telegram + (text ? '?text=' + encodeURIComponent(text) : '')

export const routes = [
  { id: 'home', path: '/', label: 'Главная', title: 'Личный турагент Ольга: подбор туров и быстрый тур', description: 'Личный турагент Ольга: подбор туров для семей, пар и компаний, быстрый тур на ближайшие даты, поездки из вашего города. Договор до оплаты, РТА 0005142.' },
  { id: 'trips', path: '/napravleniya/', label: 'Направления', title: 'Направления и туры: море, круизы, события, природа', description: 'Витрина направлений с бюджетом, сезоном и длительностью: Турция, ОАЭ, Таиланд, Япония, Норвегия, круизы и корпоративные выезды.' },
  { id: 'calendar', path: '/kalendar/', label: 'События', title: 'Календарь событий и фестивалей: даты, источники, подписка', description: 'Фестивали, парады, цветение и сезонные события с точными датами и ссылками на первоисточники. Подпишитесь на календарь (.ics).' },
  { id: 'contacts', path: '/kontakty/', label: 'Контакты', title: 'Контакты и гарантии: Telegram, телефон, РТА 0005142', description: 'Свяжитесь со мной напрямую: Telegram, телефон или форма на сайте. Номер в реестре турагентов РТА 0005142, договор до оплаты, чек.' },
  // Старые адреса сохраняем для пререндера и бесшовного редиректа (без 404)
  { id: 'olga', path: '/komanda/', label: 'Ольга', title: 'Ольга — личный турагент', redirect: '/', noindex: true },
  { id: 'process', path: '/kak-rabotaem/', label: 'Как работаем', title: 'Порядок работы — Личный турагент', redirect: '/#scene-steps', noindex: true },
  { id: 'trust', path: '/nadezhnost/', label: 'Надёжность', title: 'Надёжность и гарантии — Личный турагент', redirect: '/kontakty/', noindex: true },
  { id: 'corporate', path: '/korporativnym/', label: 'Корпоративным', title: 'Корпоративные выезды — Личный турагент', redirect: '/napravleniya/', noindex: true },
  // Страницы под поисковые запросы: в меню их нет, ссылки с главной, из направлений и подвала
  { id: 'agent', landing: 'agent', path: '/turagent/', label: 'Личный турагент', title: 'Личный турагент Ольга: подбор и бронирование туров', description: 'Личный турагент Ольга: один человек от первого сообщения до возвращения домой. Подбор тура под ваш запрос, договор до оплаты, РТА 0005142.', extra: true },
  { id: 'fast', landing: 'fast', path: '/bystryy-tur/', label: 'Быстрый тур', title: 'Быстрый тур на ближайшие даты — турагент Ольга', description: 'Нужен быстрый тур? Напишите даты, город вылета и бюджет: в течение рабочего дня пришлю варианты, которые есть в наличии. Договор до оплаты.', extra: true },
  { id: 'cities', landing: 'cities', path: '/tury-iz-vashego-goroda/', label: 'Туры из вашего города', title: 'Туры из вашего города: подбор маршрута — турагент Ольга', description: 'Скажите, откуда летите и куда хотите: соберу тур от вылета до отеля, подберу удобную пересадку, если прямого рейса нет. Москва, Петербург, Казань и другие города.', extra: true },
  // Документы и служебные страницы — только в подвале
  { id: 'oferta', path: '/oferta/', label: 'Договор и оферта', title: 'Договор и публичная оферта', description: 'Договор и публичная оферта на подбор и бронирование туров: предмет договора, порядок оплаты, права и обязанности сторон.', footer: true },
  { id: 'credits', path: '/istochniki-foto/', label: 'Источники фотографий', title: 'Источники фотографий на сайте', description: 'Авторы и лицензии фотографий, использованных на сайте.', footer: true },
  { id: 'privacy', path: '/politika-konfidencialnosti/', label: 'Политика', title: 'Политика обработки персональных данных', description: 'Как обрабатываются персональные данные (152-ФЗ).', footer: true }
]

// В верхнем меню — только основные разделы. Политика конфиденциальности
// и Источники фотографий остаются в подвале (по просьбе пользователя).
// Ровно 4 ключевых раздела в верхнем меню
const MAIN_NAV_IDS = ['home', 'trips', 'calendar', 'contacts']
export const nav = MAIN_NAV_IDS.map(id => routes.find(r => r.id === id)).filter(Boolean)
export const footerOnly = routes.filter(r => r.footer)
export const extraPages = routes.filter(r => r.extra)

export const heroVideo = {
  // Пляж с высоты: 1152p, CRF 31, без звука — ~2 МБ вместо 118 МБ исходника.
  mp4: `${BASE}videos/hero-flight.mp4?v=r2`,
  poster: `${BASE}videos/hero-poster.jpg?v=r2`
}

// Картинки направлений лежат в public/images/trips/<slug>.jpg|webp
export const tripCards = trips.items.map(t => ({
  ...t,
  // если в админке загрузили своё фото — берём его, иначе файл по слагу
  image: t.image || `${BASE}images/trips/${t.slug}.jpg`,
  imageWebp: t.imageWebp || `${BASE}images/trips/${t.slug}.webp`
}))

export const steps = stepsData.items.map(s => [s.num, s.title, s.text])
export const faq = faqData.items.map(f => [f.q, f.a])

// События и фестивали: массив с датами, источниками и отметкой проверки
export const events = eventsData.events
export const eventsUpdated = eventsData.updated
