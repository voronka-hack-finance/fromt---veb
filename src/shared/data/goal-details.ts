export type GoalDetailChart = {
  title: string;
  xLabels: readonly string[];
  yLabels: readonly string[];
  values: readonly number[];
};

export type GoalDetail = {
  id: string;
  title: string;
  image: string;
  current: number;
  target: number;
  deadline: string;
  remaining: number;
  monthlyNeeded: number;
  account: {
    label: string;
    suffix: string;
    bankIcon: string;
  };
  chart: GoalDetailChart;
};

export const goalDetails: Record<string, GoalDetail> = {
  bali: {
    id: "bali",
    title: "Отпуск на бали",
    image: "/goals/bali-goal.png",
    current: 25000,
    target: 400000,
    deadline: "Декабрь 2026",
    remaining: 375000,
    monthlyNeeded: 53572,
    account: {
      bankIcon: "/dashboard/balance/icon-sber.svg",
      label: "Счет",
      suffix: "1521",
    },
    chart: {
      title: "График накопления",
      xLabels: ["Дек", "Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
      yLabels: ["26к", "19,5к", "13к", "6,5к", "0"],
      values: [3200, 6800, 9800, 12800, 16800, 20500, 25000],
    },
  },
  car: {
    id: "car",
    title: "Подушка безопасности",
    image: "/goals/safety-cushion-goal.png",
    current: 50000,
    target: 100000,
    deadline: "Июнь 2026",
    remaining: 50000,
    monthlyNeeded: 12500,
    account: {
      bankIcon: "/dashboard/balance/icon-sber.svg",
      label: "Счет",
      suffix: "1521",
    },
    chart: {
      title: "График накопления",
      xLabels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
      yLabels: ["50к", "37,5к", "25к", "12,5к", "0"],
      values: [8000, 18000, 28000, 36000, 44000, 50000],
    },
  },
};

export const goalDetailIds = Object.keys(goalDetails);
