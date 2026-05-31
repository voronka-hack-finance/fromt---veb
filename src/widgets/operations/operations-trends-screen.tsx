"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpDown,
  Building2,
  Edit3,
  GraduationCap,
  Share2,
  ShoppingBag,
  Wifi,
  BanknoteArrowDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  useOperationsScreenQuery,
  useOperationsTrendsQuery,
  type OperationsScreenResponse,
  type OperationsTrendsResponse,
} from "@/shared/api/operations";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import {
  buildTrendLinePoints,
  getTrendBarX,
  TREND_CHART,
  valueToBarHeight,
} from "@/shared/lib/operations-chart-layout";
import { useOperationsPeriod } from "@/shared/lib/use-operations-period";
import { QueryError, QueryLoading } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { OperationsChartCardHeader } from "./operations-chart-card-header";
import styles from "./operations-trends-screen.module.css";

const SCALE_LABEL_TOPS = [0, 65.28, 128.15] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatSignedAmount(value: number) {
  const sign = value > 0 ? "+" : "−";
  const amount = formatCurrencyParts(Math.abs(value));
  return `${sign}${amount.whole} ₽`;
}

function OperationIcon({
  icon,
  tone,
}: {
  icon: OperationsScreenResponse["operations"][number]["icon"];
  tone: OperationsScreenResponse["operations"][number]["iconTone"];
}) {
  const commonProps = { size: 18, strokeWidth: 1.9 };
  const className = [
    styles.operationIconWrap,
    tone === "accent" ? styles.operationIconAccent : "",
    tone === "success" ? styles.operationIconSuccess : "",
  ].join(" ");

  const iconNode =
    icon === "education" ? (
      <GraduationCap {...commonProps} />
    ) : icon === "bag" ? (
      <ShoppingBag {...commonProps} />
    ) : icon === "bank" ? (
      <Building2 {...commonProps} />
    ) : icon === "wifi" ? (
      <Wifi {...commonProps} />
    ) : (
      <BanknoteArrowDown {...commonProps} />
    );

  return <div className={className}>{iconNode}</div>;
}

function BankChip({
  bank,
  tone,
}: {
  bank: OperationsScreenResponse["operations"][number]["bank"];
  tone: OperationsScreenResponse["operations"][number]["bankTone"];
}) {
  return (
    <div
      className={[
        styles.bankChip,
        tone === "warn" ? styles.bankChipWarn : "",
        tone === "danger" ? styles.bankChipDanger : "",
      ].join(" ")}
    >
      <span className={styles.bankMark}>{bank.slice(0, 1)}</span>
      <span>{bank}</span>
    </div>
  );
}

export function OperationsTrendsScreenView() {
  const screenQuery = useOperationsScreenQuery();
  const trendsQuery = useOperationsTrendsQuery();

  if (screenQuery.isLoading || trendsQuery.isLoading) {
    return (
      <main className={styles.stage}>
        <QueryLoading label="Загрузка трендов..." />
      </main>
    );
  }

  if (screenQuery.isError || trendsQuery.isError || !screenQuery.data || !trendsQuery.data) {
    return (
      <main className={styles.stage}>
        <QueryError
          onRetry={() => {
            void screenQuery.refetch();
            void trendsQuery.refetch();
          }}
        />
      </main>
    );
  }

  return (
    <OperationsTrendsScreenContent
      operationsScreenData={screenQuery.data}
      operationsTrendsData={trendsQuery.data}
    />
  );
}

