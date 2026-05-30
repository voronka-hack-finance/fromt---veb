# Заначка (front-hack29)

Адаптивный финансовый дашборд на `Next.js 15`, собранный по Figma-макету. Проект показывает сценарий клиентского интерфейса с акцентом на визуальную подачу: карточки баланса, категории, инвестиции, операции, цели, прогнозы, AI-рекомендации и анимированные графики.

На ширине **≥ 1200px** отображается desktop-версия с боковым меню; на меньших экранах — мобильный layout с нижней навигацией.

## Стек

### UI и инфраструктура

- `Next.js 15` + `React 19` + `TypeScript`
- `App Router` для маршрутизации
- `CSS Modules` для изолированных стилей
- `Framer Motion` для анимаций и reveal-эффектов
- `Lucide React` для иконок
- Шрифты `Inter` и `Unbounded` (Google Fonts, кириллица)

### API и данные

- **TanStack Query** — серверный стейт, кеш, loading/error, refetch
- **API-слой** в `src/shared/api/` — типизированные `fetch*` функции и хуки `use*Query`
- **Mock-бэкенд** — `src/shared/data/` имитирует ответы API (с задержкой ~200 ms)

Виджеты **не импортируют** mock-файлы напрямую — только через API-хуки.

При подключении реального бэкенда достаточно:
1. Задать `NEXT_PUBLIC_API_URL` в `.env`
2. Переписать `fetch*` в `src/shared/api/` с `mockDelay()` на `apiRequest()`

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
| `shared/` | Переиспользуемые ui, lib, types, mock-data |

Чего **нет** из классического FSD: слоёв `pages`, `features`, `entities` и строгих правил импортов между ними.

Mock-данные живут в `shared/data/` и используются **только** внутри `shared/api/`.

## Быстрый старт

### Требования

- `Node.js 20+`
- `npm 10+`

### Установка и запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

### Полезные команды

```bash
npm run dev      # dev-сервер
npm run build    # production-сборка
npm run start    # запуск собранного приложения
npm run lint     # ESLint
```

### Push-уведомления (Firebase)

