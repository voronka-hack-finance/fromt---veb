# Заначка (front-hack29)

Адаптивный финансовый дашборд на `Next.js 15`, собранный по Figma-макету. Проект показывает клиентский интерфейс личных финансов: баланс и счета, категории, операции, инвестиции, цели, кредитная нагрузка, подписки, AI-рекомендации, push-уведомления и анимированные графики.

На ширине **≥ 1200px** отображается desktop-версия с боковым меню; на меньших экранах — мобильный layout с нижней навигацией.

## Стек

### UI и инфраструктура

- `Next.js 15` + `React 19` + `TypeScript`
- `App Router` для маршрутизации
- `CSS Modules` для изолированных стилей
- `Framer Motion` для анимаций и reveal-эффектов
- `Lucide React` для иконок
- Шрифты `Inter` и `Unbounded` (Google Fonts, кириллица)
- `output: "standalone"` — production-сборка для Docker

### API и данные

- **TanStack Query** — серверный стейт, кеш, loading/error, refetch
- **API-слой** в `src/shared/api/` — типизированные `fetch*` функции и хуки `use*Query`
- **Гибридный режим данных** — при наличии JWT-токена экраны загружаются с бэкенда, иначе используются mock-данные из `src/shared/data/`
- **`backend.ts`** — типизированные вызовы REST API (схемы из OpenAPI в `generated.ts`)
- **`backend-screen-data.ts`** — маппинг ответов бэкенда в формат UI-экранов

Виджеты **не импортируют** mock-файлы напрямую — только через API-хуки.

По умолчанию фронтенд обращается к `https://zanachka.avenir-team.ru`. Базовый URL можно переопределить через `NEXT_PUBLIC_API_URL`.

### State management

- **TanStack Query** — данные экранов (баланс, операции, категории и т.д.)
- **useState / useMemo** — локальный UI-стейт (активный период, выбранная категория, таб)
- **Zustand** — не используется; добавится только при появлении сложного клиентского стейта

### Архитектура: FSD-подобная, не полный FSD

Проект **не на чистом FSD**, а на упрощённой слоёной схеме, вдохновлённой им:

| Слой | Что делает |
|---|---|
| `app/` | Роуты Next.js (`page.tsx`, `layout.tsx`) |
| `views/` | Тонкие экранные контейнеры — связывают route и widget |
| `widgets/` | Крупные UI-блоки и готовые секции экранов |
| `shared/` | Переиспользуемые ui, lib, types, mock-data, api |

Чего **нет** из классического FSD: слоёв `pages`, `features`, `entities` и строгих правил импортов между ними.

Mock-данные живут в `shared/data/` и используются **только** внутри `shared/api/`.

## Быстрый старт

### Требования

- `Node.js 20+` (в Docker — `22-alpine`)
- `npm 10+`

### Установка и запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

### Переменные окружения

Скопируйте `.env.production.example` в `.env.local` для локальной разработки:

```bash
# Базовый URL бэкенда (по умолчанию — https://zanachka.avenir-team.ru)
NEXT_PUBLIC_API_URL=https://zanachka.avenir-team.ru

# Опциональный статический токен для быстрой проверки без экрана логина
# NEXT_PUBLIC_API_TOKEN=

# Firebase Cloud Messaging (Web Push)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Опционально: искусственная задержка mock-данных в мс (0 — без задержки)
# NEXT_PUBLIC_MOCK_DELAY_MS=0
```

### Авторизация

Клиент поддерживает JWT-авторизацию:

1. `POST /api/v1/auth/login` — получение `access_token` и `refresh_token`
2. Токены сохраняются в `localStorage` (`zanachka_access_token`, `zanachka_refresh_token`)
3. При `401` клиент автоматически обновляет access token через `POST /api/v1/auth/refresh`
4. Для dev-режима можно задать `NEXT_PUBLIC_API_TOKEN` — тогда запросы к бэкенду идут сразу, без логина

Если токена нет, экраны работают на mock-данных. Если токен есть, `tryLoadScreenData()` пытается загрузить данные с бэкенда и при ошибке откатывается на mock.

### Полезные команды

```bash
npm run dev      # dev-сервер
npm run build    # production-сборка
npm run start    # запуск собранного приложения
npm run lint     # ESLint
```

### Docker

```bash
docker compose up -d --build
```

Контейнер слушает `127.0.0.1:3002` (проброс на порт `3000` внутри контейнера).

Для web push `NEXT_PUBLIC_FIREBASE_VAPID_KEY` должен быть доступен **на этапе сборки** — значение пробрасывается через `ARG` в `Dockerfile` и `docker-compose.yml`.

### Деплой

