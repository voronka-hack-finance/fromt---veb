import { categoriesAssets } from "@/shared/data/assets";
import {
  getCategoryDetailData,
  type CategoryDetailData,
} from "@/shared/data/category-details";
import { categoriesScreenData } from "@/shared/data/categories";
import { createCategoryIconOptions, type CategoryIconKey } from "@/shared/data/create-category";
import {
  bankAccounts as fallbackBankAccounts,
  categoryRadarMetrics,
  dashboardData,
  desktopForecastPoints,
  forecastPoints,
  forecastYearPoints,
} from "@/shared/data/dashboard";
import { loadGoalsFromBackend } from "@/shared/lib/goals-screen";
import { formatRecommendationInsightContent } from "@/shared/lib/recommendation-insight";
import {
  buildRecurringExpensesSummary,
  loadSubscriptionsFromBackend,
  mapRegularExpenseToSubscription,
} from "@/shared/lib/regular-expenses";
import { incomeBalanceScreenData } from "@/shared/data/income-balance";
import { investmentsBalanceScreenData } from "@/shared/data/investments-balance";
import { operationsBarsData } from "@/shared/data/operations-bars";
import { operationsScreenData } from "@/shared/data/operations";
import { operationsTrendsData } from "@/shared/data/operations-trends";
import {
  recommendationsAssets,
  recommendationsScreenData,
} from "@/shared/data/recommendations";
import { subscriptionCategoryIcon, subscriptionsScreenData } from "@/shared/data/subscriptions";
import { totalBalanceScreenData } from "@/shared/data/total-balance";
import type { BankAccount, ForecastPoint } from "@/shared/types/dashboard";

import { spendingCalendarMockGroups } from "@/shared/data/spending-calendar";
import { buildSpendingCalendarGroups } from "@/shared/lib/spending-calendar";

import {
  fetchAllTransactions,
  getTransactionAbsAmount,
  getTransactionSignedAmount,
  resolveTransactionType,
} from "./transaction-utils";

import {
  fetchAccounts,
  fetchAgentRecommendations,
  fetchAvailableBalance,
  fetchCategoriesPage,
  fetchChats,
  fetchExpectedExpenses,
  fetchRegularExpensesPage,
  fetchExpectedIncomes,
  fetchFinancialHealthHistory,
  fetchFinancialHealthProfile,
  fetchFinancialHealthScore,
  fetchLimitsPage,
  fetchTransactions,
  type AccountResponse,
  type AgentRecommendationResponse,
  type CategoryResponse,
  type ChatResponse,
  type ExpectedExpenseResponse,
  type ExpectedIncomeResponse,
  type FinancialHealthScoreResponse,
  type GoalResponse,
  type LimitResponse,
  type TransactionResponse,
} from "./backend";
import { ApiError, hasStoredAccessToken } from "./client";

type CategoriesScreenCategory = {
  id: string;
  title: string;
  spent: number;
  total: number;
  tone: "dark" | "light" | "light-darkbar";
  icon: keyof typeof categoriesAssets.icons;
  progress: number;
};

type RecommendationAgent = {
  id: string;
  title: string;
  subtitle: string;
  imageKey: keyof typeof recommendationsAssets.agentImages;
  imageVariant: "a" | "b" | "c" | "d";
  insightLead: string;
  insightRest: string;
};

type RecommendationChat = {
  agentId: string;
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  imageKey: keyof typeof recommendationsAssets.agentImages;
  imageVariant: "a" | "b" | "c" | "d" | "e";
};

type SubscriptionItem = {
  id: string;
  name: string;
  months: number;
  monthlyPrice: number;
  totalSpent: number;
  status: "active" | "paused";
  icon: string;
  sourceType: string;
};

type OperationsBreakdownItem = {
  id: string;
  label: string;
  percent: number;
  color: string;
};

type OperationsOperation = {
  id: string;
  category: string;
  title: string;
  bank: string;
  bankTone: "soft" | "warn" | "danger";
  amount: number;
  direction: "income" | "outcome";
  iconTone: "neutral" | "accent" | "success";
  icon: "education" | "bag" | "bank" | "wifi" | "income";
};

type CategoryDetailsById = Record<string, CategoryDetailData>;

const recommendationVisuals = {
  pillow_keeper: {
    imageKey: "pillowKeeper",
    imageVariant: "a",
    subtitle: "Безопасность и накопления",
  },
  expense_detective: {
    imageKey: "expenseDetective",
    imageVariant: "a",
    subtitle: "Лишние траты и утечки",
  },
  growth_strategist: {
    imageKey: "growthStrategist",
    imageVariant: "b",
    subtitle: "Рост дохода и возможностей",
  },
  balancer: {
    imageKey: "balancer",
    imageVariant: "c",
    subtitle: "Бюджет без стресса",
  },
  habit_trainer: {
    imageKey: "habitTrainer",
    imageVariant: "d",
    subtitle: "Конкретные действия на 7 дней",
  },
} satisfies Record<
  string,
  Pick<RecommendationAgent, "imageKey" | "imageVariant" | "subtitle">
>;

const subscriptionIconMatchers = [
  { keyword: "vk", icon: subscriptionCategoryIcon },
  { keyword: "music", icon: subscriptionCategoryIcon },
  { keyword: "янд", icon: subscriptionCategoryIcon },
  { keyword: "yandex", icon: subscriptionCategoryIcon },
  { keyword: "cloud", icon: subscriptionCategoryIcon },
  { keyword: "mts", icon: subscriptionCategoryIcon },
  { keyword: "premium", icon: subscriptionCategoryIcon },
] as const;

const categoryKeywordToIcon: Array<[string, CategoryIconKey]> = [
  ["coffee", "coffee"],
  ["коф", "coffee"],
  ["travel", "airplane"],
  ["пут", "airplane"],
  ["trip", "airplane"],
  ["pet", "paw"],
  ["жив", "paw"],
  ["book", "study"],
  ["обуч", "study"],
  ["edu", "study"],
  ["health", "weight"],
  ["вес", "weight"],
  ["sport", "weight"],
  ["bank", "bank"],
  ["ипот", "bank"],
  ["loan", "bank"],
  ["internet", "wifi"],
  ["wifi", "wifi"],
  ["дом", "wifi"],
  ["auto", "car"],
  ["маш", "car"],
  ["fuel", "car"],
  ["tech", "monitor"],
  ["device", "monitor"],
  ["тех", "monitor"],
  ["reserve", "dindon"],
  ["накоп", "dindon"],
  ["bag", "bag"],
  ["market", "bag"],
  ["shop", "bag"],
  ["wild", "bag"],
  ["food", "cloche"],
  ["каф", "cloche"],
  ["ресторан", "cloche"],
  ["подпис", "xz"],
  ["music", "xz"],
  ["науш", "xz"],
];

const legacyCategoryIconKeys: Record<string, CategoryIconKey> = {
  devices: "monitor",
  homeWifi: "wifi",
  reserve: "dindon",
  signpost: "arrow",
  teacher: "study",
};

function parseDecimal(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  const normalized = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
}

