"use client";

import { useQuery } from "@tanstack/react-query";

import { investmentsBalanceScreenData } from "@/shared/data/investments-balance";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type InvestmentsBalanceResponse = typeof investmentsBalanceScreenData;

export async function fetchInvestmentsBalance(): Promise<InvestmentsBalanceResponse> {
  await mockDelay();
  return investmentsBalanceScreenData;
}

export function useInvestmentsBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.investmentsBalance,
    queryFn: fetchInvestmentsBalance,
  });
}
