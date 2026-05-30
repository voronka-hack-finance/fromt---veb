"use client";

import { useState } from "react";

import { useDashboardData } from "@/shared/api/dashboard-context";
import { cn } from "@/shared/lib/cn";

import { ForecastLineChart } from "./forecast-line-chart";
import styles from "./forecast-card.module.css";

const assets = {
  legendExpenseDot: "/dashboard/forecast/legend-expense-dot.svg",
  legendIncomeDot: "/dashboard/forecast/legend-income-dot.svg",
} as const;

export function ForecastCard() {
  const { dashboard, forecastPoints, forecastYearPoints } = useDashboardData();
  const [period, setPeriod] = useState<"year" | "week">("week");
  const [activeIndex, setActiveIndex] = useState(4);

  const points = period === "week" ? forecastPoints : forecastYearPoints;

  const handlePeriodChange = (nextPeriod: "year" | "week") => {
    setPeriod(nextPeriod);
    setActiveIndex(nextPeriod === "week" ? 4 : 1);
  };

  return (
    <section className={styles.card}>
      <div className={styles.content}>
        <div className={styles.headerBlock}>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Прогнозы</h2>

            <div className={styles.toggle}>
              <button
                className={cn(styles.toggleItem, period === "year" && styles.toggleItemActive)}
                onClick={() => handlePeriodChange("year")}
                type="button"
              >
                Год
              </button>
              <button
                className={cn(styles.toggleItem, period === "week" && styles.toggleItemActive)}
                onClick={() => handlePeriodChange("week")}
                type="button"
              >
                Неделя
              </button>
            </div>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <img alt="" aria-hidden className={styles.legendDot} draggable={false} src={assets.legendIncomeDot} />
              <span>Доходы</span>
            </div>
            <div className={styles.legendItem}>
              <img alt="" aria-hidden className={styles.legendDot} draggable={false} src={assets.legendExpenseDot} />
              <span>Расходы</span>
            </div>
          </div>
        </div>

        <div className={styles.scoreRow}>
          <span className={styles.scoreValue}>{dashboard.forecastPercent}</span>
          <span className={styles.scorePercent}>%</span>
        </div>
      </div>

      <div className={styles.chartArea}>
        <ForecastLineChart
          activeIndex={activeIndex}
          animateKey={period}
          onActiveIndexChange={setActiveIndex}
          points={points}
          variant="compact"
        />
      </div>
    </section>
  );
}
