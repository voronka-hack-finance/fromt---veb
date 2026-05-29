"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/shared/api/dashboard-context";

import styles from "./recurring-expenses-card.module.css";

const assets = {
  icon1: "/dashboard/recurring/icon-1.png",
  icon2: "/dashboard/recurring/icon-2.png",
  icon3: "/dashboard/recurring/icon-3.png",
} as const;

export function RecurringExpensesCard() {
  const router = useRouter();
  const { dashboard } = useDashboardData();

  return (
    <section className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.info}>
          <div className={styles.title}>Постоянные расходы</div>

          <div className={styles.meta}>
            <div aria-hidden className={styles.icons}>
              <img alt="" className={styles.icon} draggable={false} src={assets.icon1} />
              <img alt="" className={styles.icon} draggable={false} src={assets.icon2} />
              <img alt="" className={styles.icon} draggable={false} src={assets.icon3} />
            </div>
            <span className={styles.categories}>{dashboard.recurringExpenses.categories}</span>
          </div>
        </div>

        <button
          aria-label="Открыть мои подписки"
          className={styles.actionButton}
          onClick={() => router.push("/subscriptions")}
          type="button"
        >
          <ArrowUpRight size={28} strokeWidth={2.1} />
        </button>
      </div>

      <div className={styles.value}>{dashboard.recurringExpenses.total}</div>
    </section>
  );
}
