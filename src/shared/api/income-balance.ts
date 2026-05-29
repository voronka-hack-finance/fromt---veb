"use client";

import { useQuery } from "@tanstack/react-query";

import { incomeBalanceScreenData } from "@/shared/data/income-balance";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type IncomeBalanceResponse = typeof incomeBalanceScreenData;

export async function fetchIncomeBalance(): Promise<IncomeBalanceResponse> {
  await mockDelay();
  return incomeBalanceScreenData;
}

export function useIncomeBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.incomeBalance,
    queryFn: fetchIncomeBalance,
  });
}
