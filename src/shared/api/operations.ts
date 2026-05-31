"use client";

import { useQuery } from "@tanstack/react-query";

import { operationsBarsData } from "@/shared/data/operations-bars";
import { operationsScreenData } from "@/shared/data/operations";
import { operationsTrendsData } from "@/shared/data/operations-trends";

import {
  loadOperationsBarsScreenData,
  loadOperationsScreenData,
  loadOperationsTrendsScreenData,
  tryLoadScreenData,
} from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type OperationsScreenResponse = {
  title: string;
  periodTabs: readonly ["Нед", "Мес", "Год"];
  activePeriod: "Мес";
  monthLabel: string;
  monthLabels: readonly string[];
  defaultMonthIndex: number;
  periodNavigator: typeof operationsScreenData.periodNavigator;
  totalAmount: number;
  breakdown: ReadonlyArray<{
    id: string;
    label: string;
    percent: number;
    color: string;
  }>;
  breakdownByPeriod: Record<
    "Нед" | "Мес" | "Год",
    {
      total: number;
      items: ReadonlyArray<{
        id: string;
        label: string;
        percent: number;
        color: string;
      }>;
    }
  >;
  bubblePositionById: Record<string, string>;
  yesterday: {
    label: string;
    total: number;
  };
  operationGroups?: ReadonlyArray<{
    label: string;
    total: number;
    operations: OperationsScreenResponse["operations"];
  }>;
  operations: ReadonlyArray<{
    id: string;
    category: string;
    title: string;
    bank: string;
    bankTone: "soft" | "warn" | "danger";
    amount: number;
    direction: "income" | "outcome";
    iconTone: "neutral" | "accent" | "success";
    icon: "education" | "bag" | "bank" | "wifi" | "income";
  }>;
};

export type OperationsTrendsResponse = {
  title: string;
  periodTabs: readonly ["Нед", "Мес", "Год"];
  activePeriod: "Мес";
  chartMode: "trend";
  byPeriod: Record<
    "Нед" | "Мес" | "Год",
    {
      spendScale: [number, number, number];
      bars: ReadonlyArray<{
        day: string;
        value: number;
        height?: number;
        tone: "muted" | "active";
      }>;
      lineValues: number[];
      defaultActiveIndex: number;
      insight: {
        percent: number;
        amount: number;
        date: string;
        text: string;
      };
    }
  >;
};

export type OperationsBarsResponse = {
  title: string;
  periodTabs: readonly ["Нед", "Мес", "Год"];
  activePeriod: "Мес";
  chartMode: "bars";
  byPeriod: Record<
    "Нед" | "Мес" | "Год",
    ReadonlyArray<{
      label: string;
      height: number;
      tone: "green" | "dark" | "green-deep" | "muted";
    }>
  >;
};

export async function fetchOperationsScreen(): Promise<OperationsScreenResponse> {
  await mockDelay();
  return tryLoadScreenData<OperationsScreenResponse>(
    () => loadOperationsScreenData() as Promise<OperationsScreenResponse>,
    () => operationsScreenData as OperationsScreenResponse,
  ) as Promise<OperationsScreenResponse>;
}

export async function fetchOperationsTrends(): Promise<OperationsTrendsResponse> {
  await mockDelay();
  return tryLoadScreenData<OperationsTrendsResponse>(
    () => loadOperationsTrendsScreenData() as Promise<OperationsTrendsResponse>,
    () => operationsTrendsData as OperationsTrendsResponse,
  ) as Promise<OperationsTrendsResponse>;
}

export async function fetchOperationsBars(): Promise<OperationsBarsResponse> {
  await mockDelay();
  return tryLoadScreenData<OperationsBarsResponse>(
    () => loadOperationsBarsScreenData() as Promise<OperationsBarsResponse>,
    () => operationsBarsData as OperationsBarsResponse,
  ) as Promise<OperationsBarsResponse>;
}

export function useOperationsScreenQuery() {
  return useQuery({
    queryKey: queryKeys.operations.screen,
    queryFn: fetchOperationsScreen,
  });
}

export function useOperationsTrendsQuery() {
  return useQuery({
    queryKey: queryKeys.operations.trends,
    queryFn: fetchOperationsTrends,
  });
}

export function useOperationsBarsQuery() {
  return useQuery({
    queryKey: queryKeys.operations.bars,
    queryFn: fetchOperationsBars,
  });
}
