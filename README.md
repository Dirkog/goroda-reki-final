# Города и реки — финальная React-версия

Это новая версия сайта под турагента Ольгу Дудареву: travel editorial, реальные визуалы, понятная структура, без абстрактного WebGL-портфолио.

## Запуск локально

```bash
npm install
npm run dev
```

Открыть:

```text
http://localhost:5173
```

## Если PowerShell/Windows

Если установка зависимостей падает из-за сети:

```powershell
npm config set registry https://registry.npmjs.org/
npm install --legacy-peer-deps --no-audit --no-fund --fetch-retries=8 --fetch-retry-mintimeout=30000 --fetch-retry-maxtimeout=180000
npm run dev
```

## Страницы

- Главная
- Ольга
- Путешествия
- Как работаем
- Надёжность
- Корпоративным
- Контакты

Физически это React SPA, страницы лежат в `src/pages/`.
