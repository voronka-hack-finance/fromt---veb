import { categoriesScreenData } from "./categories";

type Category = (typeof categoriesScreenData.categories)[number];

type DetailItem = {
  amount: number;
  label: string;
  title: string;
};

type DetailGroup = {
  date: string;
  items: DetailItem[];
  total: number;
};

type BankStat = {
  amount: number;
  badge: string;
  name: string;
  tone: "blue" | "green" | "red" | "yellow";
};

export type CategoryDetailData = {
  banks: BankStat[];
  groups: DetailGroup[];
  limit: {
    periodEnd: string;
    periodStart: string;
    spent: number;
    total: number;
  };
};

function createFallbackCategoryDetailData(category: Category): CategoryDetailData {
  return {
    banks: bankStats,
    groups: [],
    limit: {
      periodEnd: "01.07.2026",
      periodStart: "01.05.2026",
      spent: category.spent,
      total: category.total,
    },
  };
}

const bankStats: BankStat[] = [
  {
    amount: 158_945,
    badge: "S",
    name: "Сбербанк",
    tone: "green",
  },
  {
    amount: 128_945,
    badge: "ВТБ",
    name: "ВТБ",
    tone: "blue",
  },
  {
    amount: 58_445,
    badge: "T",
    name: "Т-Банк",
    tone: "yellow",
  },
  {
    amount: 38_945,
    badge: "A",
    name: "Альфа Банк",
    tone: "red",
  },
];

const detailByCategoryId: Partial<Record<Category["id"], CategoryDetailData>> = {
  books: {
    banks: bankStats,
    groups: [
      {
        date: "28 мая",
        items: [
          { amount: 1200, label: "Книги", title: "Книжный магазин" },
          { amount: 600, label: "Книги", title: "Книжный магазин" },
        ],
        total: 1800,
      },
      {
        date: "17 мая",
        items: [
          { amount: 900, label: "Книги", title: "Книжный магазин" },
          { amount: 500, label: "Книги", title: "Книжный магазин" },
        ],
        total: 1400,
      },
      {
        date: "7 апреля",
        items: [
          { amount: 450, label: "Книги", title: "Книжный магазин" },
          { amount: 300, label: "Книги", title: "Книжный магазин" },
        ],
        total: 750,
      },
    ],
    limit: {
      periodEnd: "01.07.2026",
      periodStart: "01.05.2026",
      spent: 3200,
      total: 4500,
    },
  },
  coffee: {
    banks: bankStats,
    groups: [
      {
        date: "31 мая",
        items: [
          { amount: 420, label: "Кофейни", title: "Кофемания" },
          { amount: 180, label: "Кофейни", title: "Кофемания" },
        ],
        total: 600,
      },
      {
        date: "18 мая",
        items: [
          { amount: 360, label: "Кофейни", title: "Кофемания" },
          { amount: 220, label: "Кофейни", title: "Кофемания" },
        ],
        total: 580,
      },
      {
        date: "13 апреля",
        items: [
          { amount: 500, label: "Кофейни", title: "Кофемания" },
          { amount: 320, label: "Кофейни", title: "Кофемания" },
        ],
        total: 820,
      },
    ],
    limit: {
      periodEnd: "01.06.2026",
      periodStart: "01.05.2026",
      spent: 3000,
      total: 4000,
    },
  },
  grill: {
    banks: bankStats,
    groups: [
      {
        date: "29 мая",
        items: [
          { amount: 1800, label: "Рестораны", title: "Ресторан Гриль" },
          { amount: 900, label: "Рестораны", title: "Ресторан Гриль" },
        ],
        total: 2700,
      },
      {
        date: "20 мая",
        items: [
          { amount: 600, label: "Рестораны", title: "Ресторан Гриль" },
          { amount: 320, label: "Рестораны", title: "Ресторан Гриль" },
        ],
        total: 920,
      },
      {
        date: "9 апреля",
        items: [
          { amount: 450, label: "Рестораны", title: "Ресторан Гриль" },
        ],
        total: 450,
      },
    ],
    limit: {
      periodEnd: "01.07.2026",
      periodStart: "01.05.2026",
      spent: 3800,
      total: 4000,
    },
  },
  pet: {
    banks: bankStats,
    groups: [
      {
        date: "30 мая",
        items: [
          { amount: 1500, label: "Товары для животных", title: "Зоомагазин" },
          { amount: 600, label: "Товары для животных", title: "Зоомагазин" },
        ],
        total: 2100,
      },
      {
        date: "19 мая",
        items: [
          { amount: 400, label: "Товары для животных", title: "Зоомагазин" },
          { amount: 300, label: "Товары для животных", title: "Зоомагазин" },
        ],
        total: 700,
      },
      {
        date: "2 апреля",
        items: [
          { amount: 200, label: "Товары для животных", title: "Зоомагазин" },
        ],
        total: 200,
      },
    ],
    limit: {
      periodEnd: "01.07.2026",
      periodStart: "01.05.2026",
      spent: 3500,
      total: 5000,
    },
  },
  sushi: {
    banks: bankStats,
    groups: [
      {
        date: "31 мая",
        items: [
          { amount: 700, label: "Рестораны", title: "Суши-бар" },
          { amount: 450, label: "Рестораны", title: "Суши-бар" },
        ],
        total: 1150,
      },
      {
        date: "11 мая",
        items: [
          { amount: 520, label: "Рестораны", title: "Суши-бар" },
          { amount: 310, label: "Рестораны", title: "Суши-бар" },
        ],
        total: 830,
      },
      {
        date: "25 апреля",
        items: [
          { amount: 380, label: "Рестораны", title: "Суши-бар" },
        ],
        total: 380,
      },
    ],
    limit: {
      periodEnd: "01.07.2026",
      periodStart: "01.05.2026",
      spent: 2400,
      total: 3000,
    },
  },
  wb: {
    banks: bankStats,
    groups: [
      {
        date: "31 мая",
        items: [
          { amount: 200, label: "Маркетплейсы", title: "Покупка на wb" },
          { amount: 1200, label: "Маркетплейсы", title: "Покупка на wb" },
        ],
        total: 1400,
      },
      {
        date: "20 мая",
        items: [
          { amount: 500, label: "Маркетплейсы", title: "Покупка на wb" },
          { amount: 1400, label: "Маркетплейсы", title: "Покупка на wb" },
        ],
        total: 1600,
      },
      {
        date: "13 апреля",
        items: [
          { amount: 4500, label: "Маркетплейсы", title: "Покупка на wb" },
          { amount: 60, label: "Маркетплейсы", title: "Покупка на wb" },
        ],
        total: 4560,
      },
      {
        date: "1 апреля",
        items: [
          { amount: 200, label: "Маркетплейсы", title: "Покупка на wb" },
        ],
        total: 200,
      },
    ],
    limit: {
      periodEnd: "01.07.2026",
      periodStart: "01.05.2026",
      spent: 3000,
      total: 4000,
    },
  },
};

export function getCategoryDetailData(category: Category) {
  return detailByCategoryId[category.id] ?? createFallbackCategoryDetailData(category);
}
