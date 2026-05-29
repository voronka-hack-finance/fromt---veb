"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CircleDollarSign,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import { totalBalanceScreenData } from "@/shared/data/total-balance";
import { buildLineChartPaths } from "@/shared/lib/charts";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { useCenteredHorizontalScroll } from "@/shared/lib/use-centered-horizontal-scroll";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./total-balance-screen.module.css";

const chartWidth = 328;
const chartHeight = 128;
const chartPadding = 12;
const trendPath = buildLineChartPaths(
  totalBalanceScreenData.trend.map((point) => ({ value: point.value })),
  chartWidth,
  chartHeight,
  chartPadding,
);
const { whole, fraction } = formatCurrencyParts(totalBalanceScreenData.amount);

function ScenarioCard({
  isActive,
  months,
  avgSpend,
  allAccounts,
  tag,
  tone,
  onSelect,
}: (typeof totalBalanceScreenData.scenarios)[number] & {
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={[
        styles.scenarioCard,
        isActive ? styles.scenarioCardFocus : "",
        !isActive && tone === "green" ? styles.scenarioCardGreen : "",
        !isActive && tone === "muted" ? styles.scenarioCardMuted : "",
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <div className={styles.scenarioTag}>{tag}</div>
      <div className={styles.scenarioHeadline}>
        <span>на</span>
        <strong>{months}</strong>
        <span> месяца</span>
      </div>
      <div className={styles.scenarioMetric}>
        <span>Средние траты</span>
        <strong>≈ {formatCurrencyParts(avgSpend).whole} ₽</strong>
      </div>
      <div className={styles.scenarioMetric}>
        <span>На всех счетах</span>
        <strong>≈ {formatCurrencyParts(allAccounts).whole} ₽</strong>
      </div>
    </button>
  );
}

export function TotalBalanceScreen() {
  const { viewportRef: scenarioViewportRef, activeIndex, scrollToIndex } =
    useCenteredHorizontalScroll<HTMLDivElement>();
  const [activeChartIndex, setActiveChartIndex] = useState(3);
  const [activeFilterId, setActiveFilterId] = useState(
    totalBalanceScreenData.filters[1]?.id ?? totalBalanceScreenData.filters[0]?.id ?? "all",
  );
  const scenarioCount = totalBalanceScreenData.scenarios.length;
  const sliderHandlePosition = scenarioCount > 1 ? (activeIndex / (scenarioCount - 1)) * 100 : 50;
  const activeTrendPoint = totalBalanceScreenData.trend[activeChartIndex];
  const activeCoordinate = trendPath.coordinates[activeChartIndex];

  return (
    <main className={styles.stage}>
      <div className={styles.shell}>
        <Reveal delay={0.03}>
          <header className={styles.header}>
            <Link aria-label="Назад" className={styles.backButton} href="/">
              <ArrowLeft size={22} strokeWidth={2} />
            </Link>
            <h1 className={styles.title}>{totalBalanceScreenData.title}</h1>
          </header>
        </Reveal>

        <div className={styles.content}>
          <Reveal delay={0.08}>
            <section className={styles.balanceCard}>
              <div className={styles.amount}>
                <span>{whole}</span>
                <span className={styles.amountFraction}>, {fraction} ₽</span>
              </div>
              <p className={styles.subtitle}>{totalBalanceScreenData.subtitle}</p>

              <div className={styles.filterRow}>
                <button aria-label="Фильтры" className={styles.filterButton} type="button">
                  <SlidersHorizontal size={18} strokeWidth={2} />
                </button>
                {totalBalanceScreenData.filters.slice(1).map((filter) => (
                  <button
                    className={cn(styles.valueChip, activeFilterId === filter.id && styles.valueChipActive)}
                    key={filter.id}
                    onClick={() => setActiveFilterId(filter.id)}
                    type="button"
                  >
                    <CircleDollarSign size={18} strokeWidth={1.8} />
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>

              <div className={styles.chartBlock}>
                <svg
                  className={styles.chart}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  role="img"
                  aria-label="Динамика средств по месяцам"
                >
                  {Array.from({ length: 5 }, (_, index) => {
                    const y = 16 + ((chartHeight - 28) / 4) * index;
                    return (
                      <line
                        className={styles.chartGrid}
                        key={y}
                        x1="0"
                        x2={chartWidth}
                        y1={y}
                        y2={y}
                      />
                    );
                  })}

                  <defs>
                    <linearGradient id="balanceArea" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(98, 231, 103, 0.45)" />
                      <stop offset="100%" stopColor="rgba(98, 231, 103, 0.03)" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    className={styles.chartArea}
                    d={trendPath.areaPath}
                    fill="url(#balanceArea)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    className={styles.chartLine}
                    d={trendPath.linePath}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {trendPath.coordinates.map((point, index) => {
                    const isActive = index === activeChartIndex;

                    return (
                      <g key={`${point.x}-${point.y}`}>
                        <circle
                          className={styles.chartHitArea}
                          cx={point.x}
                          cy={point.y}
                          onClick={() => setActiveChartIndex(index)}
                          r={12}
                        />
                        <motion.circle
                          animate={{ r: isActive ? 5.5 : 3.5, opacity: isActive ? 1 : 0.55 }}
                          className={cn(styles.chartPoint, isActive && styles.chartPointActive)}
                          cx={point.x}
                          cy={point.y}
                          initial={{ scale: 0 }}
                          r={isActive ? 5.5 : 3.5}
                          viewport={{ once: true }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 240, damping: 18 }}
                        />
                      </g>
                    );
                  })}

                  {activeTrendPoint && activeCoordinate ? (
                    <foreignObject
                      height="44"
                      width="88"
                      x={Math.min(Math.max(activeCoordinate.x - 44, 4), chartWidth - 92)}
                      y={Math.max(activeCoordinate.y - 52, 4)}
                    >
                      <div className={styles.chartTooltip}>
                        <span>{formatCurrencyParts(activeTrendPoint.value).whole} ₽</span>
                        <span>{activeTrendPoint.month}</span>
                      </div>
                    </foreignObject>
                  ) : null}
                </svg>

                <div className={styles.monthRow}>
                  {totalBalanceScreenData.trend.map((point) => (
                    <span key={point.month}>{point.month}</span>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <button className={styles.reserveCard} type="button">
              <div className={styles.reserveTop}>
                <div className={styles.reserveHeadline}>
                  <span>Хватит на</span>
                  <strong>{totalBalanceScreenData.reserveCard.months} месяца</strong>
                </div>
                <Info size={21} strokeWidth={2} />
              </div>
              <p className={styles.reserveLabel}>Столько вы тратите в месяц</p>
              <div className={styles.reserveBottom}>
                <div className={styles.reserveValue}>
                  {formatCurrencyParts(totalBalanceScreenData.reserveCard.monthlySpend).whole} ₽
                </div>
                <div className={styles.reserveBadge}>{totalBalanceScreenData.reserveCard.badge}</div>
              </div>
            </button>
          </Reveal>

          <Reveal delay={0.16}>
            <section className={styles.scenarioSection}>
              <div className={styles.sliderTrack}>
                <span
                  className={[styles.sliderDot, activeIndex === 0 ? styles.sliderDotActive : ""].join(" ")}
                />
                <span className={styles.sliderHandleRail}>
                  <motion.span
                    animate={{ left: `${sliderHandlePosition}%` }}
                    className={styles.sliderHandle}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span
                  className={[
                    styles.sliderDot,
                    activeIndex === scenarioCount - 1 ? styles.sliderDotActive : "",
                  ].join(" ")}
                />
              </div>

              <div className={styles.scenarioViewport} ref={scenarioViewportRef}>
                <motion.div
                  className={styles.scenarioRail}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {totalBalanceScreenData.scenarios.map((scenario, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <motion.div
                        animate={{ y: isActive ? -14 : 0, opacity: isActive ? 1 : 0.22 }}
                        className={styles.scenarioCell}
                        data-scenario-cell
                        initial={false}
                        key={scenario.id}
                        transition={{ duration: 0.45 }}
                      >
                        <ScenarioCard
                          {...scenario}
                          isActive={isActive}
                          onSelect={() => scrollToIndex(index, "smooth")}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