function toNonNegativeAmount(value: string | number | null | undefined) {
  return Math.max(0, parseDecimal(value));
}

function buildDisplayAccountBalances(accounts: AccountResponse[], totalBalance: number) {
  const balances = new Map<string, number>();
  const positiveBalances = accounts.map((account) => ({
    account,
    amount: toNonNegativeAmount(account.current_balance),
  }));

  if (positiveBalances.some((item) => item.amount > 0) || totalBalance <= 0) {
    positiveBalances.forEach(({ account, amount }) => balances.set(account.id, amount));
    return balances;
  }

  const weights = accounts.map((account) => Math.abs(parseDecimal(account.current_balance)));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const fallbackWeight = accounts.length ? 1 / accounts.length : 0;

  accounts.forEach((account, index) => {
    const ratio = totalWeight > 0 ? (weights[index] ?? 0) / totalWeight : fallbackWeight;
    balances.set(account.id, Math.round(totalBalance * ratio));
  });

  return balances;
}

function normalizeLabel(value: string | null | undefined) {
  return value?.trim() || "";
}

function toDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("ru-RU", options).format(date);
}

function formatMonthShort(date: Date) {
  return formatDate(date, { month: "short" })
    .replace(".", "")
    .slice(0, 4);
}

function formatMonthLong(date: Date) {
  return formatDate(date, { month: "long" });
}

function formatDayMonth(date: Date) {
  return formatDate(date, { day: "numeric", month: "short" }).replace(".", "");
}

function formatDayMonthLong(date: Date) {
  return formatDate(date, { day: "numeric", month: "long" });
}

function formatWeekdayDayMonth(date: Date) {
  return formatDate(date, { weekday: "short", day: "numeric", month: "long" });
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mapFinancialHealthToDashboardCredit(health: FinancialHealthScoreResponse) {
  const financialScore = parseDecimal(health.financial_health_score);

  return {
    betterThanUsers: clamp(Math.round(financialScore), 0, 100),
    creditLabel: health.financial_health_status,
    creditMax: 500,
    creditScore: Math.round(financialScore * 5),
  };
}

async function fetchFinancialHealthScoreSafe() {
  try {
    return await fetchFinancialHealthScore();
  } catch {
    return null;
  }
}

function sortByDateDesc<T extends { created_at?: string | null; operation_at?: string | null }>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    const leftDate = toDate(left.operation_at ?? left.created_at ?? "")?.getTime() ?? 0;
    const rightDate = toDate(right.operation_at ?? right.created_at ?? "")?.getTime() ?? 0;
    return rightDate - leftDate;
  });
}

function getCategoryIconKey(category: CategoryResponse) {
  const directKey = category.icon_key as CategoryIconKey | null;

  if (directKey) {
    if (directKey in categoriesAssets.icons) {
      return directKey;
    }

    const legacyKey = legacyCategoryIconKeys[directKey];
    if (legacyKey) {
      return legacyKey;
    }
  }

  const haystack = `${category.name} ${category.description ?? ""}`.toLowerCase();
  const match = categoryKeywordToIcon.find(([keyword]) => haystack.includes(keyword));
  return (match?.[1] ?? createCategoryIconOptions[0]) as keyof typeof categoriesAssets.icons;
}

function getBankId(account: AccountResponse) {
  const source = `${account.bank_source ?? ""} ${account.display_name}`.toLowerCase();

  if (source.includes("sber") || source.includes("сбер")) return "sber";
  if (source.includes("t-bank") || source.includes("тин") || source.includes("tink")) return "tbank";
  if (source.includes("альф") || source.includes("alfa")) return "alfa";
  if (source.includes("vtb") || source.includes("втб")) return "vtb";
  if (source.includes("газпр")) return "gpb";
  if (source.includes("райф")) return "raif";

  return account.id;
}

function getBankLabel(account: AccountResponse) {
  return account.bank_source || account.display_name || "Счет";
}

function getBankShortLabel(account: AccountResponse) {
  const bankId = getBankId(account);

  if (bankId === "sber") return "Сбер";
  if (bankId === "tbank") return "Т-Банк";
  if (bankId === "alfa") return "Альфа";
  if (bankId === "vtb") return "ВТБ";
  if (bankId === "gpb") return "Газпром";

  return getBankLabel(account).slice(0, 8);
}

function getBankTone(bankId: string) {
  if (bankId === "tbank") return "warn";
  if (bankId === "alfa") return "danger";
  return "soft";
}

function getOperationIcon(categoryName: string, description: string, type: TransactionResponse["type"]) {
  if (type === "income") return "income" as OperationsOperation["icon"];

  const haystack = `${categoryName} ${description}`.toLowerCase();

  if (haystack.includes("образ") || haystack.includes("edu") || haystack.includes("learn")) {
    return "education" as OperationsOperation["icon"];
  }

  if (haystack.includes("wifi") || haystack.includes("internet") || haystack.includes("связ")) {
    return "wifi" as OperationsOperation["icon"];
  }

  if (haystack.includes("ипот") || haystack.includes("банк") || haystack.includes("loan")) {
    return "bank" as OperationsOperation["icon"];
  }

  if (
    haystack.includes("магаз") ||
    haystack.includes("market") ||
    haystack.includes("маркет") ||
    haystack.includes("shop") ||
    haystack.includes("wild")
  ) {
    return "bag" as OperationsOperation["icon"];
  }

  return "bag" as OperationsOperation["icon"];
}

function buildBankAccounts(accounts: AccountResponse[]): BankAccount[] {
  if (!accounts.length) {
    return fallbackBankAccounts;
  }

  const colors = ["#ffd84d", "#52c26d", "#ff8a6b", "#6b8cff", "#9f7aea"];

  return accounts.slice(0, 5).map((account, index) => {
    const bankId = getBankId(account);
    const suffix = normalizeLabel(account.card_last4) || account.id.slice(-4);

    const bankKey =
      bankId === account.id
        ? "default"
        : bankId;

    return {
      bankKey,
      color: colors[index % colors.length],
      id: account.id,
      label: account.account_type || "Счет",
      suffix,
    };
  });
}

function buildMonthSeries(
  transactions: TransactionResponse[],
  monthsCount: number,
  type?: TransactionResponse["type"],
) {
  const now = new Date();
  const months = Array.from({ length: monthsCount }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthsCount - index - 1), 1);
    return date;
  });

  return months.map((date) => {
    const key = monthKey(date);
    const total = transactions.reduce((sum, transaction) => {
      if (type && transaction.type !== type) {
        return sum;
      }

      const transactionDate = toDate(transaction.operation_at);

      if (!transactionDate || monthKey(transactionDate) !== key) {
        return sum;
      }

      return sum + Math.abs(parseDecimal(transaction.operation_amount));
    }, 0);

    return {
      month: formatMonthShort(date),
      value: Math.round(total),
    };
  });
}

function buildForecastSeries(transactions: TransactionResponse[], monthsCount: number): ForecastPoint[] {
  const incomeSeries = buildMonthSeries(transactions, monthsCount, "income");
  const expenseSeries = buildMonthSeries(transactions, monthsCount, "expense");

  return incomeSeries.map((item, index) => ({
    balance: item.value,
    month: item.month,
    spend: expenseSeries[index]?.value ?? 0,
  }));
}

