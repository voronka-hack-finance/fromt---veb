"use client";

import { useQuery } from "@tanstack/react-query";

import { subscriptionsScreenData } from "@/shared/data/subscriptions";
import {
  loadSubscriptionsFromBackend,
  type SubscriptionsScreenPayload,
} from "@/shared/lib/regular-expenses";

import { tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type SubscriptionsResponse = SubscriptionsScreenPayload;

export async function fetchSubscriptions(): Promise<SubscriptionsResponse> {
  await mockDelay();

  return tryLoadScreenData(
    loadSubscriptionsFromBackend,
    () => subscriptionsScreenData as unknown as SubscriptionsResponse,
  );
}

export function useSubscriptionsQuery() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: fetchSubscriptions,
  });
}
