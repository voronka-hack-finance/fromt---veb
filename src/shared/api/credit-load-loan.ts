"use client";

import { useQuery } from "@tanstack/react-query";

import {
  creditLoadLoanDetails,
  type CreditLoadLoanDetail,
} from "@/shared/data/credit-load-loans";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type CreditLoadLoanDetailResponse = CreditLoadLoanDetail;

export async function fetchCreditLoadLoan(
  loanId: string,
): Promise<CreditLoadLoanDetailResponse> {
  await mockDelay();

  const loan = creditLoadLoanDetails[loanId];

  if (!loan) {
    throw new Error(`Loan not found: ${loanId}`);
  }

  return loan;
}

export function useCreditLoadLoanQuery(loanId: string) {
  return useQuery({
    queryKey: queryKeys.creditLoadLoan(loanId),
    queryFn: () => fetchCreditLoadLoan(loanId),
  });
}
