export const nav = [
  { id: 'home', label: 'Главная' },
  { id: 'olga', label: 'Команда' },
  { id: 'trips', label: 'Путешествия' },
  { id: 'process', label: 'Как работаем' },
  { id: 'trust', label: 'Надёжность' },
  { id: 'corporate', label: 'Корпоративным' },
  { id: 'contacts', label: 'Контакты' }
]

export const contacts = {
  whatsapp: 'http://wa.me/79150547407',
  telegram: 'https://t.me/Olgagorodareki',
  max: 'https://clck.su/Tpcuu',
  vk: 'https://vk.com/gorodareki'
}

export const heroVideo = {
  src: `${import.meta.env.BASE_URL}videos/hero-flight.mp4`,
  poster: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1800'
}

export const tripCards = [
  {
    title: 'Семейный отдых на море',
    category: 'Море',
    region: 'Турция · ОАЭ · Таиланд · Мальдивы',
    budget: 'от 180 000 ₽',
    duration: '7–14 ночей',
    season: 'круглый год',
    text: 'Пляжный отдых с понятной логистикой, отелями для детей, удобными перелётами и поддержкой до возвращения домой.',
    image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/5593133/',
    tags: ['семья', 'море', 'дети', 'all inclusive']
  },
  {
    title: 'Сакура в Японии',
    category: 'Сезоны',
    region: 'Токио · Киото · Осака',
    budget: 'индивидуально',
    duration: '8–12 дней',
    season: 'март — апрель',
    text: 'Маршрут под цветение: города, переезды, отели, прогулки, гастрономия и спокойный темп без перегруза.',
    image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/4321733/',
    tags: ['Япония', 'сакура', 'индивидуальный тур']
  },
  {
    title: 'Европейские события',
    category: 'События',
    region: 'Лондон · Стамбул · Амстердам',
    budget: 'по запросу',
    duration: '3–7 дней',
    season: 'под дату события',
    text: 'Концерты, фестивали, культурные выезды и городские путешествия с отелем, перелётом и программой.',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/38172683/',
    tags: ['концерт', 'город', 'фестиваль']
  },
  {
    title: 'Круизы по рекам и морям',
    category: 'Круизы',
    region: 'Россия · Персидский залив · Средиземное море',
    budget: 'от 120 000 ₽',
    duration: '4–14 ночей',
    season: 'по расписанию',
    text: 'Круизы для тех, кто хочет просыпаться в новом месте и не собирать чемодан каждый день.',
    image: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/855465/',
    tags: ['круиз', 'река', 'море']
  },
  {
    title: 'Корпоративный выезд',
    category: 'Корпоративным',
    region: 'Красная Поляна · Турция · Марокко · Таиланд',
    budget: 'по брифу',
    duration: '2–7 дней',
    season: 'под задачу',
    text: 'Поездка для команды, клиентов или партнёров: перелёты, размещение, активности, деловая часть и отдых.',
    image: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/5608241/',
    tags: ['команда', 'ретрит', 'бизнес']
  },
  {
    title: 'Фестивали тюльпанов',
    category: 'Сезоны',
    region: 'Амстердам · Стамбул',
    budget: 'по запросу',
    duration: '4–6 дней',
    season: 'апрель — май',
    text: 'Короткий яркий выезд в сезон цветения: город, прогулки, красивые парки, отели в удобной локации.',
    image: 'https://images.pexels.com/photos/69776/tulips-bed-colorful-color-69776.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/2806063/',
    tags: ['тюльпаны', 'весна', 'Европа']
  },
  {
    title: 'Норвежские фьорды',
    category: 'Природа',
    region: 'Норвегия',
    budget: 'индивидуально',
    duration: '7–10 дней',
    season: 'май — сентябрь',
    text: 'Маршрут для тех, кто хочет тишину, воду, горы, панорамные дороги и сильное ощущение природы.',
    image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/9851047/',
    tags: ['фьорды', 'природа', 'маршрут']
  },
  {
    title: 'ОАЭ и Оман',
    category: 'Море',
    region: 'Дубай · Абу-Даби · Маскат',
    budget: 'от 220 000 ₽',
    duration: '6–10 ночей',
    season: 'октябрь — апрель',
    text: 'Тёплое море, высокий сервис, отели под разные бюджеты, экскурсии, пустыня, города и комфортные перелёты.',
    image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: 'https://www.pexels.com/download/video/38425805/',
    tags: ['ОАЭ', 'Оман', 'сервис']
  }
]

export const steps = [
  ['01', 'Заявка в мессенджер', 'Направление, даты, состав, город вылета, бюджет и пожелания к отдыху.'],
  ['02', 'Подбор вариантов', 'Сравниваем перелёты, отели, маршруты, условия оплаты и правила направления.'],
  ['03', 'Согласование тура', 'Объясняем плюсы и ограничения каждого варианта, чтобы решение было спокойным.'],
  ['04', 'Договор', 'Паспортные данные нужны после выбора тура и оформления договора.'],
  ['05', 'Официальная оплата', 'Предоплата — на расчётный счёт агентства, после оплаты приходит чек.'],
  ['06', 'Документы и связь', 'Документы отправляем за 4–7 дней до выезда и остаёмся на связи до возвращения.']
]
