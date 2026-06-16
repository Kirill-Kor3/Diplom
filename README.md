# TechStore — Интернет-магазин компьютерной техники

Дипломный проект по теме: **«Проектирование и разработка веб-ресурса для магазина продажи компьютерной техники и комплектующих»**.

## Возможности

### Публичная часть
- Главная страница с хитами продаж и категориями
- Каталог с фильтрацией, поиском, сортировкой и пагинацией
- Карточки товаров с характеристиками
- Корзина (сохраняется в localStorage)
- Оформление заказа (для гостей и авторизованных)
- Регистрация и авторизация
- Личный кабинет с историей заказов
- Страницы «О магазине» и «Контакты»

### Админ-панель (`/admin`)
- Дашборд со статистикой и выручкой
- CRUD товаров и категорий
- Управление заказами (смена статуса)
- Список пользователей

## Технологии

| Слой | Стек |
|------|------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Node.js, Express 5, Prisma ORM |
| БД | SQLite |
| Auth | JWT + bcrypt |

## Быстрый старт

```bash
# Установка и инициализация БД
npm run setup

# Запуск (фронт + бэк)
npm run dev
```

- Сайт: http://localhost:5173
- API: http://localhost:3001/api

## Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@techstore.ru | admin123 |
| Пользователь | user@techstore.ru | user123 |

## Структура проекта

```
diplom/
├── client/          # Vite + React (фронтенд)
├── server/          # Express API + Prisma
│   ├── prisma/      # Схема БД и seed
│   └── src/         # Роуты и middleware
└── package.json     # Корневые скрипты
```

## API Endpoints

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/products` — список товаров
- `GET /api/products/:slug` — товар по slug
- `GET /api/categories` — категории
- `POST /api/orders` — создать заказ
- `GET /api/admin/stats` — статистика (admin)

## Production

```bash
npm run build
cd server && NODE_ENV=production npm start
```

Сервер раздаёт собранный фронтенд из `client/dist`.
