import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { renderToString } from "react-dom/server";
const site = {
  name: "Города и реки",
  legalName: "Онлайн-турагентство «Города и реки»",
  tagline: "Подбор и бронирование путешествий онлайн",
  // Прод-адрес. Меняется в одном месте при переезде на свой домен.
  origin: "https://dirkog.github.io",
  // Базовый путь (для GitHub Pages в подпапке). Подставляется из vite base автоматически.
  defaultTitle: "Города и реки — подбор и бронирование туров онлайн",
  defaultDescription: "Онлайн-турагентство «Города и реки»: подбор туров для семей, пар и компаний, круизы, события и корпоративные выезды. Договор до оплаты, оплата на расчётный счёт, поддержка до возвращения домой.",
  ogImage: "images/og-image.jpg",
  // ID счётчика Яндекс.Метрики. Пока пусто — код аналитики не подключается.
  metrikaId: "",
  // Необязательный вебхук для заявок (Formspree, Getform, свой эндпоинт).
  formEndpoint: "",
  email: "info@goroda-reki.ru",
  phone: "+7 915 054-74-07",
  phoneHref: "tel:+79150547407",
  workHours: "Ежедневно 10:00–21:00 (МСК). Отвечаем в течение 15 минут в рабочее время.",
  manager: "Ольга Дударева",
  managerRole: "менеджер по подбору путешествий",
  registry: {
    label: "РТА 0005142",
    url: "https://ефрт.рф/",
    note: "Единый федеральный реестр турагентов"
  }
};
const legal = {
  // Заполнить перед публикацией: юр. данные из договора.
  entity: "ИП / ООО — заполнить",
  inn: "—",
  ogrn: "—",
  address: "—",
  privacyUpdated: "01.10.2026"
};
const contacts = {
  whatsapp: "https://wa.me/79150547407",
  telegram: "https://t.me/Olgagorodareki",
  max: "https://clck.su/Tpcuu",
  vk: "https://vk.com/gorodareki"
};
const waText = (text) => contacts.whatsapp + "?text=" + encodeURIComponent(text);
const routes = [
  { id: "home", path: "/", label: "Главная", title: "Турагентство «Города и реки» — подбор туров онлайн", description: "Подберём и забронируем тур под ваши даты, состав и бюджет: море, города, круизы, события, корпоративные выезды. Договор до оплаты, поддержка до возвращения." },
  { id: "olga", path: "/komanda/", label: "Команда", title: "Команда «Города и реки»: 11 менеджеров и Ольга Дударева", description: "Онлайн-турагентство «Города и реки»: 11 менеджеров по направлениям, личный контакт, опыт собственных поездок, туристы из городов России и из-за рубежа." },
  { id: "trips", path: "/napravleniya/", label: "Направления", title: "Направления и туры: море, круизы, события, природа", description: "Витрина направлений с бюджетом, сезоном и длительностью: Турция, ОАЭ, Таиланд, Япония, Норвегия, круизы и корпоративные выезды. Отправьте запрос — соберём варианты." },
  { id: "process", path: "/kak-rabotaem/", label: "Как работаем", title: "Как мы оформляем тур: 6 шагов от заявки до документов", description: "Прозрачный процесс: заявка в мессенджер, подбор вариантов, договор, официальная оплата на расчётный счёт, чек и документы за 4–7 дней до выезда, поддержка в поездке." },
  { id: "trust", path: "/nadezhnost/", label: "Надёжность", title: "Надёжность: РТА 0005142, договор, расчётный счёт и чек", description: "Проверьте нас: номер РТА 0005142 в Едином федеральном реестре турагентов, договор до оплаты, оплата на расчётный счёт агентства, фискальный чек и полный комплект документов." },
  { id: "corporate", path: "/korporativnym/", label: "Корпоративным", title: "Корпоративные выезды: тимбилдинг, инсентив, конференции", description: "Организуем выезд для команды, клиентов или партнёров: перелёты, размещение, программа, деловая часть и закрывающие документы. Пришлите бриф — подготовим варианты." },
  { id: "contacts", path: "/kontakty/", label: "Контакты", title: "Контакты: WhatsApp, Telegram, MAX и ВКонтакте", description: "Оставьте заявку на подбор тура: WhatsApp, Telegram, MAX, ВКонтакте или форма на сайте. Укажите направление, даты, состав и бюджет — ответим в течение 15 минут." },
  { id: "oferta", path: "/oferta/", label: "Договор и оферта", title: "Договор и публичная оферта", description: "Условия оказания услуг по подбору и бронированию туров: порядок оформления договора, внесения предоплаты, возврата и обмена документами.", noindex: false },
  { id: "privacy", path: "/politika-konfidencialnosti/", label: "Политика конфиденциальности", title: "Политика обработки персональных данных", description: "Как мы обрабатываем и защищаем персональные данные, полученные через формы и мессенджеры, в соответствии с Федеральным законом № 152-ФЗ.", noindex: false }
];
const nav = routes.filter((r) => !["oferta", "privacy"].includes(r.id));
const heroVideo = {
  // Облегчённая версия: 1280×720, CRF 26, без звука — ~0,5 МБ вместо 18,6 МБ.
  mp4: `${"/goroda-reki-final/"}videos/hero-flight.mp4`,
  poster: `${"/goroda-reki-final/"}videos/hero-poster.jpg`
};
const tripCards = [
  {
    slug: "more-semejnyj-otdyh",
    title: "Семейный отдых на море",
    category: "Море",
    region: "Турция · ОАЭ · Таиланд · Мальдивы",
    budget: "от 180 000 ₽",
    budgetNote: "на двоих, 7 ночей, вылет из Москвы",
    duration: "7–14 ночей",
    season: "круглый год",
    text: "Пляжный отдых с понятной логистикой, отелями для детей, удобными перелётами и поддержкой до возвращения домой.",
    image: `${"/goroda-reki-final/"}images/trips/more-semejnyj-otdyh.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/more-semejnyj-otdyh.webp`,
    tags: ["семья", "море", "дети", "всё включено"]
  },
  {
    slug: "sakura-v-yaponii",
    title: "Сакура в Японии",
    category: "Сезоны",
    region: "Токио · Киото · Осака",
    budget: "индивидуально",
    budgetNote: "считаем под даты цветения",
    duration: "8–12 дней",
    season: "март — апрель",
    text: "Маршрут под цветение: города, переезды, отели, прогулки, гастрономия и спокойный темп без перегруза.",
    image: `${"/goroda-reki-final/"}images/trips/sakura-v-yaponii.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/sakura-v-yaponii.webp`,
    tags: ["Япония", "сакура", "индивидуальный тур"]
  },
  {
    slug: "evropejskie-sobytiya",
    title: "Европейские события",
    category: "События",
    region: "Лондон · Стамбул · Амстердам",
    budget: "по запросу",
    budgetNote: "зависит от даты события и категории мест",
    duration: "3–7 дней",
    season: "под дату события",
    text: "Концерты, фестивали, культурные выезды и городские путешествия с отелем, перелётом и программой.",
    image: `${"/goroda-reki-final/"}images/trips/evropejskie-sobytiya.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/evropejskie-sobytiya.webp`,
    tags: ["концерт", "город", "фестиваль"]
  },
  {
    slug: "kruizy",
    title: "Круизы по рекам и морям",
    category: "Круизы",
    region: "Россия · Персидский залив · Средиземное море",
    budget: "от 120 000 ₽",
    budgetNote: "на человека, внутренняя каюта, 4 ночи",
    duration: "4–14 ночей",
    season: "по расписанию",
    text: "Круизы для тех, кто хочет просыпаться в новом месте и не собирать чемодан каждый день.",
    image: `${"/goroda-reki-final/"}images/trips/kruizy.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/kruizy.webp`,
    tags: ["круиз", "река", "море"]
  },
  {
    slug: "korporativnyj-vyezd",
    title: "Корпоративный выезд",
    category: "Корпоративным",
    region: "Красная Поляна · Турция · Марокко · Таиланд",
    budget: "по брифу",
    budgetNote: "считаем после брифа: группа, даты, программа",
    duration: "2–7 дней",
    season: "под задачу",
    text: "Поездка для команды, клиентов или партнёров: перелёты, размещение, активности, деловая часть и отдых.",
    image: `${"/goroda-reki-final/"}images/trips/korporativnyj-vyezd.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/korporativnyj-vyezd.webp`,
    tags: ["команда", "ретрит", "бизнес"]
  },
  {
    slug: "festivali-tyulpanov",
    title: "Фестивали тюльпанов",
    category: "Сезоны",
    region: "Амстердам · Стамбул",
    budget: "по запросу",
    budgetNote: "зависит от дат и города вылета",
    duration: "4–6 дней",
    season: "апрель — май",
    text: "Короткий яркий выезд в сезон цветения: город, прогулки, красивые парки, отели в удобной локации.",
    image: `${"/goroda-reki-final/"}images/trips/festivali-tyulpanov.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/festivali-tyulpanov.webp`,
    tags: ["тюльпаны", "весна", "Европа"]
  },
  {
    slug: "norvezhskie-fordy",
    title: "Норвежские фьорды",
    category: "Природа",
    region: "Норвегия",
    budget: "индивидуально",
    budgetNote: "маршрут собираем под вас",
    duration: "7–10 дней",
    season: "май — сентябрь",
    text: "Маршрут для тех, кто хочет тишину, воду, горы, панорамные дороги и сильное ощущение природы.",
    image: `${"/goroda-reki-final/"}images/trips/norvezhskie-fordy.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/norvezhskie-fordy.webp`,
    tags: ["фьорды", "природа", "маршрут"]
  },
  {
    slug: "oae-i-oman",
    title: "ОАЭ и Оман",
    category: "Море",
    region: "Дубай · Абу-Даби · Маскат",
    budget: "от 220 000 ₽",
    budgetNote: "на двоих, 7 ночей, отель 5*",
    duration: "6–10 ночей",
    season: "октябрь — апрель",
    text: "Тёплое море, высокий сервис, отели под разные бюджеты, экскурсии, пустыня, города и комфортные перелёты.",
    image: `${"/goroda-reki-final/"}images/trips/oae-i-oman.jpg`,
    imageWebp: `${"/goroda-reki-final/"}images/trips/oae-i-oman.webp`,
    tags: ["ОАЭ", "Оман", "сервис"]
  }
];
const steps = [
  ["01", "Заявка в мессенджер", "Направление, даты, состав, город вылета, бюджет и пожелания к отдыху."],
  ["02", "Подбор вариантов", "Сравниваем перелёты, отели, маршруты, условия оплаты и правила направления."],
  ["03", "Согласование тура", "Объясняем плюсы и ограничения каждого варианта, чтобы решение было спокойным."],
  ["04", "Договор", "Паспортные данные нужны после выбора тура и оформления договора."],
  ["05", "Официальная оплата", "Предоплата — на расчётный счёт агентства, после оплаты приходит чек."],
  ["06", "Документы и связь", "Документы отправляем за 4–7 дней до выезда и остаёмся на связи до возвращения."]
];
const faq = [
  ["Сколько стоит ваша работа?", "Стоимость тура не выше, чем при самостоятельном бронировании: мы работаем по договору с туроператором и получаем агентское вознаграждение от него. Отдельную плату за подбор берём только в редких случаях и предупреждаем об этом заранее."],
  ["Когда нужны паспортные данные?", "Только после того, как вы выбрали тур и мы оформили договор. До этого достаточно направления, дат, состава поездки и бюджета."],
  ["Как проходит оплата?", "Предоплата вносится на расчётный счёт агентства по договору. После оплаты вы получаете фискальный чек на электронную почту. Оплата на личные карты не практикуется."],
  ["Что если изменится расписание или рейс отменят?", "Мы остаёмся на связи всё время поездки: подскажем порядок действий, поможем связаться с туроператором, отелем или страховой и предложим варианты."],
  ["Можно ли оформить тур, если я не в России?", "Да. Мы работаем с туристами из-за рубежа и собираем маршруты на регулярных рейсах, подбирая стыковки под ваш город."],
  ["Вы делаете визы?", "Мы консультируем по визовым требованиям направления и подсказываем порядок оформления документов, но не гарантируем выдачу визы: решение принимает консульство."],
  ["Сколько ждать подбор?", "Первые варианты — в течение дня, в рабочее время обычно в течение 1–2 часов после получения всех деталей. Сложные индивидуальные маршруты могут занять 1–2 дня."],
  ["Можно ли поехать большой группой или компанией?", "Да, корпоративные и групповые выезды — отдельное направление: перелёты, размещение, программа, деловая часть и закрывающие документы для компании."]
];
function track(event, params = {}) {
  try {
    if (typeof window === "undefined") return;
    const payload = { event, ...params };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.ym === "function" && window.__ymId) {
      window.ym(window.__ymId, "reachGoal", event, params);
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.debug("[track]", payload);
    }
  } catch {
  }
}
function leadSource() {
  try {
    const utm = sessionStorage.getItem("gr_utm");
    if (utm) return utm;
  } catch {
  }
  return "";
}
function Header({ page }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      var _a;
      if (e.key === "Escape") {
        setOpen(false);
        (_a = toggleRef.current) == null ? void 0 : _a.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll("a[href], button:not([disabled])");
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const t = setTimeout(() => {
      var _a, _b;
      return (_b = (_a = panelRef.current) == null ? void 0 : _a.querySelector("a, button")) == null ? void 0 : _b.focus();
    }, 60);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("header", { className: "header", children: [
    /* @__PURE__ */ jsxs("a", { className: "brand", href: "/", "aria-label": `${site.name} — на главную`, children: [
      /* @__PURE__ */ jsx("span", { className: "brand-mark", "aria-hidden": "true", children: "гр" }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("b", { children: site.name }),
        /* @__PURE__ */ jsx("small", { children: "онлайн-турагентство" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "nav", "aria-label": "Основная навигация", children: nav.map((item) => /* @__PURE__ */ jsx("a", { href: item.path, className: page === item.id ? "active" : "", "aria-current": page === item.id ? "page" : void 0, children: /* @__PURE__ */ jsx("span", { children: item.label }) }, item.id)) }),
    /* @__PURE__ */ jsx("a", { className: "header-cta", href: waText(`Здравствуйте! Хочу подобрать тур. Направление: ___, даты: ___, состав: ___.`), onClick: () => track("click_whatsapp_header"), children: "Написать" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: toggleRef,
        className: "nav-toggle",
        "aria-label": open ? "Закрыть меню" : "Открыть меню",
        "aria-expanded": open,
        "aria-controls": "mobile-menu",
        onClick: () => setOpen((v) => !v),
        children: /* @__PURE__ */ jsx("span", { className: open ? "is-open" : "", "aria-hidden": "true" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `mobile-wrap ${open ? "is-open" : ""}`, "aria-hidden": !open, children: [
      /* @__PURE__ */ jsx("div", { className: "menu-scrim", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxs("div", { id: "mobile-menu", className: "mobile-menu", role: "dialog", "aria-modal": "true", "aria-label": "Меню навигации", ref: panelRef, children: [
        /* @__PURE__ */ jsx("p", { className: "mobile-menu-label", children: "Навигация" }),
        /* @__PURE__ */ jsx("nav", { className: "mobile-nav", children: nav.map((item) => /* @__PURE__ */ jsx("a", { href: item.path, className: page === item.id ? "active" : "", onClick: () => setOpen(false), children: item.label }, item.id)) }),
        /* @__PURE__ */ jsxs("div", { className: "mobile-menu-contacts", children: [
          /* @__PURE__ */ jsx("a", { className: "btn light mobile-menu-cta", href: waText("Здравствуйте! Хочу подобрать тур."), onClick: () => track("click_whatsapp_menu"), children: "WhatsApp" }),
          /* @__PURE__ */ jsx("a", { className: "btn ghost mobile-menu-cta", href: contacts.telegram, children: "Telegram" }),
          /* @__PURE__ */ jsx("a", { className: "mobile-menu-phone", href: site.phoneHref, children: site.phone }),
          /* @__PURE__ */ jsx("p", { className: "mobile-menu-hours", children: site.workHours })
        ] })
      ] })
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "footer", children: [
    /* @__PURE__ */ jsxs("div", { className: "footer-main", children: [
      /* @__PURE__ */ jsx("a", { className: "footer-logo", href: "/", children: site.name }),
      /* @__PURE__ */ jsx("p", { children: "Онлайн-турагентство для семейных поездок, событийных маршрутов, круизов, индивидуальных туров и корпоративных выездов. Работаем по договору, оплата — на расчётный счёт." }),
      /* @__PURE__ */ jsxs("p", { className: "footer-registry", children: [
        /* @__PURE__ */ jsx("b", { children: site.registry.label }),
        " — ",
        /* @__PURE__ */ jsx("a", { href: site.registry.url, target: "_blank", rel: "noopener noreferrer", children: "проверить в реестре турагентов" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "footer-cols", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("b", { children: "Официально" }),
        /* @__PURE__ */ jsx("span", { children: legal.entity }),
        /* @__PURE__ */ jsxs("span", { children: [
          "ИНН ",
          legal.inn,
          " · ОГРН ",
          legal.ogrn
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Адрес: ",
          legal.address
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("b", { children: "Связаться" }),
        /* @__PURE__ */ jsx("a", { href: waText("Здравствуйте! Хочу подобрать тур."), children: "WhatsApp" }),
        /* @__PURE__ */ jsx("a", { href: contacts.telegram, children: "Telegram" }),
        /* @__PURE__ */ jsx("a", { href: contacts.max, children: "MAX" }),
        /* @__PURE__ */ jsx("a", { href: contacts.vk, children: "ВКонтакте" }),
        /* @__PURE__ */ jsx("a", { href: site.phoneHref, children: site.phone }),
        /* @__PURE__ */ jsx("a", { href: `mailto:${site.email}`, children: site.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("b", { children: "Разделы" }),
        nav.filter((n) => n.id !== "home").map((n) => /* @__PURE__ */ jsx("a", { href: n.path, children: n.label }, n.id)),
        /* @__PURE__ */ jsx("a", { href: "/oferta/", children: "Договор и оферта" }),
        /* @__PURE__ */ jsx("a", { href: "/politika-konfidencialnosti/", children: "Политика обработки данных" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "footer-bottom", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        site.name,
        ". Все права защищены."
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Режим работы: ",
        site.workHours
      ] })
    ] })
  ] });
}
function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("gr_cta_closed") === "1") setClosed(true);
    } catch {
    }
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (closed) return null;
  return /* @__PURE__ */ jsxs("div", { className: `sticky-cta ${visible ? "is-visible" : ""}`, role: "region", "aria-label": "Быстрая связь", children: [
    /* @__PURE__ */ jsxs("a", { className: "sticky-cta-main", href: waText("Здравствуйте! Хочу подобрать тур: направление ___, даты ___, взрослых ___, детей ___."), onClick: () => track("click_whatsapp_sticky"), children: [
      /* @__PURE__ */ jsx("span", { className: "sticky-cta-icon", "aria-hidden": "true", children: "✆" }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("b", { children: "Подобрать тур" }),
        /* @__PURE__ */ jsx("small", { children: "ответим за 15 минут" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("a", { className: "sticky-cta-alt", href: contacts.telegram, onClick: () => track("click_telegram_sticky"), "aria-label": "Написать в Telegram", children: "TG" }),
    /* @__PURE__ */ jsx("a", { className: "sticky-cta-alt", href: site.phoneHref, onClick: () => track("click_phone_sticky"), "aria-label": `Позвонить ${site.phone}`, children: "☎" }),
    /* @__PURE__ */ jsx("button", { className: "sticky-cta-close", "aria-label": "Скрыть панель", onClick: () => {
      setClosed(true);
      try {
        sessionStorage.setItem("gr_cta_closed", "1");
      } catch {
      }
    }, children: "×" })
  ] });
}
function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("gr_cookie_ok")) setShow(true);
    } catch {
    }
  }, []);
  if (!show) return null;
  const accept = () => {
    try {
      localStorage.setItem("gr_cookie_ok", "1");
    } catch {
    }
    setShow(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "cookie-notice", role: "dialog", "aria-label": "Использование cookie", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      "Мы используем cookie и обезличенную статистику, чтобы сайт работал корректно и был удобнее. Подробнее — в ",
      /* @__PURE__ */ jsx("a", { href: "/politika-konfidencialnosti/", children: "политике обработки персональных данных" }),
      "."
    ] }),
    /* @__PURE__ */ jsx("button", { className: "btn light", onClick: accept, children: "Понятно" })
  ] });
}
function Page({ children, className = "" }) {
  return /* @__PURE__ */ jsx("section", { className: `page ${className}`, children });
}
function SplitTitle({ eyebrow, title, text }) {
  return /* @__PURE__ */ jsxs("div", { className: "split-title", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      eyebrow && /* @__PURE__ */ jsx("p", { className: "eyebrow", children: eyebrow }),
      /* @__PURE__ */ jsx("h1", { children: title })
    ] }),
    text && /* @__PURE__ */ jsx("p", { className: "split-title-text", children: text })
  ] });
}
function Breadcrumbs({ items }) {
  return /* @__PURE__ */ jsx("nav", { className: "breadcrumbs", "aria-label": "Хлебные крошки", children: items.map((it, i) => /* @__PURE__ */ jsxs("span", { children: [
    it.path ? /* @__PURE__ */ jsx("a", { href: it.path, children: it.label }) : /* @__PURE__ */ jsx("b", { children: it.label }),
    i < items.length - 1 && /* @__PURE__ */ jsx("i", { "aria-hidden": "true", children: "/" })
  ] }, it.label)) });
}
const DIRECTIONS = ["Море / пляж", "Город и экскурсии", "Круиз", "Событие (концерт, фестиваль)", "Природа / маршрут", "Корпоративный выезд", "Пока не решил(а)"];
function LeadForm({ preset = {}, compact = false }) {
  const [form, setForm] = useState({ name: "", contact: "", direction: preset.direction || DIRECTIONS[0], dates: preset.dates || "", people: "", comment: preset.comment || "", consent: false });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const message = () => [
    `Заявка с сайта ${site.name}`,
    `Имя: ${form.name || "—"}`,
    `Контакт: ${form.contact || "—"}`,
    `Формат: ${form.direction}`,
    form.dates ? `Даты: ${form.dates}` : "",
    form.people ? `Состав: ${form.people}` : "",
    form.comment ? `Комментарий: ${form.comment}` : "",
    leadSource() ? `Источник: ${leadSource()}` : ""
  ].filter(Boolean).join("\n");
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setError("Заполните имя и контакт — как с вами связаться.");
      return;
    }
    if (!form.consent) {
      setError("Нужно согласие на обработку персональных данных.");
      return;
    }
    setError("");
    track("lead_submit", { direction: form.direction });
    if (site.formEndpoint) {
      try {
        await fetch(site.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, source: leadSource(), page: window.location.pathname }) });
      } catch {
      }
    } else {
      window.open(waText(message()), "_blank", "noopener");
    }
    setSent(true);
  };
  if (sent) {
    return /* @__PURE__ */ jsxs("div", { className: "lead-form lead-form-done", children: [
      /* @__PURE__ */ jsx("h3", { children: "Заявка отправлена" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Ответим в течение 15 минут в рабочее время. Если удобнее письмом — напишите на ",
        /* @__PURE__ */ jsx("a", { href: `mailto:${site.email}`, children: site.email }),
        "."
      ] }),
      /* @__PURE__ */ jsx("a", { className: "btn light", href: waText(message()), target: "_blank", rel: "noopener noreferrer", children: "Продолжить в WhatsApp" })
    ] });
  }
  return /* @__PURE__ */ jsxs("form", { className: `lead-form ${compact ? "compact" : ""}`, onSubmit: submit, noValidate: true, children: [
    /* @__PURE__ */ jsxs("div", { className: "lead-form-row", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Как вас зовут *" }),
        /* @__PURE__ */ jsx("input", { value: form.name, onChange: set("name"), autoComplete: "name", placeholder: "Имя", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Телефон, WhatsApp или Telegram *" }),
        /* @__PURE__ */ jsx("input", { value: form.contact, onChange: set("contact"), autoComplete: "tel", placeholder: "+7 ... или @ник", required: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lead-form-row", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Что интересует" }),
        /* @__PURE__ */ jsx("select", { value: form.direction, onChange: set("direction"), children: DIRECTIONS.map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d)) })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Даты поездки" }),
        /* @__PURE__ */ jsx("input", { value: form.dates, onChange: set("dates"), placeholder: "например, 12–19 марта или «конец июня»" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      /* @__PURE__ */ jsx("span", { children: "Состав поездки" }),
      /* @__PURE__ */ jsx("input", { value: form.people, onChange: set("people"), placeholder: "2 взрослых + ребёнок 7 лет, вылет из Москвы" })
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      /* @__PURE__ */ jsx("span", { children: "Комментарий" }),
      /* @__PURE__ */ jsx("textarea", { value: form.comment, onChange: set("comment"), rows: compact ? 3 : 4, placeholder: "Бюджет, важные пожелания, что нельзя не учесть" })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "lead-form-consent", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.consent, onChange: set("consent") }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Согласен(на) с ",
        /* @__PURE__ */ jsx("a", { href: "/politika-konfidencialnosti/", target: "_blank", rel: "noopener noreferrer", children: "политикой обработки персональных данных" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "lead-form-error", role: "alert", children: error }),
    /* @__PURE__ */ jsx("button", { className: "btn light", type: "submit", children: site.formEndpoint ? "Отправить заявку" : "Отправить в WhatsApp" }),
    /* @__PURE__ */ jsx("p", { className: "lead-form-note", children: "Паспортные данные не нужны до выбора тура и оформления договора." })
  ] });
}
function TripImage({ card, alt, eager = false, width = 1200, height = 800 }) {
  return /* @__PURE__ */ jsxs("picture", { children: [
    card.imageWebp && /* @__PURE__ */ jsx("source", { type: "image/webp", srcSet: card.imageWebp }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: card.image,
        alt: alt || `${card.title} — ${card.region}`,
        width,
        height,
        loading: eager ? "eager" : "lazy",
        decoding: "async"
      }
    )
  ] });
}
function Img({ src, webp, alt, width, height, className = "", eager = false }) {
  return /* @__PURE__ */ jsxs("picture", { children: [
    webp && /* @__PURE__ */ jsx("source", { type: "image/webp", srcSet: webp }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt,
        width,
        height,
        className,
        loading: eager ? "eager" : "lazy",
        decoding: "async"
      }
    )
  ] });
}
function HeroMedia() {
  const [videoOn, setVideoOn] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const conn = navigator.connection || {};
    const saveData = conn.saveData || /2g|slow-2g|3g/.test(conn.effectiveType || "");
    if (reduce || small || saveData) return;
    const start = () => setVideoOn(true);
    if (window.requestIdleCallback) window.requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 1500);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flight-hero", children: [
    /* @__PURE__ */ jsx("img", { className: "hero-photo", src: heroVideo.poster, alt: "Вид с высоты на реку, лесистые берега и город", width: "1920", height: "1080", fetchpriority: "high", decoding: "async" }),
    videoOn && !failed && /* @__PURE__ */ jsx("video", { className: "flight-video", autoPlay: true, muted: true, loop: true, playsInline: true, preload: "none", poster: heroVideo.poster, onError: () => setFailed(true), "aria-hidden": "true", children: /* @__PURE__ */ jsx("source", { src: heroVideo.mp4, type: "video/mp4" }) }),
    /* @__PURE__ */ jsx("div", { className: "horizon-glow", "aria-hidden": "true" })
  ] });
}
function Home() {
  return /* @__PURE__ */ jsxs(Page, { className: "home-page", children: [
    /* @__PURE__ */ jsxs("section", { className: "home-hero", children: [
      /* @__PURE__ */ jsx(HeroMedia, {}),
      /* @__PURE__ */ jsxs("div", { className: "hero-content", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "официальное турагентство · РТА 0005142" }),
        /* @__PURE__ */ jsx("h1", { children: "Путешествия, которые хочется вспоминать" }),
        /* @__PURE__ */ jsx("p", { className: "hero-lead", children: "Подбираем и бронируем туры для семей, пар, компаний и корпоративных групп: море, города, круизы, события. Договор до оплаты, оплата на расчётный счёт, поддержка до возвращения домой." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions", children: [
          /* @__PURE__ */ jsx("a", { className: "btn light", href: waText("Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___."), onClick: () => track("click_whatsapp_hero"), children: "Написать в WhatsApp" }),
          /* @__PURE__ */ jsx("a", { className: "btn glass", href: "/napravleniya/", children: "Смотреть направления" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-note", children: "Отвечаем в течение 15 минут в рабочее время. Подбор — бесплатно." })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hero-search", "aria-label": "Быстрый переход", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: "Куда" }),
          /* @__PURE__ */ jsx("b", { children: "море · город · круиз" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: "Когда" }),
          /* @__PURE__ */ jsx("b", { children: "даты или месяц" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: "Кто едет" }),
          /* @__PURE__ */ jsx("b", { children: "семья · пара · команда" })
        ] }),
        /* @__PURE__ */ jsx("a", { className: "hero-search-go", href: "/napravleniya/", children: "Подобрать тур" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("aside", { className: "home-trust", "aria-label": "Ключевые факты", children: [
      ["РТА 0005142", "агентство в реестре турагентов"],
      ["Договор до оплаты", "оплата на расчётный счёт и чек"],
      ["11 менеджеров", "свой специалист по направлению"],
      ["Связь 24/7", "помогаем и в поездке, не только до"],
      ["Документы заранее", "за 4–7 дней до выезда"],
      ["Работаем из любой страны", "маршруты на регулярных рейсах"]
    ].map(([b, s]) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("b", { children: b }),
      /* @__PURE__ */ jsx("span", { children: s })
    ] }, b)) }),
    /* @__PURE__ */ jsxs("section", { className: "home-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "направления" }),
          /* @__PURE__ */ jsx("h2", { children: "Что подбираем чаще всего" })
        ] }),
        /* @__PURE__ */ jsx("a", { className: "section-link", href: "/napravleniya/", children: "Все направления →" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "trip-grid home-grid", children: tripCards.slice(0, 6).map((card, i) => /* @__PURE__ */ jsxs("a", { className: "trip-teaser", href: "/napravleniya/", children: [
        /* @__PURE__ */ jsx(TripImage, { card, eager: i === 0 }),
        /* @__PURE__ */ jsxs("span", { className: "trip-teaser-body", children: [
          /* @__PURE__ */ jsx("em", { children: card.category }),
          /* @__PURE__ */ jsx("b", { children: card.title }),
          /* @__PURE__ */ jsx("small", { children: card.region }),
          /* @__PURE__ */ jsxs("span", { className: "trip-teaser-price", children: [
            card.budget,
            /* @__PURE__ */ jsx("i", { children: card.budgetNote })
          ] })
        ] })
      ] }, card.slug)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "home-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "section-head", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "как это работает" }),
          /* @__PURE__ */ jsx("h2", { children: "Четыре шага до поездки" })
        ] }),
        /* @__PURE__ */ jsx("a", { className: "section-link", href: "/kak-rabotaem/", children: "Подробно о процессе →" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "steps-track home-steps", children: steps.slice(0, 4).map(([num, title, text]) => /* @__PURE__ */ jsxs("article", { className: "step", children: [
        /* @__PURE__ */ jsx("span", { children: num }),
        /* @__PURE__ */ jsx("h3", { children: title }),
        /* @__PURE__ */ jsx("p", { children: text })
      ] }, num)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "home-section home-lead-block", children: [
      /* @__PURE__ */ jsxs("div", { className: "home-lead-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "заявка на подбор" }),
        /* @__PURE__ */ jsx("h2", { children: "Расскажите о поездке — подберём варианты" }),
        /* @__PURE__ */ jsx("p", { children: "Заполните короткую форму: направление, даты, состав и бюджет. Первые варианты пришлём в течение дня, в рабочее время — обычно за 1–2 часа." }),
        /* @__PURE__ */ jsxs("ul", { className: "check-list", children: [
          /* @__PURE__ */ jsx("li", { children: "Подбор и консультация — бесплатно, без обязательств" }),
          /* @__PURE__ */ jsx("li", { children: "Сравниваем перелёты, отели и условия, объясняем разницу" }),
          /* @__PURE__ */ jsx("li", { children: "Договор оформляем до оплаты, оплата — на расчётный счёт" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "home-lead-alt", children: [
          "Удобнее сразу в мессенджер: ",
          /* @__PURE__ */ jsx("a", { href: contacts.telegram, children: "Telegram" }),
          " · ",
          /* @__PURE__ */ jsx("a", { href: contacts.vk, children: "ВКонтакте" }),
          " · ",
          /* @__PURE__ */ jsx("a", { href: contacts.max, children: "MAX" }),
          " · ",
          /* @__PURE__ */ jsx("a", { href: site.phoneHref, children: site.phone })
        ] })
      ] }),
      /* @__PURE__ */ jsx(LeadForm, { compact: true })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "home-section", children: [
      /* @__PURE__ */ jsx("div", { className: "section-head", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "частые вопросы" }),
        /* @__PURE__ */ jsx("h2", { children: "Отвечаем честно" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "faq-list", children: faq.map(([q, a]) => /* @__PURE__ */ jsxs("details", { children: [
        /* @__PURE__ */ jsx("summary", { children: q }),
        /* @__PURE__ */ jsx("p", { children: a })
      ] }, q)) }),
      /* @__PURE__ */ jsxs("p", { className: "faq-more", children: [
        "Не нашли ответ? ",
        /* @__PURE__ */ jsx("a", { href: "/kontakty/", children: "Задайте вопрос — ответим без обязательств" }),
        "."
      ] })
    ] })
  ] });
}
function Olga() {
  return /* @__PURE__ */ jsxs(Page, { className: "olga-page inner-page", children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Главная", path: "/" }, { label: "Команда" }] }),
    /* @__PURE__ */ jsx(
      SplitTitle,
      {
        eyebrow: "команда и подход",
        title: "Личный контакт внутри сильной команды",
        text: "«Города и реки» — онлайн-турагентство под руководством Анны Рогалёвой. В команде 11 менеджеров, и каждая отвечает за свои направления и форматы путешествий."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "olga-grid", children: [
      /* @__PURE__ */ jsxs("article", { className: "editorial-card big", children: [
        /* @__PURE__ */ jsx("p", { children: "Мы работаем с туристами из разных городов России и из-за рубежа. География не ограничивает: из городов РФ можно организовать любые туры, а из других стран — маршруты на регулярных рейсах." }),
        /* @__PURE__ */ jsx("p", { children: "Команда сама часто путешествует, поэтому подбор строится не только по параметрам отеля. Важны компания, темп, логистика, настроение поездки и ощущение безопасности." })
      ] }),
      /* @__PURE__ */ jsx("blockquote", { children: "«Хороший тур — это когда детали не мешают отдыху»" }),
      /* @__PURE__ */ jsxs("article", { className: "editorial-card accent", children: [
        /* @__PURE__ */ jsx("b", { children: "11 экспертов" }),
        /* @__PURE__ */ jsx("span", { children: "Семейный отдых, индивидуальные маршруты, круизы, события и корпоративные выезды." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Направления, за которые отвечает команда" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Семейный отдых" }),
          /* @__PURE__ */ jsx("span", { children: "Пляжные направления с понятной логистикой, отелями для детей и удобными перелётами." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Индивидуальные маршруты" }),
          /* @__PURE__ */ jsx("span", { children: "Авторские поездки под ваш темп: города, переезды, гастрономия и впечатления." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Круизы и события" }),
          /* @__PURE__ */ jsx("span", { children: "Речные и морские круизы, концерты, фестивали и выезды под конкретную дату." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Корпоративные выезды" }),
          /* @__PURE__ */ jsx("span", { children: "Поездки для команд, клиентов и партнёров с деловой частью и отдыхом." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page-cta", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-cta-copy", children: [
        /* @__PURE__ */ jsx("h2", { children: "Хотите узнать, как оформляется тур?" }),
        /* @__PURE__ */ jsx("p", { children: "Покажем весь путь — от первой заявки до документов перед вылетом и связи в поездке." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "btn glass", href: "/kak-rabotaem/", children: "Как оформляется тур" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page-cta light-cta", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-cta-copy", children: [
        /* @__PURE__ */ jsx("h2", { children: "Или сразу к делу" }),
        /* @__PURE__ */ jsx("p", { children: "Напишите, куда и когда хотите поехать — вернёмся с вариантами." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "btn light", href: waText(`Здравствуйте! Хочу подобрать тур.`), children: "Написать в WhatsApp" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "page-note", children: [
      "Официально: ",
      site.registry.label,
      " — проверить можно в ",
      /* @__PURE__ */ jsx("a", { href: site.registry.url, target: "_blank", rel: "noopener noreferrer", children: site.registry.note.toLowerCase() }),
      "."
    ] })
  ] });
}
const FILTERS = ["Все", "Море", "Сезоны", "События", "Круизы", "Корпоративным", "Природа"];
function TripCard({ card, index }) {
  const request = () => track("click_request_tour", { tour: card.title });
  const msg = `Здравствуйте! Интересует «${card.title}» (${card.region}). Даты: ___, состав: ___. Пришлите варианты и цены.`;
  return /* @__PURE__ */ jsxs("article", { className: "trip-card rich", id: card.slug, children: [
    /* @__PURE__ */ jsx(TripImage, { card }),
    /* @__PURE__ */ jsxs("div", { className: "trip-top", children: [
      /* @__PURE__ */ jsx("span", { children: card.category }),
      /* @__PURE__ */ jsx("b", { children: card.duration })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "trip-body", children: [
      /* @__PURE__ */ jsx("h2", { children: card.title }),
      /* @__PURE__ */ jsx("p", { children: card.text }),
      /* @__PURE__ */ jsxs("dl", { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Регион" }),
          /* @__PURE__ */ jsx("dd", { children: card.region })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Сезон" }),
          /* @__PURE__ */ jsx("dd", { children: card.season })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Бюджет" }),
          /* @__PURE__ */ jsxs("dd", { children: [
            card.budget,
            /* @__PURE__ */ jsx("small", { children: card.budgetNote })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "tag-row", children: card.tags.map((tag) => /* @__PURE__ */ jsx("em", { children: tag }, tag)) }),
      /* @__PURE__ */ jsxs("div", { className: "trip-actions", children: [
        /* @__PURE__ */ jsx("a", { className: "btn light", href: waText(msg), target: "_blank", rel: "noopener noreferrer", onClick: request, children: "Запросить этот тур" }),
        /* @__PURE__ */ jsx("a", { className: "trip-actions-alt", href: contacts.telegram, children: "или в Telegram" })
      ] })
    ] })
  ] });
}
function Trips() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");
  const [sort, setSort] = useState("popular");
  useEffect(() => {
    try {
      const cat = new URLSearchParams(window.location.search).get("cat");
      if (cat && FILTERS.includes(cat)) setFilter(cat);
    } catch {
    }
  }, []);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tripCards.map((card, i) => ({ card, i })).filter(({ card }) => {
      const inFilter = filter === "Все" || card.category === filter;
      const hay = `${card.title} ${card.category} ${card.region} ${card.text} ${card.tags.join(" ")}`.toLowerCase();
      return inFilter && (!q || hay.includes(q));
    });
    if (sort === "az") list.sort((a, b) => a.card.title.localeCompare(b.card.title, "ru"));
    else if (sort === "budget") list.sort((a, b) => (parseInt(a.card.budget.replace(/\D/g, ""), 10) || 9e9) - (parseInt(b.card.budget.replace(/\D/g, ""), 10) || 9e9));
    else list.sort((a, b) => a.i - b.i);
    return list.map((x) => x.card);
  }, [query, filter, sort]);
  return /* @__PURE__ */ jsxs(Page, { className: "trips-page inner-page", children: [
    /* @__PURE__ */ jsx(
      SplitTitle,
      {
        eyebrow: "каталог идей",
        title: "Поиск тура начинается с настроения",
        text: "Это не полный прайс, а витрина направлений: фильтруйте по формату, смотрите сезон и бюджет. По каждой идее можно сразу запросить варианты — подберём конкретные отели и даты."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "tour-search-panel", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Поиск по направлениям" }),
        /* @__PURE__ */ jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Япония, море, круиз, команда…", type: "search" })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Сортировка" }),
        /* @__PURE__ */ jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "popular", children: "Рекомендуемые" }),
          /* @__PURE__ */ jsx("option", { value: "az", children: "По алфавиту" }),
          /* @__PURE__ */ jsx("option", { value: "budget", children: "Сначала дешевле" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "tour-search-cta", href: "/kontakty/", children: "Оставить заявку" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "filter-row", role: "tablist", "aria-label": "Фильтр по формату", children: FILTERS.map((item) => /* @__PURE__ */ jsx("button", { role: "tab", "aria-selected": filter === item, className: filter === item ? "active" : "", onClick: () => {
      setFilter(item);
      track("filter_trips", { filter: item });
    }, children: item }, item)) }),
    /* @__PURE__ */ jsx("div", { className: "trip-grid catalog", children: visible.map((card, i) => /* @__PURE__ */ jsx(TripCard, { card, index: i }, card.slug)) }),
    visible.length === 0 && /* @__PURE__ */ jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsx("h2", { children: "Ничего не найдено" }),
      /* @__PURE__ */ jsx("p", { children: "Попробуйте другой запрос или напишите команде — часто направление можно собрать индивидуально." }),
      /* @__PURE__ */ jsx("a", { className: "btn light", href: waText("Здравствуйте! Не нашёл(ла) подходящее направление на сайте. Ищу: ___"), children: "Написать в WhatsApp" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Что можно запросить дополнительно" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Комбинация стран" }),
          /* @__PURE__ */ jsx("span", { children: "Маршрут с несколькими городами, пересадками и разным ритмом поездки." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Семейные нюансы" }),
          /* @__PURE__ */ jsx("span", { children: "Возраст детей, питание, пляж, трансферы, детская инфраструктура." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Событие под дату" }),
          /* @__PURE__ */ jsx("span", { children: "Концерт, фестиваль, спорт, праздник или сезон цветения." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Регулярные рейсы" }),
          /* @__PURE__ */ jsx("span", { children: "Если вы находитесь не в России, можно собрать маршрут в любую точку мира." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page-cta", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-cta-copy", children: [
        /* @__PURE__ */ jsx("h2", { children: "Не нашли своё направление?" }),
        /* @__PURE__ */ jsx("p", { children: "Опишите поездку в двух словах: месяц, состав, бюджет и настроение — предложим 2–3 варианта." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "btn glass", href: waText("Здравствуйте! Хочу тур. Направление: ___, даты: ___, бюджет: ___"), children: "Написать в WhatsApp" })
    ] })
  ] });
}
function Process() {
  return /* @__PURE__ */ jsxs(Page, { className: "process-page inner-page", children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Главная", path: "/" }, { label: "Как работаем" }] }),
    /* @__PURE__ */ jsx(
      SplitTitle,
      {
        eyebrow: "полностью онлайн",
        title: "Как мы оформляем тур",
        text: "Процесс прозрачный: сначала выбор и договор, затем официальная оплата и документы перед путешествием."
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "steps-track", children: steps.map(([num, title, text]) => /* @__PURE__ */ jsxs("article", { className: "step", children: [
      /* @__PURE__ */ jsx("span", { children: num }),
      /* @__PURE__ */ jsx("h2", { children: title }),
      /* @__PURE__ */ jsx("p", { children: text })
    ] }, num)) }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Что важно знать заранее" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Данные — после выбора" }),
          /* @__PURE__ */ jsx("span", { children: "Паспортные данные нужны только после согласования тура и оформления договора." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Прозрачная оплата" }),
          /* @__PURE__ */ jsx("span", { children: "Предоплата вносится на расчётный счёт агентства, чек приходит на почту." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Без скрытых условий" }),
          /* @__PURE__ */ jsx("span", { children: "Объясняем плюсы и ограничения каждого варианта, чтобы решение было спокойным." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Связь до возвращения" }),
          /* @__PURE__ */ jsx("span", { children: "Остаёмся на связи весь маршрут и помогаем, если что-то меняется в поездке." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Сроки, к которым стоит готовиться" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Подбор вариантов" }),
          /* @__PURE__ */ jsx("span", { children: "Первые предложения — в течение дня, обычно 1–2 часа в рабочее время." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Бронирование" }),
          /* @__PURE__ */ jsx("span", { children: "После согласования бронь подтверждается туроператором — обычно в течение суток." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Оплата и документы" }),
          /* @__PURE__ */ jsx("span", { children: "Оплата по договору, чек — сразу после платежа, документы — за 4–7 дней до выезда." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Перед поездкой" }),
          /* @__PURE__ */ jsx("span", { children: "Присылаем памятку: маршрут, время вылета, трансфер, важные детали направления." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page-cta", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-cta-copy", children: [
        /* @__PURE__ */ jsx("h2", { children: "Готовы начать подбор?" }),
        /* @__PURE__ */ jsx("p", { children: "Оставьте заявку — соберём варианты под ваши даты, состав и бюджет, а дальше пройдём все шаги вместе." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "btn glass", href: waText("Здравствуйте! Готов(а) начать подбор тура. Направление: ___, даты: ___"), children: "Оставить заявку" })
    ] })
  ] });
}
function Trust() {
  return /* @__PURE__ */ jsxs(Page, { className: "trust-page inner-page", children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Главная", path: "/" }, { label: "Надёжность" }] }),
    /* @__PURE__ */ jsxs("div", { className: "registry-hero", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "надёжность" }),
      /* @__PURE__ */ jsx("h1", { children: site.registry.label }),
      /* @__PURE__ */ jsx("p", { children: "Информацию о нас можно проверить в Едином федеральном реестре турагентов. Мы работаем полностью онлайн и полностью официально." }),
      /* @__PURE__ */ jsx("p", { className: "registry-hero-actions", children: /* @__PURE__ */ jsx("a", { className: "btn light", href: site.registry.url, target: "_blank", rel: "noopener noreferrer", children: "Проверить в реестре турагентов" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "trust-list", children: [
      /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsx("b", { children: "Договор до оплаты" }),
        /* @__PURE__ */ jsx("span", { children: "Предоплата производится только на основании договора." })
      ] }),
      /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsx("b", { children: "Расчётный счёт" }),
        /* @__PURE__ */ jsx("span", { children: "Оплата идёт на расчётный счёт агентства, не на личные карты." })
      ] }),
      /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsx("b", { children: "Чек на почту" }),
        /* @__PURE__ */ jsx("span", { children: "После оплаты чек отправляется на электронную почту туриста." })
      ] }),
      /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsx("b", { children: "Документы заранее" }),
        /* @__PURE__ */ jsx("span", { children: "Полный комплект документов приходит за 4–7 дней до путешествия." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Документы, которые вы получаете" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Договор" }),
          /* @__PURE__ */ jsx("span", { children: "Официальный договор с условиями тура, оформляется до внесения предоплаты." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Чек об оплате" }),
          /* @__PURE__ */ jsx("span", { children: "Фискальный чек приходит на электронную почту сразу после оплаты." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Брони и билеты" }),
          /* @__PURE__ */ jsx("span", { children: "Подтверждения отелей, авиабилеты и ваучеры на трансферы и экскурсии." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Памятка перед вылетом" }),
          /* @__PURE__ */ jsx("span", { children: "Маршрут, важные детали направления и контакты для связи в поездке." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Как проверить нас самостоятельно" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Реестр турагентов" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Найдите номер ",
            site.registry.label,
            " в Едином федеральном реестре турагентов по ИНН или названию."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Реквизиты в договоре" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Все данные агентства указаны в договоре — их легко сверить: ",
            legal.entity,
            ", ИНН ",
            legal.inn,
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Оплата на счёт" }),
          /* @__PURE__ */ jsx("span", { children: "Платёж проходит на расчётный счёт компании, а не на личные карты." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Отзывы и соцсети" }),
          /* @__PURE__ */ jsx("span", { children: "Реальные отзывы туристов и наши направления открыты в соцсетях и на картах." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "page-cta", children: [
      /* @__PURE__ */ jsxs("div", { className: "page-cta-copy", children: [
        /* @__PURE__ */ jsx("h2", { children: "Остались вопросы о безопасности сделки?" }),
        /* @__PURE__ */ jsx("p", { children: "Расскажем, как проходит договор, оплата и оформление документов — без обязательств." })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "btn glass", href: "/kontakty/", children: "Задать вопрос" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "page-note", children: [
      "Документы и условия: ",
      /* @__PURE__ */ jsx("a", { href: "/oferta/", children: "договор и публичная оферта" }),
      ", ",
      /* @__PURE__ */ jsx("a", { href: "/politika-konfidencialnosti/", children: "политика обработки персональных данных" }),
      "."
    ] })
  ] });
}
function Corporate() {
  return /* @__PURE__ */ jsxs(Page, { className: "corporate-page inner-page", children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Главная", path: "/" }, { label: "Корпоративным" }] }),
    /* @__PURE__ */ jsx("div", { className: "corporate-photo", children: /* @__PURE__ */ jsx(
      Img,
      {
        src: `${"/goroda-reki-final/"}images/trips/corporate-team.jpg`,
        webp: `${"/goroda-reki-final/"}images/trips/corporate-team.webp`,
        alt: "Команда на корпоративном выезде",
        width: "1200",
        height: "800"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "corporate-copy", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "командам и партнёрам" }),
      /* @__PURE__ */ jsx("h1", { children: "Корпоративный выезд как событие" }),
      /* @__PURE__ */ jsx("p", { children: "Поездка для команды, клиентов или партнёров: подберём направление, перелёты, размещение, программу и оформим всё официально — с договором и закрывающими документами для компании." }),
      /* @__PURE__ */ jsxs("div", { className: "mini-list", children: [
        /* @__PURE__ */ jsx("span", { children: "Красная Поляна" }),
        /* @__PURE__ */ jsx("span", { children: "Турция" }),
        /* @__PURE__ */ jsx("span", { children: "Куба" }),
        /* @__PURE__ */ jsx("span", { children: "Индонезия" }),
        /* @__PURE__ */ jsx("span", { children: "Марокко" }),
        /* @__PURE__ */ jsx("span", { children: "Таиланд" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "corporate-actions", children: [
        /* @__PURE__ */ jsx("a", { className: "btn light", href: waText("Здравствуйте! Нужен корпоративный выезд. Группа: ___, даты: ___, задача: ___"), children: "Обсудить выезд" }),
        /* @__PURE__ */ jsx("a", { className: "btn ghost", href: "#brief", children: "Прислать бриф" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Форматы корпоративных поездок" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Тимбилдинг-ретрит" }),
          /* @__PURE__ */ jsx("span", { children: "Выезд для сплочения команды: активности, неформальное общение и смена обстановки." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Инсентив для клиентов" }),
          /* @__PURE__ */ jsx("span", { children: "Мотивационная поездка для партнёров или лучших клиентов как знак признания." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Конференция и отдых" }),
          /* @__PURE__ */ jsx("span", { children: "Деловая программа с площадкой для встреч и продуманным досугом рядом." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Партнёрский выезд" }),
          /* @__PURE__ */ jsx("span", { children: "Совместная поездка с партнёрами: переговоры, презентации и общий отдых." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Что мы берём на себя" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Перелёты и трансферы" }),
          /* @__PURE__ */ jsx("span", { children: "Групповые перелёты, встреча в аэропорту и вся логистика на месте." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Отели и площадки" }),
          /* @__PURE__ */ jsx("span", { children: "Размещение под размер группы и залы для деловой части выезда." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Программа и активности" }),
          /* @__PURE__ */ jsx("span", { children: "Экскурсии, гастрономия, спорт и события под цель и настроение поездки." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Документы и отчётность" }),
          /* @__PURE__ */ jsx("span", { children: "Официальное оформление, договор и закрывающие документы для компании и бухгалтерии." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "corporate-brief", id: "brief", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { children: "Пришлите бриф — подготовим варианты" }),
        /* @__PURE__ */ jsx("p", { children: "Достаточно размера группы, города вылета, дат, бюджета и цели выезда. Обычно присылаем 2–3 варианта с разной логикой: «экономично», «сбалансированно», «максимальный опыт»." }),
        /* @__PURE__ */ jsxs("ul", { className: "check-list", children: [
          /* @__PURE__ */ jsx("li", { children: "Считаем бюджет на группу и на человека" }),
          /* @__PURE__ */ jsx("li", { children: "Предлагаем площадки для деловой части" }),
          /* @__PURE__ */ jsx("li", { children: "Готовим договор, счёт и закрывающие документы" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(LeadForm, { compact: true, preset: { direction: "Корпоративный выезд" } })
    ] })
  ] });
}
function Contacts() {
  return /* @__PURE__ */ jsxs(Page, { className: "contacts-page inner-page", children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Главная", path: "/" }, { label: "Контакты" }] }),
    /* @__PURE__ */ jsx(
      SplitTitle,
      {
        eyebrow: "контакты",
        title: "Оставьте заявку удобным способом",
        text: "Заполните форму — ответим в течение 15 минут в рабочее время. Или напишите в мессенджер: в первом сообщении достаточно направления, дат, состава поездки, города вылета и бюджета."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "contact-layout", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "contact-grid", children: [
          /* @__PURE__ */ jsxs("a", { href: waText("Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___."), onClick: () => track("click_whatsapp_contacts"), children: [
            "WhatsApp ",
            /* @__PURE__ */ jsx("span", { children: site.phone })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: contacts.telegram, children: [
            "Telegram ",
            /* @__PURE__ */ jsx("span", { children: "@Olgagorodareki" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: contacts.max, children: [
            "MAX ",
            /* @__PURE__ */ jsx("span", { children: "написать в мессенджере" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: contacts.vk, children: [
            "ВКонтакте ",
            /* @__PURE__ */ jsx("span", { children: "vk.com/gorodareki" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: site.phoneHref, onClick: () => track("click_phone_contacts"), children: [
            "Телефон ",
            /* @__PURE__ */ jsx("span", { children: site.phone })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: `mailto:${site.email}`, children: [
            "Почта ",
            /* @__PURE__ */ jsx("span", { children: site.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "contact-hours", children: [
          /* @__PURE__ */ jsx("b", { children: "Режим работы:" }),
          " ",
          site.workHours
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "contact-manager", children: [
          "Заявку ведёт ",
          site.manager,
          " — ",
          site.managerRole,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "contact-form-title", children: "Заявка на подбор тура" }),
        /* @__PURE__ */ jsx(LeadForm, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Что указать в первом сообщении" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Направление и даты" }),
          /* @__PURE__ */ jsx("span", { children: "Страна или город и примерные даты — либо длительность и месяц поездки." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Состав поездки" }),
          /* @__PURE__ */ jsx("span", { children: "Сколько взрослых и детей, возраст детей, едете семьёй, парой или командой." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Город вылета и бюджет" }),
          /* @__PURE__ */ jsx("span", { children: "Откуда удобно лететь и ориентир по бюджету на человека или на всю поездку." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Настроение отдыха" }),
          /* @__PURE__ */ jsx("span", { children: "Что важно: пляж, экскурсии, спокойствие, активность, гастрономия или события." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "travel-info-block", children: [
      /* @__PURE__ */ jsx("h2", { children: "Как мы отвечаем" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Быстрый ответ" }),
          /* @__PURE__ */ jsx("span", { children: "В рабочее время — как правило, в течение 15–60 минут; вне часов работы отвечаем утром." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Полностью онлайн" }),
          /* @__PURE__ */ jsx("span", { children: "Всё общение, подбор и оформление проходят в мессенджере — приезжать в офис не нужно." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Без спешки" }),
          /* @__PURE__ */ jsx("span", { children: "Не давим на решение: спокойно сравниваем варианты и объясняем условия." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("b", { children: "Личный менеджер" }),
          /* @__PURE__ */ jsx("span", { children: "За вашим запросом закрепляется менеджер по нужному направлению." })
        ] })
      ] })
    ] })
  ] });
}
function Legal({ route }) {
  const isPrivacy = route.id === "privacy";
  return /* @__PURE__ */ jsxs(Page, { className: `legal-page inner-page ${isPrivacy ? "privacy-page" : "oferta-page"}`, children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Главная", path: "/" }, { label: route.label }] }),
    /* @__PURE__ */ jsx(
      SplitTitle,
      {
        eyebrow: "документы",
        title: isPrivacy ? "Политика обработки персональных данных" : "Договор и публичная оферта",
        text: isPrivacy ? `Как мы собираем, храним и используем данные, которые вы оставляете на сайте и в мессенджерах. Действует в соответствии с Федеральным законом № 152-ФЗ «О персональных данных». Обновлено ${legal.privacyUpdated}.` : "Условия работы агентства: как оформляется договор, вносится предоплата, выдаются документы и решаются спорные ситуации."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "legal-body", children: [
      /* @__PURE__ */ jsxs("p", { className: "legal-warning", children: [
        /* @__PURE__ */ jsx("b", { children: "Черновик для проверки." }),
        " Шаблон подготовлен для сайта и требует заполнения реквизитов (",
        legal.entity,
        ", ИНН ",
        legal.inn,
        ", ОГРН ",
        legal.ogrn,
        ") и финальной юридической вычитки владельцем агентства."
      ] }),
      isPrivacy ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("h2", { children: "1. Оператор персональных данных" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Оператор: ",
          legal.entity,
          ", ИНН ",
          legal.inn,
          ", ОГРН ",
          legal.ogrn,
          ", адрес: ",
          legal.address,
          ". Контакт для обращений: ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${site.email}`, children: site.email }),
          ", ",
          site.phone,
          "."
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "2. Какие данные мы обрабатываем" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "имя или как к вам обращаться;" }),
          /* @__PURE__ */ jsx("li", { children: "телефон, e-mail, ник в мессенджере (WhatsApp, Telegram, MAX, ВКонтакте);" }),
          /* @__PURE__ */ jsx("li", { children: "сведения о поездке: направление, даты, состав, бюджет, пожелания;" }),
          /* @__PURE__ */ jsx("li", { children: "технические данные: IP-адрес, cookie, статистика посещений (обезличенно);" }),
          /* @__PURE__ */ jsx("li", { children: "данные, необходимые для оформления тура, — только после заключения договора." })
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "3. Зачем мы обрабатываем данные" }),
        /* @__PURE__ */ jsx("p", { children: "Чтобы подобрать тур, согласовать условия, оформить договор и бронирование, передать документы туроператору, связаться с вами до, во время и после поездки, а также для улучшения сайта." }),
        /* @__PURE__ */ jsx("h2", { children: "4. Правовые основания" }),
        /* @__PURE__ */ jsx("p", { children: "Ваше согласие (ст. 6 152-ФЗ), исполнение договора, а также требования законодательства РФ для оформления туристского продукта." }),
        /* @__PURE__ */ jsx("h2", { children: "5. Передача третьим лицам" }),
        /* @__PURE__ */ jsx("p", { children: "Данные передаются туроператору, страховщику, авиакомпании и принимающей стороне — только в объёме, необходимом для бронирования и оформления поездки. Мы не продаём и не передаём данные для рекламы третьих лиц." }),
        /* @__PURE__ */ jsx("h2", { children: "6. Хранение и защита" }),
        /* @__PURE__ */ jsx("p", { children: "Данные хранятся не дольше, чем нужно для целей обработки, и в течение сроков, установленных законодательством. Доступ имеют только уполномоченные сотрудники. Используются организационные и технические меры защиты." }),
        /* @__PURE__ */ jsx("h2", { children: "7. Cookie и аналитика" }),
        /* @__PURE__ */ jsx("p", { children: "Сайт использует cookie и обезличенную статистику (Яндекс.Метрика) для оценки удобства и улучшения страниц. Отключить cookie можно в настройках браузера." }),
        /* @__PURE__ */ jsx("h2", { children: "8. Ваши права" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Вы можете запросить информацию об обработке своих данных, потребовать уточнения, блокирования или уничтожения данных, а также отозвать согласие — напишите на ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${site.email}`, children: site.email }),
          "."
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "9. Изменения политики" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Актуальная редакция всегда опубликована на этой странице. Дата последнего обновления: ",
          legal.privacyUpdated,
          "."
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("h2", { children: "1. Общие положения" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Настоящий документ является публичной офертой ",
          legal.entity,
          " (далее — «Агентство») о подборе, бронировании и оформлении туристского продукта и описывает порядок работы с заявками через сайт ",
          site.registry.label,
          "."
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "2. Порядок работы" }),
        /* @__PURE__ */ jsxs("ol", { children: [
          /* @__PURE__ */ jsx("li", { children: "Клиент оставляет заявку на сайте или в мессенджере: направление, даты, состав поездки, бюджет, город вылета." }),
          /* @__PURE__ */ jsx("li", { children: "Агентство подбирает варианты и передаёт их клиенту вместе с условиями и ограничениями." }),
          /* @__PURE__ */ jsx("li", { children: "После выбора варианта оформляется договор. Паспортные данные запрашиваются только на этом этапе." }),
          /* @__PURE__ */ jsx("li", { children: "Предоплата вносится на расчётный счёт Агентства на основании договора; после оплаты клиент получает чек." }),
          /* @__PURE__ */ jsx("li", { children: "Документы (билеты, ваучеры, подтверждения) направляются клиенту за 4–7 дней до начала путешествия." })
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "3. Стоимость и оплата" }),
        /* @__PURE__ */ jsx("p", { children: "Стоимость туристского продукта определяется ценами туроператора на дату подтверждения бронирования. Агентское вознаграждение включено в стоимость и оплачивается туроператором; отдельная плата за подбор возможна только по предварительному согласованию с клиентом." }),
        /* @__PURE__ */ jsx("h2", { children: "4. Изменение и отмена" }),
        /* @__PURE__ */ jsx("p", { children: "Условия изменения, отмены и возврата определяются договором с туроператором, правилами направления и законодательством РФ. Агентство информирует клиента о фактических размерах удержаний на момент обращения." }),
        /* @__PURE__ */ jsx("h2", { children: "5. Ответственность" }),
        /* @__PURE__ */ jsx("p", { children: "Агентство отвечает за подбор, бронирование и документальное оформление в рамках договора. Исполнение услуг, входящих в туристский продукт, обеспечивается туроператором. Агентство оказывает клиенту содействие в спорных ситуациях, включая связь с туроператором, отелем, страховой компанией." }),
        /* @__PURE__ */ jsx("h2", { children: "6. Обработка данных" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Порядок обработки персональных данных описан в ",
          /* @__PURE__ */ jsx("a", { href: "/politika-konfidencialnosti/", children: "политике обработки персональных данных" }),
          "."
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "7. Реквизиты и связь" }),
        /* @__PURE__ */ jsxs("p", { children: [
          legal.entity,
          " · ИНН ",
          legal.inn,
          " · ОГРН ",
          legal.ogrn,
          " · ",
          legal.address,
          /* @__PURE__ */ jsx("br", {}),
          "Телефон: ",
          site.phone,
          " · E-mail: ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${site.email}`, children: site.email }),
          " · Telegram: ",
          /* @__PURE__ */ jsx("a", { href: contacts.telegram, children: "@Olgagorodareki" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "legal-contact", children: [
        "Вопросы по документам — ",
        /* @__PURE__ */ jsx("a", { href: "/kontakty/", children: "через форму на странице контактов" }),
        " или письмом на ",
        site.email,
        "."
      ] })
    ] })
  ] });
}
function NotFound() {
  return /* @__PURE__ */ jsx(Page, { className: "notfound-page inner-page", children: /* @__PURE__ */ jsxs("div", { className: "notfound", children: [
    /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "ошибка 404" }),
    /* @__PURE__ */ jsx("h1", { children: "Такой страницы нет" }),
    /* @__PURE__ */ jsx("p", { children: "Возможно, ссылка устарела. Посмотрите разделы ниже или напишите нам — подскажем, где искать нужное." }),
    /* @__PURE__ */ jsx("div", { className: "notfound-links", children: nav.map((n) => /* @__PURE__ */ jsx("a", { href: n.path, children: n.label }, n.id)) }),
    /* @__PURE__ */ jsx("a", { className: "btn light", href: waText("Здравствуйте! Не нашёл(ла) нужную информацию на сайте: ___"), children: "Написать в WhatsApp" })
  ] }) });
}
const __vite_import_meta_env__$1 = { "BASE_URL": "/goroda-reki-final/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true };
const BASE = __vite_import_meta_env__$1 && "/goroda-reki-final/" || "/";
function normalize(pathname) {
  let p = pathname || "/";
  const b = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  if (b && b !== "/" && p.startsWith(b)) p = p.slice(b.length) || "/";
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}
function routeById(id) {
  return routes.find((r) => r.id === id) || null;
}
function routeByPath(pathname) {
  const p = normalize(pathname);
  const exact = routes.find((r) => normalize(r.path) === p);
  if (exact) return { route: exact, found: true };
  return { route: routeById("home"), found: false };
}
const __vite_import_meta_env__ = { "BASE_URL": "/goroda-reki-final/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true };
function basePath() {
  const b = __vite_import_meta_env__ && "/goroda-reki-final/" || "/";
  return b.endsWith("/") ? b : b + "/";
}
function canonicalUrl(route, origin = site.origin) {
  const b = basePath();
  const p = route.path === "/" ? "" : route.path.replace(/^\//, "");
  return origin.replace(/\/$/, "") + "/" + (b === "/" ? "" : b.replace(/^\//, "")) + p;
}
function ogImageUrl(origin = site.origin) {
  return site.origin.replace(/\/$/, "") + basePath() + site.ogImage;
}
function jsonLdFor(id, origin = site.origin) {
  const blocks = [];
  const home = routes.find((r) => r.id === "home");
  blocks.push({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    description: site.defaultDescription,
    url: canonicalUrl(home, origin),
    image: ogImageUrl(origin),
    telephone: site.phone,
    email: site.email,
    priceRange: "₽₽",
    areaServed: ["RU", "BY", "KZ"],
    sameAs: [contacts.vk, contacts.telegram],
    identifier: site.registry.label
  });
  if (id === "home" || id === "contacts") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
    });
  }
  if (id === "trips") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Направления и форматы путешествий",
      itemListElement: tripCards.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: c.title,
          description: c.text,
          category: c.category,
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            description: `${c.budget} — ${c.budgetNote || "условия уточняются"}`,
            availability: "https://schema.org/InStock",
            url: canonicalUrl(routes.find((r) => r.id === "trips"), origin)
          }
        }
      }))
    });
  }
  return blocks;
}
function headFor(route, origin = site.origin) {
  const title = route.title || site.defaultTitle;
  const description = route.description || site.defaultDescription;
  const url = canonicalUrl(route, origin);
  const image = ogImageUrl(origin);
  return {
    title,
    description,
    url,
    image,
    robots: route.noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
    metas: [
      ["name", "description", description],
      ["name", "robots", route.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"],
      ["property", "og:type", "website"],
      ["property", "og:site_name", site.name],
      ["property", "og:locale", "ru_RU"],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:url", url],
      ["property", "og:image", image],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", image]
    ],
    jsonLd: jsonLdFor(route.id, origin)
  };
}
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function applyMeta(route) {
  if (typeof document === "undefined") return;
  const head = headFor(route, site.origin);
  document.title = head.title;
  for (const [attr, key, value] of head.metas) setMeta(attr, key, value);
  setLink("canonical", head.url);
  head.jsonLd.forEach((data, i) => {
    const id = "ld-" + i;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  });
}
const PAGES = { home: Home, olga: Olga, trips: Trips, process: Process, trust: Trust, corporate: Corporate, contacts: Contacts, oferta: Legal, privacy: Legal };
const NOT_FOUND = {
  id: "notfound",
  path: "/404",
  label: "Страница не найдена",
  title: "Страница не найдена — Города и реки",
  description: "Такой страницы нет. Вернитесь на главную или напишите нам — подберём тур.",
  noindex: true
};
function App({ url }) {
  const [current, setCurrent] = useState(() => url || (typeof window !== "undefined" ? normalize(window.location.pathname) : "/"));
  const first = React.useRef(!url);
  useEffect(() => {
    if (url) return;
    const onPop = () => setCurrent(normalize(window.location.pathname));
    window.addEventListener("popstate", onPop);
    window.addEventListener("gr:navigate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("gr:navigate", onPop);
    };
  }, [url]);
  const { route, found } = routeByPath(current);
  const active = found ? route : NOT_FOUND;
  const Page2 = PAGES[active.id] || NotFound;
  useEffect(() => {
    if (url || typeof document === "undefined") return;
    applyMeta(active);
    if (first.current) {
      first.current = false;
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
      track("page_view", { path: current });
    }
  }, [current, url]);
  return /* @__PURE__ */ jsxs("div", { className: `site page-${active.id}`, children: [
    /* @__PURE__ */ jsx("a", { className: "skip-link", href: "#main", children: "Перейти к содержимому" }),
    /* @__PURE__ */ jsx(Header, { page: active.id }),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx(Page2, { route: active }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(StickyCta, {}),
    /* @__PURE__ */ jsx(CookieNotice, {})
  ] });
}
function render(url) {
  return renderToString(/* @__PURE__ */ jsx(App, { url }));
}
export {
  basePath,
  canonicalUrl,
  contacts,
  faq,
  headFor,
  render,
  routes,
  site,
  tripCards
};
