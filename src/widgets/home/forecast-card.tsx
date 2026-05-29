"use client";

import { useMemo, useState } from "react";

import { dashboardData, forecastPoints, forecastYearPoints } from "@/shared/data/dashboard";
import { buildLineChartPaths } from "@/shared/lib/charts";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./forecast-card.module.css";

const assets = {
  legendExpenseDot: "/dashboard/forecast/legend-expense-dot.svg",
  legendIncomeDot: "/dashboard/forecast/legend-income-dot.svg",
} as const;

const chartWidth = 185;
const chartHeight = 106;
const chartPadding = 10;

export function ForecastCard() {
  const [period, setPeriod] = useState<"year" | "week">("week");
  const [activeIndex, setActiveIndex] = useState(4);

  const points = period === "week" ? forecastPoints : forecastYearPoints;

  const incomePaths = useMemo(
    () => buildLineChartPaths(points.map((point) => ({ value: point.balance })), chartWidth, chartHeight, chartPadding),
    [points],
  );

  const expensePaths = useMemo(
    () => buildLineChartPaths(points.map((point) => ({ value: point.spend })), chartWidth, chartHeight, chartPadding),
    [points],
  );

  const activePoint = points[activeIndex];
  const activeCoordinate = incomePaths.coordinates[activeIndex];

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
          <span className={styles.scoreValue}>{dashboardData.forecastPercent}</span>
          <span className={styles.scorePercent}>%</span>
        </div>
      </div>

      <div className={styles.chartArea}>
        <svg
          aria-label="Прогноз доходов и расходов"
          className={styles.chart}
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {points.map((point, index) => {
            const x =
              chartPadding + ((chartWidth - chartPadding * 2) / Math.max(points.length - 1, 1)) * index;

            return (
              <line
                className={styles.chartGrid}
                key={`grid-${point.month}`}
                x1={x}
                x2={x}
                y1={6}
                y2={chartHeight - 8}
              />
            );
          })}

          <path className={styles.chartLineIncome} d={incomePaths.linePath} />
          <path className={styles.chartLineExpense} d={expensePaths.linePath} />

          {incomePaths.coordinates.map((point, index) => {
            const isActive = index === activeIndex;

            return (
              <g key={points[index]?.month ?? index}>
                <circle
                  className={styles.chartHitArea}
                  cx={point.x}
                  cy={point.y}
                  onClick={() => setActiveIndex(index)}
                  r={12}
                />
                <circle
                  className={cn(styles.chartPoint, isActive && styles.chartPointActive)}
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 4.5 : 3}
                />
              </g>
            );
          })}

          {activePoint && activeCoordinate ? (
            <foreignObject height="40" width="72" x={activeCoordinate.x - 36} y={activeCoordinate.y - 48}>
              <div className={styles.chartTooltip}>
                <span>{formatCurrencyParts(activePoint.balance).whole.replace(/\s/g, " ")}</span>
                <span>Баланс</span>
              </div>
            </foreignObject>
          ) : null}
        </svg>

        <div className={styles.months}>
          {points.map((point) => (
            <span key={point.month}>{point.month}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
