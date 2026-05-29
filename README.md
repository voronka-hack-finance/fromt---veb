# Заначка (front-hack29)

Мобильный финансовый дашборд на `Next.js 15`, собранный по Figma-макету. Проект показывает сценарий клиентского интерфейса с акцентом на визуальную подачу: карточки баланса, категории, инвестиции, операции, цели, прогнозы и анимированные графики.

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

## Маршруты

| Маршрут | Описание |
|---|---|
| `/` | Главная панель дашборда |
| `/total` | Экран общего баланса |
| `/income` | Экран доходов |
| `/investments` | Экран инвестиций |
| `/operations` | Операции с разбивкой по категориям |
| `/operations/trends` | Тренды по операциям (line chart) |
| `/operations/bars` | Bar-chart представление операций |
| `/categories` | Экран категорий расходов |
| `/goals` | Мои цели — прогресс накоплений |

### Нижняя навигация

На части экранов отображается `MobileTabNav` с четырьмя вкладками:

- **Главная** → `/`
- **История** → `/operations/trends`
- **Мои цели** → `/goals`
- **Категории** → `/categories`

Навигация также показывается на `/total` и внутри раздела `/operations/*`.

## Экраны и виджеты

### Главная (`/`)

Собрана из карточек в `src/widgets/home/`:

- `BalanceCard` — общий баланс и счета
- `AssistantCard` — блок ассистента
- `OperationsCard`, `IncomeStatCard`, `InvestmentStatCard` — метрики
- `RecurringExpensesCard` — регулярные расходы
- `ForecastCard` — прогноз доходов и расходов
- `CreditLoadCard` — кредитная нагрузка
- `CategoriesCard` — превью категорий

### Операции

- `operations-breakdown-card` — круговая разбивка по категориям с переключением периода
- `operations-trends-screen` — линейный график трендов
- `operations-bars-screen` — столбчатый график

### Остальные экраны

- `total-balance-screen` — детализация общего баланса
- `income-balance-screen` — экран доходов
- `investments-balance-screen` — экран инвестиций
- `categories-screen` — radar-chart категорий
- `goals-screen` — список финансовых целей

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
    └── ui/           # UI-примитивы (Reveal, UserAvatar, QueryBoundary)
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
| `total-balance.ts` | `useTotalBalanceQuery()` | Общий баланс |
| `income-balance.ts` | `useIncomeBalanceQuery()` | Доходы |
| `investments-balance.ts` | `useInvestmentsBalanceQuery()` | Инвестиции |
| `assets.ts` | `useAssetsQuery()` | Аватар и иконки |

Общие утилиты: `client.ts` (`apiRequest`, `mockDelay`), `query-keys.ts`.

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
| `goals.ts` | Финансовые цели |
| `assets.ts` | Активы |

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
6. На главной дашборд-данные пробрасываются через `DashboardDataProvider`.
7. Локальный UI-стейт (период, фильтр) остаётся в `useState` внутри виджетов.

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