function buildQuarterForecastSeries(transactions: TransactionResponse[]) {
  const monthly = buildForecastSeries(transactions, 12);
  const quarters = [
    monthly.slice(0, 3),
    monthly.slice(3, 6),
    monthly.slice(6, 9),
    monthly.slice(9, 12),
  ];

  return quarters.map((quarter, index) => ({
    balance: quarter.reduce((sum, item) => sum + item.balance, 0),
    month: `Q${index + 1}`,
    spend: quarter.reduce((sum, item) => sum + item.spend, 0),
  }));
}

const OPERATIONS_LIST_LIMIT = 50;

function pickTopTransactions(transactions: TransactionResponse[], limit: number) {
  return sortByDateDesc(transactions).slice(0, limit);
}

function mapTransactionToListOperation(
  transaction: TransactionResponse,
  accountsById: Map<string, AccountResponse>,
  categoriesById: Map<string, CategoryResponse>,
) {
  const account = transaction.account_id
    ? accountsById.get(transaction.account_id)
    : undefined;
  const category = transaction.category_id
    ? categoriesById.get(transaction.category_id)
    : undefined;
  const type = resolveTransactionType(transaction);
  const categoryName =
    transaction.category_name ||
    category?.name ||
    (type === "income" ? "Доходы" : "Расходы");
  const description =
    normalizeLabel(transaction.description) || categoryName || "Операция";
  const bank = account ? getBankLabel(account) : "Счет";
  const bankId = account ? getBankId(account) : "default";

  return {
    amount: getTransactionSignedAmount(transaction),
    bank,
    bankTone: getBankTone(bankId) as OperationsOperation["bankTone"],
    category: categoryName,
    direction: (type === "income" ? "income" : "outcome") as OperationsOperation["direction"],
    icon: getOperationIcon(categoryName, description, type),
    iconTone:
      type === "income"
        ? ("success" as OperationsOperation["iconTone"])
        : ("neutral" as OperationsOperation["iconTone"]),
    id: transaction.id,
    title: description,
  };
}

function buildOperationsList(
  transactions: TransactionResponse[],
  accountsById: Map<string, AccountResponse>,
  categoriesById: Map<string, CategoryResponse>,
) {
  return pickTopTransactions(transactions, OPERATIONS_LIST_LIMIT).map((transaction) =>
    mapTransactionToListOperation(transaction, accountsById, categoriesById),
  );
}

function buildOperationsDateGroups(
  transactions: TransactionResponse[],
  accountsById: Map<string, AccountResponse>,
  categoriesById: Map<string, CategoryResponse>,
) {
  const labels: string[] = [];
  const groups = new Map<string, OperationsOperation[]>();

  pickTopTransactions(transactions, OPERATIONS_LIST_LIMIT).forEach((transaction) => {
    const operation = mapTransactionToListOperation(transaction, accountsById, categoriesById);
    const date = toDate(transaction.operation_at);
    const label = date ? formatDayMonthLong(date) : "Без даты";

    if (!groups.has(label)) {
      groups.set(label, []);
      labels.push(label);
    }

    groups.get(label)!.push(operation);
  });

  return labels.map((label) => {
    const operations = groups.get(label) ?? [];

    return {
      label,
      operations,
      total: Math.round(operations.reduce((sum, operation) => sum + operation.amount, 0)),
    };
  });
}

function buildBreakdownItems(transactions: TransactionResponse[], limit = 3) {
  const totals = new Map<string, number>();

  transactions
    .filter((transaction) => resolveTransactionType(transaction) === "expense")
    .forEach((transaction) => {
      const key = transaction.category_name || "Прочее";
      totals.set(key, (totals.get(key) ?? 0) + getTransactionAbsAmount(transaction));
    });

  const entries = [...totals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit);
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0) || 1;
  const colors = ["#4dbc47", "#b2ff27", "#d2d2d2"];

  return entries.map(([label, amount], index) => ({
    color: colors[index] ?? colors.at(-1)!,
    id: `${label}-${index}`.toLowerCase(),
    label,
    percent: Math.max(1, Math.round((amount / total) * 100)),
  })) as OperationsBreakdownItem[];
}

function buildCategoryDetails(
  categories: CategoriesScreenCategory[],
  transactions: TransactionResponse[],
  accountsById: Map<string, AccountResponse>,
  categoriesByBackendId: Map<string, CategoryResponse>,
  limitsByCategoryId: Map<string, LimitResponse>,
) {
  const detailsById: CategoryDetailsById = {};

  categories.forEach((category) => {
    const backendCategory = categoriesByBackendId.get(category.id);
    const categoryTransactions = sortByDateDesc(
      transactions.filter((transaction) => transaction.category_id === backendCategory?.id),
    );

    if (!backendCategory || !categoryTransactions.length) {
      detailsById[category.id] = getCategoryDetailData(category);
      return;
    }

    const groupedTransactions = new Map<
      string,
      {
        amount: number;
        items: Array<{
          amount: number;
          bank?: string;
          bankId?: string;
          label: string;
          title: string;
        }>;
      }
    >();

    categoryTransactions.slice(0, 12).forEach((transaction) => {
      const date = toDate(transaction.operation_at);
      const groupKey = date ? formatDayMonthLong(date) : "Без даты";
      const nextAmount = Math.abs(parseDecimal(transaction.operation_amount));
      const group = groupedTransactions.get(groupKey) ?? {
        amount: 0,
        items: [],
      };

      const account = transaction.account_id
        ? accountsById.get(transaction.account_id)
        : undefined;
      const bankId = account ? getBankId(account) : undefined;
      const bankLabel = account ? getBankShortLabel(account) : undefined;

      group.amount += nextAmount;
      group.items.push({
        amount: nextAmount,
        bank: bankLabel,
        bankId,
        label: transaction.category_name || backendCategory.name,
        title: transaction.description || backendCategory.name,
      });

      groupedTransactions.set(groupKey, group);
    });

    const banksMap = new Map<string, { amount: number; badge: string; name: string; tone: "blue" | "green" | "red" | "yellow" }>();

    categoryTransactions.forEach((transaction) => {
      const account = transaction.account_id
        ? accountsById.get(transaction.account_id)
        : undefined;
      const bankName = account ? getBankLabel(account) : "Счет";
      const bankId = account ? getBankId(account) : "default";
      const current = banksMap.get(bankId) ?? {
        amount: 0,
        badge: bankName.slice(0, 1).toUpperCase(),
        name: bankName,
        tone:
          bankId === "tbank"
            ? "yellow"
            : bankId === "alfa"
              ? "red"
              : bankId === "vtb" || bankId === "gpb"
                ? "blue"
                : "green",
      };

      current.amount += Math.abs(parseDecimal(transaction.operation_amount));
      banksMap.set(bankId, current);
    });

    const limit = limitsByCategoryId.get(backendCategory.id);
    const now = new Date();
    const periodStart = limit?.period_started_at
      ? toDate(limit.period_started_at)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = periodStart
      ? new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    detailsById[category.id] = {
      banks: [...banksMap.values()].sort((left, right) => right.amount - left.amount).slice(0, 4),
      groups: [...groupedTransactions.entries()].map(([date, group]) => ({
        date,
        items: group.items,
        total: Math.round(group.amount),
      })),
      limit: {
        periodEnd: formatDate(periodEnd ?? now, { day: "2-digit", month: "2-digit", year: "numeric" }),
        periodStart: formatDate(periodStart ?? now, { day: "2-digit", month: "2-digit", year: "numeric" }),
        spent: category.spent,
        total: category.total,
      },
    };
  });

  return detailsById;
}

