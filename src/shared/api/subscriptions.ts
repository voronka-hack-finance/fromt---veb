"use client";

import { useQuery } from "@tanstack/react-query";

import { subscriptionsScreenData } from "@/shared/data/subscriptions";

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

export async function fetchSubscriptions(): Promise<SubscriptionsResponse> {
  await mockDelay();
  return tryLoadScreenData(
    loadSubscriptionsScreenData,
    () => subscriptionsScreenData as SubscriptionsResponse,
  ) as Promise<SubscriptionsResponse>;
}

export function useSubscriptionsQuery() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: fetchSubscriptions,
  });
}