function OperationsTrendsScreenContent({
  operationsScreenData,
  operationsTrendsData,
}: {
  operationsScreenData: OperationsScreenResponse;
  operationsTrendsData: OperationsTrendsResponse;
}) {
  const [activePeriod, setActivePeriod] = useOperationsPeriod(operationsTrendsData.activePeriod);
  const periodData = operationsTrendsData.byPeriod[activePeriod];
  const [activeBarIndex, setActiveBarIndex] = useState(periodData.defaultActiveIndex);

  const chartBars = useMemo(
    () =>
      periodData.bars.map((bar) => ({
        ...bar,
        height: bar.height ?? valueToBarHeight(bar.value, periodData.spendScale[0]),
        tone: bar.tone,
      })),
    [periodData],
  );

  const linePoints = useMemo(
    () => buildTrendLinePoints([...periodData.lineValues], chartBars.length),
    [periodData.lineValues, chartBars.length],
  );

  const activeBar = chartBars[activeBarIndex] ?? chartBars[0];
  const activePoint = linePoints[activeBarIndex] ?? linePoints[0];

  const linePath = useMemo(
    () => linePoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "),
    [linePoints],
  );

  const barBottom = TREND_CHART.barAreaTop + TREND_CHART.barAreaHeight;
  const tooltipLeft = clamp(activePoint.x, 72, TREND_CHART.width - 72);
  const tooltipTop = clamp(activePoint.y, 44, TREND_CHART.barAreaTop + TREND_CHART.barAreaHeight);

  const handlePeriodChange = (period: typeof activePeriod) => {
    const nextData = operationsTrendsData.byPeriod[period];
    setActivePeriod(period);
    setActiveBarIndex(nextData.defaultActiveIndex);
  };

  useEffect(() => {
    setActiveBarIndex(operationsTrendsData.byPeriod[activePeriod].defaultActiveIndex);
  }, [activePeriod]);

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
      <div className={styles.shell}>
        <Reveal delay={0.03}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <Link aria-label="Назад" className={styles.iconButton} href="/">
                <ArrowLeft size={22} strokeWidth={2} />
              </Link>
              <h1 className={styles.title}>{operationsTrendsData.title}</h1>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.actionButton} type="button">
                <Share2 size={20} strokeWidth={2} />
              </button>
              <button className={styles.actionButton} type="button">
                <Edit3 size={20} strokeWidth={2} />
              </button>
            </div>
          </header>
        </Reveal>

        <div className={styles.content}>
          <Reveal delay={0.08}>
            <section className={styles.chartCard}>
              <div className={styles.cardInner}>
              <OperationsChartCardHeader
                activePeriod={activePeriod}
                activeView="trends"
                onPeriodChange={handlePeriodChange}
                periodTabs={operationsTrendsData.periodTabs}
              />

              <div className={styles.chartSection}>
                <div className={styles.chartBlock}>
                  <div className={styles.graphArea}>
                  {periodData.spendScale.map((label, index) => (
                    <span
                      className={styles.scaleLabel}
                      key={`scale-${index}`}
                      style={{ top: `${SCALE_LABEL_TOPS[index]}px` }}
                    >
                      {formatCurrencyParts(label).whole} ₽
                    </span>
                  ))}

                  <svg
                    aria-label="Тренд трат за месяц"
                    className={styles.chartSvg}
                    role="img"
                    viewBox={`0 0 ${TREND_CHART.width} ${TREND_CHART.height}`}
                  >
                    {TREND_CHART.gridLineYs.map((y) => (
                      <line
                        className={styles.gridLine}
                        key={y}
                        x1={TREND_CHART.gridLineLeft}
                        x2={TREND_CHART.gridLineLeft + TREND_CHART.gridLineWidth}
                        y1={y}
                        y2={y}
                      />
                    ))}

                    {chartBars.map((bar, index) => {
                      const x = getTrendBarX(index, chartBars.length);
                      const y = barBottom - bar.height;
                      const isActive = index === activeBarIndex;

                      return (
                        <motion.rect
                          className={isActive ? styles.barActive : styles.barMuted}
                          height={bar.height}
                          initial={{ height: 0, y: barBottom }}
                          key={`${activePeriod}-${bar.day}`}
                          onClick={() => setActiveBarIndex(index)}
                          rx="2.759"
                          style={{ cursor: "pointer" }}
                          viewport={{ once: true }}
                          whileInView={{ height: bar.height, y }}
                          width={TREND_CHART.barWidth}
                          x={x}
                          transition={{ duration: 0.55, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
                        />
                      );
                    })}

                    <motion.path
                      className={styles.trendLine}
                      d={linePath}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      key={activePeriod}
                      viewport={{ once: true }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {linePoints.map((point, index) => {
                      const isActive = index === activeBarIndex;

                      return (
                        <circle
                          className={cn(styles.point, isActive && styles.pointActive)}
                          cx={point.x}
                          cy={point.y}
                          key={`${activePeriod}-${point.x}-${point.y}`}
                          onClick={() => setActiveBarIndex(index)}
                          r={isActive ? 4 : 2.5}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    })}
                  </svg>

                  <motion.div
                    animate={{ opacity: 1 }}
                    className={styles.insightBubble}
                    initial={{ opacity: 0 }}
                    key={`${activePeriod}-${activeBar?.day}`}
                    style={{ left: `${tooltipLeft}px`, top: `${tooltipTop}px` }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className={styles.bubbleIcon}>
                      <ArrowUpDown size={12} strokeWidth={2.4} />
                    </div>
                    <div className={styles.bubbleText}>
                      <strong>{formatCurrencyParts(activeBar?.value ?? 0).whole} ₽</strong>
                      <span>
                        {activeBarIndex === periodData.defaultActiveIndex
                          ? periodData.insight.date
                          : activeBar?.day}
                      </span>
                    </div>
                  </motion.div>
                </div>

                  <div className={styles.chartFooter}>
                    <strong>{periodData.insight.percent}%</strong>
                    <p>{periodData.insight.text}</p>
                  </div>
                </div>
              </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <section className={styles.listSection}>
              <div className={styles.yesterdayHeader}>
                <span>{operationsScreenData.yesterday.label}</span>
                <div className={styles.headerDivider} />
                <strong>+{formatCurrencyParts(operationsScreenData.yesterday.total).whole} ₽</strong>
              </div>

              <div className={styles.operationsList}>
                {operationsScreenData.operations.map((operation, index) => (
                  <motion.button
                    className={styles.operationCard}
                    initial={{ opacity: 0, y: 18 }}
                    key={operation.id}
                    type="button"
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.04 * index }}
                  >
                    <div className={styles.operationRow}>
                      <OperationIcon icon={operation.icon} tone={operation.iconTone} />

                      <div className={styles.operationText}>
                        <span>{operation.category}</span>
                        <p>{operation.title}</p>
                      </div>

                      <div className={styles.operationMeta}>
                        <BankChip bank={operation.bank} tone={operation.bankTone} />
                        <strong
                          className={
                            operation.direction === "income" ? styles.amountIncome : styles.amountOutcome
                          }
                        >
                          {formatSignedAmount(operation.amount)}
                        </strong>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
    </DesktopSidebarLayout>
  );
}
