"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

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
  points: ReadonlyArray<ForecastPoint>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  variant?: keyof typeof chartSizes;
  animateKey?: string;
};

type ChartSeries = "income" | "expense";

function buildSmoothLinePathFromCoordinates(coordinates: { x: number; y: number }[]) {
  return coordinates.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = coordinates[index - 1];
    const controlX = (previous.x + point.x) / 2;

    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function buildTrimmedSmoothLinePath(
  coordinates: { x: number; y: number }[],
  trimFromEnd: number,
) {
  if (coordinates.length < 2 || trimFromEnd <= 0) {
    return buildSmoothLinePathFromCoordinates(coordinates);
  }

  const tip = coordinates.at(-1);
  const previous = coordinates.at(-2);

  if (!tip || !previous) {
    return buildSmoothLinePathFromCoordinates(coordinates);
  }

  const deltaX = tip.x - previous.x;
  const deltaY = tip.y - previous.y;
  const distance = Math.hypot(deltaX, deltaY) || 1;
  const trimRatio = Math.min(1, Math.max(0, (distance - trimFromEnd) / distance));
  const trimmedTip = {
    x: previous.x + deltaX * trimRatio,
    y: previous.y + deltaY * trimRatio,
  };

  return buildSmoothLinePathFromCoordinates([...coordinates.slice(0, -1), trimmedTip]);
}

function buildArrowHeadPoints(
  coordinates: { x: number; y: number }[],
  length = 12,
  halfWidth = 5.5,
) {
  if (coordinates.length < 2) {
    return "";
  }

  const tip = coordinates.at(-1);
  const previous = coordinates.at(-2);

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
  const baseCenterX = tip.x - unitX * length;
  const baseCenterY = tip.y - unitY * length;
  const leftX = baseCenterX + perpendicularX * halfWidth;
  const leftY = baseCenterY + perpendicularY * halfWidth;
  const rightX = baseCenterX - perpendicularX * halfWidth;
  const rightY = baseCenterY - perpendicularY * halfWidth;

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
  const [activeSeries, setActiveSeries] = useState<ChartSeries>("income");

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
  const activeCoordinate = paths[activeSeries].coordinates[activeIndex];
  const animationKey = animateKey ?? points.map((point) => point.month).join("-");
  const incomeArrowLength = 12;
  const incomeLinePath =
    variant === "wide"
      ? buildTrimmedSmoothLinePath(paths.income.coordinates, incomeArrowLength)
      : paths.income.linePath;
  const incomeArrowPoints = useMemo(
    () =>
      variant === "wide"
        ? buildArrowHeadPoints(paths.income.coordinates, incomeArrowLength, 5.5)
        : "",
    [paths.income.coordinates, variant],
  );
  const activePosition = activeCoordinate
    ? {
        left: `${(activeCoordinate.x / width) * 100}%`,
        top: `${(activeCoordinate.y / height) * 100}%`,
      }
    : undefined;
  const activeTooltipValue =
    activeSeries === "income" ? activePoint?.balance : activePoint?.spend;
  const activeTooltipLabel =
    activeSeries === "income"
      ? variant === "wide"
        ? "Баланс"
        : "баланс"
      : variant === "wide"
        ? "Расходы"
        : "расходы";

  const handlePointSelect = (series: ChartSeries, index: number) => {
    setActiveSeries(series);
    onActiveIndexChange(index);
  };

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
            animate={{ opacity: 1 }}
            className={styles.expenseLine}
            d={paths.expense.linePath}
            initial={{ opacity: 0 }}
            key={`expense-${animationKey}`}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            animate={{ opacity: 1, pathLength: 1 }}
            className={styles.incomeLine}
            d={incomeLinePath}
            initial={{ opacity: 0.2, pathLength: 0 }}
            key={`income-${animationKey}`}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
          {variant === "wide" && incomeArrowPoints ? (
            <motion.polygon
              animate={{ opacity: 1 }}
              className={styles.incomeArrow}
              initial={{ opacity: 0 }}
              key={`income-arrow-${animationKey}`}
              points={incomeArrowPoints}
              transition={{ duration: 0.24, delay: 0.68 }}
            />
          ) : null}

          {paths.expense.coordinates.map((coordinate, index) => {
            const isActive = activeSeries === "expense" && index === activeIndex;

            return (
              <g key={`expense-point-${points[index]?.month ?? index}`}>
                <circle
                  aria-label={`Расходы за ${points[index]?.month ?? index}`}
                  className={styles.hitArea}
                  cx={coordinate.x}
                  cy={coordinate.y}
                  onClick={() => handlePointSelect("expense", index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handlePointSelect("expense", index);
                    }
                  }}
                  r={variant === "wide" ? 12 : 12}
                  role="button"
                  tabIndex={0}
                />
                <motion.circle
                  animate={{ opacity: isActive ? 1 : 0, r: isActive ? 4.5 : 3, scale: 1 }}
                  className={cn(styles.point, styles.expensePoint, isActive && styles.pointActive)}
                  cx={coordinate.x}
                  cy={coordinate.y}
                  initial={{ opacity: 0, r: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                />
              </g>
            );
          })}

          {paths.income.coordinates.map((coordinate, index) => {
            const isActive = activeSeries === "income" && index === activeIndex;

            return (
              <g key={`income-point-${points[index]?.month ?? index}`}>
                <circle
                  aria-label={`Баланс за ${points[index]?.month ?? index}`}
                  className={styles.hitArea}
                  cx={coordinate.x}
                  cy={coordinate.y}
                  onClick={() => handlePointSelect("income", index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handlePointSelect("income", index);
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

        {activePoint && activeTooltipValue !== undefined && activeCoordinate && activePosition ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.tooltip}
            initial={{ opacity: 0 }}
            key={`${animationKey}-${activeSeries}-${activePoint.month}`}
            style={{
              left: activePosition.left,
              top: activePosition.top,
              transform:
                variant === "wide"
                  ? "translate(-50%, calc(-100% - 14px))"
                  : "translate(-50%, calc(-100% - 4px))",
            }}
            transition={{ duration: 0.2 }}
          >
            <span className={styles.tooltipValue}>
              {formatCurrencyParts(activeTooltipValue).whole.replace(/\s/g, " ")}
            </span>
            <span className={styles.tooltipLabel}>{activeTooltipLabel}</span>
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
