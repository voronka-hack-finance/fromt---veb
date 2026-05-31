export const subscriptionCategoryIcon = "/subscriptions/category-icon.svg";

export const subscriptionsScreenData = {
  title: "Мои подписки",
  summary: {
    perMonth: 20597,
    totalSpent: 86869,
    nextChargeLabel: "Ближайшее списание",
    nextChargeDate: "14.06",
  },
  tabs: [
    { id: "all", label: "Все", count: 4 },
    { id: "active", label: "Активные", count: 3 },
    { id: "paused", label: "На паузе", count: 1 },
  ],
  subscriptions: [
    {
      id: "vk-music",
      name: "ВК музыка",
      months: 14,
      monthlyPrice: 299,
      totalSpent: 4186,
      status: "active",
      icon: subscriptionCategoryIcon,
      sourceType: "manual",
    },
    {
      id: "yandex-plus",
      name: "Яндекс.плюс",
      months: 1,
      monthlyPrice: 299,
      totalSpent: 299,
      status: "active",
      icon: subscriptionCategoryIcon,
      sourceType: "manual",
    },
    {
      id: "cloud-ai",
      name: "Клауд ИИ",
      months: 4,
      monthlyPrice: 19999,
      totalSpent: 79996,
      status: "active",
      icon: subscriptionCategoryIcon,
      sourceType: "manual",
    },
    {
      id: "mts-premium",
      name: "МТС премиум",
      months: 12,
      monthlyPrice: 199,
      totalSpent: 2388,
      status: "paused",
      icon: subscriptionCategoryIcon,
      sourceType: "manual",
    },
  ],
} as const;
