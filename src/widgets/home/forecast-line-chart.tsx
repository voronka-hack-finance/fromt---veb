"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { buildDualLineChartPaths } from "@/shared/lib/charts";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import type { ForecastPoint } from "@/shared/types/dashboard";

import styles from "./forecast-line-chart.module.css";

const chartSizes = {
  compact: {
    width: 185,
    height: 106,
    padding: { top: 6, right: 10, bottom: 8, left: 10 },
    tooltipOffsetY: 48,
  },
  wide: {
    width: 345,
    height: 133,
    padding: { top: 4, right: 10, bottom: 10, left: 10 },
    tooltipOffsetY: 50,
  },
} as const;

type ForecastLineChartProps = {
  points: ForecastPoint[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  variant?: keyof typeof chartSizes;
  animateKey?: string;
};

export function ForecastLineChart({
  points,
  activeIndex,
  onActiveIndexChange,
  variant = "compact",
  animateKey,
}: ForecastLineChartProps) {
  const { width, height, padding, tooltipOffsetY } = chartSizes[variant];

  const paths = useMemo(
    () =>
      buildDualLineChartPaths(
        points.map((point) => point.balance),
        points.map((point) => point.spend),
        width,
        height,
        padding,
      ),
    [height, padding, points, width],
  );

  const activePoint = points[activeIndex];
  const activeCoordinate = paths.income.coordinates[activeIndex];
  const animationKey = animateKey ?? points.map((point) => point.month).join("-");

  const tooltipStyle =
    activeCoordinate && variant === "wide"
      ? {
          left: `${(activeCoordinate.x / width) * 100}%`,
          top: Math.max(activeCoordinate.y - tooltipOffsetY, 4),
        }
      : activeCoordinate
        ? {
            left: `${(activeCoordinate.x / width) * 100}%`,
            top: activeCoordinate.y - tooltipOffsetY,
          }
        : undefined;

  return (
    <div className={cn(styles.wrap, styles[`wrap_${variant}`])}>
      <svg
        aria-label="Прогноз доходов и расходов"
        className={styles.svg}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        {points.map((point, index) => {
          const x = paths.income.coordinates[index]?.x ?? padding.left;

          return (
            <line
              className={styles.gridLine}
              key={`grid-${point.month}`}
              x1={x}
              x2={x}
              y1={padding.top}
              y2={height - padding.bottom}
            />
          );
        })}

        <motion.path
          animate={{ opacity: 1, pathLength: 1 }}
          className={styles.incomeLine}
          d={paths.income.linePath}
          initial={{ opacity: 0.2, pathLength: 0 }}
          key={`income-${animationKey}`}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          animate={{ opacity: 1, pathLength: 1 }}
          className={styles.expenseLine}
          d={paths.expense.linePath}
          initial={{ opacity: 0.2, pathLength: 0 }}
          key={`expense-${animationKey}`}
          transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        />

        {paths.income.coordinates.map((coordinate, index) => {
          const isActive = index === activeIndex;

          return (
            <g key={points[index]?.month ?? index}>
              <circle
                className={styles.hitArea}
                cx={coordinate.x}
                cy={coordinate.y}
                onClick={() => onActiveIndexChange(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onActiveIndexChange(index);
                  }
                }}
                r={variant === "wide" ? 14 : 12}
                role="button"
                tabIndex={0}
              />
              <motion.circle
                animate={{ opacity: 1, r: isActive ? 4.5 : 3, scale: 1 }}
                className={cn(styles.point, isActive && styles.pointActive)}
                cx={coordinate.x}
                cy={coordinate.y}
                initial={{ opacity: 0, r: 0, scale: 0.5 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              />
            </g>
          );
        })}
      </svg>

      {activePoint && activeCoordinate && tooltipStyle ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={styles.tooltip}
          initial={{ opacity: 0, y: 6 }}
          key={`${animationKey}-${activePoint.month}`}
          style={tooltipStyle}
          transition={{ duration: 0.2 }}
        >
          <span className={styles.tooltipValue}>
            {formatCurrencyParts(activePoint.balance).whole.replace(/\s/g, " ")}
          </span>
          <span className={styles.tooltipLabel}>баланс</span>
        </motion.div>
      ) : null}

      <div
        className={styles.months}
        style={
          variant === "wide"
            ? { gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {points.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}
