"use client";

import { useQuery } from "@tanstack/react-query";

import {
  bankAccountDetails,
  type BankAccountDetail,
} from "@/shared/data/bank-account-detail";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type BankAccountDetailResponse = BankAccountDetail;

export async function fetchBankAccountDetail(
  accountId: string,
): Promise<BankAccountDetailResponse> {
  await mockDelay();

  const account = bankAccountDetails[accountId];

  if (!account) {
    throw new Error(`Bank account not found: ${accountId}`);
  }

  return account;
}

export function useBankAccountDetailQuery(accountId: string) {
  return useQuery({
    queryKey: queryKeys.bankAccountDetail(accountId),
    queryFn: () => fetchBankAccountDetail(accountId),
  });
}
