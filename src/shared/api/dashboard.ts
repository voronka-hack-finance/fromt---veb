"use client";

import { useQuery } from "@tanstack/react-query";

import {
  bankAccounts,
  categoryRadarMetrics,
  dashboardData,
  forecastPoints,
  forecastYearPoints,
} from "@/shared/data/dashboard";
import type { BankAccount, ForecastPoint } from "@/shared/types/dashboard";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type DashboardResponse = {
  bankAccounts: BankAccount[];
  categoryRadarMetrics: typeof categoryRadarMetrics;
  dashboard: typeof dashboardData;
  forecastPoints: ForecastPoint[];
  forecastYearPoints: ForecastPoint[];
};

export async function fetchDashboard(): Promise<DashboardResponse> {
  await mockDelay();

  return {
    bankAccounts,
    categoryRadarMetrics,
    dashboard: dashboardData,
    forecastPoints,
    forecastYearPoints,
  };
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