1. В [Firebase Console](https://console.firebase.google.com/) → **Project Settings** → **Cloud Messaging** скопируйте **Web Push certificates** (VAPID key).
2. Добавьте в `.env.local` или production env:

```bash
NEXT_PUBLIC_FIREBASE_VAPID_KEY=ваш_vapid_key
```

Остальные параметры Firebase уже зафиксированы в `src/shared/lib/firebase/config.ts` и `public/firebase-messaging-sw.js`, поэтому для web push достаточно добавить `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.

Если фронт собирается в Docker, `NEXT_PUBLIC_FIREBASE_VAPID_KEY` должен быть доступен во время `docker build`: значение уже проброшено в `Dockerfile` и `docker-compose.yml`.

После авторизации (JWT в `localStorage` или `NEXT_PUBLIC_API_TOKEN`) приложение запросит разрешение на уведомления, получит FCM-токен и отправит его на бэкенд (`POST /api/v1/notifications/devices`). Тестовая отправка: `POST /api/v1/notifications/test`.

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
| `/categories` | Экран категорий расходов |
| `/categories/new` | Создание новой категории |
| `/categories/[categoryId]` | Детальная карточка категории |
| `/goals` | Мои цели — прогресс накоплений |
| `/recommendations` | AI-рекомендации (desktop) |
| `/subscriptions` | Подписки (desktop) |

### Навигация

#### Мобильная (`BottomNav`)

На части экранов отображается нижняя панель с четырьмя вкладками:

- **Главная** → `/`
- **История** → `/operations/trends`
- **Мои цели** → `/goals`
- **Категории** → `/categories`

Панель также показывается на `/total`, `/recommendations` и внутри раздела `/operations/*`.

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

- `BalanceCard` — общий баланс и счета
- `AssistantCard` — блок ассистента
- `OperationsCard`, `IncomeStatCard`, `InvestmentStatCard` — метрики
- `RecurringExpensesCard` — регулярные расходы
- `ForecastCard` / `ForecastLineChart` — прогноз доходов и расходов
- `CreditLoadCard` — кредитная нагрузка
- `CategoriesCard` — превью категорий
- `DesktopDashboard` — desktop-версия главной (календарь операций, метрики, график)
- `BudgetDashboard` — экран «Основной бюджет» (`/budget`): sparkline, runway, защита бюджета

### Операции

- `operations-screen` — разбивка по категориям с переключением периода
- `operations-trends-screen` — линейный график трендов
- `operations-bars-screen` — столбчатый график

### Категории

- `categories-screen` / `desktop-categories-screen` — список категорий с radar-chart
- `create-category-screen` — форма создания категории (`/categories/new`)
- `category-detail-screen` — детализация категории с лимитом и операциями

### Остальные экраны

- `total-balance-screen` / `desktop-total-balance-screen` — общий баланс
- `income-balance-screen` — экран доходов
- `investments-balance-screen` / `desktop-investments-screen` — инвестиции, достижения, график переводов
- `goals-screen` / `desktop-goals-screen` — финансовые цели
- `recommendations-screen` — AI-агенты и рекомендации
- `subscriptions-screen` — управление подписками

## Структура проекта

```
src/
├── app/              # роуты Next.js (page.tsx, layout.tsx)
├── views/            # экранные контейнеры, связывающие маршруты и виджеты
├── widgets/          # крупные UI-блоки и готовые секции экранов
└── shared/
    ├── api/          # fetch-функции, query-keys, TanStack Query хуки
    ├── data/         # mock-источник данных (только для api-слоя)
    ├── lib/          # форматтеры, chart-утилиты, хуки
    ├── providers/    # QueryProvider
    ├── types/        # общие типы домена
    └── ui/           # UI-примитивы и desktop-оболочка
        ├── app-brand/
        ├── desktop-app-header/
        ├── desktop-sidebar/
        ├── query-state/   # QueryBoundary, QueryLoading, QueryError
        ├── reveal/
        └── user-avatar/
```

### API-слой (`src/shared/api/`)

| Модуль | Хук | Что отдаёт |
|---|---|---|
| `dashboard.ts` | `useDashboardQuery()` | Главная: баланс, прогноз, radar-метрики |
| `operations.ts` | `useOperationsScreenQuery()` | Операции и разбивка |
| `operations.ts` | `useOperationsTrendsQuery()` | Line chart |
| `operations.ts` | `useOperationsBarsQuery()` | Bar chart |
| `categories.ts` | `useCategoriesQuery()` | Категории + ассеты |
| `goals.ts` | `useGoalsQuery()` | Финансовые цели |
| `recommendations.ts` | `useRecommendationsQuery()` | AI-рекомендации и агенты |
| `subscriptions.ts` | `useSubscriptionsQuery()` | Подписки |
| `total-balance.ts` | `useTotalBalanceQuery()` | Общий баланс |
| `income-balance.ts` | `useIncomeBalanceQuery()` | Доходы |
| `investments-balance.ts` | `useInvestmentsBalanceQuery()` | Инвестиции |
| `assets.ts` | `useAssetsQuery()` | Аватар и иконки |

Общие утилиты: `client.ts` (`apiRequest`, `mockDelay`), `query-keys.ts`, `dashboard-context.tsx` (`DashboardDataProvider`).

### Mock-данные (`src/shared/data/`)

| Файл | Содержимое |
|---|---|
| `dashboard.ts` | Главная: баланс, прогноз, кредитная нагрузка |
| `total-balance.ts` | Данные экрана общего баланса |
| `income-balance.ts` | Данные экрана доходов |
| `investments-balance.ts` | Данные экрана инвестиций |
| `operations.ts` | Операции и разбивка по категориям |
| `operations-trends.ts` | Точки для line chart |
| `operations-bars.ts` | Данные для bar chart |
| `categories.ts` | Категории расходов |
| `category-details.ts` | Детализация категории (лимит, операции) |
| `create-category.ts` | Данные формы создания категории |
| `goals.ts` | Финансовые цели |
| `recommendations.ts` | AI-агенты и рекомендации |
| `subscriptions.ts` | Подписки |
| `assets.ts` | Активы и иконки |

### Утилиты и хуки (`src/shared/lib/`)

- `formatters.ts` — форматирование валюты и чисел
- `charts.ts` — SVG-хелперы для графиков
- `operations-period.ts` — логика периодов операций
- `operations-chart-layout.ts` — расчёт layout для chart-экранов
- `use-operations-period.ts` — хук переключения периода
- `use-centered-horizontal-scroll.ts` — центрированный горизонтальный скролл
- `cn.ts` — утилита для объединения CSS-классов (`clsx`)

### Поток данных

1. Route в `src/app/.../page.tsx` рендерит экран из `src/views`.
2. `view` подключает `widget`.
3. `widget` вызывает `use*Query()` из `src/shared/api/`.
4. API-функция (`fetchDashboard` и др.) возвращает mock из `shared/data/` или реальный ответ с бэка.
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
- Данные статические — приложение подходит для UI-демо, прототипирования и дальнейшей интеграции с API.

## Как расширять проект

- Новую страницу добавляйте в `src/app/<route>/page.tsx`.
- Экранную композицию держите в `src/views`.
- Сложные визуальные блоки выносите в `src/widgets`.
- Демо-данные добавляйте в `src/shared/data/`, а виджеты подключайте через новый `fetch*` + `use*Query` в `src/shared/api/`.
- Для desktop-экранов используйте `DesktopSidebarLayout` или связку `DesktopSidebar` + `DesktopAppHeader`.
- Для реального бэка задайте `NEXT_PUBLIC_API_URL` и замените mock-реализацию в API-модулях.

## Roadmap

- Подключение **реального API** (замена mock в `fetch*`-функциях);
- тесты на форматтеры, chart-утилиты и ключевые экраны;
- accessibility-полировка интерактивных элементов;
- при необходимости — **Zustand** для сложного клиентского стейта.

## Линтинг

Перед коммитом стоит прогонять:

```bash
npm run lint
```

## License

В репозитории лицензия пока не указана. Если проект планируется к публикации или передаче команде, стоит добавить явный `LICENSE`.