function inferSubscriptions(transactions: TransactionResponse[]) {
  const groups = new Map<
    string,
    {
      dates: Date[];
      name: string;
      total: number;
      values: number[];
    }
  >();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const name =
        normalizeLabel(transaction.description) ||
        normalizeLabel(transaction.category_name) ||
        "Подписка";
      const key = name.toLowerCase();
      const group = groups.get(key) ?? {
        dates: [],
        name,
        total: 0,
        values: [],
      };

      const amount = Math.abs(parseDecimal(transaction.operation_amount));
      const date = toDate(transaction.operation_at);

      if (date) {
        group.dates.push(date);
      }

      group.total += amount;
      group.values.push(amount);
      groups.set(key, group);
    });

  const now = new Date();

  return [...groups.values()]
    .map((group) => {
      const uniqueMonths = new Set(group.dates.map(monthKey));
      const averageValue =
        group.values.reduce((sum, value) => sum + value, 0) /
        Math.max(group.values.length, 1);
      const lastDate = group.dates.sort((left, right) => right.getTime() - left.getTime())[0];
      const hasSubscriptionKeyword =
        /(subscription|premium|music|plus|cloud|fitness|tv|play|pro|подпис)/i.test(group.name);

      if (!hasSubscriptionKeyword && uniqueMonths.size < 2) {
        return null;
      }

      const status =
        lastDate && now.getTime() - lastDate.getTime() > 45 * 24 * 60 * 60 * 1000
          ? "paused"
          : "active";
      const icon =
        subscriptionIconMatchers.find(({ keyword }) =>
          group.name.toLowerCase().includes(keyword),
        )?.icon ?? subscriptionCategoryIcon;

      const nextSubscription: SubscriptionItem = {
        icon,
        id: group.name.toLowerCase().replace(/\s+/g, "-"),
        monthlyPrice: Math.round(averageValue),
        months: uniqueMonths.size || 1,
        name: group.name,
        sourceType: "detected",
        status,
        totalSpent: Math.round(group.total),
      };

      return nextSubscription;
    })
    .filter((item): item is SubscriptionItem => item !== null)
    .sort((left, right) => right.monthlyPrice - left.monthlyPrice)
    .slice(0, 8);
}

function buildBarHeights(values: number[]) {
  const maxValue = Math.max(...values, 1);
  return values.map((value) => Math.max(18, Math.round((value / maxValue) * 87)));
}

function buildTrendPeriodData(transactions: TransactionResponse[]) {
  const now = new Date();
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return date;
  });
  const monthDates = Array.from({ length: 10 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (9 - index));
    return date;
  });
  const yearMonths = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    return date;
  });

  const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");

  const aggregateByExactDate = (dates: Date[]) =>
    dates.map((date) =>
      Math.round(
        expenseTransactions.reduce((sum, transaction) => {
          const transactionDate = toDate(transaction.operation_at);
          if (!transactionDate) return sum;

          if (
            transactionDate.getFullYear() === date.getFullYear() &&
            transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getDate() === date.getDate()
          ) {
            return sum + Math.abs(parseDecimal(transaction.operation_amount));
          }

          return sum;
        }, 0),
      ),
    );

  const aggregateByMonth = (dates: Date[]) =>
    dates.map((date) =>
      Math.round(
        expenseTransactions.reduce((sum, transaction) => {
          const transactionDate = toDate(transaction.operation_at);
          if (!transactionDate) return sum;

          if (
            transactionDate.getFullYear() === date.getFullYear() &&
            transactionDate.getMonth() === date.getMonth()
          ) {
            return sum + Math.abs(parseDecimal(transaction.operation_amount));
          }

          return sum;
        }, 0),
      ),
    );

  const weekValues = aggregateByExactDate(weekDates);
  const monthValues = aggregateByExactDate(monthDates);
  const yearValues = aggregateByMonth(yearMonths);

  const scaleFromValues = (values: number[]) => {
    const maxValue = Math.max(...values, 1);
    return [
      Math.round(maxValue),
      Math.round(maxValue * 0.66),
      Math.round(maxValue * 0.33),
    ] as [number, number, number];
  };

  return {
    week: {
      bars: weekDates.map((date, index) => {
        const tone: "active" | "muted" =
          index === weekValues.length - 1 ? "active" : "muted";

        return {
          day: formatDate(date, { weekday: "short" }),
          tone,
          value: weekValues[index] ?? 0,
        };
      }),
      defaultActiveIndex: Math.max(0, weekValues.length - 1),
      insightDate: formatWeekdayDayMonth(weekDates.at(-1) ?? now),
      lineValues: weekValues,
      scale: scaleFromValues(weekValues),
    },
    month: {
      bars: monthDates.map((date, index) => {
        const tone: "active" | "muted" =
          index === monthValues.length - 1 ? "active" : "muted";

        return {
          day: String(date.getDate()),
          tone,
          value: monthValues[index] ?? 0,
        };
      }),
      defaultActiveIndex: Math.max(0, monthValues.length - 1),
      insightDate: formatWeekdayDayMonth(monthDates.at(-1) ?? now),
      lineValues: monthValues,
      scale: scaleFromValues(monthValues),
    },
    year: {
      bars: yearMonths.map((date, index) => {
        const tone: "active" | "muted" =
          index === yearValues.length - 1 ? "active" : "muted";

        return {
          day: formatMonthShort(date),
          tone,
          value: yearValues[index] ?? 0,
        };
      }),
      defaultActiveIndex: Math.max(0, yearValues.length - 1),
      insightDate: formatMonthLong(yearMonths.at(-1) ?? now),
      lineValues: yearValues,
      scale: scaleFromValues(yearValues),
    },
  };
}

function buildBarsPeriodData(transactions: TransactionResponse[]) {
  const trendData = buildTrendPeriodData(transactions);
  const tones = ["green", "green-deep", "muted", "dark"] as const;

  const mapBars = (
    items: Array<{ day: string; value: number }>,
  ) => {
    const heights = buildBarHeights(items.map((item) => item.value));
    const maxIndex = items.reduce(
      (bestIndex, item, index, array) =>
        item.value > array[bestIndex]!.value ? index : bestIndex,
      0,
    );

    return items.map((item, index) => {
      const tone: "green" | "dark" | "green-deep" | "muted" =
        index === maxIndex ? "dark" : tones[index % tones.length]!;

      return {
        height: heights[index] ?? 18,
        label: item.day,
        tone,
      };
    });
  };

  return {
    week: mapBars(trendData.week.bars),
    month: mapBars(trendData.month.bars),
    year: mapBars(trendData.year.bars),
  };
}

