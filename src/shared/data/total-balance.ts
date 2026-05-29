const sharedMonths = ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль"] as const;

function buildTrend(values: number[]) {
  return sharedMonths.map((month, index) => ({
    month,
    value: values[index] ?? values.at(-1) ?? 0,
  }));
}

export const totalBalanceScreenData = {
  title: "Всего средств",
  defaultFilterId: "reserve",
  defaultChartIndex: 4,
  filters: [
    {
      id: "all",
      label: "Все",
      amount: 18753.85,
      subtitle: "Без кредитки",
      trend: buildTrend([8600, 15400, 10900, 12900, 9400, 17800, 16400]),
    },
    {
      id: "primary",
      label: "21 000 ₽",
      amount: 21000,
      subtitle: "Основной счёт",
      trend: buildTrend([10200, 18200, 12800, 15200, 11100, 21000, 19300]),
    },
    {
      id: "reserve",
      label: "5 521 ₽",
      amount: 5521,
      subtitle: "Накопительный счёт",
      trend: buildTrend([2400, 4300, 3100, 3600, 2700, 5100, 4700]),
    },
    {
      id: "backup",
      label: "2 521 ₽",
      amount: 2521,
      subtitle: "Резервный счёт",
      trend: buildTrend([1100, 2000, 1400, 1700, 1200, 2400, 2200]),
    },
  ],
  reserveCard: {
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

export type TotalBalanceFilter = (typeof totalBalanceScreenData.filters)[number];
