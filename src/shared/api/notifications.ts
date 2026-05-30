"use client";

import { useQuery } from "@tanstack/react-query";

import {
  notificationsScreenData,
  type NotificationIconKey,
  type NotificationItem,
  type NotificationsScreenData,
} from "@/shared/data/notifications";

import {
  fetchAgentRecommendations,
  fetchCategoriesPage,
  fetchFinancialHealthScore,
  fetchLimitsPage,
  fetchTransactions,
} from "./backend";
import { tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type NotificationsResponse = NotificationsScreenData;

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

function formatNotificationTime(date: Date) {
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function buildRecommendationNotifications(
  recommendations: Awaited<ReturnType<typeof fetchAgentRecommendations>>["items"],
): NotificationItem[] {
  return recommendations.slice(0, 3).map((item, index) => ({
    body: item.content.length > 120 ? `${item.content.slice(0, 117)}…` : item.content,
    icon: "star" as NotificationIconKey,
    id: `recommendation-${item.id ?? item.agent_key}-${index}`,
    time: formatNotificationTime(
      item.created_at ? new Date(item.created_at) : new Date(),
    ),
    title: item.title,
    unread: index === 0,
  }));
}

function buildLimitNotifications(
  categories: Awaited<ReturnType<typeof fetchCategoriesPage>>["items"],
  limits: Awaited<ReturnType<typeof fetchLimitsPage>>["items"],
  transactions: Awaited<ReturnType<typeof fetchTransactions>>["items"],
): NotificationItem[] {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return limits
    .filter((limit) => limit.is_active && limit.category_id)
    .map((limit) => {
      const category = categoriesById.get(limit.category_id as string);
      const limitAmount = parseDecimal(limit.limit_amount);
      const spent = transactions.reduce((sum, transaction) => {
        if (transaction.type !== "expense") return sum;
        if (transaction.category_id !== limit.category_id) return sum;
        return sum + Math.abs(parseDecimal(transaction.operation_amount));
      }, 0);
      const ratio = limitAmount > 0 ? spent / limitAmount : 0;

      return {
        categoryName: category?.name ?? "Категория",
        id: `limit-${limit.id}`,
        ratio,
        spent,
        limitAmount,
      };
    })
    .filter((entry) => entry.ratio >= 0.75)
    .slice(0, 3)
    .map((entry) => ({
      body: `Вы потратили ${Math.round(entry.spent).toLocaleString("ru-RU")} ₽ из ${Math.round(entry.limitAmount).toLocaleString("ru-RU")} ₽ по категории «${entry.categoryName}».`,
      icon: "wallet" as NotificationIconKey,
      id: entry.id,
      time: formatNotificationTime(new Date()),
      title: entry.ratio >= 1 ? "Лимит превышен" : "Почти достигнут лимит",
      unread: entry.ratio >= 0.9,
    }));
}

function buildRiskNotifications(
  drivers: string[],
): NotificationItem[] {
  return drivers.slice(0, 2).map((driver, index) => ({
    body: driver,
    icon: "trend" as NotificationIconKey,
    id: `risk-${index}`,
    time: formatNotificationTime(new Date()),
    title: "Риск по бюджету",
    unread: false,
  }));
}

export async function loadNotificationsScreenData(): Promise<NotificationsScreenData> {
  const [recommendations, limitsResponse, categoriesResponse, transactionsResponse, health] =
    await Promise.all([
      fetchAgentRecommendations(),
      fetchLimitsPage({ page_size: 100 }),
      fetchCategoriesPage({ page_size: 200 }),
      fetchTransactions({ page_size: 500 }),
      fetchFinancialHealthScore().catch(() => null),
    ]);

  const todayItems = [
    ...buildLimitNotifications(
      categoriesResponse.items,
      limitsResponse.items,
      transactionsResponse.items,
    ),
    ...buildRecommendationNotifications(recommendations.items),
  ];

  const yesterdayItems = buildRiskNotifications(health?.top_risk_drivers ?? []);

  if (!todayItems.length && !yesterdayItems.length) {
    return notificationsScreenData;
  }

  const sections: NotificationsScreenData["sections"] = [];

  if (todayItems.length) {
    sections.push({
      id: "today",
      items: todayItems,
      title: "Сегодня",
    });
  }

  if (yesterdayItems.length) {
    sections.push({
      id: "yesterday",
      items: yesterdayItems,
      title: "Вчера",
    });
  }

  return {
    sections,
    title: notificationsScreenData.title,
  };
}

export async function fetchNotifications(): Promise<NotificationsResponse> {
  await mockDelay();
  return tryLoadScreenData(
    loadNotificationsScreenData,
    () => notificationsScreenData,
  );
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: fetchNotifications,
  });
}
