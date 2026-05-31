"use client";

import { useQuery } from "@tanstack/react-query";

import { subscriptionsScreenData } from "@/shared/data/subscriptions";
import { loadManualSubscriptions } from "@/shared/lib/manual-subscriptions";

import { loadSubscriptionsScreenData, tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type SubscriptionsResponse = {
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
  subscriptions: ReadonlyArray<{
    id: string;
    name: string;
    months: number;
    monthlyPrice: number;
    totalSpent: number;
    status: "active" | "paused";
    icon: string;
  }>;
};

function withManualSubscriptions(data: SubscriptionsResponse): SubscriptionsResponse {
  const manualSubscriptions = loadManualSubscriptions();

  if (!manualSubscriptions.length) {
    return data;
  }

  const inferredIds = new Set(data.subscriptions.map((subscription) => subscription.id));
  const mergedSubscriptions = [
    ...manualSubscriptions.filter((subscription) => !inferredIds.has(subscription.id)),
    ...data.subscriptions,
  ];
  const activeSubscriptions = mergedSubscriptions.filter((subscription) => subscription.status === "active");
  const pausedSubscriptions = mergedSubscriptions.filter((subscription) => subscription.status === "paused");

  return {
    ...data,
    subscriptions: mergedSubscriptions,
    summary: {
      ...data.summary,
      perMonth: activeSubscriptions.reduce((sum, subscription) => sum + subscription.monthlyPrice, 0),
      totalSpent: mergedSubscriptions.reduce((sum, subscription) => sum + subscription.totalSpent, 0),
    },
    tabs: data.tabs.map((tab) => {
      if (tab.id === "all") {
        return { ...tab, count: mergedSubscriptions.length };
      }

      if (tab.id === "active") {
        return { ...tab, count: activeSubscriptions.length };
      }

      return { ...tab, count: pausedSubscriptions.length };
    }),
  };
}

export async function fetchSubscriptions(): Promise<SubscriptionsResponse> {
  await mockDelay();
  const data = (await tryLoadScreenData(
    loadSubscriptionsScreenData,
    () => subscriptionsScreenData as SubscriptionsResponse,
  )) as SubscriptionsResponse;

  return withManualSubscriptions(data);
}

export function useSubscriptionsQuery() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: fetchSubscriptions,
  });
}
