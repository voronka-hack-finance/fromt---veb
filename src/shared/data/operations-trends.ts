import type { OperationsPeriod } from "@/shared/lib/operations-period";

type TrendBar = {
  day: string;
  value: number;
  height?: number;
  tone: "muted" | "active";
};

type TrendPeriodData = {
  spendScale: [number, number, number];
  bars: TrendBar[];
  lineValues: number[];
  defaultActiveIndex: number;
  insight: {
    percent: number;
    amount: number;
    date: string;
    text: string;
  };
};

const monthPeriod: TrendPeriodData = {
  spendScale: [3000, 2000, 1000],
  bars: [
    { day: "13", value: 1540, height: 63, tone: "muted" },
    { day: "14", value: 2060, height: 87, tone: "muted" },
    { day: "15", value: 1760, height: 51, tone: "muted" },
    { day: "16", value: 2140, height: 74, tone: "muted" },
    { day: "17", value: 1610, height: 44, tone: "muted" },
    { day: "18", value: 1800, height: 69, tone: "muted" },
    { day: "19", value: 2100, height: 87, tone: "active" },
    { day: "20", value: 1670, height: 57, tone: "muted" },
    { day: "21", value: 2010, height: 74, tone: "muted" },
    { day: "22", value: 1440, height: 44, tone: "muted" },
  ],
  lineValues: [1540, 2040, 1280, 1650, 1150, 1490, 2100, 1460, 1900, 1180],
  defaultActiveIndex: 6,
  insight: {
    percent: 30,
    amount: 2100,
    date: "сб, 21 марта",
    text: "Вы потратили в этот день на 30% меньше в сравнении с прошлой неделей",
  },
};

const weekPeriod: TrendPeriodData = {
  spendScale: [1200, 800, 400],
  bars: [
    { day: "Пн", value: 620, tone: "muted" },
    { day: "Вт", value: 890, tone: "muted" },
    { day: "Ср", value: 540, tone: "muted" },
    { day: "Чт", value: 980, tone: "muted" },
    { day: "Пт", value: 760, tone: "active" },
    { day: "Сб", value: 410, tone: "muted" },
    { day: "Вс", value: 320, tone: "muted" },
  ],
  lineValues: [620, 890, 540, 980, 760, 410, 320],
  defaultActiveIndex: 4,
  insight: {
    percent: 12,
    amount: 760,
    date: "пт, 28 марта",
    text: "Вы потратили в этот день на 12% меньше в сравнении с прошлой неделей",
  },
};

const yearPeriod: TrendPeriodData = {
  spendScale: [28000, 19000, 10000],
  bars: [
    { day: "Янв", value: 18200, tone: "muted" },
    { day: "Фев", value: 16400, tone: "muted" },
    { day: "Мар", value: 23456, tone: "active" },
    { day: "Апр", value: 19800, tone: "muted" },
    { day: "Май", value: 22100, tone: "muted" },
    { day: "Июн", value: 20500, tone: "muted" },
    { day: "Июл", value: 24300, tone: "muted" },
    { day: "Авг", value: 17600, tone: "muted" },
    { day: "Сен", value: 19200, tone: "muted" },
    { day: "Окт", value: 21400, tone: "muted" },
    { day: "Ноя", value: 18800, tone: "muted" },
    { day: "Дек", value: 25600, tone: "muted" },
  ],
  lineValues: [18200, 16400, 23456, 19800, 22100, 20500, 24300, 17600, 19200, 21400, 18800, 25600],
  defaultActiveIndex: 2,
  insight: {
    percent: 8,
    amount: 23456,
    date: "март 2025",
    text: "Вы потратили в этом месяце на 8% меньше в сравнении с прошлым годом",
  },
};

export const operationsTrendsData = {
  title: "Операции",
  periodTabs: ["Нед", "Мес", "Год"] as const,
  activePeriod: "Мес" as const,
  chartMode: "trend" as const,
  byPeriod: {
    Нед: weekPeriod,
    Мес: monthPeriod,
    Год: yearPeriod,
  } satisfies Record<OperationsPeriod, TrendPeriodData>,
};

export type OperationsTrendPeriodData = TrendPeriodData;
