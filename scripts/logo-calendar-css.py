#!/usr/bin/env python3
"""Стили: логотип-знак, рваный край кадра, читаемый календарь."""
SITE = '/home/user/work/site'
CSS = """

/* =========================================================
   ЛОГОТИП-ЗНАК (волны и дом) вместо букв
   ========================================================= */
.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: var(--primary);
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 2px;
  flex-shrink: 0;
}
.brand-mark svg { display: block; }
.header.is-transparent .brand-mark { color: #fff; border-color: rgba(255, 255, 255, 0.45); background: rgba(255, 255, 255, 0.06); }
.footer-logo { display: inline-flex; align-items: center; gap: 12px; }
.footer-logo svg { color: var(--accent-soft); flex-shrink: 0; }

/* =========================================================
   РВАНЫЙ КРАЙ: фото переходит в бумагу, как на референсе
   ========================================================= */
.frame-tear {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 130px;
  z-index: 4;
  pointer-events: none;
  opacity: var(--bridge);
  transform: translateY(calc(74% - var(--bridge) * 74%));
  filter: drop-shadow(0 -6px 18px rgba(10, 12, 14, 0.18));
}

/* =========================================================
   КАЛЕНДАРЬ: одна строка — одно событие, читается спокойно
   ========================================================= */
.calendar-bar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 28px;
  border-bottom: 1px solid var(--line);
  font-size: 12.5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}
.calendar-list { display: grid; }
.event-row {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr) 210px;
  gap: 32px;
  padding: 30px 28px;
  border-bottom: 1px solid var(--line);
  align-items: start;
  transition: background 0.25s ease;
}
.event-row:last-child { border-bottom: 0; }
.event-row:hover { background: rgba(25, 23, 19, 0.022); }
.event-when b {
  display: block;
  font-family: var(--serif);
  font-size: 21px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--ink);
}
.event-when span { display: block; margin-top: 8px; color: var(--muted); font-size: 13.5px; }
.event-when small { display: block; margin-top: 8px; color: var(--muted); font-size: 12px; opacity: 0.75; }
.event-next {
  display: inline-block;
  margin-bottom: 10px;
  padding: 3px 9px;
  border: 1px solid var(--accent);
  border-radius: 2px;
  color: var(--accent);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.event-body h3 { font-size: 23px; line-height: 1.25; margin-bottom: 10px; max-width: 34ch; }
.event-note {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
  max-width: 62ch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.event-src {
  display: inline-block;
  margin-top: 12px;
  color: var(--muted);
  font-size: 12.5px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
}
.event-src:hover { color: var(--primary); border-color: var(--primary); }
.event-side { display: grid; gap: 14px; justify-items: start; align-content: start; }
.event-side em {
  font-style: normal;
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--line-strong);
  border-radius: 2px;
  padding: 5px 10px;
}
.event-side em.hot { color: var(--accent); border-color: var(--accent); }
.event-cta {
  color: var(--primary);
  font-weight: 600;
  font-size: 15px;
  border-bottom: 1px solid var(--line-strong);
  padding-bottom: 2px;
  white-space: nowrap;
}
.event-cta:hover { border-color: var(--primary); }

@media (max-width: 960px) {
  .event-row { grid-template-columns: 1fr; gap: 16px; padding: 24px 20px; }
  .event-side { grid-auto-flow: column; align-items: center; gap: 18px; }
  .calendar-bar { padding: 12px 20px; }
}
@media (max-width: 680px) {
  .event-body h3 { font-size: 20px; }
  .event-when b { font-size: 18px; }
  .event-side { grid-auto-flow: row; }
  .calendar-sort { display: none; }
  .frame-tear { height: 78px; }
}
"""
p = f'{SITE}/src/styles.css'
t = open(p, encoding='utf-8').read()
# старые правила календаря и логотипа перекрываются новыми (идут позже в файле)
if 'ЛОГОТИП-ЗНАК (волны и дом)' not in t:
    open(p, 'w', encoding='utf-8').write(t + CSS)
    print('стили добавлены')
else:
    print('стили уже есть')