function buildRecommendations(
  recommendations: AgentRecommendationResponse[],
) {
  if (!recommendations.length) {
    return recommendationsScreenData.agents;
  }

  const fallbackAgentsById = new Map(
    recommendationsScreenData.agents.map((agent) => [agent.id, agent]),
  );
  const fallbackAgentIdsByKey: Record<string, string> = {
    pillow_keeper: "pillow-keeper",
    expense_detective: "expense-detective",
    growth_strategist: "growth-strategist",
    balancer: "balancer",
    habit_trainer: "habit-trainer",
  };

  const isInvalidCopy = (value: string | null | undefined) => {
    const normalized = value?.trim().toLowerCase() ?? "";
    return (
      !normalized ||
      normalized.includes("ошибка вывода данных") ||
      normalized.includes("error") ||
      normalized === "null" ||
      normalized === "undefined"
    );
  };

  return recommendations.map((recommendation, index) => {
    const fallbackAgentId =
      fallbackAgentIdsByKey[recommendation.agent_key] ??
      recommendationsScreenData.agents[index % recommendationsScreenData.agents.length]!.id;
    const fallbackAgent =
      fallbackAgentsById.get(fallbackAgentId) ??
      recommendationsScreenData.agents[index % recommendationsScreenData.agents.length]!;
    const visual =
      recommendationVisuals[
        recommendation.agent_key as keyof typeof recommendationVisuals
      ] ??
      fallbackAgent;
    const recommendationContent = formatRecommendationInsightContent(
      isInvalidCopy(recommendation.content)
        ? `${fallbackAgent.insightLead} ${fallbackAgent.insightRest}`.trim()
        : recommendation.content.trim(),
    );
    const [lead, ...rest] = recommendationContent.split(/(?<=\.)\s+/);
    const recommendationTitle = isInvalidCopy(recommendation.title)
      ? fallbackAgent.title
      : recommendation.title.trim();

    return {
      id: fallbackAgent.id,
      imageKey: visual.imageKey,
      imageVariant: visual.imageVariant,
      insightLead: lead || fallbackAgent.insightLead,
      insightRest: rest.join(" ") || fallbackAgent.insightRest,
      subtitle: isInvalidCopy(visual.subtitle) ? fallbackAgent.subtitle : visual.subtitle,
      title: recommendationTitle,
    } satisfies RecommendationAgent;
  });
}

function resolveAgentVisualByTitle(title: string, index: number) {
  const matchedAgent = recommendationsScreenData.agents.find((agent) => agent.title === title);
  if (matchedAgent) {
    return {
      imageKey: matchedAgent.imageKey,
      imageVariant: matchedAgent.imageVariant as RecommendationChat["imageVariant"],
    };
  }

  const fallbackAgent =
    recommendationsScreenData.agents[index % recommendationsScreenData.agents.length]!;

  return {
    imageKey: fallbackAgent.imageKey,
    imageVariant: fallbackAgent.imageVariant as RecommendationChat["imageVariant"],
  };
}

function formatChatTimestamp(date: Date) {
  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();

  if (isSameDay) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (date >= weekAgo) {
    return date
      .toLocaleDateString("ru-RU", { weekday: "short" })
      .replace(".", "");
  }

  return formatDate(date, { day: "2-digit", month: "2-digit", year: "numeric" });
}

function buildChats(chats: ChatResponse[]) {
  if (!chats.length) {
    return recommendationsScreenData.chats;
  }

  const fallbackAgentIdsByTitle = new Map(
    recommendationsScreenData.agents.map((agent) => [agent.title.trim(), agent.id]),
  );

  return chats.map((chat, index) => {
    const visual = resolveAgentVisualByTitle(chat.title, index);
    const fallbackChat =
      recommendationsScreenData.chats[index % recommendationsScreenData.chats.length]!;
    const normalizedTitle = chat.title?.trim();
    const title =
      normalizedTitle &&
      !/ошибка вывода данных|error|null|undefined/i.test(normalizedTitle)
        ? normalizedTitle
        : fallbackChat.title;

    return {
      agentId:
        fallbackAgentIdsByTitle.get(title) ??
        fallbackAgentIdsByTitle.get(fallbackChat.title) ??
        "pillow-keeper",
      id: chat.id,
      imageKey: visual.imageKey,
      imageVariant: visual.imageVariant,
      preview: fallbackChat.preview,
      timestamp: formatChatTimestamp(new Date(chat.updated_at)),
      title,
    } satisfies RecommendationChat;
  });
}

function buildCategoryBankStats(accounts: AccountResponse[]) {
  const grouped = new Map<
    string,
    { amount: number; badge: string; name: string; tone: "blue" | "green" | "red" | "yellow" }
  >();

  accounts.forEach((account) => {
    const bankId = getBankId(account);
    const entry = grouped.get(bankId) ?? {
      amount: 0,
      badge: getBankLabel(account).slice(0, 1).toUpperCase(),
      name: getBankLabel(account),
      tone:
        bankId === "tbank"
          ? "yellow"
          : bankId === "alfa"
            ? "red"
            : bankId === "vtb" || bankId === "gpb"
              ? "blue"
              : "green",
    };

    entry.amount += toNonNegativeAmount(account.current_balance);
    grouped.set(bankId, entry);
  });

  return [...grouped.values()].sort((left, right) => right.amount - left.amount);
}

function buildCategoriesFromBackend(
  categories: CategoryResponse[],
  limits: LimitResponse[],
  transactions: TransactionResponse[],
) {
  const limitsByCategoryId = new Map(
    limits
      .filter((limit) => limit.category_id && limit.is_active)
      .map((limit) => [limit.category_id as string, limit]),
  );

  return categories.map((category, index) => {
    const spent = Math.round(
      transactions.reduce((sum, transaction) => {
        if (transaction.type !== "expense") return sum;
        if (transaction.category_id !== category.id) return sum;
        return sum + Math.abs(parseDecimal(transaction.operation_amount));
      }, 0),
    );
    const limit = limitsByCategoryId.get(category.id);
    const total = Math.max(
      Math.round(parseDecimal(limit?.limit_amount)),
      spent || 0,
      1000,
    );
    const progress = clamp(spent / Math.max(total, 1), 0, 1);

    return {
      icon: getCategoryIconKey(category),
      id: category.id,
      progress,
      spent,
      title: category.name,
      tone:
        index === 0
          ? "dark"
          : progress >= 0.8
            ? "light-darkbar"
            : "light",
      total,
    } satisfies CategoriesScreenCategory;
  });
}

