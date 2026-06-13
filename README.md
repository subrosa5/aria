# Aria — AI-powered SaaS Workspace

> Полноценная AI-платформа для продуктивности: чат с ИИ, генерация контента, управление рабочим пространством. Production-ready SaaS с аутентификацией, стримингом и полировкой UI.

**Live:** https://aria-three-alpha.vercel.app · **GitHub:** https://github.com/subrosa5/aria

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?style=flat-square&logo=prisma)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## Что сделано и исправлено

### ✅ Подключение Groq AI (реальный ИИ вместо demo-режима)
- Интегрирован **Groq API** с моделью **Llama 3.1 8B Instant** (бесплатный тариф)
- Установлен пакет `@ai-sdk/groq`, настроен `streamText` через Vercel AI SDK v6
- API-ключ добавлен в переменные окружения Vercel
- Чат теперь отдаёт реальные стриминговые ответы от LLM

### ✅ Фикс: ИИ не отвечал в чате
- **Проблема:** баг замыкания в `send()` — `activeChatId` захватывался как `null` в момент вызова функции. После `addChat()` устанавливал временный ID, но условие `activeChatId?.startsWith("temp-")` было `false`, и `updateLastMessage()` не находил нужный чат
- **Решение:** введена локальная переменная `tempChatId`, которая независимо отслеживает временный ID чата и корректно подменяется на реальный после ответа сервера

### ✅ Удаление чатов
- Кнопка с иконкой корзины появляется при наведении на чат в сайдбаре (`opacity-0 group-hover:opacity-100`)
- DELETE-запрос на `/api/chat` удаляет чат и все его сообщения из БД каскадно
- Zustand-стор обновляется: удалённый чат исчезает из списка, активным становится следующий

### ✅ Переключатель языка EN / RU
- Кнопка переключения встроена в **навбар лендинга** (между ссылками и CTA-кнопкой)
- В **Sidebar** — кнопка над «Выйти», показывает текущий язык
- На страницах **авторизации** — компактный toggle в правом углу
- Выбор языка сохраняется в `localStorage` через Zustand `persist`
- Исправлен баг: плавающий `fixed top-4 right-4` toggle перекрывал кнопку «Начать» на лендинге — убран из глобального layout

### ✅ Полный перевод интерфейса на русский язык
Все страницы полностью переведены — ни одной английской надписи при выбранном RU:

| Страница | Что переведено |
|---|---|
| Лендинг | Навбар, hero-секция, фичи, тарифы, CTA, футер |
| Авторизация (вход) | Заголовок, подзаголовок, поля, кнопки, ссылки |
| Авторизация (регистрация) | Все поля, плейсхолдеры, кнопки, ссылки |
| Дашборд | Приветствие, 4 стат-карточки, usage-бар с подстановкой переменных, быстрые действия |
| Инструменты | Заголовок, описание, 4 карточки инструментов |
| Генератор контента | Типы контента, 5 тонов, лейблы, плейсхолдеры, кнопки, пустое состояние |
| Настройки | Все секции: профиль, тариф, безопасность, кнопки |
| Чат | Новый чат, плейсхолдер, подсказка горячих клавиш, пустое состояние |

`i18n.ts` расширен с ~60 до 130+ ключей переводов.

### ✅ Мобильная адаптация Sidebar
- **Desktop (md+):** фиксированный сайдбар 256px — без изменений
- **Mobile:** сайдбар скрыт по умолчанию
  - Мобильный top bar (h-14, тёмный) с логотипом и кнопкой-гамбургером — всегда виден
  - Гамбургер открывает **drawer** (w-72) с анимацией slide-in 300ms
  - Затемнённый overlay закрывает drawer по тапу
  - Кнопка ✕ внутри drawer
  - Клик по пункту меню автоматически закрывает drawer

### ✅ Мобильная адаптация всех страниц
Все аутентифицированные страницы (dashboard, chat, tools, writer, settings):
- `ml-64` → `md:ml-64` — убран жёсткий отступ под сайдбар на мобиле
- `pt-14 md:pt-0` — контент не перекрывается мобильным top bar
- `p-8` → `p-4 md:p-8` — нормальные отступы на маленьких экранах
- Заголовки адаптированы: `text-3xl` → `text-2xl md:text-3xl`
- Статистические карточки: адаптивные размеры иконок и паддингов
- Кнопки на мобиле переносятся вниз, не обрезаются

### ✅ Прочие технические улучшения
- Добавлена кириллическая подгрузка шрифта Inter (`subsets: ["latin", "cyrillic"]`) — корректное отображение русского текста
- `viewport` вынесен из `metadata` в отдельный экспорт (фикс deprecated warning в Next.js 16)
- Добавлен мета-тег viewport с `maximum-scale=1` для предотвращения zoom на мобиле

---

## Функциональность приложения

### Лендинг
- Анимированный hero с градиентным текстом (Framer Motion)
- Сетка фич с анимациями при скролле
- Таблица тарифов (Free / Pro / Team) с выделенным планом
- Полностью адаптивный дизайн

### Аутентификация
- Регистрация и вход по email + пароль
- JWT в **httpOnly cookies** (защита от XSS)
- Middleware защищает все маршруты `/dashboard`, `/chat`, `/tools`, `/settings`
- Хэширование паролей через **bcryptjs** (cost factor 12)
- Валидация всех API-запросов через Zod

