#!/usr/bin/env python3
"""Финальная шлифовка текста под голос одного человека + чистка «калькулятора»
на странице направлений. Каждая замена проверяется: если строка не нашлась — сообщаем."""
import re, sys

SITE = '/home/user/work/site'
done, missed = [], []

def edit(path, pairs):
    p = f'{SITE}/{path}'
    t = open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in t:
            missed.append((path, old[:70]))
            continue
        t = t.replace(old, new)
        done.append((path, old[:50]))
    open(p, 'w', encoding='utf-8').write(t)

# --- «Команда»: голос одного человека ---
edit('src/pages/Olga.jsx', [
    ('для наших туристов. Мы работаем полностью онлайн и полностью оф', 'для моих туристов. Работаю онлайн — офиса с очередями нет, зато есть личный контакт с тем, кто ведёт вашу поездку'),
    ('Наши туристы живут в разных городах России и за её пределами, по', 'Мои туристы живут в разных городах России и за её пределами, по'),
    ('Мы с вами одной крови: команда сама постоянно в пути', 'Я сама постоянно в пути'),
    ('<h2>Что мы уже организовали</h2>', '<h2>Что я уже организовала</h2>'),
    ('<b>Как мы работаем</b>', '<b>Как я работаю</b>'),
])

# --- «Как работаем»: от первого лица ---
edit('src/pages/Process.jsx', [
    ('title="Как мы оформляем тур"', 'title="Как я оформляю тур"'),
])

# --- «Надёжность» ---
edit('src/pages/Trust.jsx', [
    ('<p>Информацию о нас можно проверить в Едином федеральном реестре', '<p>Меня и агентство можно проверить в Едином федеральном реестре'),
    ('Реальные отзывы туристов и наши нап', 'Реальные отзывы туристов и мои нап'),
])

# --- «Корпоративным» / «Контакты» ---
edit('src/pages/Corporate.jsx', [('<h2>Что мы берём на себя</h2>', '<h2>Что я беру на себя</h2>')])
edit('src/pages/Contacts.jsx', [('<h2>Как мы отвечаем</h2>', '<h2>Как я отвечаю</h2>')])
edit('src/components/CookieNotice.jsx', [('Мы используем cookie', 'Использую cookie')])

# --- «Направления»: убираем «калькуляторную» панель, ставим понятную строку с фильтром ---
edit('src/pages/Trips.jsx', [
    ('title="Поиск тура начинается с настроения"', 'title="Направления: откуда начать"'),
    ('text="Это не полный прайс, а витрина направлений: фильтруйте по формату, смотрите сезон и бюджет. По каждой идее можно сразу запросить варианты — подберём конкретные отели и даты."',
     'text="Это не прайс, а витрина: по каждому направлению видно сезон, бюджет и длительность. Выберите формат или напишите мне — соберу конкретные отели, даты и цены под вашу поездку."'),
    ("""      <div className="tour-search-panel">
        <label>
          <span>Поиск по направлениям</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Япония, море, круиз, команда…" type="search" />
        </label>
        <label>
          <span>Сортировка</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="popular">Рекомендуемые</option>
            <option value="az">По алфавиту</option>
            <option value="budget">Сначала дешевле</option>
          </select>
        </label>
        <a className="tour-search-cta" href="/kontakty/">Оставить заявку</a>
      </div>""",
     """      <div className="trips-tools">
        <label className="trips-search">
          <span>Поиск по витрине</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Япония, море, круиз, команда…" type="search" />
        </label>
        <label className="trips-sort">
          <span>Порядок</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="popular">Рекомендуемые</option>
            <option value="az">По алфавиту</option>
            <option value="budget">Сначала дешевле</option>
          </select>
        </label>
        <a className="trips-calendar-link" href="/#scene-01">
          Сначала посмотреть календарь событий →
        </a>
      </div>"""),
    ('<h2>Не нашли своё направление?</h2>', '<h2>Не нашли своё направление?</h2>'),
    ('<h2>Что можно запросить дополнительно</h2>', '<h2>Что можно запросить дополнительно</h2>'),
])

# --- стили новой строки фильтров ---
css = open(f'{SITE}/src/styles.css', encoding='utf-8').read()
if '.trips-tools' not in css:
    css = css.replace("""/* ---------- каталог ---------- */""", """/* ---------- каталог: строка фильтров вместо «калькулятора» ---------- */
.trips-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  align-items: end;
  padding: 18px 0 22px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.trips-tools label { display: grid; gap: 7px; }
.trips-tools span { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--muted); }
.trips-search { flex: 1 1 320px; }
.trips-sort { flex: 0 0 190px; }
.trips-tools input, .trips-tools select {
  border: 1px solid var(--line-strong);
  border-radius: 2px;
  padding: 12px 14px;
  background: var(--surface);
  width: 100%;
}
.trips-tools input:focus, .trips-tools select:focus { outline: 2px solid var(--primary); border-color: var(--primary); }
.trips-calendar-link { font-weight: 600; color: var(--primary); padding-bottom: 12px; border-bottom: 1px solid var(--line-strong); white-space: nowrap; }
.trips-calendar-link:hover { border-color: var(--primary); }
@media (max-width: 680px) { .trips-sort { flex: 1 1 100%; } }

/* ---------- каталог ---------- */""")
    open(f'{SITE}/src/styles.css', 'w', encoding='utf-8').write(css)

# --- админка: описание для поисковых систем ---
adm = f'{SITE}/public/admin/index.html'
t = open(adm, encoding='utf-8').read()
if 'name="description"' not in t:
    t = t.replace('<title>', '<meta name="robots" content="noindex, nofollow" />\n  <meta name="description" content="Панель управления сайтом: направления, события, контакты и тексты страниц." />\n  <title>', 1)
    open(adm, 'w', encoding='utf-8').write(t)
    done.append(('public/admin/index.html', 'meta description + noindex'))

print('заменено:', len(done))
for p, s in done: print('  ✓', p, '→', s)
if missed:
    print('\nНЕ найдено (проверить вручную):', len(missed))
    for p, s in missed: print('  ✗', p, '→', s)
    sys.exit(0)
