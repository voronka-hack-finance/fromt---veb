import {
  createRegularExpense,
  deleteRegularExpense,
  fetchRegularExpense,
  fetchRegularExpensesPage,
  updateRegularExpense,
  type RegularExpenseCreateRequest,
  type RegularExpenseResponse,
  type RegularExpenseUpdateRequest,
} from "@/shared/api/backend";
import { parseTransactionDecimal } from "@/shared/api/transaction-utils";
import {
  subscriptionCategoryIcon,
  subscriptionsScreenData,
} from "@/shared/data/subscriptions";

const SUBSCRIPTION_ICON_MATCHERS = [
  { keyword: "vk", icon: subscriptionCategoryIcon },
  { keyword: "music", icon: subscriptionCategoryIcon },
  { keyword: "янд", icon: subscriptionCategoryIcon },
  { keyword: "yandex", icon: subscriptionCategoryIcon },
  { keyword: "cloud", icon: subscriptionCategoryIcon },
  { keyword: "mts", icon: subscriptionCategoryIcon },
  { keyword: "premium", icon: subscriptionCategoryIcon },
  { keyword: "netflix", icon: subscriptionCategoryIcon },
] as const;

export type SubscriptionListItem = {
  id: string;
  name: string;
  months: number;
  monthlyPrice: number;
  totalSpent: number;
  status: "active" | "paused";
  icon: string;
  sourceType: string;
  nextExpectedAt?: string | null;
};

export type SubscriptionsScreenPayload = {
  title: string;
  summary: {
    perMonth: number;
    totalSpent: number;
    nextChargeLabel: string;
    nextChargeDate: string;
  };
  tabs: ReadonlyArray<{
    id: "all" | "active" | "paused";
    label: string;
    count: number;
  }>;
  subscriptions: ReadonlyArray<SubscriptionListItem>;
};

function getSubscriptionIcon(name: string) {
  const haystack = name.toLowerCase();

  return (
    SUBSCRIPTION_ICON_MATCHERS.find(({ keyword }) => haystack.includes(keyword))?.icon ??
    subscriptionCategoryIcon
  );
}

function getMonthlyPrice(expense: RegularExpenseResponse) {
  const amount = expense.expected_amount ?? expense.average_amount;

  return Math.max(0, Math.round(parseTransactionDecimal(amount)));
}

function getSubscriptionMonths(expense: RegularExpenseResponse) {
  const createdAt = new Date(expense.created_at);
  const now = Date.now();

  if (Number.isNaN(createdAt.getTime())) {
    return 1;
  }

  const elapsedDays = Math.max(
    1,
    Math.floor((now - createdAt.getTime()) / (24 * 60 * 60 * 1000)),
  );
  const frequencyDays = Math.max(expense.frequency_days || 30, 1);

  return Math.max(1, Math.round(elapsedDays / frequencyDays));
}

function normalizeSubscriptionStatus(status: string): SubscriptionListItem["status"] {
  return status === "paused" ? "paused" : "active";
}

export function mapRegularExpenseToSubscription(
  expense: RegularExpenseResponse,
): SubscriptionListItem {
  const monthlyPrice = getMonthlyPrice(expense);
  const months = getSubscriptionMonths(expense);

  return {
    icon: getSubscriptionIcon(expense.merchant_pattern),
    id: expense.id,
    monthlyPrice,
    months,
    name: expense.merchant_pattern,
    nextExpectedAt: expense.next_expected_at,
    sourceType: expense.source_type,
    status: normalizeSubscriptionStatus(expense.status),
    totalSpent: monthlyPrice * months,
  };
}

function formatChargeDate(value: string | null | undefined) {
  if (!value) {
    return subscriptionsScreenData.summary.nextChargeDate;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return subscriptionsScreenData.summary.nextChargeDate;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function buildSubscriptionsScreenPayload(
  subscriptions: SubscriptionListItem[],
): SubscriptionsScreenPayload {
  const activeSubscriptions = subscriptions.filter((item) => item.status === "active");
  const pausedSubscriptions = subscriptions.filter((item) => item.status === "paused");
  const nearestCharge = activeSubscriptions
    .map((item) => item.nextExpectedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => ({ date: new Date(value), raw: value }))
    .filter((item) => !Number.isNaN(item.date.getTime()))
    .sort((left, right) => left.date.getTime() - right.date.getTime())[0];
  const nextChargeDate = nearestCharge
    ? formatChargeDate(nearestCharge.raw)
    : subscriptionsScreenData.summary.nextChargeDate;

  return {
    ...subscriptionsScreenData,
    subscriptions,
    summary: {
      nextChargeDate,
      nextChargeLabel: subscriptionsScreenData.summary.nextChargeLabel,
      perMonth: Math.round(
        activeSubscriptions.reduce((sum, item) => sum + item.monthlyPrice, 0),
      ),
      totalSpent: Math.round(
        subscriptions.reduce((sum, item) => sum + item.totalSpent, 0),
      ),
    },
    tabs: [
      {
        count: subscriptions.length,
        id: "all",
        label: subscriptionsScreenData.tabs[0].label,
      },
      {
        count: activeSubscriptions.length,
        id: "active",
        label: subscriptionsScreenData.tabs[1].label,
      },
      {
        count: pausedSubscriptions.length,
        id: "paused",
        label: subscriptionsScreenData.tabs[2].label,
      },
    ],
  };
}

export async function loadSubscriptionsFromBackend(): Promise<SubscriptionsScreenPayload> {
  const response = await fetchRegularExpensesPage({ page_size: 100 });
  const subscriptions = response.items
    .filter((item) => item.status !== "deleted")
    .map(mapRegularExpenseToSubscription);

  return buildSubscriptionsScreenPayload(subscriptions);
}

export async function loadRegularExpenseDetail(expenseId: string) {
  const expense = await fetchRegularExpense(expenseId);

  return mapRegularExpenseToSubscription(expense);
}

export async function createRegularExpenseOnBackend(input: {
  name: string;
  monthlyPrice: number;
  status?: "active" | "paused";
}) {
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    throw new Error("Regular expense name is required");
  }

  const payload: RegularExpenseCreateRequest = {
    currency: "RUB",
    expected_amount: String(Math.max(1, input.monthlyPrice)),
    frequency_days: 30,
    merchant_pattern: trimmedName,
    source_type: "manual",
    status: input.status ?? "active",
  };

  return createRegularExpense(payload);
}

export async function updateRegularExpenseOnBackend(
  expenseId: string,
  input: {
    name?: string;
    monthlyPrice?: number;
    status?: "active" | "paused";
  },
) {
  const payload: RegularExpenseUpdateRequest = {};

  if (input.name !== undefined) {
    payload.merchant_pattern = input.name.trim() || null;
  }

  if (input.monthlyPrice !== undefined) {
    payload.expected_amount = String(Math.max(1, input.monthlyPrice));
  }

  if (input.status !== undefined) {
    payload.status = input.status;
    payload.source_type = "user_adjusted";
  }

  return updateRegularExpense(expenseId, payload);
}

export async function deleteRegularExpenseOnBackend(expenseId: string) {
  return deleteRegularExpense(expenseId);
}

export function buildRecurringExpensesSummary(subscriptions: SubscriptionListItem[]) {
  const activeSubscriptions = subscriptions.filter((item) => item.status === "active");

  return {
    categories: `${subscriptions.length} ${subscriptions.length === 1 ? "категория" : subscriptions.length < 5 ? "категории" : "категорий"}`,
    total: `${Math.round(
      activeSubscriptions.reduce((sum, item) => sum + item.monthlyPrice, 0),
    )} ₽`,
  };
}
