"use client";

import {
  DashboardDataProvider,
  useDashboardQuery,
} from "@/shared/api/dashboard";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { AppTopBar } from "./app-top-bar";
import { AssistantCard } from "./assistant-card";
import { BalanceCard } from "./balance-card";
import { CategoriesCard } from "./categories-card";
import { CreditLoadCard } from "./credit-load-card";
import { DesktopDashboard } from "./desktop-dashboard";
import { ForecastCard } from "./forecast-card";
import { OperationsCard } from "./operations-card";
import { RecurringExpensesCard } from "./recurring-expenses-card";
import { IncomeStatCard, InvestmentStatCard } from "./stat-cards";
import styles from "./mobile-dashboard.module.css";

function MobileDashboardContent() {
  return (
    <main className={styles.stage}>
      <div className={styles.desktopShell}>
        <DesktopDashboard />
      </div>

      <div className={styles.mobileShell}>
        <div className={styles.phoneFrame}>
          <div className={styles.pageGlow} />
          <div className={styles.page}>
            <Reveal delay={0.02}>
              <AppTopBar lowercaseTitle />
            </Reveal>

            <div className={styles.sections}>
              <Reveal delay={0.05}>
                <BalanceCard />
              </Reveal>

              <Reveal delay={0.08}>
                <AssistantCard />
              </Reveal>

              <div className={styles.metricsGrid}>
                <Reveal delay={0.11} className={styles.gridSpanWide}>
                  <OperationsCard />
                </Reveal>

                <Reveal delay={0.14}>
                  <InvestmentStatCard />
                </Reveal>

                <Reveal delay={0.17}>
                  <IncomeStatCard />
                </Reveal>
              </div>

              <Reveal delay={0.19}>
                <RecurringExpensesCard />
              </Reveal>

              <Reveal delay={0.23}>
                <ForecastCard />
              </Reveal>

              <Reveal delay={0.26}>
                <CreditLoadCard />
              </Reveal>

              <Reveal delay={0.29}>
                <CategoriesCard />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function MobileDashboard() {
  const query = useDashboardQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка дашборда..." query={query}>
      {(data) => (
        <DashboardDataProvider value={data}>
          <MobileDashboardContent />
        </DashboardDataProvider>
      )}
    </QueryBoundary>
  );
}