function buildInvestmentSeries(
  transactions: TransactionResponse[],
  accounts: AccountResponse[],
) {
  const investmentAccountIds = new Set(
    accounts
      .filter((account) => /(invest|broker|iis|накоп|сберег)/i.test(`${account.account_type} ${account.display_name}`))
      .map((account) => account.id),
  );

  const relatedTransactions = transactions.filter((transaction) => {
    const text = `${transaction.category_name ?? ""} ${transaction.description ?? ""}`;
    return (
      investmentAccountIds.has(transaction.account_id ?? "") ||
      /(invest|broker|iis|акц|облиг|накоп|сбереж)/i.test(text)
    );
  });

  return buildMonthSeries(relatedTransactions, 7).map((item, index, items) => ({
    labelValue: index === items.length - 3 ? item.value : undefined,
    month: item.month,
    tone:
      index < items.length - 2
        ? "muted"
        : index === items.length - 2
          ? "active"
          : "future",
    value: Math.max(12, Math.round(item.value / Math.max((items.at(-2)?.value ?? item.value) / 144, 1))),
  }));
}

export function canUseBackendScreens() {
  return hasStoredAccessToken();
}

export async function loadDashboardScreenData() {
  const [
    accountsResponse,
    availableBalance,
    expectedIncomes,
    expectedExpenses,
    regularExpensesResponse,
    transactions,
    recommendationsResponse,
    financialHealth,
  ] = await Promise.all([
    fetchAccounts({ page_size: 100 }),
    fetchAvailableBalance(),
    fetchExpectedIncomes({ page_size: 100 }),
    fetchExpectedExpenses({ page_size: 100 }),
    fetchRegularExpensesPage({ page_size: 100 }),
    fetchAllTransactions(),
    fetchAgentRecommendations(),
    fetchFinancialHealthScoreSafe(),
  ]);

  const accounts = accountsResponse.items;
  const spendingCalendar = buildSpendingCalendarGroups(transactions);
  const recommendations = recommendationsResponse.items;
  const bankAccounts = buildBankAccounts(accounts);
  const liveForecastPoints = buildForecastSeries(transactions, 6);
  const liveDesktopForecastPoints = buildForecastSeries(transactions, 9);
  const liveYearForecastPoints = buildQuarterForecastSeries(transactions);
  const availableAmount = parseDecimal(availableBalance.available_amount);
  const totalBalance = availableAmount;
  const receipts = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + parseDecimal(transaction.operation_amount), 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Math.abs(parseDecimal(transaction.operation_amount)), 0);
  const expectedIncomeTotal = parseDecimal(availableBalance.expected_income_total);
  const expectedExpenseTotal = parseDecimal(availableBalance.expected_expense_total);
  const regularExpenseSubscriptions = regularExpensesResponse.items
    .filter((item) => item.status !== "deleted")
    .map(mapRegularExpenseToSubscription);
  const subscriptions = regularExpenseSubscriptions.length
    ? regularExpenseSubscriptions
    : inferSubscriptions(transactions);
  const investmentSeries = buildInvestmentSeries(transactions, accounts);
  const investmentValue = investmentSeries.reduce((sum, item) => sum + item.value, 0);
  const assetsTotal = accounts.reduce(
    (sum, account) => sum + Math.max(0, parseDecimal(account.current_balance)),
    0,
  );
  const investmentDenominator = Math.max(assetsTotal, Math.abs(totalBalance), 1);
  const investmentSharePercent = clamp(
    Math.round((investmentValue / investmentDenominator) * 100),
    0,
    99,
  );
  const investmentMonthGrowth =
    investmentSeries.at(-2)?.value && investmentSeries.at(-2)!.value > 0
      ? ((investmentSeries.at(-1)?.value ?? 0) - investmentSeries.at(-2)!.value) /
        investmentSeries.at(-2)!.value
      : 0;
  const useInvestmentFallback =
    totalBalance <= 0 || investmentValue <= 0 || investmentSharePercent >= 90;
  const investmentPercent = useInvestmentFallback
    ? dashboardData.investmentPercent
    : investmentSharePercent || dashboardData.investmentPercent;
  const investmentGrowth = useInvestmentFallback
    ? dashboardData.investmentGrowth
    : `+${Math.max(0.01, Math.abs(investmentMonthGrowth) * 100)
        .toFixed(2)
        .replace(".", ",")} (${(investmentSharePercent / 100)
        .toFixed(2)
        .replace(".", ",")}%)`;
  const forecastPercent = clamp(
    Math.round((availableAmount / Math.max(totalBalance, 1)) * 100),
    0,
    100,
  );

  return {
    bankAccounts,
    categoryRadarMetrics: categoryRadarMetrics.map((metric) => {
      if (metric.id === "expenses") {
        return {
          ...metric,
          percent: clamp(Math.round((expenses / Math.max(receipts + expenses, 1)) * 100), 1, 99),
        };
      }

      if (metric.id === "reserve") {
        return {
          ...metric,
          percent: clamp(Math.round((availableAmount / Math.max(expectedExpenseTotal, 1)) * 100), 1, 99),
        };
      }

      if (metric.id === "income") {
        return {
          ...metric,
          percent: clamp(Math.round((expectedIncomeTotal / Math.max(receipts || expectedIncomeTotal, 1)) * 100), 1, 99),
        };
      }

      if (metric.id === "investments") {
        return {
          ...metric,
          percent: clamp(investmentPercent, 1, 99),
        };
      }

      return metric;
    }),
    dashboard: {
      ...dashboardData,
      ...(financialHealth ? mapFinancialHealthToDashboardCredit(financialHealth) : {}),
      assistantText: recommendations[0]?.title ?? dashboardData.assistantText,
      expenses,
      forecastPercent,
      forecastTooltip: liveForecastPoints.at(-1)?.balance ?? dashboardData.forecastTooltip,
      incomeRemainder: availableAmount,
      investmentGrowth,
      investmentPercent,
      notifications: recommendations.length || dashboardData.notifications,
      receipts,
      recurringExpenses: buildRecurringExpensesSummary(subscriptions),
      totalBalance,
    },
    desktopForecastPoints:
      liveDesktopForecastPoints.some((point) => point.balance || point.spend)
        ? liveDesktopForecastPoints
        : desktopForecastPoints,
    forecastPoints:
      liveForecastPoints.some((point) => point.balance || point.spend)
        ? liveForecastPoints
        : forecastPoints,
    forecastYearPoints:
      liveYearForecastPoints.some((point) => point.balance || point.spend)
        ? liveYearForecastPoints
        : forecastYearPoints,
    spendingCalendar: spendingCalendar.length
      ? spendingCalendar
      : spendingCalendarMockGroups,
  };
}

export async function loadCategoriesScreenData() {
  const [categoriesResponse, limitsResponse, transactionsResponse, accountsResponse] =
    await Promise.all([
      fetchCategoriesPage({ page_size: 200 }),
      fetchLimitsPage({ page_size: 200 }),
      fetchTransactions({ page_size: 500 }),
      fetchAccounts({ page_size: 100 }),
    ]);

  const categories = buildCategoriesFromBackend(
    categoriesResponse.items,
    limitsResponse.items,
    transactionsResponse.items,
  );

  const categoriesById = new Map(
    categoriesResponse.items.map((category) => [category.id, category]),
  );
  const limitsByCategoryId = new Map(
    limitsResponse.items
      .filter((limit) => limit.category_id)
      .map((limit) => [limit.category_id as string, limit]),
  );
  const accountsById = new Map(
    accountsResponse.items.map((account) => [account.id, account]),
  );

  const detailsById = buildCategoryDetails(
    categories,
    transactionsResponse.items,
    accountsById,
    categoriesById,
    limitsByCategoryId,
  );

  return {
    assets: categoriesAssets,
    detailsById,
    screen: {
      ...categoriesScreenData,
      categories: categories.length ? categories : categoriesScreenData.categories,
    },
  };
}

