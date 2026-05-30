"use client";

import { useQuery } from "@tanstack/react-query";

import {
  creditLoadScreenData,
  type CreditLoadPaymentIcon,
  type CreditLoadUpcomingPayment,
} from "@/shared/data/credit-load";

import { loadCreditLoadScreenData } from "./backend-entity-loaders";
import { tryLoadScreenData } from "./backend-screen-data";
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
  upcomingPayments: ReadonlyArray<CreditLoadUpcomingPayment>;
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
    upcomingPayments: data.upcomingPayments.map((payment) => ({ ...payment })),
  };
}

export async function fetchCreditLoad(): Promise<CreditLoadResponse> {
  await mockDelay();
  return tryLoadScreenData(loadCreditLoadScreenData, () =>
    toCreditLoadResponse(creditLoadScreenData),
  );
}

export function useCreditLoadQuery() {
  return useQuery({
    queryKey: queryKeys.creditLoad,
    queryFn: fetchCreditLoad,
  });
}
