"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { buildDualLineChartPaths } from "@/shared/lib/charts";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import type { ForecastPoint } from "@/shared/types/dashboard";

import styles from "./balance-sparkline.module.css";

const chartWidth = 420;
const chartHeight = 112;
const chartPadding = { top: 8, right: 14, bottom: 8, left: 6 };

type BalanceSparklineProps = {
  points: ForecastPoint[];
  defaultActiveIndex?: number;
};

function buildLineEndArrow(
  coordinates: { x: number; y: number }[],
  color: string,
) {
  if (coordinates.length < 2) {
    return null;
  }

  const last = coordinates.at(-1)!;
  const previous = coordinates.at(-2)!;
  const angle = Math.atan2(last.y - previous.y, last.x - previous.x);
  const size = 7;
  const tipX = last.x + Math.cos(angle) * size;
  const tipY = last.y + Math.sin(angle) * size;
  const leftX = last.x + Math.cos(angle + (2 * Math.PI) / 3) * (size * 0.72);
  const leftY = last.y + Math.sin(angle + (2 * Math.PI) / 3) * (size * 0.72);
  const rightX = last.x + Math.cos(angle - (2 * Math.PI) / 3) * (size * 0.72);
  const rightY = last.y + Math.sin(angle - (2 * Math.PI) / 3) * (size * 0.72);

  return (
    <polygon
      fill={color}
      points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
    />
  );
}

export function BalanceSparkline({ points, defaultActiveIndex = 4 }: BalanceSparklineProps) {
  const initialIndex = Math.min(defaultActiveIndex, Math.max(points.length - 1, 0));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const paths = useMemo(
    () =>
      buildDualLineChartPaths(
        points.map((point) => point.balance),
        points.map((point) => point.spend),
        chartWidth,
        chartHeight,
        chartPadding,
      ),
    [points],
  );

  const activePoint = points[activeIndex];
  const activeCoordinate = paths.income.coordinates[activeIndex];
  const plotBottom = chartHeight - chartPadding.bottom;

  const tooltipStyle = activeCoordinate
    ? {
        left: `${(activeCoordinate.x / chartWidth) * 100}%`,
        top: Math.max(activeCoordinate.y - 46, 0),
      }
    : undefined;

  return (
    <div className={styles.wrap}>
      <div className={styles.plot}>
        <svg
          aria-label="График динамики бюджета"
          className={styles.svg}
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {points.map((point, index) => {
            const x = paths.income.coordinates[index]?.x ?? chartPadding.left;

            return (
              <line
                className={styles.gridLine}
                key={`grid-${point.month}`}
                x1={x}
                x2={x}
                y1={chartPadding.top}
                y2={plotBottom}
              />
            );
          })}

          <motion.path
            animate={{ opacity: 1, pathLength: 1 }}
            className={styles.spendLine}
            d={paths.expense.linePath}
            initial={{ opacity: 0.25, pathLength: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            animate={{ opacity: 1, pathLength: 1 }}
            className={styles.balanceLine}
            d={paths.income.linePath}
            initial={{ opacity: 0.25, pathLength: 0 }}
            transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          />
          {buildLineEndArrow(paths.income.coordinates, "#5ccf5d")}

          {paths.income.coordinates.map((coordinate, index) => {
            const isActive = index === activeIndex;

            return (
              <g key={points[index]?.month ?? index}>
                <circle
                  className={styles.hitArea}
                  cx={coordinate.x}
                  cy={coordinate.y}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  r={14}
                  role="button"
                  tabIndex={0}
                />
                {isActive ? (
                  <motion.circle
                    animate={{ opacity: 1, r: 4.5 }}
                    className={styles.marker}
                    cx={coordinate.x}
                    cy={coordinate.y}
                    initial={{ opacity: 0, r: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {activePoint && activeCoordinate && tooltipStyle ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={styles.tooltip}
            initial={{ opacity: 0, y: 6 }}
            key={activePoint.month}
            style={tooltipStyle}
            transition={{ duration: 0.2 }}
          >
            <span className={styles.tooltipValue}>
              {formatCurrencyParts(activePoint.balance).whole.replace(/\s/g, " ")}
            </span>
            <span className={styles.tooltipLabel}>Баланс</span>
          </motion.div>
        ) : null}
      </div>

      <div
        className={styles.months}
        style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
      >
        {points.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}
