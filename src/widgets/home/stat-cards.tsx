"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import { useDashboardData } from "@/shared/api/dashboard-context";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./stat-cards.module.css";

export function InvestmentStatCard() {
  const { dashboard } = useDashboardData();

  return (
    <Link className={styles.cardLink} href="/investments">
      <section className={cn(styles.card, styles.investmentCard)}>
        <div className={styles.cardBody}>
          <div className={styles.muted}>Инвестиции</div>
          <div className={styles.trend}>
            <TrendingUp size={32} strokeWidth={2.2} />
            <span>{dashboard.investmentPercent.toLocaleString("ru-RU")} %</span>
          </div>
          <div className={styles.positivePill}>{dashboard.investmentGrowth}</div>
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
        <div className={styles.detailButton}>
          Подробнее
          <ArrowUpRight size={16} strokeWidth={2} />
        </div>
      </section>
    </Link>
  );
}
