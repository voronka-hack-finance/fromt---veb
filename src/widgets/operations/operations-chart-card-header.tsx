"use client";

import Link from "next/link";
import { ArrowUpDown, BarChart3, PieChart } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { operationsChartHref, type OperationsPeriod } from "@/shared/lib/operations-period";

import styles from "./operations-chart-card-header.module.css";

type ChartView = "pie" | "trends" | "bars";

type OperationsChartCardHeaderProps = {
  activePeriod: OperationsPeriod;
  activeView: ChartView;
  onPeriodChange: (period: OperationsPeriod) => void;
  periodTabs: readonly OperationsPeriod[];
};

export function OperationsChartCardHeader({
  activePeriod,
  activeView,
  onPeriodChange,
  periodTabs,
}: OperationsChartCardHeaderProps) {
  return (
    <div className={styles.cardTop}>
      <div className={styles.periodToggle}>
        {periodTabs.map((tab) => (
          <button
            className={cn(styles.periodButton, tab === activePeriod && styles.periodButtonActive)}
            key={tab}
            onClick={() => onPeriodChange(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.viewControls}>
        {activeView === "pie" ? (
          <button aria-label="Круговая диаграмма" className={cn(styles.viewButton, styles.viewButtonActive)} type="button">
            <PieChart size={24} strokeWidth={1.8} />
          </button>
        ) : (
          <Link aria-label="Круговая диаграмма" className={styles.viewButton} href={operationsChartHref("/operations", activePeriod)}>
            <PieChart size={24} strokeWidth={1.8} />
          </Link>
        )}

        {activeView === "trends" ? (
          <button aria-label="Тренды" className={cn(styles.viewButton, styles.viewButtonActive)} type="button">
            <ArrowUpDown size={24} strokeWidth={1.8} />
          </button>
        ) : (
          <Link aria-label="Тренды" className={styles.viewButton} href={operationsChartHref("/operations/trends", activePeriod)}>
            <ArrowUpDown size={24} strokeWidth={1.8} />
          </Link>
        )}

        {activeView === "bars" ? (
          <button aria-label="Столбцы" className={cn(styles.viewButton, styles.viewButtonActive)} type="button">
            <BarChart3 size={24} strokeWidth={1.8} />
          </button>
        ) : (
          <Link aria-label="Столбцы" className={styles.viewButton} href={operationsChartHref("/operations/bars", activePeriod)}>
            <BarChart3 size={24} strokeWidth={1.8} />
          </Link>
        )}
      </div>
    </div>
  );
}
