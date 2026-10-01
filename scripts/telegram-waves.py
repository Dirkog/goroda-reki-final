#!/usr/bin/env python3
"""Перевод сайта на Telegram (WhatsApp убираем везде) и выравнивание волны внизу кадра.

Запуск: python3 scripts/telegram-waves.py [--check]
Идемпотентно: повторный запуск ничего не ломает, только сообщает «совпадает».
"""
import json, pathlib, re, sys

SITE = pathlib.Path('/home/user/work/site')
CHECK = '--check' in sys.argv
changes = []


def edit(path, pairs, required=True):
    p = SITE / path
    text = p.read_text(encoding='utf-8')
    before = text
    for old, new in pairs:
        if old in text:
            text = text.replace(old, new)
        elif required and new not in text:
            raise SystemExit(f'не найдено в {path}: {old[:70]!r}')
    if text != before:
        if not CHECK:
            p.write_text(text, encoding='utf-8')
        changes.append(str(path))


# ------------------------------------------------------------------ Telegram
LEAD = 'Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___.'
LEAD_SHORT = 'Здравствуйте! Хочу подобрать тур.'

edit('src/data/site.js', [
    ("export const waText = (text) => contacts.whatsapp + '?text=' + encodeURIComponent(text)",
     "// Telegram — основной канал: в чат уходит готовое первое сообщение.\n"
     "export const tgText = (text) => contacts.telegram + (text ? '?text=' + encodeURIComponent(text) : '')"),
    ("'Контакты: WhatsApp, Telegram, MAX и ВКонтакте'", "'Контакты: Telegram, MAX, ВКонтакте и телефон'"),
    ("Оставьте заявку на подбор тура: WhatsApp, Telegram, MAX, ВКонтакте или форма на сайте.",
     "Оставьте заявку на подбор тура: Telegram, MAX, ВКонтакте или форма на сайте."),
])

# все обращения к хелперу
for path in [p for p in (SITE / 'src').rglob('*.jsx')] + [SITE / 'src/data/site.js']:
    text = path.read_text(encoding='utf-8')
    if 'waText' in text:
        if not CHECK:
            path.write_text(text.replace('waText', 'tgText'), encoding='utf-8')
        changes.append(str(path.relative_to(SITE)))

edit('src/components/Header.jsx', [
    ('>WhatsApp</a>', '>Telegram</a>'),
    ("track('click_whatsapp', { place: 'menu' })", "track('click_telegram', { place: 'menu' })"),
])

edit('src/components/Footer.jsx', [
    ("""<a href={tgText('Здравствуйте! Хочу подобрать тур.')}>WhatsApp</a>""",
     """<a href={tgText('Здравствуйте! Хочу подобрать тур.')}>Telegram</a>"""),
])

edit('src/components/StickyCta.jsx', [
    ("track('click_whatsapp', { place: 'sticky' })", "track('click_telegram', { place: 'sticky' })"),
    ('aria-label="Написать в WhatsApp">WA</a>', 'aria-label="Написать в Telegram">TG</a>'),
])

edit('src/components/EventsCalendar.jsx', [
    ("track('click_whatsapp', { place: 'calendar' })", "track('click_telegram', { place: 'calendar' })"),
    ('Подобрать под событие в WhatsApp', 'Подобрать под событие в Telegram'),
])

edit('src/components/LeadForm.jsx', [
    ("""// ни один канал не ответил — заявку не теряем, уводим в WhatsApp
      track('lead_fallback_whatsapp', {})""",
     """// ни один канал не ответил — заявку не теряем, уводим в Telegram
      track('lead_fallback_telegram', {})"""),
    ('Продолжить в WhatsApp', 'Продолжить в Telegram'),
    ('Отправить в WhatsApp', 'Отправить в Telegram'),
    ('<span>Телефон, WhatsApp или Telegram *</span>', '<span>Телефон или Telegram *</span>'),
    ('// Порядок каналов: свой приём заявок на сайте → Web3Forms → WhatsApp.',
     '// Порядок каналов: свой приём заявок на сайте → Web3Forms → Telegram.'),
    ('// иначе открываем WhatsApp с готовым текстом (без бэкенда это надёжный путь).',
     '// иначе открываем Telegram с готовым текстом (без бэкенда это надёжный путь).'),
])

edit('src/pages/Home.jsx', [
    ("track('click_whatsapp', { place: 'hero' })", "track('click_telegram', { place: 'hero' })"),
    ('>Написать в WhatsApp</a>', '>Написать в Telegram</a>'),
])

edit('src/pages/Contacts.jsx', [
    ("""            <a href={tgText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_whatsapp', { place: 'contacts' })}>WhatsApp <span>{site.phone}</span></a>\n"""
     """            <a href={contacts.telegram}>Telegram <span>@Olgagorodareki</span></a>\n""",
     """            <a href={tgText('Здравствуйте! Хочу подобрать тур: направление ___, даты ___, состав ___.')} onClick={() => track('click_telegram', { place: 'contacts' })}>Telegram <span>@Olgagorodareki</span></a>\n"""),
])

edit('src/pages/Legal.jsx', [
    ('ник в мессенджере (WhatsApp, Telegram, MAX, ВКонтакте)', 'ник в мессенджере (Telegram, MAX, ВКонтакте)'),
])

edit('src/pages/NotFound.jsx', [
    ('>Написать в WhatsApp</a>', '>Написать в Telegram</a>'),
])

edit('src/pages/Olga.jsx', [
    ('>Написать в WhatsApp</a>', '>Написать в Telegram</a>'),
])

edit('src/pages/Trips.jsx', [
    ('>Написать в WhatsApp</a>', '>Написать в Telegram</a>'),
])

# --- содержание настроек: убираем WhatsApp как канал -------------------------
p = SITE / 'src/content/settings.json'
data = json.loads(p.read_text(encoding='utf-8'))
if 'whatsapp' in data.get('contacts', {}):
    data['contacts'].pop('whatsapp')
    if not CHECK:
        p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    changes.append('src/content/settings.json')

# ------------------------------------------------------------------- волна
p = SITE / 'src/components/HeroFilm.jsx'
t = p.read_text(encoding='utf-8')
t = t.replace('viewBox="0 0 1440 130"', 'viewBox="0 0 1440 190"')
t = t.replace("sticky.style.setProperty('--spill', smoothstep(0.42, 0.86, p).toFixed(4))",
              "sticky.style.setProperty('--spill', smoothstep(0.40, 0.80, p).toFixed(4))")
t = t.replace("sticky.style.setProperty('--tear', smoothstep(0.6, 1, p).toFixed(4))",
              "sticky.style.setProperty('--tear', smoothstep(0.52, 0.88, p).toFixed(4))")
if not CHECK:
    p.write_text(t, encoding='utf-8')
changes.append('src/components/HeroFilm.jsx')

p = SITE / 'src/styles.css'
s = p.read_text(encoding='utf-8')
s = s.replace("""  bottom: -1px;
  height: 130px;
  z-index: 4;""", """  bottom: -1px;
  height: 190px;
  z-index: 4;""")
s = s.replace(".frame-tear { opacity: var(--tear, 0); transform: translateY(calc((1 - var(--tear, 0)) * 82%)); }",
              ".frame-tear { opacity: var(--tear, 0); transform: translateY(calc((1 - var(--tear, 0)) * 46%)); }")
if not CHECK:
    p.write_text(s, encoding='utf-8')
changes.append('src/styles.css')

print('изменено файлов:', len(set(changes)))
for c in sorted(set(changes)):
    print('  ', c)
