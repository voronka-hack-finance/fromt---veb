import type { BankAccount, ForecastPoint } from "@/shared/types/dashboard";

export const bankAccounts: BankAccount[] = [
  { id: "tbank", label: "Счет", suffix: "0418", color: "#ffd84d" },
  { id: "sber", label: "Счет", suffix: "1521", color: "#52c26d" },
];

export const forecastPoints: ForecastPoint[] = [
  { month: "Янв", balance: 5000, spend: 3400 },
  { month: "Фев", balance: 6100, spend: 3900 },
  { month: "Март", balance: 7200, spend: 4300 },
  { month: "Апр", balance: 7600, spend: 4700 },
  { month: "Май", balance: 9250, spend: 5200 },
  { month: "Июн", balance: 8800, spend: 4900 },
];

export const forecastYearPoints: ForecastPoint[] = [
  { month: "Q1", balance: 18300, spend: 11600 },
  { month: "Q2", balance: 23650, spend: 14800 },
  { month: "Q3", balance: 26800, spend: 15100 },
  { month: "Q4", balance: 25100, spend: 14200 },
];

export const dashboardData = {
  notifications: 9,
  title: "заначка",
  avatarLabel: "КУ",
  totalBalance: 654220.67,
  assistantText: "Анализирует траты и помогает управлять бюджетом",
  receipts: 529910.54,
  expenses: 109592.52,
  investmentGrowth: "+0,10 (0,13%)",
  investmentPercent: 72.5,
  incomeRemainder: 10000,
  recurringExpenses: {
    total: "5 676 ₽",
    categories: "10 категорий",
  },
  forecastPercent: 51,
  forecastTooltip: 9250,
  creditScore: 350,
  creditMax: 500,
  creditLabel: "Надежный",
  betterThanUsers: 72,
};

export const categoryRadarMetrics = [
  {
    id: "expenses",
    label: "Расходы",
    percent: 56,
  },
  {
    id: "reserve",
    label: "Резерв",
    percent: 72,
  },
  {
    id: "protection",
    label: "Защита",
    percent: 98,
  },
  {
    id: "income",
    label: "Доходы",
    percent: 84,
  },
  {
    id: "investments",
    label: "Инвестиции",
    percent: 65,
  },
  {
    id: "credit",
    label: "Кредиты",
    percent: 42,
  },
] as const;