export async function loadGoalsScreenData() {
  return loadGoalsFromBackend();
}

export async function loadRecommendationsScreenData() {
  const [recommendationsResponse, chatsResponse] = await Promise.all([
    fetchAgentRecommendations(),
    fetchChats({ page_size: 100 }),
  ]);

  const agents = buildRecommendations(recommendationsResponse.items);
  const chats = buildChats(chatsResponse.items);

  return {
    assets: recommendationsAssets,
    screen: {
      ...recommendationsScreenData,
      agents,
      chats,
      summary: {
        ...recommendationsScreenData.summary,
        agentsCount: agents.length,
      },
    },
  };
}

export async function loadSubscriptionsScreenData() {
  return loadSubscriptionsFromBackend();
}

export async function loadOperationsScreenData() {
  const [transactions, accountsResponse, categoriesResponse] = await Promise.all([
    fetchAllTransactions(),
    fetchAccounts({ page_size: 100 }),
    fetchCategoriesPage({ page_size: 200 }),
  ]);
  const accountsById = new Map(accountsResponse.items.map((account) => [account.id, account]));
  const categoriesById = new Map(categoriesResponse.items.map((category) => [category.id, category]));

  const monthBreakdown = buildBreakdownItems(transactions);
  const weekBreakdown = buildBreakdownItems(
    transactions.filter((transaction) => {
      const date = toDate(transaction.operation_at);
      if (!date) return false;
      return Date.now() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
    }),
  );
  const yearBreakdown = buildBreakdownItems(transactions);
  const latestDate = sortByDateDesc(transactions)[0]
    ? toDate(sortByDateDesc(transactions)[0]!.operation_at)
    : null;
  const operations = buildOperationsList(transactions, accountsById, categoriesById);
  const operationGroups = buildOperationsDateGroups(transactions, accountsById, categoriesById);
  const firstGroup = operationGroups[0];

  return {
    ...operationsScreenData,
    breakdown: monthBreakdown.length ? monthBreakdown : operationsScreenData.breakdown,
    breakdownByPeriod: {
      ...operationsScreenData.breakdownByPeriod,
      Год: {
        items: yearBreakdown.length ? yearBreakdown : operationsScreenData.breakdownByPeriod["Год"].items,
        total: Math.round(
          transactions
            .filter((transaction) => resolveTransactionType(transaction) === "expense")
            .reduce((sum, transaction) => sum + getTransactionAbsAmount(transaction), 0),
        ),
      },
      Мес: {
        items: monthBreakdown.length ? monthBreakdown : operationsScreenData.breakdownByPeriod["Мес"].items,
        total: Math.round(
          transactions
            .filter((transaction) => resolveTransactionType(transaction) === "expense")
            .reduce((sum, transaction) => sum + getTransactionAbsAmount(transaction), 0),
        ),
      },
      Нед: {
        items: weekBreakdown.length ? weekBreakdown : operationsScreenData.breakdownByPeriod["Нед"].items,
        total: Math.round(
          transactions
            .filter((transaction) => {
              if (resolveTransactionType(transaction) !== "expense") {
                return false;
              }

              const date = toDate(transaction.operation_at);
              return Boolean(
                date && Date.now() - date.getTime() <= 7 * 24 * 60 * 60 * 1000,
              );
            })
            .reduce((sum, transaction) => sum + getTransactionAbsAmount(transaction), 0),
        ),
      },
    },
    monthLabel: latestDate ? formatMonthLong(latestDate) : operationsScreenData.monthLabel,
    operationGroups: operationGroups.length ? operationGroups : undefined,
    operations: operations.length ? operations : operationsScreenData.operations,
    totalAmount: Math.round(
      transactions
        .filter((transaction) => resolveTransactionType(transaction) === "expense")
        .reduce((sum, transaction) => sum + getTransactionAbsAmount(transaction), 0),
    ),
    yesterday: firstGroup
      ? { label: firstGroup.label, total: firstGroup.total }
      : {
          label: latestDate ? formatDayMonthLong(latestDate) : operationsScreenData.yesterday.label,
          total: 0,
        },
  };
}

export async function loadOperationsTrendsScreenData() {
  const transactionsResponse = await fetchTransactions({ page_size: 500, type: "expense" });
  const trendData = buildTrendPeriodData(transactionsResponse.items);

  return {
    ...operationsTrendsData,
    byPeriod: {
      Год: {
        ...operationsTrendsData.byPeriod["Год"],
        bars: trendData.year.bars,
        defaultActiveIndex: trendData.year.defaultActiveIndex,
        insight: {
          ...operationsTrendsData.byPeriod["Год"].insight,
          amount: trendData.year.lineValues[trendData.year.defaultActiveIndex] ?? 0,
          date: trendData.year.insightDate,
          percent: 0,
        },
        lineValues: trendData.year.lineValues,
        spendScale: trendData.year.scale,
      },
      Мес: {
        ...operationsTrendsData.byPeriod["Мес"],
        bars: trendData.month.bars,
        defaultActiveIndex: trendData.month.defaultActiveIndex,
        insight: {
          ...operationsTrendsData.byPeriod["Мес"].insight,
          amount: trendData.month.lineValues[trendData.month.defaultActiveIndex] ?? 0,
          date: trendData.month.insightDate,
          percent: 0,
        },
        lineValues: trendData.month.lineValues,
        spendScale: trendData.month.scale,
      },
      Нед: {
        ...operationsTrendsData.byPeriod["Нед"],
        bars: trendData.week.bars,
        defaultActiveIndex: trendData.week.defaultActiveIndex,
        insight: {
          ...operationsTrendsData.byPeriod["Нед"].insight,
          amount: trendData.week.lineValues[trendData.week.defaultActiveIndex] ?? 0,
          date: trendData.week.insightDate,
          percent: 0,
        },
        lineValues: trendData.week.lineValues,
        spendScale: trendData.week.scale,
      },
    },
  };
}

export async function loadOperationsBarsScreenData() {
  const transactionsResponse = await fetchTransactions({ page_size: 500, type: "expense" });
  const barsData = buildBarsPeriodData(transactionsResponse.items);

  return {
    ...operationsBarsData,
    byPeriod: {
      Год: barsData.year,
      Мес: barsData.month,
      Нед: barsData.week,
    },
  };
}

function buildHealthHistoryTrend(
  items: Awaited<ReturnType<typeof fetchFinancialHealthHistory>>["items"],
  length: number,
) {
  const sorted = [...items].sort((left, right) => left.period.localeCompare(right.period));
  const slice = sorted.slice(-length);

  if (!slice.length) {
    return null;
  }

  return slice.map((item) => {
    const [, monthPart] = item.period.split("-");
    const monthIndex = Number.parseInt(monthPart ?? "1", 10) - 1;
    const date = new Date(2026, monthIndex, 1);

    return {
      month: formatMonthShort(date),
      value: Math.round(parseDecimal(item.financial_health_score) * 100),
    };
  });
}

