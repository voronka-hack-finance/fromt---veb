"use client";

import { useQuery } from "@tanstack/react-query";

import { incomeBalanceScreenData } from "@/shared/data/income-balance";

import { loadIncomeBalanceScreenData, tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type IncomeBalanceResponse = {
  title: string;
  amount: number;
  subtitle: string;
  filters: ReadonlyArray<{
    id: string;
    label: string;
  }>;
  trend: ReadonlyArray<{
    month: string;
    value: number;
  }>;
  summary: {
    remainPercent: number;
    spentAmount: number;
    badge: string;
  };
  scenarios: ReadonlyArray<{
    id: string;
    tone: string;
    tag: string;
    percentLabel: string;
    invested: number;
    totalIncome: number;
  }>;
};

export async function fetchIncomeBalance(): Promise<IncomeBalanceResponse> {
  await mockDelay();
  return tryLoadScreenData(
    loadIncomeBalanceScreenData,
    () => incomeBalanceScreenData as IncomeBalanceResponse,
  ) as Promise<IncomeBalanceResponse>;
}

export function useIncomeBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.incomeBalance,
    queryFn: fetchIncomeBalance,
  });
}
