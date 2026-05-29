export const totalBalanceScreenData = {
  title: "Всего средств",
  amount: 18753.85,
  subtitle: "Без кредитки",
  filters: [
    { id: "all", label: "Все", value: null },
    { id: "primary", label: "21 000 ₽", value: 21000 },
    { id: "reserve", label: "5 521 ₽", value: 5521 },
    { id: "backup", label: "2 521 ₽", value: 2521 },
  ],
  trend: [
    { month: "Янв", value: 8600 },
    { month: "Фев", value: 15400 },
    { month: "Март", value: 10900 },
    { month: "Апр", value: 12900 },
    { month: "Май", value: 9400 },
    { month: "Июнь", value: 17800 },
    { month: "Июль", value: 16400 },
  ],
  reserveCard: {
    months: 3,
    monthlySpend: 66700,
    badge: "Неплохо",
  },
  scenarios: [
    {
      id: "soft",
      tone: "muted",
      tag: "Хорошо",
      months: 2,
      avgSpend: 10230,
      allAccounts: 60230,
    },
    {
      id: "focus",
      tone: "default",
      tag: "Хорошо",
      months: 2,
      avgSpend: 10230,
      allAccounts: 60230,
    },
    {
      id: "great",
      tone: "green",
      tag: "Отлично",
      months: 4,
      avgSpend: 10230,
      allAccounts: 60230,
    },
  ] as const,
};

