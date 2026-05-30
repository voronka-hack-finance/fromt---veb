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
  },
  wide: {
    width: 400,
    height: 158,
    padding: { top: 8, right: 10, bottom: 4, left: 0 },
  },
} as const;

type ForecastLineChartProps = {
  points: ForecastPoint[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  variant?: keyof typeof chartSizes;
  animateKey?: string;
};

function buildArrowHeadPoints(
  coordinates: { x: number; y: number }[],
  length = 18,
  halfWidth = 8,
  inset = 3,
) {
  if (coordinates.length === 0) {
    return "";
  }

  const tip = coordinates.at(-1);
  const previous = coordinates.at(-2) ?? tip;

  if (!tip || !previous) {
    return "";
  }

  const deltaX = tip.x - previous.x;
  const deltaY = tip.y - previous.y;
  const magnitude = Math.hypot(deltaX, deltaY) || 1;
  const unitX = deltaX / magnitude;
  const unitY = deltaY / magnitude;
  const perpendicularX = -unitY;
  const perpendicularY = unitX;
  const baseCenterX = tip.x - unitX * inset;
  const baseCenterY = tip.y - unitY * inset;
  const tailCenterX = baseCenterX - unitX * length;
  const tailCenterY = baseCenterY - unitY * length;
  const leftX = tailCenterX + perpendicularX * halfWidth;
  const leftY = tailCenterY + perpendicularY * halfWidth;
  const rightX = tailCenterX - perpendicularX * halfWidth;
  const rightY = tailCenterY - perpendicularY * halfWidth;

  return `${tip.x},${tip.y} ${leftX},${leftY} ${rightX},${rightY}`;
}

export function ForecastLineChart({
  points,
  activeIndex,
  onActiveIndexChange,
  variant = "compact",
  animateKey,
}: ForecastLineChartProps) {
  const { width, height, padding } = chartSizes[variant];

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
  const incomeArrowPoints = useMemo(
    () => (variant === "wide" ? buildArrowHeadPoints(paths.income.coordinates) : ""),
    [paths.income.coordinates, variant],
  );
  const activePosition = activeCoordinate
    ? {
        left: `${(activeCoordinate.x / width) * 100}%`,
        top: `${(activeCoordinate.y / height) * 100}%`,
      }
    : undefined;

  return (
    <div className={cn(styles.wrap, styles[`wrap_${variant}`])}>
      <div className={styles.plot}>
        <svg
          aria-label="Прогноз доходов и расходов"
          className={styles.svg}
          preserveAspectRatio="none"
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
            className={styles.expenseLine}
            d={paths.expense.linePath}
            initial={{ opacity: 0.2, pathLength: 0 }}
            key={`expense-${animationKey}`}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            animate={{ opacity: 1, pathLength: 1 }}
            className={styles.incomeLine}
            d={paths.income.linePath}
            initial={{ opacity: 0.2, pathLength: 0 }}
            key={`income-${animationKey}`}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
          {variant === "wide" && incomeArrowPoints ? (
            <motion.polygon
              animate={{ opacity: 1, scale: 1 }}
              className={styles.incomeArrow}
              initial={{ opacity: 0, scale: 0.8 }}
              key={`income-arrow-${animationKey}`}
              points={incomeArrowPoints}
              transition={{ duration: 0.24, delay: 0.68 }}
            />
          ) : null}

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
                  r={variant === "wide" ? 10 : 12}
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

        {variant === "wide" && activePosition ? (
          <div
            aria-hidden
            className={styles.activeMarker}
            style={activePosition}
          >
            <span className={styles.activeMarkerCore} />
          </div>
        ) : null}

        {activePoint && activeCoordinate && activePosition ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.tooltip}
            initial={{ opacity: 0 }}
            key={`${animationKey}-${activePoint.month}`}
            style={{
              left: activePosition.left,
              top: activePosition.top,
              transform:
                variant === "wide"
                  ? "translate(-50%, calc(-100% - 6px))"
                  : "translate(-50%, calc(-100% - 4px))",
            }}
            transition={{ duration: 0.2 }}
          >
            <span className={styles.tooltipValue}>
              {formatCurrencyParts(activePoint.balance).whole.replace(/\s/g, " ")}
            </span>
            <span className={styles.tooltipLabel}>{variant === "wide" ? "Баланс" : "баланс"}</span>
          </motion.div>
        ) : null}
      </div>

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
