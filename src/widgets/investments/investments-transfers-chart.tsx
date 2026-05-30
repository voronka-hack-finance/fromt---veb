"use client";

import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./investments-transfers-chart.module.css";

export type TransfersChartPoint = {
  label: string;
  value: number;
};

type InvestmentsTransfersChartProps = {
  points: ReadonlyArray<TransfersChartPoint>;
};

const TRACK_HEIGHT = 112;

export function InvestmentsTransfersChart({ points }: InvestmentsTransfersChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const maxValue = useMemo(
    () => Math.max(...points.map((point) => point.value), 1),
    [points],
  );

  const highlightedIndex = useMemo(() => {
    if (activeIndex !== null) {
      return activeIndex;
    }

    const lastNonZero = [...points].reverse().findIndex((point) => point.value > 0);
    return lastNonZero === -1 ? null : points.length - 1 - lastNonZero;
  }, [activeIndex, points]);

  const tooltipPoint = highlightedIndex !== null ? points[highlightedIndex] : null;
  const tooltipBarHeight =
    tooltipPoint && tooltipPoint.value > 0
      ? Math.round((tooltipPoint.value / maxValue) * TRACK_HEIGHT)
      : 0;
  const tooltipTop = Math.max(0, TRACK_HEIGHT - tooltipBarHeight - 44);

  return (
    <div
      aria-label="Динамика переводов в инвестиции по месяцам"
      className={styles.wrap}
      role="img"
    >
      <div className={styles.plot}>
        {tooltipPoint && tooltipPoint.value > 0 ? (
          <div
            className={styles.tooltip}
            style={{
              left: `${((highlightedIndex ?? 0) + 0.5) * (100 / points.length)}%`,
              top: tooltipTop,
            }}
          >
            <span className={styles.tooltipValue}>
              {formatCurrencyParts(tooltipPoint.value).whole} ₽
            </span>
            <span className={styles.tooltipLabel}>{tooltipPoint.label}</span>
          </div>
        ) : null}

        <div className={styles.columns}>
          {points.map((point, index) => {
            const barHeight =
              point.value > 0 ? Math.round((point.value / maxValue) * TRACK_HEIGHT) : 0;
            const isActive = index === highlightedIndex;

            return (
              <div className={styles.column} key={point.label}>
                <div className={styles.track}>
                  <div className={styles.gridLine} />

                  {barHeight > 0 ? (
                    <div
                      className={cn(styles.bar, isActive && styles.barActive)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      style={{ height: barHeight }}
                    />
                  ) : null}
                </div>

                <span className={styles.month}>{point.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
