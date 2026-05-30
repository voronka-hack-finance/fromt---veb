"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/shared/api/dashboard-context";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./operations-card.module.css";

const assets = {
  arrow: "/dashboard/operations/icon-arrow-up-right.svg",
  calendar: "/dashboard/operations/icon-calendar.svg",
  presentationChart: "/dashboard/operations/icon-presentation-chart.svg",
} as const;

export function OperationsCard() {
  const router = useRouter();
  const { dashboard } = useDashboardData();
  const receiptsParts = formatCurrencyParts(dashboard.receipts);
  const expensesParts = formatCurrencyParts(dashboard.expenses);
  const operationsTotal = dashboard.receipts + dashboard.expenses;
  const incomeBarRatio = operationsTotal > 0 ? dashboard.receipts / operationsTotal : 0.5;
  const expenseBarRatio = operationsTotal > 0 ? dashboard.expenses / operationsTotal : 0.5;

  const openOperations = () => router.push("/operations");

  return (
    <section
      className={styles.card}
      onClick={openOperations}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openOperations();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconChipPrimary}>
            <img alt="" aria-hidden className={styles.icon16} draggable={false} src={assets.presentationChart} />
          </div>
          <div className={styles.title}>Операции</div>
        </div>

        <div className={styles.actions}>
          <button
            aria-label="Выбрать период"
            className={styles.iconButton}
            onClick={(event) => {
              event.stopPropagation();
              router.push("/operations/trends");
            }}
            type="button"
          >
            <img alt="" aria-hidden className={styles.icon20} draggable={false} src={assets.calendar} />
          </button>
          <Link
            aria-label="Открыть операции"
            className={styles.iconButton}
            href="/operations"
            onClick={(event) => event.stopPropagation()}
          >
            <img alt="" aria-hidden className={styles.icon20} draggable={false} src={assets.arrow} />
          </Link>
        </div>
      </div>

      <div className={styles.summary}>
        <button
          aria-label="Поступления"
          className={styles.incomeColumn}
          onClick={(event) => {
            event.stopPropagation();
            router.push("/operations");
          }}
          type="button"
        >
          <div className={styles.metricBlock}>
            <span className={styles.metricLabel}>Поступления</span>
            <div className={styles.metricValue}>
              <span>{receiptsParts.whole}</span>
              <span className={styles.valueFraction}>,{receiptsParts.fraction} ₽</span>
            </div>
          </div>
        </button>

        <button
          aria-label="Расходы"
          className={styles.expenseColumn}
          onClick={(event) => {
            event.stopPropagation();
            router.push("/operations/bars");
          }}
          type="button"
        >
          <div className={styles.metricBlock}>
            <span className={styles.metricLabel}>Расходы</span>
            <div className={styles.metricValue}>
              <span>{expensesParts.whole}</span>
              <span className={styles.valueFraction}>,{expensesParts.fraction} ₽</span>
            </div>
          </div>
        </button>

        <div aria-hidden className={styles.barRow}>
          <span className={styles.barDivider} />
          <motion.span
            animate={{ scaleX: 1 }}
            className={styles.incomeBar}
            initial={{ scaleX: 0 }}
            style={{ flex: incomeBarRatio, transformOrigin: "left center" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className={styles.barDividerOverlap} />
          <motion.span
            animate={{ scaleX: 1 }}
            className={styles.expenseBar}
            initial={{ scaleX: 0 }}
            style={{ flex: expenseBarRatio, transformOrigin: "left center" }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </section>
  );
}
