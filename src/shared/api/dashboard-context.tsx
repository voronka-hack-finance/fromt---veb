"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { spendingCalendarMockGroups } from "@/shared/data/spending-calendar";

import type { DashboardResponse } from "./dashboard";

const DashboardContext = createContext<DashboardResponse | null>(null);

type DashboardDataProviderProps = {
  children: ReactNode;
  value: DashboardResponse;
};

export function DashboardDataProvider({ children, value }: DashboardDataProviderProps) {
  const normalizedValue = useMemo(
    () => ({
      ...value,
      spendingCalendar: value.spendingCalendar?.length
        ? value.spendingCalendar
        : spendingCalendarMockGroups,
    }),
    [value],
  );

  return (
    <DashboardContext.Provider value={normalizedValue}>{children}</DashboardContext.Provider>
  );
}

export function useDashboardData() {
  const value = useContext(DashboardContext);

  if (!value) {
    throw new Error("useDashboardData must be used within DashboardDataProvider");
  }

  return value;
}

export function useOptionalDashboardData() {
  return useContext(DashboardContext);
}
