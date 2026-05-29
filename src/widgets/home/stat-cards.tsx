"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import { dashboardData } from "@/shared/data/dashboard";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./stat-cards.module.css";

const incomeRemainderParts = formatCurrencyParts(dashboardData.incomeRemainder);
const incomeProgressPercent = Math.min(
  100,
  Math.round((dashboardData.incomeRemainder / dashboardData.receipts) * 100),
);

export function InvestmentStatCard() {
  return (
    <Link className={styles.cardLink} href="/investments">
      <section className={cn(styles.card, styles.investmentCard)}>
        <div className={styles.cardBody}>
          <div className={styles.muted}>Инвестиции</div>
          <div className={styles.trend}>
            <TrendingUp size={32} strokeWidth={2.2} />
            <span>{dashboardData.investmentPercent.toLocaleString("ru-RU")} %</span>
          </div>
          <div className={styles.positivePill}>{dashboardData.investmentGrowth}</div>
        </div>
        <div className={styles.detailButton}>
          Подробнее
          <ArrowUpRight size={16} strokeWidth={2} />
        </div>
      </section>
    </Link>
  );
}

export function IncomeStatCard() {
  return (
    <Link className={styles.cardLink} href="/income">
      <section className={cn(styles.card, styles.incomeCard)}>
        <div className={styles.cardBody}>
          <div className={styles.mutedOnGreen}>Остаток от доходов</div>
          <div className={styles.bigValue}>+ {incomeRemainderParts.whole} ₽</div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${incomeProgressPercent}%` }} />
          </div>
          <div className={styles.level}>Мастер</div>
        </div>
        <div className={styles.detailButton}>
          Подробнее
          <ArrowUpRight size={16} strokeWidth={2} />
        </div>
      </section>
    </Link>
  );
}