### AI Чат (стриминг)
- Реальные стриминговые ответы от **Llama 3.1 8B** через Groq API
- SSE (Server-Sent Events) — без polling
- Мультичат: создание, переключение, история
- Хранение чатов и сообщений в PostgreSQL
- Индикатор набора с анимированными точками
- Автоскролл к последнему сообщению
- Автоматический заголовок из первого сообщения
- **Удаление чатов** — иконка корзины при наведении
- Предложенные промпты на пустом состоянии

### Генератор контента
- 4 типа контента: **Статья/Blog Post**, **Email**, **Соцсети**, **Код**
- 5 тонов: Профессиональный, Повседневный, Дружелюбный, Убедительный, Информативный
- Skeleton-лоадер во время генерации
- Копирование в буфер одним кликом с подтверждением

### Дашборд
- Персональное приветствие
- Стат-карточки: сообщения, генерации, тариф, активные дни
- Прогресс-бар использования бесплатного плана
- Быстрый доступ к инструментам

### Настройки
- Редактирование профиля
- Отображение тарифа с CTA апгрейда
- Секция безопасности

### Переключатель языка
- Переключение EN/RU в один клик
- Сохранение выбора в localStorage
- Встроен в навбар, сайдбар и страницы авторизации

---

## Стек технологий

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 16 (App Router) |
| Язык | TypeScript 5 |
| Стили | Tailwind CSS v4 |
| Анимации | Framer Motion |
| Иконки | Lucide React |
| State | Zustand + persist middleware |
| Валидация | Zod |
| Авторизация | JWT + bcryptjs + httpOnly cookies |
| AI | Groq API — Llama 3.1 8B Instant (free) |
| ORM | Prisma v5 |
| База данных | PostgreSQL (Neon serverless) |
| Деплой | Vercel |

---

## Структура проекта

```
src/
├── app/
│   ├── page.tsx                  # Лендинг
│   ├── layout.tsx                # Root layout
│   ├── auth/
│   │   ├── login/page.tsx        # Форма входа
│   │   └── register/page.tsx     # Форма регистрации
│   ├── dashboard/page.tsx        # Дашборд со статистикой
│   ├── chat/page.tsx             # AI Чат со стримингом
│   ├── tools/
│   │   ├── page.tsx              # Каталог инструментов
│   │   └── writer/page.tsx       # Генератор контента
│   ├── settings/page.tsx         # Настройки аккаунта
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts    # POST: авторизация
│       │   ├── register/route.ts # POST: регистрация
│       │   ├── logout/route.ts   # POST: выход
│       │   └── me/route.ts       # GET: текущий пользователь
│       ├── chat/route.ts         # POST: стриминг AI | GET: история | DELETE: удаление
│       └── generate/route.ts     # POST: генерация контента
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx           # Сайдбар (desktop + mobile drawer)
│   └── LanguageToggle.tsx        # Компонент переключателя языка
├── lib/
│   ├── auth.ts                   # JWT, bcrypt, getCurrentUser
│   ├── i18n.ts                   # 130+ ключей переводов EN/RU
│   ├── prisma.ts                 # Prisma singleton
│   └── utils.ts                  # cn() (clsx + tailwind-merge)
├── store/
│   ├── chat.ts                   # Zustand: чаты, сообщения, стриминг
│   └── language.ts               # Zustand: язык интерфейса (persist)
└── middleware.ts                  # Защита маршрутов
```

---

## Схема базы данных

```
User     — id, name, email, password (bcrypt), plan, avatar, createdAt
Chat     — id, userId, title, createdAt
Message  — id, chatId, userId, role (user|assistant), content, createdAt
Usage    — id, userId, type, tokens, createdAt
```

---

## Запуск локально

```bash
# 1. Клонировать репозиторий
git clone https://github.com/subrosa5/aria.git
cd aria

# 2. Установить зависимости
npm install

# 3. Настроить переменные окружения
cp .env.example .env
# Заполнить DATABASE_URL, JWT_SECRET, GROQ_API_KEY

# 4. Применить схему БД
npx prisma db push

# 5. Запустить dev-сервер
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

### Переменные окружения

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | PostgreSQL строка подключения |
| `DIRECT_URL` | Прямое подключение для Prisma миграций |
| `JWT_SECRET` | Секрет для подписи JWT-токенов |
| `GROQ_API_KEY` | API-ключ Groq (console.groq.com, бесплатно) |

> Без `GROQ_API_KEY` приложение работает в **demo-режиме** — весь UI функционирует, AI возвращает заглушку.

---

## Стриминг: как работает

Чат использует кастомный SSE-поток на базе Web `ReadableStream`:

```ts
// Сервер отправляет события: data: {"delta": "token"}\n\n
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
const stream = new ReadableStream({
  async start(controller) {
    const result = streamText({ model: groq("llama-3.1-8b-instant"), messages });
    for await (const delta of (await result).textStream) {
      controller.enqueue(encode(`data: ${JSON.stringify({ delta })}\n\n`));
    }
    controller.enqueue(encode("data: [DONE]\n\n"));
    controller.close();
  }
});
```

Клиент читает поток токен за токеном и обновляет Zustand-стор — React перерисовывает каждый новый символ в реальном времени.

---

## Деплой

Приложение задеплоено на **Vercel** (Hobby plan, бесплатно).
База данных на **Neon** (serverless PostgreSQL, бесплатный тариф).

```bash
npx vercel --prod
```
