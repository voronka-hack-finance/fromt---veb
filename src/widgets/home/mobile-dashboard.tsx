"use client";

import clsx from "clsx";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import { dashboardData } from "@/shared/data/dashboard";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { AssistantCard } from "./assistant-card";
import { BalanceCard } from "./balance-card";
import { BottomNav } from "./bottom-nav";
import { CategoriesCard } from "./categories-card";
import { CreditLoadCard } from "./credit-load-card";
import { ForecastCard } from "./forecast-card";
import { OperationsCard } from "./operations-card";
import { RecurringExpensesCard } from "./recurring-expenses-card";
import { IncomeStatCard, InvestmentStatCard } from "./stat-cards";
import styles from "./mobile-dashboard.module.css";

function IconButton({
  ariaLabel,
  children,
  muted,
  onClick,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx(styles.iconButton, muted && styles.iconButtonMuted)}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function MobileDashboard() {
  const router = useRouter();

  return (
    <main className={styles.stage}>
      <div className={styles.phoneFrame}>
        <div className={styles.pageGlow} />
        <div className={styles.page}>
          <Reveal delay={0.02}>
            <header className={styles.header}>
              <div className={styles.notificationWrap}>
                <IconButton ariaLabel="Уведомления" muted onClick={() => router.push("/operations")}>
                  <Bell size={22} strokeWidth={1.9} />
                </IconButton>
                <span className={styles.badge}>{dashboardData.notifications}</span>
              </div>
              <div className={styles.headerTitle}>{dashboardData.title}</div>
              <button
                aria-label="Профиль"
                className={styles.avatar}
                onClick={() => router.push("/categories")}
                type="button"
              >
                {dashboardData.avatarLabel}
              </button>
            </header>
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

        <BottomNav />
      </div>
    </main>
  );
}
