"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";

import { useCreditLoadQuery, type CreditLoadResponse } from "@/shared/api/credit-load";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { ChartContainer } from "./chart-container";
import styles from "./credit-load-screen.module.css";

const assets = {
  summaryBg: "/credit-load/summary-bg.svg",
  bankDot: "/dashboard/balance/divider-dot-sber.svg",
} as const;

function formatRubles(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole}₽`;
}

function LoanCard({
  bank,
  bankIcon,
  id,
  paidPercent,
  perMonth,
  rate,
  remaining,
  title,
}: CreditLoadResponse["loans"][number]) {
  return (
    <article className={styles.loanCard}>
      <div className={styles.loanHeader}>
        <div className={styles.loanMeta}>
          <h3 className={styles.loanTitle}>{title}</h3>
          <div className={styles.bankTag}>
            <img alt="" aria-hidden className={styles.bankIcon} draggable={false} src={bankIcon} />
            <div className={styles.bankInfo}>
              <span>{bank}</span>
              <img alt="" aria-hidden className={styles.bankDot} draggable={false} src={assets.bankDot} />
              <span>{rate}</span>
            </div>
          </div>
        </div>

        <Link
          aria-label={`Подробнее: ${title}`}
          className={styles.detailButton}
          href={`/credit-load/${id}`}
        >
          <ArrowUpRight size={24} strokeWidth={1.8} />
        </Link>
      </div>

      <div className={styles.loanBody}>
        <div className={styles.progressBlock}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${paidPercent}%` }} />
          </div>
          <p className={styles.progressLabel}>
            <span>Выплачено</span>
            <span>{paidPercent}%</span>
          </p>
        </div>

        <div className={styles.loanStats}>
          <div className={styles.loanStatBlock}>
            <p className={styles.loanStatLabel}>В месяц</p>
            <p className={styles.loanStatValue}>{formatRubles(perMonth)}</p>
          </div>
          <div className={`${styles.loanStatBlock} ${styles.loanStatBlockRight}`}>
            <p className={styles.loanStatLabel}>Остаток</p>
            <p className={styles.loanStatValue}>{formatRubles(remaining)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CreditLoadScreenView() {
  const query = useCreditLoadQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка кредитной нагрузки..." query={query}>
      {(screenData) => <CreditLoadScreenContent screenData={screenData} />}
    </QueryBoundary>
  );
}

function CreditLoadScreenContent({ screenData }: { screenData: CreditLoadResponse }) {
  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{screenData.title}</h1>
            </header>
          </Reveal>

          <div className={styles.content}>
            <Reveal delay={0.07}>
              <section className={styles.summaryCard}>
                <img alt="" aria-hidden className={styles.summaryBg} draggable={false} src={assets.summaryBg} />
                <div className={styles.summaryTop}>
                  <div>
                    <p className={styles.summaryLabel}>В месяц</p>
                    <p className={styles.summaryValue}>{formatRubles(screenData.summary.perMonth)}</p>
                  </div>
                  <div className={styles.summaryRight}>
                    <p className={styles.summaryLabel}>Общий долг</p>
                    <p className={styles.summaryValue}>{formatRubles(screenData.summary.totalDebt)}</p>
                  </div>
                </div>

                <div className={styles.nextPaymentPill}>
                  <span>{screenData.summary.nextPaymentLabel}</span>
                  <span>{screenData.summary.nextPaymentDate}</span>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.11}>
              <section className={styles.indicatorCard}>
                <div className={styles.indicatorHeader}>
                  <h2 className={styles.indicatorTitle}>Показатель долговой нагрузки</h2>
                  <span className={styles.indicatorBadge}>{screenData.debtIndicator.label}</span>
                </div>
                <ChartContainer percent={screenData.debtIndicator.percent} />
              </section>
            </Reveal>

            <section className={styles.loansSection}>
              <Reveal delay={0.15}>
                <h2 className={styles.loansTitle}>Текущие кредиты</h2>
              </Reveal>

              {screenData.loans.map((loan, index) => (
                <Reveal delay={0.18 + index * 0.04} key={loan.id}>
                  <LoanCard {...loan} />
                </Reveal>
              ))}

              <Reveal delay={0.3}>
                <Link className={styles.addButton} href="/credit-load/add">
                  <span>Добавить кредит</span>
                  <Plus size={24} strokeWidth={2} />
                </Link>
              </Reveal>
            </section>
          </div>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}