export async function loadTotalBalanceScreenData() {
  const [accountsResponse, availableBalance, transactionsResponse, healthHistory] =
    await Promise.all([
      fetchAccounts({ page_size: 100 }),
      fetchAvailableBalance(),
      fetchTransactions({ page_size: 500 }),
      fetchFinancialHealthHistory({ page_size: 12 }).catch(() => ({
        items: [],
        pagination: { page: 1, page_size: 12, total_items: 0, total_pages: 0 },
      })),
    ]);

  const accounts = accountsResponse.items;
  const totalBalance = toNonNegativeAmount(availableBalance.available_amount);
  const displayAccountBalances = buildDisplayAccountBalances(accounts, totalBalance);
  const healthTrend = buildHealthHistoryTrend(
    healthHistory.items,
    totalBalanceScreenData.filters[0].trend.length,
  );
  const defaultTrendLength = totalBalanceScreenData.filters[0].trend.length;
  const filters = [
    {
      ...totalBalanceScreenData.filters[0],
      amount: totalBalance,
      label: totalBalanceScreenData.filters[0].label,
      subtitle: totalBalanceScreenData.filters[0].subtitle,
      trend:
        healthTrend ??
        buildMonthSeries(transactionsResponse.items, defaultTrendLength).map((item) => ({
          month: item.month,
          value: item.value,
        })),
    },
    ...accounts.slice(0, 3).map((account) => ({
      amount: displayAccountBalances.get(account.id) ?? 0,
      id: account.id,
      label: `${Math.round(displayAccountBalances.get(account.id) ?? 0)} ₽`,
      subtitle: getBankLabel(account),
      trend: buildMonthSeries(
        transactionsResponse.items.filter((transaction) => transaction.account_id === account.id),
        totalBalanceScreenData.filters[0].trend.length,
      ).map((item) => ({
        month: item.month,
        value: item.value,
      })),
    })),
  ];
  const bankStats = buildCategoryBankStats(accounts);
  const transactionExpensesTotal = transactionsResponse.items
    .filter((transaction) => resolveTransactionType(transaction) === "expense")
    .reduce((sum, transaction) => sum + getTransactionAbsAmount(transaction), 0);
  const expectedExpensesTotal = toNonNegativeAmount(availableBalance.expected_expense_total);
  const avgSpend = Math.max(
    0,
    Math.round(expectedExpensesTotal || transactionExpensesTotal),
  );
  const scenarioMonths = Math.max(1, Math.round(totalBalance / Math.max(avgSpend, 1)));
  const spendingCalendar = buildSpendingCalendarGroups(transactionsResponse.items);

  return {
    ...totalBalanceScreenData,
    defaultFilterId: totalBalanceScreenData.filters[0].id,
    spendingCalendar: spendingCalendar.length
      ? spendingCalendar
      : spendingCalendarMockGroups,
    desktop: {
      ...totalBalanceScreenData.desktop,
      banks:
        accounts.filter((account) => !account.is_archived).length > 0
          ? accounts
              .filter((account) => !account.is_archived)
              .slice(0, 6)
              .map((account) => {
                const bankId = getBankId(account);
                const suffix = normalizeLabel(account.card_last4) || account.id.slice(-4);

                return {
                  accountBadges: [`${account.account_type} • ${suffix}`],
                  amount: Math.round(displayAccountBalances.get(account.id) ?? 0),
                  bank: `*${suffix}`,
                  id: account.id,
                  tone:
                    bankId === "tbank"
                      ? "yellow"
                      : bankId === "alfa"
                        ? "red"
                        : bankId === "vtb" || bankId === "gpb"
                          ? "blue"
                          : "green",
                } as const;
              })
          : totalBalanceScreenData.desktop.banks,
      topBanks: bankStats.slice(0, 4).map((bank) => ({
        amount: Math.round(bank.amount),
        badge: bank.badge,
        name: bank.name,
        tone: bank.tone,
      })),
    },
    filters,
    scenarios: totalBalanceScreenData.scenarios.map((scenario, index) => ({
      ...scenario,
      allAccounts: Math.round(totalBalance),
      avgSpend,
      months: Math.max(1, scenarioMonths + index - 1),
    })),
  };
}

export async function loadIncomeBalanceScreenData() {
  const [availableBalance, expectedIncomes, transactionsResponse] = await Promise.all([
    fetchAvailableBalance(),
    fetchExpectedIncomes({ page_size: 100 }),
    fetchTransactions({ page_size: 500, type: "income" }),
  ]);

  const amount = parseDecimal(availableBalance.available_amount);
  const expectedIncomeTotal = parseDecimal(availableBalance.expected_income_total);
  const trend = buildMonthSeries(
    transactionsResponse.items,
    incomeBalanceScreenData.trend.length,
    "income",
  ).map((item) => ({
    month: item.month,
    value: item.value,
  }));

  return {
    ...incomeBalanceScreenData,
    amount,
    filters: expectedIncomes.items.slice(0, 3).map((income, index) => ({
      id: income.id ?? `income-${index}`,
      label: String(Math.round(parseDecimal(income.expected_amount))),
    })),
    summary: {
      ...incomeBalanceScreenData.summary,
      remainPercent: clamp(Math.round((amount / Math.max(expectedIncomeTotal, 1)) * 100), 0, 100),
      spentAmount: Math.round(amount),
    },
    trend: trend.some((item) => item.value) ? trend : incomeBalanceScreenData.trend,
  };
}

export async function loadInvestmentsBalanceScreenData() {
  const [accountsResponse, transactions] = await Promise.all([
    fetchAccounts({ page_size: 100 }),
    fetchAllTransactions(),
  ]);

  const spendingCalendar = buildSpendingCalendarGroups(transactions);
  const chart = buildInvestmentSeries(transactions, accountsResponse.items);
  const amount = accountsResponse.items
    .filter((account) => /(invest|broker|iis|накоп|сберег)/i.test(`${account.account_type} ${account.display_name}`))
    .reduce((sum, account) => sum + parseDecimal(account.current_balance), 0);

  return {
    ...investmentsBalanceScreenData,
    amount,
    chart: chart.some((item) => item.value) ? chart : investmentsBalanceScreenData.chart,
    summary: {
      ...investmentsBalanceScreenData.summary,
      remainPercent: clamp(Math.round((amount / Math.max(amount + 1, 1)) * 100), 0, 100),
      spentAmount: Math.round(
        transactions.reduce(
          (sum, transaction) => sum + getTransactionAbsAmount(transaction),
          0,
        ),
      ),
    },
    spendingCalendar: spendingCalendar.length
      ? spendingCalendar
      : spendingCalendarMockGroups,
  };
}

export async function tryLoadScreenData<T>(loader: () => Promise<T>, fallback: () => T) {
  if (!canUseBackendScreens()) {
    return fallback();
  }

  try {
    return await loader();
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) {
      return fallback();
    }

    throw error;
  }
}
