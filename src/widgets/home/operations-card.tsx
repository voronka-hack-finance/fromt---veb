"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { dashboardData } from "@/shared/data/dashboard";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./operations-card.module.css";

const assets = {
  arrow: "/dashboard/operations/icon-arrow-up-right.svg",
  calendar: "/dashboard/operations/icon-calendar.svg",
  presentationChart: "/dashboard/operations/icon-presentation-chart.svg",
} as const;

const receiptsParts = formatCurrencyParts(dashboardData.receipts);
const expensesParts = formatCurrencyParts(dashboardData.expenses);

export function OperationsCard() {
  const router = useRouter();

  return (
    <section className={styles.card}>
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
            onClick={() => router.push("/operations/trends")}
            type="button"
          >
            <img alt="" aria-hidden className={styles.icon20} draggable={false} src={assets.calendar} />
          </button>
          <Link aria-label="Открыть операции" className={styles.iconButton} href="/operations">
            <img alt="" aria-hidden className={styles.icon20} draggable={false} src={assets.arrow} />
          </Link>
        </div>
      </div>

      <div className={styles.summary}>
        <button
          aria-label="Поступления"
          className={styles.incomeColumn}
          onClick={() => router.push("/operations")}
          type="button"
        >
          <div className={styles.metricBlock}>
            <span className={styles.metricLabel}>Поступления</span>
            <div className={styles.incomeValue}>
              <span>{receiptsParts.whole}</span>
              <span className={styles.valueFraction}>,{receiptsParts.fraction} ₽</span>
            </div>
          </div>

          <div className={styles.barRow}>
            <span className={styles.barDivider} />
            <span className={styles.incomeBar} />
          </div>
        </button>

        <button
          aria-label="Расходы"
          className={styles.expenseColumn}
          onClick={() => router.push("/operations/bars")}
          type="button"
        >
          <div className={styles.metricBlock}>
            <span className={styles.metricLabel}>Расходы</span>
            <div className={styles.expenseValue}>
              <span>{expensesParts.whole}</span>
              <span className={styles.valueFraction}>,{expensesParts.fraction} ₽</span>
            </div>
          </div>

          <div className={styles.barRow}>
            <span className={styles.barDividerOverlap} />
            <span className={styles.expenseBar} />
          </div>
        </button>
      </div>
    </section>
  );
}
