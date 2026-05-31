"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  useOperationsScreenQuery,
  type OperationsScreenResponse,
} from "@/shared/api/operations";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { useOperationsPeriod } from "@/shared/lib/use-operations-period";
import { QueryLoading } from "@/shared/ui/query-state/query-state";

import { OperationsChartCardHeader } from "./operations-chart-card-header";
import styles from "./operations-breakdown-card.module.css";

type Period = OperationsScreenResponse["periodTabs"][number];

const LEGEND_ORDER = ["transfers", "hotels", "groceries"] as const;

type BreakdownSlotId = (typeof LEGEND_ORDER)[number];

type BreakdownEntry = OperationsScreenResponse["breakdownByPeriod"]["Нед"]["items"][number] & {
  amount: number;
};

function mapBreakdownToSlots(items: BreakdownEntry[]) {
  const sorted = [...items].sort((left, right) => right.percent - left.percent);

  return LEGEND_ORDER.flatMap((slotId, index) => {
    const item = sorted[index];
    return item ? [{ item, slotId }] : [];
  });
}

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
  const [activeBreakdownId, setActiveBreakdownId] = useState<string | null>(null);
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

  const slottedBreakdown = useMemo(() => mapBreakdownToSlots(breakdown), [breakdown]);

  const handlePeriodChange = (period: Period) => {
    const nextNavigator = operationsScreenData.periodNavigator[period];
    setActivePeriod(period);
    setActiveBreakdownId(null);
    setNavigatorIndex(nextNavigator.defaultIndex);
  };

  useEffect(() => {
    setNavigatorIndex(operationsScreenData.periodNavigator[activePeriod].defaultIndex);
  }, [activePeriod, operationsScreenData.periodNavigator]);

  const selectBreakdown = (id: string) => {
    setActiveBreakdownId((current) => (current === id ? null : id));
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardInner}>
        <OperationsChartCardHeader
          activePeriod={activePeriod}
          activeView="pie"
          onPeriodChange={handlePeriodChange}
          periodTabs={operationsScreenData.periodTabs}
        />

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
            <div className={styles.gaugeChartWrap}>
              <div className={styles.gaugeStage}>
                <div aria-hidden className={styles.gaugeArcs}>
                {(["transfers", "hotels", "groceries"] as const).map((id) => {
                  const slotItem = slottedBreakdown.find((entry) => entry.slotId === id)?.item;
                  const isActive = Boolean(slotItem && activeBreakdownId === slotItem.id);

                  return (
                    <motion.button
                      aria-label={`${slotItem?.label ?? id}`}
                      animate={{
                        opacity: 1,
                        scale: isActive ? 1.02 : 1,
                      }}
                      className={cn(styles.arcSegment, arcClass[id])}
                      initial={{ opacity: 0, scale: 0.92 }}
                      key={id}
                      onClick={() => selectBreakdown(slotItem?.id ?? id)}
                      transition={{ duration: 0.35, delay: id === "transfers" ? 0.04 : id === "hotels" ? 0.09 : 0.14 }}
                      type="button"
                    >
                      <img alt="" className={styles.arcImage} src={ARC_SRC[id]} />
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                animate={{ opacity: 1 }}
                className={styles.gaugeCenter}
                initial={{ opacity: 0 }}
                key={`${activePeriod}-${navigatorIndex}-${totalAmount}`}
                transition={{ duration: 0.28 }}
              >
                <span>Всего</span>
                <strong>{formatCurrencyParts(totalAmount).whole} ₽</strong>
              </motion.div>

              {slottedBreakdown.map(({ item, slotId }) => {
                const isActive = activeBreakdownId === item.id;

                return (
                  <motion.button
                    aria-label={`${item.label}: ${item.percent}%`}
                    aria-pressed={isActive}
                    animate={{ opacity: 1 }}
                    className={cn(
                      styles.percentBubble,
                      bubbleClass[slotId as BreakdownSlotId],
                      isActive && styles.percentBubbleActive,
                    )}
                    initial={{ opacity: 0 }}
                    key={item.id}
                    onClick={() => selectBreakdown(item.id)}
                    transition={{
                      duration: 0.28,
                      delay: slotId === "transfers" ? 0.18 : slotId === "hotels" ? 0.24 : 0.3,
                    }}
                    type="button"
                  >
                    {item.percent}%
                  </motion.button>
                );
              })}
              </div>
            </div>

            <div className={styles.legendGrid}>
              {slottedBreakdown.map(({ item, slotId }) => {
                const isActive = activeBreakdownId === item.id;

                return (
                  <motion.button
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      styles.legendItem,
                      slotId === "groceries" && styles.legendItemGroceries,
                      isActive && styles.legendItemActive,
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    key={item.id}
                    onClick={() => selectBreakdown(item.id)}
                    transition={{
                      duration: 0.28,
                      delay: slotId === "transfers" ? 0.1 : slotId === "hotels" ? 0.16 : 0.22,
                    }}
                    type="button"
                  >
                    <span className={styles.legendContent}>
                      <span className={styles.legendLabel}>
                        <span
                          className={cn(styles.legendDot, legendDotClass[slotId as BreakdownSlotId])}
                        />
                        {item.label}
                      </span>
                      <strong>{item.percent}%</strong>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
