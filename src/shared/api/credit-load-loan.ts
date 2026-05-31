"use client";

import { useQuery } from "@tanstack/react-query";

import {
  creditLoadLoanDetails,
  type CreditLoadLoanDetail,
} from "@/shared/data/credit-load-loans";

import { fetchDebt } from "./backend";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type CreditLoadLoanDetailResponse = CreditLoadLoanDetail;

function parseDecimal(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getBankIdFromText(source: string) {
  const normalized = source.toLowerCase();

  if (normalized.includes("sber") || normalized.includes("сбер")) return "sber";
  if (normalized.includes("t-bank") || normalized.includes("тин") || normalized.includes("tink")) return "tbank";
  if (normalized.includes("альф") || normalized.includes("alfa")) return "alfa";

  return "default";
}

function getBankLogoMeta(source: string) {
  const bankId = getBankIdFromText(source);

  if (bankId === "sber") {
    return { bankLogo: "/credit-load/sberbank-logo.png", bankLogoHeight: 28, bankLogoWidth: 180 };
  }

  if (bankId === "tbank") {
    return { bankLogo: "/credit-load/tbank.png", bankLogoHeight: 28, bankLogoWidth: 120 };
  }

  if (bankId === "alfa") {
    return { bankLogo: "/credit-load/icon-alfa.svg", bankLogoHeight: 28, bankLogoWidth: 120 };
  }

  return { bankLogo: "/bank-accounts/icons/sber.svg", bankLogoHeight: 24, bankLogoWidth: 24 };
}

function formatInterestRate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return value;
  }

  return `${parsed.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  })}%`;
}

function formatRemainingDuration(remainingBalance: number, monthlyPayment: number) {
  if (remainingBalance <= 0 || monthlyPayment <= 0) {
    return "—";
  }

  const totalMonths = Math.ceil(remainingBalance / monthlyPayment);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} г. ${months} мес.`;
  }

  if (years > 0) {
    return `${years} г.`;
  }

  return `${Math.max(totalMonths, 1)} мес.`;
}

function getPaidPercent(remainingBalance: number, monthlyPayment: number, creditLimit: number) {
  if (creditLimit > 0) {
    return clamp(Math.round(((creditLimit - remainingBalance) / creditLimit) * 100), 0, 100);
  }

  if (monthlyPayment > 0 && remainingBalance > 0) {
    const estimatedTotal = remainingBalance + monthlyPayment * 12;
    return clamp(Math.round(((estimatedTotal - remainingBalance) / estimatedTotal) * 100), 5, 95);
  }

  return 0;
}

export async function fetchCreditLoadLoan(
  loanId: string,
): Promise<CreditLoadLoanDetailResponse> {
  await mockDelay();

  try {
    const debt = await fetchDebt(loanId);
    const remainingBalance = Math.round(parseDecimal(debt.remaining_balance));
    const monthlyPayment = Math.round(parseDecimal(debt.monthly_payment));
    const creditLimit = parseDecimal(debt.credit_limit);
    const logo = getBankLogoMeta(`${debt.title} ${debt.description ?? ""}`);

    return {
      annualRate: formatInterestRate(debt.interest_rate),
      bankLogo: logo.bankLogo,
      bankLogoHeight: logo.bankLogoHeight,
      bankLogoWidth: logo.bankLogoWidth,
      id: debt.id,
      monthlyPayment,
      paidPercent: getPaidPercent(remainingBalance, monthlyPayment, creditLimit),
      remainingBalance,
      remainingDuration: formatRemainingDuration(remainingBalance, monthlyPayment),
      title: debt.title,
    };
  } catch {
    const loan = creditLoadLoanDetails[loanId];

    if (!loan) {
      throw new Error(`Loan not found: ${loanId}`);
    }

    return loan;
  }
}

export function useCreditLoadLoanQuery(loanId: string) {
  return useQuery({
    queryKey: queryKeys.creditLoadLoan(loanId),
    queryFn: () => fetchCreditLoadLoan(loanId),
  });
}
