import {
  fetchAccounts,
  fetchGoal,
  type AccountResponse,
  type GoalResponse,
} from "@/shared/api/backend";
import { parseTransactionDecimal } from "@/shared/api/transaction-utils";
import { goalDetails, type GoalDetail } from "@/shared/data/goal-details";
import { mapGoalToCard } from "@/shared/lib/goals-screen";

const MONTH_LABELS = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
] as const;

function formatDeadline(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function countMonthsUntilDeadline(deadline: Date) {
  const now = new Date();
  const months =
    (deadline.getFullYear() - now.getFullYear()) * 12 +
    (deadline.getMonth() - now.getMonth());

  return Math.max(months, 1);
}

function formatCompactAmount(value: number) {
  if (value >= 1000) {
    const thousands = value / 1000;
    return Number.isInteger(thousands) ? `${thousands}к` : `${thousands.toFixed(1).replace(".", ",")}к`;
  }

  return String(value);
}

function buildChartValues(current: number, target: number, pointCount = 7) {
  const values = Array.from({ length: pointCount }, (_, index) => {
    const ratio = index / Math.max(pointCount - 1, 1);
    const eased = ratio * ratio * 0.35 + ratio * 0.65;

    return Math.round(current * eased);
  });

  values[values.length - 1] = current;

  return values;
}

function buildChartLabels(values: number[]) {
  const maxValue = Math.max(...values, 1);
  const step = maxValue / 4;

  return [
    formatCompactAmount(maxValue),
    formatCompactAmount(step * 3),
    formatCompactAmount(step * 2),
    formatCompactAmount(step),
    "0",
  ];
}

function buildChartXLabels(count: number) {
  const now = new Date();
  const labels: string[] = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    labels.push(MONTH_LABELS[date.getMonth()] ?? "—");
  }

  return labels;
}

function mapGoalToDetail(
  goal: GoalResponse,
  account: AccountResponse | undefined,
  index: number,
): GoalDetail {
  const card = mapGoalToCard(goal, account, index);
  const current = card.current;
  const target = card.target;
  const remaining = Math.max(target - current, 0);
  const deadlineDate = goal.target_date ? new Date(goal.target_date) : null;
  const deadline =
    deadlineDate && !Number.isNaN(deadlineDate.getTime())
      ? formatDeadline(deadlineDate)
      : goalDetails.bali.deadline;
  const monthsLeft = deadlineDate && !Number.isNaN(deadlineDate.getTime())
    ? countMonthsUntilDeadline(deadlineDate)
    : 7;
  const monthlyNeeded = Math.round(remaining / monthsLeft);
  const chartValues = buildChartValues(current, target);
  const fallbackChart = goalDetails[goal.id]?.chart ?? goalDetails.bali.chart;

  return {
    account: card.account,
    chart: {
      title: fallbackChart.title,
      values: chartValues,
      xLabels: buildChartXLabels(chartValues.length),
      yLabels: buildChartLabels(chartValues),
    },
    current,
    deadline,
    id: card.id,
    image: card.image,
    monthlyNeeded,
    remaining,
    target,
    title: card.title,
  };
}

export async function loadGoalDetailFromBackend(goalId: string): Promise<GoalDetail> {
  const [goal, accountsResponse] = await Promise.all([
    fetchGoal(goalId),
    fetchAccounts({ page_size: 100 }),
  ]);

  const account = goal.account_id
    ? accountsResponse.items.find((item) => item.id === goal.account_id)
    : undefined;

  const current = Math.round(parseTransactionDecimal(goal.current_amount));
  const target = Math.max(Math.round(parseTransactionDecimal(goal.target_amount)), 1);

  return mapGoalToDetail(
    {
      ...goal,
      current_amount: String(current),
      target_amount: String(target),
    },
    account,
    0,
  );
}
