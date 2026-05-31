import type { TransactionResponse } from "@/shared/api/backend";
import {
  getTransactionAbsAmount,
  resolveTransactionType,
} from "@/shared/api/transaction-utils";
import { formatCurrencyParts } from "@/shared/lib/formatters";

export type SpendingCalendarItem = {
  id: string;
  category: string;
  title: string;
  amount: string;
  badge: string;
};

export type SpendingCalendarGroup = {
  date: string;
  total: string;
  items: SpendingCalendarItem[];
};

function toTransactionDate(transaction: TransactionResponse) {
  const value = transaction.operation_at || transaction.payment_at;

  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDayMonthLong(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
}

function formatSpendingAmount(amount: number) {
  return `${formatCurrencyParts(Math.round(amount)).whole} ₽`;
}

export function getSpendingCalendarBadge(categoryName: string, description: string) {
  const haystack = `${categoryName} ${description}`.toLowerCase();

  if (haystack.includes("перевод") || haystack.includes("transfer")) {
    return "↔";
  }

  if (haystack.includes("яндекс") && (haystack.includes("плюс") || haystack.includes("plus"))) {
    return "Я+";
  }

  if (haystack.includes("wild") || haystack.includes("wb")) {
    return "WB";
  }

  if (
    haystack.includes("такси") ||
    haystack.includes("uber") ||
    haystack.includes("транспорт")
  ) {
    return "🚕";
  }

  if (
    haystack.includes("кафе") ||
    haystack.includes("coffee") ||
    haystack.includes("обед") ||
    haystack.includes("ресторан")
  ) {
    return "☕";
  }

  if (
    haystack.includes("супермаркет") ||
    haystack.includes("продукт") ||
    haystack.includes("market") ||
    haystack.includes("маркет") ||
    haystack.includes("магаз")
  ) {
    return "🛒";
  }

  if (haystack.includes("подписк")) {
    return "★";
  }

  const normalized = description.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, " ").trim();
  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    const first = words[0]?.[0] ?? "";
    const second = words[1]?.[0] ?? "";

    if (first && second) {
      return `${first}${second}`.toUpperCase();
    }
  }

  if (normalized.length >= 2) {
    return normalized.slice(0, 2).toUpperCase();
  }

  return "●";
}

type BuildSpendingCalendarOptions = {
  expenseOnly?: boolean;
  maxDays?: number;
  maxItemsPerDay?: number;
  maxTotalItems?: number;
};

export function buildSpendingCalendarGroups(
  transactions: TransactionResponse[],
  options: BuildSpendingCalendarOptions = {},
) {
  const { maxDays, maxItemsPerDay, maxTotalItems } = options;
  const expenseOnly = options.expenseOnly ?? true;

  const sorted = [...transactions].sort((left, right) => {
    const leftTime = toTransactionDate(left)?.getTime() ?? 0;
    const rightTime = toTransactionDate(right)?.getTime() ?? 0;
    return rightTime - leftTime;
  });

  const filtered = expenseOnly
    ? sorted.filter((transaction) => resolveTransactionType(transaction) === "expense")
    : sorted;

  const groupMap = new Map<string, SpendingCalendarGroup & { totalValue: number }>();
  const order: string[] = [];
  let itemCount = 0;

  filtered.forEach((transaction) => {
    if (maxTotalItems !== undefined && itemCount >= maxTotalItems) {
      return;
    }

    const date = toTransactionDate(transaction);
    const dateLabel = date ? formatDayMonthLong(date) : "Без даты";
    let group = groupMap.get(dateLabel);

    if (!group) {
      if (maxDays !== undefined && order.length >= maxDays) {
        return;
      }

      group = { date: dateLabel, items: [], total: "0 ₽", totalValue: 0 };
      groupMap.set(dateLabel, group);
      order.push(dateLabel);
    }

    if (maxItemsPerDay !== undefined && group.items.length >= maxItemsPerDay) {
      return;
    }

    const categoryName = transaction.category_name || "Расходы";
    const title = transaction.description?.trim() || categoryName || "Операция";
    const amountValue = getTransactionAbsAmount(transaction);

    group.items.push({
      amount: formatSpendingAmount(amountValue),
      badge: getSpendingCalendarBadge(categoryName, title),
      category: categoryName,
      id: transaction.id,
      title,
    });
    group.totalValue += amountValue;
    itemCount += 1;
  });

  return order.map((dateLabel) => {
    const group = groupMap.get(dateLabel)!;

    return {
      date: group.date,
      items: group.items,
      total: formatSpendingAmount(group.totalValue),
    };
  });
}
