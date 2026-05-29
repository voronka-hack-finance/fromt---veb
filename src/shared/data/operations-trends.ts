export const operationsTrendsData = {
  title: "Операции",
  periodTabs: ["Нед", "Мес", "Год"] as const,
  activePeriod: "Мес" as const,
  chartMode: "trend" as const,
  spendScale: [3000, 2000, 1000],
  bars: [
    { day: "13", value: 1540, tone: "muted" },
    { day: "14", value: 2060, tone: "muted" },
    { day: "15", value: 1760, tone: "muted" },
    { day: "16", value: 2140, tone: "muted" },
    { day: "17", value: 1610, tone: "muted" },
    { day: "18", value: 1800, tone: "muted" },
    { day: "19", value: 2100, tone: "active" },
    { day: "20", value: 1670, tone: "muted" },
    { day: "21", value: 2010, tone: "muted" },
    { day: "22", value: 1440, tone: "muted" },
  ] as const,
  line: [1540, 2040, 1280, 1650, 1150, 1490, 2100, 1460, 1900, 1180] as const,
  insight: {
    percent: 30,
    amount: 2100,
    date: "сб, 21 марта",
    text: "Вы потратили в этот день на 30% меньше в сравнении с прошлой неделей",
  },
};

