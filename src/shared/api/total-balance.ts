"use client";

import { useQuery } from "@tanstack/react-query";

import { totalBalanceScreenData } from "@/shared/data/total-balance";

import { loadTotalBalanceScreenData, tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type TotalBalanceResponse = {
  title: string;
  defaultFilterId: string;
  defaultChartIndex: number;
  filters: ReadonlyArray<{
    id: string;
    label: string;
    amount: number;
    subtitle: string;
    trend: Array<{
      month: string;
      value: number;
    }>;
  }>;
  reserveCard: {
    badge: string;
  };
  scenarios: ReadonlyArray<{
    id: string;
    tone: string;
    tag: string;
    months: number;
    avgSpend: number;
    allAccounts: number;
  }>;
  desktop: {
    title: string;
    addBank: typeof totalBalanceScreenData.desktop.addBank;
    assistant: typeof totalBalanceScreenData.desktop.assistant;
    banks: ReadonlyArray<{
      accountBadges: ReadonlyArray<string>;
      amount: number;
      bank: string;
      id: string;
      tone: "green" | "yellow" | "red" | "blue";
    }>;
    protection: typeof totalBalanceScreenData.desktop.protection;
    topBanks: ReadonlyArray<{
      amount: number;
      badge: string;
      name: string;
      tone: "green" | "yellow" | "red" | "blue";
    }>;
  };
};

export async function fetchTotalBalance(): Promise<TotalBalanceResponse> {
  await mockDelay();
  return tryLoadScreenData(
    loadTotalBalanceScreenData,
    () => totalBalanceScreenData as TotalBalanceResponse,
  ) as Promise<TotalBalanceResponse>;
}

export function useTotalBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.totalBalance,
    queryFn: fetchTotalBalance,
  });
}
