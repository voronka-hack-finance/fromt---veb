"use client";

import { useQuery } from "@tanstack/react-query";

import { investmentsBalanceScreenData } from "@/shared/data/investments-balance";

import {
  loadInvestmentsBalanceScreenData,
  tryLoadScreenData,
} from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type InvestmentsBalanceResponse = {
  title: string;
  amount: number;
  chart: ReadonlyArray<{
    month: string;
    value: number;
    tone: string;
    label?: string;
    labelValue?: number;
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
    spent: number;
    left: number;
    totalIncome: number;
  }>;
};

export async function fetchInvestmentsBalance(): Promise<InvestmentsBalanceResponse> {
  await mockDelay();
  return tryLoadScreenData<InvestmentsBalanceResponse>(
    () => loadInvestmentsBalanceScreenData() as Promise<InvestmentsBalanceResponse>,
    () => investmentsBalanceScreenData as InvestmentsBalanceResponse,
  ) as Promise<InvestmentsBalanceResponse>;
}

export function useInvestmentsBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.investmentsBalance,
    queryFn: fetchInvestmentsBalance,
  });
}
