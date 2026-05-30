"use client";

import { useQuery } from "@tanstack/react-query";

import { bankAccountsScreenData } from "@/shared/data/bank-accounts";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type BankAccountItem = {
  id: string;
  bankIcon: string;
  cardLast4?: string;
  balance: number;
  accountSuffix: string;
  compactAmount?: boolean;
};

export type BankAccountsSection = {
  id: string;
  title: string;
  accounts: ReadonlyArray<BankAccountItem>;
};

export type BankAccountsResponse = {
  title: string;
  sections: ReadonlyArray<BankAccountsSection>;
};

export async function fetchBankAccounts(): Promise<BankAccountsResponse> {
  await mockDelay();
  return bankAccountsScreenData as BankAccountsResponse;
}

export function useBankAccountsQuery() {
  return useQuery({
    queryKey: queryKeys.bankAccounts,
    queryFn: fetchBankAccounts,
  });
}
