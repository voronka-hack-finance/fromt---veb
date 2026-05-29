"use client";

import { useRouter } from "next/navigation";

import { dashboardData } from "@/shared/data/dashboard";

import styles from "./recurring-expenses-card.module.css";

const assets = {
  icon1: "/dashboard/recurring/icon-1.png",
  icon2: "/dashboard/recurring/icon-2.png",
  icon3: "/dashboard/recurring/icon-3.png",
} as const;

export function RecurringExpensesCard() {
  const router = useRouter();

  return (
    <button
      aria-label={`Постоянные расходы: ${dashboardData.recurringExpenses.total}, ${dashboardData.recurringExpenses.categories}`}
      className={styles.card}
      onClick={() => router.push("/operations/bars")}
      type="button"
    >
      <div className={styles.info}>
        <div className={styles.title}>Постоянные расходы</div>

        <div className={styles.meta}>
          <div aria-hidden className={styles.icons}>
            <img alt="" className={styles.icon} draggable={false} src={assets.icon1} />
            <img alt="" className={styles.icon} draggable={false} src={assets.icon2} />
            <img alt="" className={styles.icon} draggable={false} src={assets.icon3} />
          </div>
          <span className={styles.categories}>{dashboardData.recurringExpenses.categories}</span>
        </div>
      </div>

      <div className={styles.value}>{dashboardData.recurringExpenses.total}</div>
    </button>
  );
}
