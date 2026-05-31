"use client";

import { useQuery } from "@tanstack/react-query";

import { investmentsBalanceScreenData } from "@/shared/data/investments-balance";
import { spendingCalendarMockGroups } from "@/shared/data/spending-calendar";
import type { SpendingCalendarGroup } from "@/shared/lib/spending-calendar";

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
  spendingCalendar: ReadonlyArray<SpendingCalendarGroup>;
};

function withSpendingCalendar(
  data: InvestmentsBalanceResponse,
): InvestmentsBalanceResponse {
  return {
    ...data,
    spendingCalendar: data.spendingCalendar?.length
      ? data.spendingCalendar
      : spendingCalendarMockGroups,
  };
}

export async function fetchInvestmentsBalance(): Promise<InvestmentsBalanceResponse> {
  await mockDelay();
  const data = (await tryLoadScreenData<InvestmentsBalanceResponse>(
    () => loadInvestmentsBalanceScreenData() as Promise<InvestmentsBalanceResponse>,
    () =>
      ({
        ...investmentsBalanceScreenData,
        spendingCalendar: spendingCalendarMockGroups,
      }) as InvestmentsBalanceResponse,
  )) as InvestmentsBalanceResponse;

  return withSpendingCalendar(data);
}

export function useInvestmentsBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.investmentsBalance,
    queryFn: fetchInvestmentsBalance,
  });
}
