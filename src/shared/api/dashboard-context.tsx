"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { DashboardResponse } from "./dashboard";

const DashboardContext = createContext<DashboardResponse | null>(null);

type DashboardDataProviderProps = {
  children: ReactNode;
  value: DashboardResponse;
};

export function DashboardDataProvider({ children, value }: DashboardDataProviderProps) {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
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
