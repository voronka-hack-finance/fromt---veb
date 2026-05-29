"use client";

import Link from "next/link";
import { ArrowUpDown, BarChart3, ChevronLeft, ChevronRight, PieChart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  useOperationsScreenQuery,
  type OperationsScreenResponse,
} from "@/shared/api/operations";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { operationsChartHref } from "@/shared/lib/operations-period";
import { useOperationsPeriod } from "@/shared/lib/use-operations-period";
import { QueryLoading } from "@/shared/ui/query-state/query-state";

import styles from "./operations-breakdown-card.module.css";

type Period = OperationsScreenResponse["periodTabs"][number];

const LEGEND_ORDER = ["transfers", "hotels", "groceries"] as const;

const ARC_SRC = {
  transfers: "/operations/breakdown/arc-transfers.svg",
  hotels: "/operations/breakdown/arc-hotels.svg",
  groceries: "/operations/breakdown/arc-groceries.svg",
} as const;

const arcClass = {
  transfers: styles.arcTransfers,
  hotels: styles.arcHotels,
  groceries: styles.arcGroceries,
} as const;

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

function getNavigatorTotal(
  operationsScreenData: OperationsScreenResponse,
  period: Period,
  navigatorIndex: number,
) {
  const navigator = operationsScreenData.periodNavigator[period];
  const base = operationsScreenData.breakdownByPeriod[period].total;
  const offset = navigatorIndex - navigator.defaultIndex;

  return Math.round(base * (1 + offset * 0.02));
}

export function OperationsBreakdownCard() {
  const screenQuery = useOperationsScreenQuery();

  if (screenQuery.isLoading) {
    return <QueryLoading compact label="Загрузка графика..." />;
  }

  if (screenQuery.isError || !screenQuery.data) {
    return null;
  }

  return <OperationsBreakdownCardContent operationsScreenData={screenQuery.data} />;
}

function OperationsBreakdownCardContent({
  operationsScreenData,
}: {
  operationsScreenData: OperationsScreenResponse;
}) {
  const [activePeriod, setActivePeriod] = useOperationsPeriod(operationsScreenData.activePeriod);
  const [activeBreakdownId, setActiveBreakdownId] = useState<string>("transfers");
  const navigator = operationsScreenData.periodNavigator[activePeriod];
  const [navigatorIndex, setNavigatorIndex] = useState(navigator.defaultIndex);

  const periodData = operationsScreenData.breakdownByPeriod[activePeriod];
  const navigatorLabel = navigator.labels[navigatorIndex] ?? navigator.labels[navigator.defaultIndex];

  const totalAmount = useMemo(
    () => getNavigatorTotal(operationsScreenData, activePeriod, navigatorIndex),
    [activePeriod, navigatorIndex, operationsScreenData],
  );

  const breakdown = useMemo(
    () =>
      periodData.items.map((item) => ({
        ...item,
        amount: Math.round((totalAmount * item.percent) / 100),
      })),
    [periodData.items, totalAmount],
  );

  const handlePeriodChange = (period: Period) => {
    const nextNavigator = operationsScreenData.periodNavigator[period];
    setActivePeriod(period);
    setActiveBreakdownId("transfers");
    setNavigatorIndex(nextNavigator.defaultIndex);
  };

  useEffect(() => {
    setNavigatorIndex(operationsScreenData.periodNavigator[activePeriod].defaultIndex);
  }, [activePeriod, operationsScreenData.periodNavigator]);

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
            <Link aria-label="Тренды" className={styles.viewButton} href={operationsChartHref("/operations/trends", activePeriod)}>
              <ArrowUpDown size={24} strokeWidth={1.8} />
            </Link>
            <Link aria-label="Столбцы" className={styles.viewButton} href={operationsChartHref("/operations/bars", activePeriod)}>
              <BarChart3 size={24} strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.monthSwitcher}>
            <button
              aria-label="Предыдущий период"
              className={styles.monthArrow}
              disabled={navigatorIndex === 0}
              onClick={() => setNavigatorIndex((value) => Math.max(0, value - 1))}
              type="button"
            >
              <ChevronLeft aria-hidden size={16} strokeWidth={2} />
            </button>
            <span>{navigatorLabel}</span>
            <button
              aria-label="Следующий период"
              className={styles.monthArrow}
              disabled={navigatorIndex >= navigator.labels.length - 1}
              onClick={() =>
                setNavigatorIndex((value) => Math.min(navigator.labels.length - 1, value + 1))
              }
              type="button"
            >
              <ChevronRight aria-hidden size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.chartBlock}>
            <div className={styles.gaugeStage}>
              <div aria-hidden className={styles.gaugeArcs}>
                {(["transfers", "hotels", "groceries"] as const).map((id) => {
                  const isActive = activeBreakdownId === id;

                  return (
                    <button
                      aria-label={`${breakdown.find((item) => item.id === id)?.label ?? id}`}
                      className={cn(styles.arcSegment, arcClass[id])}
                      key={id}
                      onClick={() => selectBreakdown(id)}
                      style={{ opacity: isActive ? 1 : activeBreakdownId ? 0.42 : 1 }}
                      type="button"
                    >
                      <img alt="" className={styles.arcImage} src={ARC_SRC[id]} />
                    </button>
                  );
                })}
              </div>

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
