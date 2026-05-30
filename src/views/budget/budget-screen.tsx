"use client";

import {
  DashboardDataProvider,
  useDashboardQuery,
} from "@/shared/api/dashboard";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopDashboard as BudgetDashboard } from "@/widgets/home/budget-dashboard";

export function BudgetScreen() {
  const query = useDashboardQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка дашборда..." query={query}>
      {(data) => (
        <DashboardDataProvider value={data}>
          <BudgetDashboard />
        </DashboardDataProvider>
      )}
    </QueryBoundary>
  );
}
