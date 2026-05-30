"use client";

import { useQuery } from "@tanstack/react-query";

import { creditLoadScreenData } from "@/shared/data/credit-load";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type CreditLoadResponse = {
  title: string;
  summary: {
    perMonth: number;
    totalDebt: number;
    nextPaymentLabel: string;
    nextPaymentDate: string;
  };
  debtIndicator: {
    percent: number;
    label: string;
  };
  loans: ReadonlyArray<{
    id: string;
    title: string;
    bank: string;
    rate: string;
    bankIcon: string;
    paidPercent: number;
    perMonth: number;
    remaining: number;
  }>;
};

export async function fetchCreditLoad(): Promise<CreditLoadResponse> {
  await mockDelay();
  return creditLoadScreenData as CreditLoadResponse;
}

export function useCreditLoadQuery() {
  return useQuery({
    queryKey: queryKeys.creditLoad,
    queryFn: fetchCreditLoad,
  });
}
