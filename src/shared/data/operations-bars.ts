import type { OperationsPeriod } from "@/shared/lib/operations-period";

type BarTone = "green" | "dark" | "green-deep" | "muted";

type BarsPeriodItem = {
  label: string;
  height: number;
  tone: BarTone;
};

const monthBars: BarsPeriodItem[] = [
  { label: "10", height: 44, tone: "green" },
  { label: "11", height: 44, tone: "green" },
  { label: "12", height: 87, tone: "dark" },
  { label: "13", height: 57, tone: "green-deep" },
  { label: "14", height: 57, tone: "green-deep" },
  { label: "16", height: 74, tone: "muted" },
  { label: "18", height: 87, tone: "dark" },
  { label: "20", height: 74, tone: "muted" },
  { label: "22", height: 57, tone: "green-deep" },
  { label: "24", height: 57, tone: "green-deep" },
  { label: "26", height: 74, tone: "muted" },
  { label: "28", height: 74, tone: "muted" },
  { label: "30", height: 45, tone: "green" },
];

const weekBars: BarsPeriodItem[] = [
  { label: "Пн", height: 52, tone: "green" },
  { label: "Вт", height: 74, tone: "green-deep" },
  { label: "Ср", height: 41, tone: "muted" },
  { label: "Чт", height: 87, tone: "dark" },
  { label: "Пт", height: 63, tone: "green-deep" },
  { label: "Сб", height: 38, tone: "muted" },
  { label: "Вс", height: 32, tone: "green" },
];

const yearBars: BarsPeriodItem[] = [
  { label: "Янв", height: 68, tone: "green-deep" },
  { label: "Фев", height: 58, tone: "muted" },
  { label: "Мар", height: 87, tone: "dark" },
  { label: "Апр", height: 72, tone: "green-deep" },
  { label: "Май", height: 79, tone: "green" },
  { label: "Июн", height: 74, tone: "muted" },
  { label: "Июл", height: 84, tone: "dark" },
  { label: "Авг", height: 61, tone: "green-deep" },
  { label: "Сен", height: 70, tone: "muted" },
  { label: "Окт", height: 76, tone: "green" },
  { label: "Ноя", height: 67, tone: "green-deep" },
  { label: "Дек", height: 82, tone: "dark" },
];

export const operationsBarsData = {
  title: "Операции",
  periodTabs: ["Нед", "Мес", "Год"] as const,
  activePeriod: "Мес" as const,
  chartMode: "bars" as const,
  byPeriod: {
    Нед: weekBars,
    Мес: monthBars,
    Год: yearBars,
  } satisfies Record<OperationsPeriod, BarsPeriodItem[]>,
};

export type OperationsBarsPeriodItem = BarsPeriodItem;