При push в ветку `main` GitHub Actions (`.github/workflows/deploy.yml`) синхронизирует проект на VPS через `rsync` и перезапускает `docker compose up -d --build` в `/opt/zanachka/app/`.

Необходимые secrets: `VPS_SSH_KEY`, `VPS_HOST`, `VPS_PORT`, `VPS_USER`.

### Push-уведомления (Firebase)

1. В [Firebase Console](https://console.firebase.google.com/) → **Project Settings** → **Cloud Messaging** скопируйте **Web Push certificates** (VAPID key).
2. Добавьте в `.env.local` или production env:

```bash
NEXT_PUBLIC_FIREBASE_VAPID_KEY=ваш_vapid_key
```

Остальные параметры Firebase зафиксированы в `src/shared/lib/firebase/config.ts` и `public/firebase-messaging-sw.js`.

После авторизации приложение запросит разрешение на уведомления, получит FCM-токен и отправит его на бэкенд (`POST /api/v1/notifications/devices`). Тестовая отправка: `POST /api/v1/notifications/test`.

## Маршруты

| Маршрут | Описание |
|---|---|
| `/` | Главная панель дашборда (mobile + desktop preview) |
| `/budget` | Desktop-экран «Основной бюджет» |
| `/total` | Экран общего баланса / «Нагрузка» |
| `/income` | Экран доходов |
| `/investments` | Экран инвестиций |
| `/operations` | Операции с разбивкой по категориям |
| `/operations/trends` | Тренды по операциям (line chart) |
| `/operations/bars` | Bar-chart представление операций |
| `/operations/[operationId]` | Детальная карточка операции |
| `/categories` | Экран категорий расходов |
| `/categories/new` | Создание новой категории |
| `/categories/[categoryId]` | Детальная карточка категории |
| `/goals` | Мои цели — прогресс накоплений |
| `/recommendations` | AI-рекомендации (desktop) |
| `/recommendations/[agentId]/chat` | Чат с AI-агентом |
| `/subscriptions` | Подписки (desktop) |
| `/bank-accounts` | Список банковских счетов |
| `/bank-accounts/new` | Создание нового счёта |
| `/bank-accounts/add` | Добавление счёта |
| `/bank-accounts/[accountId]` | Детальная карточка счёта |
| `/credit-load` | Кредитная нагрузка |
| `/credit-load/add` | Добавление кредита |
| `/credit-load/[loanId]` | Детальная карточка кредита |
| `/notifications` | Центр уведомлений |

### Навигация

#### Мобильная (`BottomNav`)

На части экранов отображается нижняя панель с четырьмя вкладками:

- **Главная** → `/`
- **История** → `/operations/trends`
- **Мои цели** → `/goals`
- **Категории** → `/categories`

Панель также показывается на `/total`, `/recommendations` и внутри раздела `/operations/*`.

Дополнительные переходы из UI:

- иконка уведомлений в `AppTopBar` → `/notifications`
- карточка баланса → `/bank-accounts`
- блок кредитной нагрузки → `/credit-load`

#### Desktop (`DesktopSidebar`)

На ширине ≥ 1200px большинство экранов переключаются на desktop-layout с боковым меню:

- **Главная** (раскрывающийся блок):
  - Основной бюджет → `/budget`
  - Доходы и расходы → `/operations`
  - Остаток от дохода → `/income`
  - Инвестиции → `/investments`
  - Нагрузка → `/total`
- **Категории** → `/categories`
- **Цели** → `/goals`
- **Счета** → `/total`
- **AI Рекомендации** → `/recommendations`

Конфигурация пунктов меню — в `src/shared/ui/desktop-sidebar/desktop-sidebar-config.ts`.

## Экраны и виджеты

### Главная (`/`)

Собрана из карточек в `src/widgets/home/`:

- `BalanceCard` — общий баланс и счета (переход на `/bank-accounts`)
- `AssistantCard` — блок ассистента
- `OperationsCard`, `IncomeStatCard`, `InvestmentStatCard` — метрики
- `RecurringExpensesCard` — регулярные расходы
- `ForecastCard` / `ForecastLineChart` — прогноз доходов и расходов
- `CreditLoadCard` — кредитная нагрузка (переход на `/credit-load`)
- `CategoriesCard` — превью категорий
- `DesktopDashboard` — desktop-версия главной (календарь трат, метрики, график)
- `SpendingCalendarGroups` — группировка операций по дням в календаре
- `BudgetDashboard` — экран «Основной бюджет» (`/budget`): sparkline, runway, защита бюджета

### Операции

- `operations-screen` — разбивка по категориям с переключением периода
- `operations-trends-screen` — линейный график трендов
- `operations-bars-screen` — столбчатый график
- `operation-detail-screen` — детализация операции (кэшбэк, налоговый вычет и т.д.)

### Категории

- `categories-screen` / `desktop-categories-screen` — список категорий с radar-chart
- `create-category-screen` — форма создания категории (`/categories/new`)
- `category-detail-screen` — детализация категории с лимитом и операциями

### Счета и кредиты

- `bank-accounts-screen` — список счетов по банкам
- `bank-account-detail-screen` — детализация счёта с картой и операциями
- `new-bank-account-screen` / `add-bank-account-screen` — создание и добавление счёта
- `credit-load-screen` — обзор кредитной нагрузки
- `loan-detail-screen` — детализация кредита
- `add-credit-screen` — добавление кредита

### Остальные экраны

- `total-balance-screen` / `desktop-total-balance-screen` — общий баланс
- `income-balance-screen` — экран доходов
- `investments-balance-screen` / `desktop-investments-screen` — инвестиции, достижения, график переводов
- `goals-screen` / `desktop-goals-screen` — финансовые цели (`CreateGoalDialog` для создания)
- `recommendations-screen` — AI-агенты и рекомендации
- `agent-chat-screen` — чат с выбранным агентом
- `subscriptions-screen` — управление подписками
- `notifications-screen` — лента уведомлений

## Структура проекта

```
src/
├── app/              # роуты Next.js (page.tsx, layout.tsx)
├── views/            # экранные контейнеры, связывающие маршруты и виджеты
├── widgets/          # крупные UI-блоки и готовые секции экранов
└── shared/
    ├── api/          # fetch-функции, query-keys, TanStack Query хуки, backend-клиент
    ├── data/         # mock-источник данных (только для api-слоя)
    ├── lib/          # форматтеры, chart-утилиты, хуки, маппинг экранов
    ├── providers/    # QueryProvider
    ├── types/        # общие типы домена
    └── ui/           # UI-примитивы и desktop-оболочка
        ├── app-brand/
        ├── app-date-picker/
        ├── app-select/
        ├── desktop-app-header/
        ├── desktop-sidebar/
        ├── query-state/   # QueryBoundary, QueryLoading, QueryError
        ├── reveal/
        └── user-avatar/
```

### API-слой (`src/shared/api/`)

| Модуль | Хук | Что отдаёт |
|---|---|---|
| `dashboard.ts` | `useDashboardQuery()` | Главная: баланс, прогноз, radar-метрики, календарь трат |
| `operations.ts` | `useOperationsScreenQuery()` | Операции и разбивка |
| `operations.ts` | `useOperationsTrendsQuery()` | Line chart |
| `operations.ts` | `useOperationsBarsQuery()` | Bar chart |
| `operation-detail.ts` | `useOperationDetailQuery(id)` | Детализация операции |
| `categories.ts` | `useCategoriesQuery()` | Категории + ассеты |
| `category-mutations.ts` | — | Создание/обновление категорий и лимитов |
| `goals.ts` | `useGoalsQuery()` | Финансовые цели |
| `recommendations.ts` | `useRecommendationsQuery()` | AI-рекомендации и агенты |
| `agent-chat.ts` | `useAgentChatQuery(id)` | Чат с AI-агентом |
| `subscriptions.ts` | `useSubscriptionsQuery()` | Подписки |
| `bank-accounts.ts` | `useBankAccountsQuery()` | Список счетов |
| `bank-account-detail.ts` | `useBankAccountDetailQuery(id)` | Детализация счёта |
| `credit-load.ts` | `useCreditLoadQuery()` | Кредитная нагрузка |
| `credit-load-loan.ts` | `useCreditLoadLoanQuery(id)` | Детализация кредита |
| `total-balance.ts` | `useTotalBalanceQuery()` | Общий баланс |
| `income-balance.ts` | `useIncomeBalanceQuery()` | Доходы |
| `investments-balance.ts` | `useInvestmentsBalanceQuery()` | Инвестиции |
| `notifications.ts` | `useNotificationsQuery()` | Уведомления |
| `assets.ts` | `useAssetsQuery()` | Аватар и иконки |
| `import.ts` | — | Загрузка файлов и ожидание импорта |
| `backend.ts` | — | Типизированные REST-вызовы (auth, accounts, transactions, goals и т.д.) |

Общие утилиты: `client.ts` (`apiRequest`, JWT refresh, `mockDelay`), `query-keys.ts`, `dashboard-context.tsx` (`DashboardDataProvider`), `backend-screen-data.ts` (маппинг бэкенда → UI), `transaction-utils.ts` (нормализация транзакций), `generated.ts` (OpenAPI-схемы).

### Mock-данные (`src/shared/data/`)

| Файл | Содержимое |
|---|---|
| `dashboard.ts` | Главная: баланс, прогноз, кредитная нагрузка |
| `spending-calendar.ts` | Группы операций для календаря трат |
| `total-balance.ts` | Данные экрана общего баланса |
| `income-balance.ts` | Данные экрана доходов |
| `investments-balance.ts` | Данные экрана инвестиций |
| `operations.ts` | Операции и разбивка по категориям |
| `operations-trends.ts` | Точки для line chart |
| `operations-bars.ts` | Данные для bar chart |
| `operation-details.ts` | Детализация операций |
| `categories.ts` | Категории расходов |
| `category-details.ts` | Детализация категории (лимит, операции) |
| `create-category.ts` | Данные формы создания категории |
| `goals.ts` | Финансовые цели |
| `recommendations.ts` | AI-агенты и рекомендации |
| `agent-chat.ts` | Mock-чаты с агентами |
| `subscriptions.ts` | Подписки |
| `bank-accounts.ts` | Список счетов |
| `bank-account-detail.ts` | Детализация счёта |
| `new-bank-account.ts` / `add-bank-account.ts` | Формы счетов |
| `credit-load.ts` / `credit-load-loans.ts` / `add-credit.ts` | Кредитная нагрузка |
| `notifications.ts` | Уведомления |
| `assets.ts` | Активы и иконки |

### Утилиты и хуки (`src/shared/lib/`)

- `formatters.ts` — форматирование валюты и чисел
- `date-format.ts` — форматирование дат
- `charts.ts` — SVG-хелперы для графиков
- `operations-period.ts` — логика периодов операций
- `operations-chart-layout.ts` — расчёт layout для chart-экранов
- `spending-calendar.ts` — группировка транзакций для календаря
- `goals-screen.ts` — маппинг целей с бэкенда
- `operation-detail.ts` — маппинг детализации операции
- `use-operations-period.ts` — хук переключения периода
- `use-centered-horizontal-scroll.ts` — центрированный горизонтальный скролл
- `cn.ts` — утилита для объединения CSS-классов (`clsx`)

### Поток данных

1. Route в `src/app/.../page.tsx` рендерит экран из `src/views`.
2. `view` подключает `widget`.
3. `widget` вызывает `use*Query()` из `src/shared/api/`.
4. `fetch*` вызывает `tryLoadScreenData(loader, fallback)`:
   - если есть JWT — `loader()` запрашивает бэкенд через `backend.ts` и маппит ответ;
   - иначе (или при ошибке) — возвращает mock из `shared/data/`.
5. `QueryBoundary` / `QueryLoading` / `QueryError` обрабатывают loading и ошибки.
6. На главной и бюджете дашборд-данные пробрасываются через `DashboardDataProvider`.
7. Локальный UI-стейт (период, фильтр, таб) остаётся в `useState` внутри виджетов.

### Адаптивность

Большинство экранов используют паттерн `desktopShell` / `mobileShell`:

- **≥ 1200px** — desktop-layout с `DesktopSidebar`, `DesktopAppHeader` или `DesktopSidebarLayout`
- **< 1200px** — мобильный layout с `AppTopBar` и нижней навигацией

## Технические детали

- Alias `@/*` → `src/*` (настроен в `tsconfig.json`).
- Включён `reactStrictMode`.
- Графики отрисовываются через `svg` и локальные хелперы; часть декоративных элементов — SVG/PNG из `public/`.
- Интерфейс на русском языке (`lang="ru"`).
- OpenAPI-схемы бэкенда — в `src/shared/api/generated.ts` (генерируется из спецификации, не редактировать вручную).

## Как расширять проект

- Новую страницу добавляйте в `src/app/<route>/page.tsx`.
- Экранную композицию держите в `src/views`.
- Сложные визуальные блоки выносите в `src/widgets`.
- Демо-данные добавляйте в `src/shared/data/`, а виджеты подключайте через новый `fetch*` + `use*Query` в `src/shared/api/`.
- Для загрузки с бэкенда добавьте `load*ScreenData` в `backend-screen-data.ts` и подключите через `tryLoadScreenData`.
- Новые REST-эндпоинты — в `backend.ts` (типы из `generated.ts`).
- Для desktop-экранов используйте `DesktopSidebarLayout` или связку `DesktopSidebar` + `DesktopAppHeader`.

## Roadmap

- Экран авторизации и полный auth-flow в UI;
- покрытие тестами форматтеров, chart-утилит и ключевых экранов;
- accessibility-полировка интерактивных элементов;
- при необходимости — **Zustand** для сложного клиентского стейта.

## Линтинг

Перед коммитом стоит прогонять:

```bash
npm run lint
```

## License

В репозитории лицензия пока не указана. Если проект планируется к публикации или передаче команде, стоит добавить явный `LICENSE`.
