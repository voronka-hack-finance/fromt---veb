import type { SpendingCalendarGroup } from "@/shared/lib/spending-calendar";

export const spendingCalendarMockGroups: SpendingCalendarGroup[] = [
  {
    date: "31 марта",
    items: [
      {
        amount: "1 100 ₽",
        badge: "↔",
        category: "Переводы",
        id: "mock-transfer-1",
        title: "Перевод между счетами",
      },
      {
        amount: "100 ₽",
        badge: "АШ",
        category: "Переводы",
        id: "mock-transfer-2",
        title: "Арина Ш.",
      },
      {
        amount: "200 ₽",
        badge: "🛒",
        category: "Супермаркеты",
        id: "mock-grocery-1",
        title: "Продукты",
      },
    ],
    total: "1 400 ₽",
  },
  {
    date: "30 марта",
    items: [
      {
        amount: "399 ₽",
        badge: "Я+",
        category: "Подписки",
        id: "mock-subscription-1",
        title: "Яндекс Плюс",
      },
      {
        amount: "651 ₽",
        badge: "🚕",
        category: "Транспорт",
        id: "mock-taxi-1",
        title: "Такси",
      },
      {
        amount: "1 100 ₽",
        badge: "☕",
        category: "Кафе",
        id: "mock-cafe-1",
        title: "Обед",
      },
    ],
    total: "2 150 ₽",
  },
];
