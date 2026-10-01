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
  origin: (import.meta.env && import.meta.env.VITE_SITE_ORIGIN) || 'https://dirkog.github.io',
  ogImage: 'images/og-image.jpg'
}

export const team = settings.team
export const pastTrips = settings.pastTrips
export const legal = settings.legal
export const contacts = settings.contacts

// Telegram — основной канал: в чат уходит готовое первое сообщение.
export const tgText = (text) => contacts.telegram + (text ? '?text=' + encodeURIComponent(text) : '')

export const routes = [
  { id: 'home', path: '/', label: 'Главная', title: 'Личный турагент Ольга Дударева — подбор и бронирование путешествий', description: 'Подберём и забронируем тур под ваши даты, состав и бюджет: море, города, круизы, события, корпоративные выезды. Договор до оплаты, поддержка до возвращения.' },
  { id: 'olga', path: '/komanda/', label: 'Команда', title: 'Ольга Дударева — личный турагент: как я работаю', description: 'Ольга Дударева — ваш личный турагент: подбирает туры для семей, пар и компаний, отвечает лично, на связи до возвращения домой.' },
  { id: 'trips', path: '/napravleniya/', label: 'Направления', title: 'Направления и туры: море, круизы, события, природа', description: 'Витрина направлений с бюджетом, сезоном и длительностью: Турция, ОАЭ, Таиланд, Япония, Норвегия, круизы и корпоративные выезды. Отправьте запрос — соберём варианты.' },
  { id: 'calendar', path: '/kalendar/', label: 'Календарь', title: 'Календарь событий и фестивалей: даты, источники, подписка', description: 'Фестивали, парады, цветение и сезонные события с точными датами и ссылками на первоисточники. Подпишитесь на календарь: файл .ics, лента RSS и напоминания о новых датах.' },
  { id: 'process', path: '/kak-rabotaem/', label: 'Как работаем', title: 'Как мы оформляем тур: 6 шагов от заявки до документов', description: 'Прозрачный процесс: заявка в мессенджер, подбор вариантов, договор, официальная оплата на расчётный счёт, чек и документы за 4–7 дней до выезда, поддержка в поездке.' },
  { id: 'trust', path: '/nadezhnost/', label: 'Надёжность', title: 'Надёжность: РТА 0005142, договор, расчётный счёт и чек', description: 'Проверьте нас: номер РТА 0005142 в Едином федеральном реестре турагентов, договор до оплаты, оплата на расчётный счёт агентства, фискальный чек и полный комплект документов.' },
  { id: 'corporate', path: '/korporativnym/', label: 'Корпоративным', title: 'Корпоративные выезды: тимбилдинг, инсентив, конференции', description: 'Организуем выезд для команды, клиентов или партнёров: перелёты, размещение, программа, деловая часть и закрывающие документы. Пришлите бриф — подготовим варианты.' },
  { id: 'contacts', path: '/kontakty/', label: 'Контакты', title: 'Контакты: Telegram, MAX, ВКонтакте и телефон', description: 'Оставьте заявку на подбор тура: Telegram, MAX, ВКонтакте или форма на сайте. Укажите направление, даты, состав и бюджет — ответим в течение 15 минут.' },
  { id: 'oferta', path: '/oferta/', label: 'Договор и оферта', title: 'Договор и публичная оферта', description: 'Условия оказания услуг по подбору и бронированию туров: порядок оформления договора, внесения предоплаты, возврата и обмена документами.', noindex: false },
  { id: 'credits', path: '/istochniki-foto/', label: 'Источники фотографий', title: 'Источники фотографий на сайте', description: 'Авторы и лицензии фотографий, использованных на сайте: снимки из Wikimedia Commons со свободными лицензиями.' },
  { id: 'privacy', path: '/politika-konfidencialnosti/', label: 'Политика', title: 'Политика обработки персональных данных', description: 'Как мы обрабатываем и защищаем персональные данные, полученные через формы и мессенджеры, в соответствии с Федеральным законом № 152-ФЗ.', noindex: false }
]

// В верхнем меню — только основные разделы. Политика конфиденциальности
// и Источники фотографий остаются в подвале (по просьбе пользователя).
const NAV_HIDDEN = new Set(['oferta', 'privacy', 'credits'])
export const nav = routes.filter(r => !NAV_HIDDEN.has(r.id))
export const footerOnly = routes.filter(r => r.id === 'privacy' || r.id === 'credits')

export const heroVideo = {
  // Пляж с высоты: 1152p, CRF 31, без звука — ~2 МБ вместо 118 МБ исходника.
  mp4: `${BASE}videos/hero-flight.mp4?v=r3`,
  poster: `${BASE}videos/hero-poster.jpg?v=r3`
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
