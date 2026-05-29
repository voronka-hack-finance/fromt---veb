"use client";

import { useQuery } from "@tanstack/react-query";

import { totalBalanceScreenData } from "@/shared/data/total-balance";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type TotalBalanceResponse = typeof totalBalanceScreenData;

export async function fetchTotalBalance(): Promise<TotalBalanceResponse> {
  await mockDelay();
  return totalBalanceScreenData;
}

export function useTotalBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.totalBalance,
    queryFn: fetchTotalBalance,
  });
}
