export const incomeBalanceScreenData = {
  title: "Остаток от доходов",
  amount: 18753.85,
  subtitle: "Без кредитки",
  filters: [
    { id: "salary", label: "211 000" },
    { id: "other-1", label: "0" },
    { id: "other-2", label: "0" },
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
  summary: {
    remainPercent: 16,
    spentAmount: 18753,
    badge: "Неплохо",
  },
  scenarios: [
    {
      id: "weak",
      tone: "amber",
      tag: "Неплохо",
      percentLabel: "2% от дохода",
      invested: 25000,
      totalIncome: 156250,
    },
    {
      id: "focus",
      tone: "default",
      tag: "Хорошо",
      percentLabel: "2% от дохода",
      invested: 25000,
      totalIncome: 156250,
    },
    {
      id: "strong",
      tone: "good",
      tag: "Хорошо",
      percentLabel: ">20% от дохода",
      invested: 31250,
      totalIncome: 156250,
    },
  ] as const,
};

