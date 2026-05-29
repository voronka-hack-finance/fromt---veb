"use client";

import { useQuery } from "@tanstack/react-query";

import { subscriptionsScreenData } from "@/shared/data/subscriptions";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type SubscriptionsResponse = typeof subscriptionsScreenData;

export async function fetchSubscriptions(): Promise<SubscriptionsResponse> {
  await mockDelay();
  return subscriptionsScreenData;
}

export function useSubscriptionsQuery() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: fetchSubscriptions,
  });
}
