"use client";

import { useQuery } from "@tanstack/react-query";

import {
  bankAccounts,
  categoryRadarMetrics,
  dashboardData,
  desktopForecastPoints,
  forecastPoints,
  forecastYearPoints,
} from "@/shared/data/dashboard";
import type { BankAccount, ForecastPoint } from "@/shared/types/dashboard";

import { tryLoadScreenData, loadDashboardScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type DashboardResponse = {
  bankAccounts: ReadonlyArray<BankAccount>;
  categoryRadarMetrics: ReadonlyArray<{
    id: string;
    label: string;
    percent: number;
  }>;
  dashboard: {
    notifications: number;
    title: string;
    totalBalance: number;
    assistantText: string;
    receipts: number;
    expenses: number;
    investmentGrowth: string;
    investmentPercent: number;
    incomeRemainder: number;
    recurringExpenses: {
      total: string;
      categories: string;
    };
    forecastPercent: number;
    forecastTooltip: number;
    creditScore: number;
    creditMax: number;
    creditLabel: string;
    betterThanUsers: number;
  };
  desktopForecastPoints: ReadonlyArray<ForecastPoint>;
  forecastPoints: ReadonlyArray<ForecastPoint>;
  forecastYearPoints: ReadonlyArray<ForecastPoint>;
};

export async function fetchDashboard(): Promise<DashboardResponse> {
  await mockDelay();
  return tryLoadScreenData(loadDashboardScreenData, () => ({
    bankAccounts,
    categoryRadarMetrics,
    dashboard: dashboardData,
    desktopForecastPoints,
    forecastPoints,
    forecastYearPoints,
  } as DashboardResponse)) as Promise<DashboardResponse>;
}

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
  });
}

export {
  DashboardDataProvider,
  useDashboardData,
  useOptionalDashboardData,
} from "./dashboard-context";
