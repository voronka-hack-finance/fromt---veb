"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useTotalBalanceQuery, type TotalBalanceResponse } from "@/shared/api/total-balance";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";

import styles from "./load-screen.module.css";

function LoadContent({ data }: { data: TotalBalanceResponse }) {
  const primaryFilter =
    data.filters.find((filter) => filter.id === data.defaultFilterId) ?? data.filters[0];
  const scenarios = data.scenarios.slice(0, 3);

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <Link aria-label="Назад" className={styles.backButton} href="/">
              <ArrowLeft size={24} strokeWidth={1.9} />
            </Link>
            <h1 className={styles.title}>Нагрузка</h1>
            <span aria-hidden className={styles.backButton} style={{ visibility: "hidden" }} />
          </header>

          {!primaryFilter || scenarios.length === 0 ? (
            <section className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>Детализация пока недоступна</h2>
              <p className={styles.emptyText}>
                Не удалось собрать данные по нагрузке. Попробуйте открыть экран позже или
                проверьте счета и операции.
              </p>
            </section>
          ) : (
            <div className={styles.stack}>
              <section className={styles.card}>
                <p className={styles.eyebrow}>Текущий объём средств</p>
                <p className={styles.amount}>{formatCurrencyParts(primaryFilter.amount).whole} ₽</p>
                <p className={styles.subtitle}>
                  {primaryFilter.subtitle}. Ниже показано, на сколько месяцев хватит средств при
                  разных сценариях трат.
                </p>
              </section>

              <section className={styles.scenarioGrid}>
                {scenarios.map((scenario) => (
                  <article className={styles.scenarioCard} key={scenario.id}>
                    <span className={styles.scenarioTag}>{scenario.tag}</span>
                    <h2 className={styles.scenarioTitle}>Хватит на {scenario.months} мес.</h2>
                    <p className={styles.scenarioMeta}>
                      Средние траты: {formatCurrencyParts(scenario.avgSpend).whole} ₽
                    </p>
                    <p className={styles.scenarioMeta}>
                      На всех счетах: {formatCurrencyParts(scenario.allAccounts).whole} ₽
                    </p>
                  </article>
                ))}
              </section>

              <section className={styles.actions}>
                <Link className={styles.action} href="/total">
                  Всего средств
                </Link>
                <Link className={styles.action} href="/bank-accounts">
                  Счета
                </Link>
              </section>
            </div>
          )}
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function LoadScreen() {
  const query = useTotalBalanceQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка нагрузки..." query={query}>
      {(data) => <LoadContent data={data} />}
    </QueryBoundary>
  );
}
