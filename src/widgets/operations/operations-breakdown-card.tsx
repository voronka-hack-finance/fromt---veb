"use client";

import Link from "next/link";
import { ArrowUpDown, BarChart3, ChevronLeft, ChevronRight, PieChart } from "lucide-react";
import { useMemo, useState } from "react";

import { operationsScreenData } from "@/shared/data/operations";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./operations-breakdown-card.module.css";

type Period = (typeof operationsScreenData.periodTabs)[number];

const GAUGE = {
  width: 315,
  height: 142,
  cx: 157.5,
  cy: 130,
  radius: 96,
  stroke: 32,
} as const;

const LEGEND_ORDER = ["transfers", "hotels", "groceries"] as const;

const bubbleClass = {
  transfers: styles.percentBubble50,
  hotels: styles.percentBubble40,
  groceries: styles.percentBubble10,
} as const;

const legendDotClass = {
  transfers: styles.legendDotTransfers,
  hotels: styles.legendDotHotels,
  groceries: styles.legendDotGroceries,
} as const;

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function buildArcPath(startDeg: number, endDeg: number) {
  const start = polar(GAUGE.cx, GAUGE.cy, GAUGE.radius, startDeg);
  const end = polar(GAUGE.cx, GAUGE.cy, GAUGE.radius, endDeg);
  const delta = endDeg - startDeg;
  const largeArc = delta > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${GAUGE.radius} ${GAUGE.radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function buildGaugeSegments(breakdown: Array<{ id: string; percent: number; color: string }>) {
  const gap = 3;
  let cursor = 180;

  return breakdown.map((item) => {
    const sweep = (item.percent / 100) * 180;
    const start = cursor + gap / 2;
    const end = cursor + sweep - gap / 2;
    cursor += sweep;

    return {
      ...item,
      path: buildArcPath(start, end),
    };
  });
}

function getMonthTotal(period: Period, monthIndex: number) {
  const base = operationsScreenData.breakdownByPeriod[period].total;
  const offset = monthIndex - operationsScreenData.defaultMonthIndex;

  return Math.round(base * (1 + offset * 0.02));
}

export function OperationsBreakdownCard() {
  const [activePeriod, setActivePeriod] = useState<Period>(operationsScreenData.activePeriod);
  const [activeBreakdownId, setActiveBreakdownId] = useState<string>("transfers");
  const [monthIndex, setMonthIndex] = useState(operationsScreenData.defaultMonthIndex);

  const periodData = operationsScreenData.breakdownByPeriod[activePeriod];
  const monthLabel = operationsScreenData.monthLabels[monthIndex] ?? operationsScreenData.monthLabel;

  const totalAmount = useMemo(
    () => getMonthTotal(activePeriod, monthIndex),
    [activePeriod, monthIndex],
  );

  const breakdown = useMemo(
    () =>
      periodData.items.map((item) => ({
        ...item,
        amount: Math.round((totalAmount * item.percent) / 100),
      })),
    [periodData.items, totalAmount],
  );

  const gaugeSegments = useMemo(() => {
    const ordered = ["groceries", "hotels", "transfers"]
      .map((id) => breakdown.find((item) => item.id === id))
      .filter((item): item is (typeof breakdown)[number] => Boolean(item));

    return buildGaugeSegments(ordered);
  }, [breakdown]);

  const handlePeriodChange = (period: Period) => {
    setActivePeriod(period);
    setActiveBreakdownId("transfers");
  };

  const selectBreakdown = (id: string) => {
    setActiveBreakdownId(id);
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <div className={styles.periodToggle}>
            {operationsScreenData.periodTabs.map((tab) => (
              <button
                className={cn(styles.periodButton, tab === activePeriod && styles.periodButtonActive)}
                key={tab}
                onClick={() => handlePeriodChange(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.viewControls}>
            <button aria-label="Круговая диаграмма" className={cn(styles.viewButton, styles.viewButtonActive)} type="button">
              <PieChart size={24} strokeWidth={1.8} />
            </button>
            <Link aria-label="Тренды" className={styles.viewButton} href="/operations/trends">
              <ArrowUpDown size={24} strokeWidth={1.8} />
            </Link>
            <Link aria-label="Столбцы" className={styles.viewButton} href="/operations/bars">
              <BarChart3 size={24} strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.monthSwitcher}>
            <button
              aria-label="Предыдущий месяц"
              className={styles.monthArrow}
              disabled={monthIndex === 0}
              onClick={() => setMonthIndex((value) => Math.max(0, value - 1))}
              type="button"
            >
              <ChevronLeft aria-hidden size={16} strokeWidth={2} />
            </button>
            <span>{monthLabel}</span>
            <button
              aria-label="Следующий месяц"
              className={styles.monthArrow}
              disabled={monthIndex >= operationsScreenData.monthLabels.length - 1}
              onClick={() =>
                setMonthIndex((value) => Math.min(operationsScreenData.monthLabels.length - 1, value + 1))
              }
              type="button"
            >
              <ChevronRight aria-hidden size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.chartBlock}>
            <div className={styles.gaugeStage}>
              <svg
                aria-label="Распределение расходов"
                className={styles.gaugeSvg}
                role="img"
                viewBox={`0 0 ${GAUGE.width} ${GAUGE.height}`}
              >
                {gaugeSegments.map((segment) => {
                  const isActive = activeBreakdownId === segment.id;

                  return (
                    <path
                      className={styles.gaugeSegment}
                      d={segment.path}
                      key={segment.id}
                      onClick={() => selectBreakdown(segment.id)}
                      stroke={segment.color}
                      style={{ opacity: isActive ? 1 : activeBreakdownId ? 0.42 : 1 }}
                    />
                  );
                })}
              </svg>

              <div className={styles.gaugeCenter}>
                <span>Всего</span>
                <strong>{formatCurrencyParts(totalAmount).whole} ₽</strong>
              </div>

              {breakdown.map((item) => {
                const isActive = activeBreakdownId === item.id;
                const positionClass = bubbleClass[item.id as keyof typeof bubbleClass];

                return (
                  <button
                    aria-label={`${item.label}: ${item.percent}%`}
                    aria-pressed={isActive}
                    className={cn(styles.percentBubble, positionClass, isActive && styles.percentBubbleActive)}
                    key={item.id}
                    onClick={() => selectBreakdown(item.id)}
                    type="button"
                  >
                    {item.percent}%
                  </button>
                );
              })}
            </div>

            <div className={styles.legendGrid}>
              {LEGEND_ORDER.map((id) => {
                const item = breakdown.find((entry) => entry.id === id);
                if (!item) return null;

                const isActive = activeBreakdownId === item.id;

                return (
                  <button
                    className={cn(
                      styles.legendItem,
                      id === "hotels" && styles.legendItemWide,
                      isActive && styles.legendItemActive,
                    )}
                    key={item.id}
                    onClick={() => selectBreakdown(item.id)}
                    type="button"
                  >
                    <span className={cn(styles.legendContent, id === "hotels" && styles.legendContentWide)}>
                      <span className={styles.legendLabel}>
                        <span className={cn(styles.legendDot, legendDotClass[item.id as keyof typeof legendDotClass])} />
                        {item.label}
                      </span>
                      <strong>{item.percent}%</strong>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
