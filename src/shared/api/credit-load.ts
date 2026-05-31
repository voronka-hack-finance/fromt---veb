"use client";

import { useQuery } from "@tanstack/react-query";

import {
  creditLoadScreenData,
  type CreditLoadPaymentIcon,
  type CreditLoadUpcomingPayment,
} from "@/shared/data/credit-load";

import { fetchDebtsPage, type DebtResponse } from "./backend";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type CreditLoadResponse = {
  title: string;
  calendar: {
    year: number;
    month: number;
    selectedDay: number;
    paymentDays: number[];
  };
  upcomingPayments: ReadonlyArray<CreditLoadPaymentItem>;
};

export type CreditLoadPaymentItem = CreditLoadUpcomingPayment & {
  debtId?: string;
};

export type { CreditLoadPaymentIcon, CreditLoadUpcomingPayment };

function toCreditLoadResponse(
  data: typeof creditLoadScreenData,
): CreditLoadResponse {
  return {
    calendar: {
      month: data.calendar.month,
      paymentDays: [...data.calendar.paymentDays],
      selectedDay: data.calendar.selectedDay,
      year: data.calendar.year,
    },
    title: data.title,
    upcomingPayments: data.upcomingPayments.map((payment) => ({ ...payment, debtId: undefined })),
  };
}

function parseDecimal(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDayMonthLong(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

function resolvePaymentIcon(title: string): CreditLoadPaymentIcon {
  const haystack = title.toLowerCase();

  if (haystack.includes("обуч") || haystack.includes("edu") || haystack.includes("универ")) {
    return "education";
  }

  if (haystack.includes("yandex") || haystack.includes("янд")) {
    return "yandex";
  }

  if (haystack.includes("vk") || haystack.includes("вк")) {
    return "vk";
  }

  if (haystack.includes("mts") || haystack.includes("мтс")) {
    return "mts";
  }

  return "generic";
}

function getNextPaymentDate(paymentDay: number | null | undefined, now = new Date()) {
  const day = paymentDay && paymentDay >= 1 && paymentDay <= 31 ? paymentDay : 1;
  const candidate = new Date(now.getFullYear(), now.getMonth(), day);

  if (candidate < now) {
    return new Date(now.getFullYear(), now.getMonth() + 1, day);
  }

  return candidate;
}

function mapDebtToUpcomingPayment(debt: DebtResponse) {
  const nextPaymentDate = getNextPaymentDate(debt.payment_day);
  const amount = Math.round(
    parseDecimal(debt.monthly_payment) || parseDecimal(debt.remaining_balance),
  );

  return {
    amount,
    dateLabel: formatDayMonthLong(nextPaymentDate),
    debtId: debt.id,
    icon: resolvePaymentIcon(debt.title),
    id: debt.id,
    paymentDay: nextPaymentDate.getDate(),
    title: debt.title,
  } satisfies CreditLoadUpcomingPayment;
}

export async function fetchCreditLoad(): Promise<CreditLoadResponse> {
  await mockDelay();

  try {
    const debts = await fetchDebtsPage({ page_size: 100, status: "active" });
    const upcomingPayments = debts.items
      .map(mapDebtToUpcomingPayment)
      .sort((left, right) => left.paymentDay - right.paymentDay);

    if (!upcomingPayments.length) {
      return toCreditLoadResponse(creditLoadScreenData);
    }

    const referenceDate = getNextPaymentDate(debts.items[0]?.payment_day);

    return {
      calendar: {
        month: referenceDate.getMonth(),
        paymentDays: [...new Set(upcomingPayments.map((payment) => payment.paymentDay))],
        selectedDay: upcomingPayments[0]?.paymentDay ?? referenceDate.getDate(),
        year: referenceDate.getFullYear(),
      },
      title: creditLoadScreenData.title,
      upcomingPayments,
    };
  } catch {
    return toCreditLoadResponse(creditLoadScreenData);
  }
}

export function useCreditLoadQuery() {
  return useQuery({
    queryKey: queryKeys.creditLoad,
    queryFn: fetchCreditLoad,
  });
}
