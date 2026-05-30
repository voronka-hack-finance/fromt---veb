"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import {
  useCreditLoadLoanQuery,
  type CreditLoadLoanDetailResponse,
} from "@/shared/api/credit-load-loan";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./loan-detail-screen.module.css";

function formatRubles(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole}₽`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className={styles.detailRow}>
        <p className={styles.detailLabel}>{label}</p>
        <p className={styles.detailValue}>{value}</p>
      </div>
      <div aria-hidden className={styles.divider} />
    </>
  );
}

function LoanDetailContent({ loan }: { loan: CreditLoadLoanDetailResponse }) {
  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.iconButton} href="/credit-load">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{loan.title}</h1>
              <button aria-label="Редактировать кредит" className={styles.iconButton} type="button">
                <Pencil size={24} strokeWidth={1.8} />
              </button>
            </header>
          </Reveal>

          <Reveal delay={0.08}>
            <section className={styles.card}>
              <div className={styles.bankRow}>
                <p className={styles.bankLabel}>Банк кредитор</p>
                <img
                  alt=""
                  className={styles.bankLogo}
                  draggable={false}
                  height={loan.bankLogoHeight}
                  src={loan.bankLogo}
                  width={loan.bankLogoWidth}
                />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${loan.paidPercent}%` }} />
                </div>

                <div className={styles.paidRow}>
                  <p className={styles.paidLabel}>Выплачено</p>
                  <p className={styles.paidValue}>{loan.paidPercent}%</p>
                </div>

                <div aria-hidden className={styles.divider} />

                <DetailRow label="Ежемесячный платёж" value={formatRubles(loan.monthlyPayment)} />
                <DetailRow label="Остаток от займа" value={formatRubles(loan.remainingBalance)} />
                <DetailRow label="Годовой процент" value={loan.annualRate} />

                <div className={styles.remainingBlock}>
                  <p className={styles.remainingLabel}>Осталось выплачивать</p>
                  <p className={styles.remainingValue}>{loan.remainingDuration}</p>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function LoanDetailScreenView({ loanId }: { loanId: string }) {
  const query = useCreditLoadLoanQuery(loanId);

  return (
    <QueryBoundary loadingLabel="Загрузка кредита..." query={query}>
      {(loan) => <LoanDetailContent loan={loan} />}
    </QueryBoundary>
  );
}
