"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { useDashboardData } from "@/shared/api/dashboard-context";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./stat-cards.module.css";

const assets = {
  detailArrow: "/dashboard/stat-cards/detail-arrow.svg",
  trendUp: "/dashboard/stat-cards/trend-up.svg",
} as const;

export function InvestmentStatCard() {
  const { dashboard } = useDashboardData();

  return (
    <Link className={styles.cardLink} href="/investments">
      <section className={cn(styles.card, styles.investmentCard)}>
        <div className={styles.cardBody}>
          <div className={styles.muted}>Инвестиции</div>
          <div className={styles.trend}>
            <img alt="" aria-hidden className={styles.trendIcon} draggable={false} src={assets.trendUp} />
            <span>{dashboard.investmentPercent.toLocaleString("ru-RU")} %</span>
          </div>
          <div className={styles.positivePill}>{dashboard.investmentGrowth}</div>
        </div>
        <div className={styles.detailButton}>
          Подробнее
          <img alt="" aria-hidden className={styles.detailArrow} draggable={false} src={assets.detailArrow} />
        </div>
      </section>
    </Link>
  );
}

export function IncomeStatCard() {
  const { dashboard } = useDashboardData();
  const incomeRemainderParts = formatCurrencyParts(dashboard.incomeRemainder);
  const incomeProgressPercent = Math.min(
    100,
    Math.round((dashboard.incomeRemainder / dashboard.receipts) * 100),
  );

  return (
    <Link className={styles.cardLink} href="/income">
      <section className={cn(styles.card, styles.incomeCard)}>
        <div className={styles.cardBody}>
          <div className={styles.mutedOnGreen}>Остаток от доходов</div>
          <div className={styles.bigValue}>+ {incomeRemainderParts.whole} ₽</div>
          <div className={styles.progressTrack}>
            <motion.div
              animate={{ width: `${incomeProgressPercent}%` }}
              className={styles.progressFill}
              initial={{ width: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className={styles.level}>Мастер</div>
        </div>
        <div className={cn(styles.detailButton, styles.detailButtonOnGreen)}>
          Подробнее
          <img alt="" aria-hidden className={styles.detailArrow} draggable={false} src={assets.detailArrow} />
        </div>
      </section>
    </Link>
  );
}
