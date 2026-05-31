"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Info, SlidersHorizontal } from "lucide-react";
import { RubleBoldDuotoneIcon } from "@/shared/ui/icons/ruble-bold-duotone-icon";
import { useMemo, useRef, useState } from "react";

import { useTotalBalanceQuery, type TotalBalanceResponse } from "@/shared/api/total-balance";
import { buildLineChartPaths } from "@/shared/lib/charts";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { useCenteredHorizontalScroll } from "@/shared/lib/use-centered-horizontal-scroll";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { DesktopTotalBalanceScreen } from "./desktop-total-balance-screen";
import styles from "./total-balance-screen.module.css";

const chartWidth = 328;
const chartHeight = 128;
const chartPadding = 12;

function ScenarioCard({
  isActive,
  months,
  avgSpend,
  allAccounts,
  tag,
  tone,
  onSelect,
}: TotalBalanceResponse["scenarios"][number] & {
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
  const query = useTotalBalanceQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка баланса..." query={query}>
      {(screenData) => <TotalBalanceScreenContent screenData={screenData} />}
    </QueryBoundary>
  );
}

function TotalBalanceScreenContent({ screenData }: { screenData: TotalBalanceResponse }) {
  const accountFilters = screenData.filters.filter((filter) => filter.id !== "all");
  const scenarioSectionRef = useRef<HTMLElement>(null);
  const { viewportRef: scenarioViewportRef, activeIndex, scrollToIndex } =
    useCenteredHorizontalScroll<HTMLDivElement>({ initialIndex: 1 });
  const [activeChartIndex, setActiveChartIndex] = useState(screenData.defaultChartIndex);
  const [activeFilterId, setActiveFilterId] = useState(screenData.defaultFilterId);

  const activeFilter =
    screenData.filters.find((filter) => filter.id === activeFilterId) ??
    screenData.filters[0];
  const activeScenario = screenData.scenarios[activeIndex] ?? screenData.scenarios[1];
  const scenarioCount = screenData.scenarios.length;

  const trendPath = useMemo(
    () =>
      buildLineChartPaths(
        activeFilter.trend.map((point) => ({ value: point.value })),
        chartWidth,
        chartHeight,
        chartPadding,
      ),
    [activeFilter],
  );

  const amountParts = formatCurrencyParts(activeFilter.amount);
  const activeTrendPoint = activeFilter.trend[activeChartIndex];
  const activeCoordinate = trendPath.coordinates[activeChartIndex];

  const handleFilterChange = (filterId: string) => {
    setActiveFilterId(filterId);
    setActiveChartIndex((index) => {
      const nextLength =
        screenData.filters.find((filter) => filter.id === filterId)?.trend.length ?? 1;

      return Math.min(index, nextLength - 1);
    });
  };

  const scrollToScenarios = () => {
    scenarioSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <main className={styles.stage}>
      <div className={styles.desktopShell}>
        <DesktopTotalBalanceScreen screenData={screenData} />
      </div>

      <div className={styles.mobileShell}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/">
                <ArrowLeft size={22} strokeWidth={2} />
              </Link>
              <h1 className={styles.title}>{screenData.title}</h1>
            </header>
          </Reveal>

          <div className={styles.content}>
            <Reveal delay={0.08}>
              <section className={styles.balanceCard}>
                <div className={styles.amount}>
                  <span>{amountParts.whole}</span>
                  <span className={styles.amountFraction}>, {amountParts.fraction} ₽</span>
                </div>
                <p className={styles.subtitle}>{activeFilter.subtitle}</p>

                <div className={styles.filterRow}>
                  <button
                    aria-label="Все счета"
                    aria-pressed={activeFilterId === "all"}
                    className={cn(styles.filterButton, activeFilterId === "all" && styles.filterButtonActive)}
                    onClick={() => handleFilterChange("all")}
                    type="button"
                  >
                    <SlidersHorizontal size={18} strokeWidth={2} />
                  </button>
                  {accountFilters.map((filter) => (
                    <button
                      aria-pressed={activeFilterId === filter.id}
                      className={cn(styles.valueChip, activeFilterId === filter.id && styles.valueChipActive)}
                      key={filter.id}
                      onClick={() => handleFilterChange(filter.id)}
                      type="button"
                    >
                      <RubleBoldDuotoneIcon size={18} />
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.chartBlock}>
                  <svg
                    aria-label="Динамика средств по месяцам"
                    className={styles.chart}
                    role="img"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
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
                      animate={{ opacity: 1 }}
                      className={styles.chartArea}
                      d={trendPath.areaPath}
                      fill="url(#balanceArea)"
                      initial={{ opacity: 0 }}
                      key={`${activeFilterId}-area`}
                      transition={{ duration: 0.35 }}
                    />
                    <motion.path
                      animate={{ pathLength: 1 }}
                      className={styles.chartLine}
                      d={trendPath.linePath}
                      initial={{ pathLength: 0 }}
                      key={`${activeFilterId}-line`}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {trendPath.coordinates.map((point, index) => {
                      const isActive = index === activeChartIndex;

                      return (
                        <g key={`${activeFilterId}-${point.x}-${point.y}`}>
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
                            r={isActive ? 5.5 : 3.5}
                            transition={{ damping: 20, stiffness: 260, type: "spring" }}
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
                    {activeFilter.trend.map((point, index) => (
                      <button
                        className={cn(styles.monthButton, index === activeChartIndex && styles.monthButtonActive)}
                        key={`${activeFilterId}-${point.month}`}
                        onClick={() => setActiveChartIndex(index)}
                        type="button"
                      >
                        {point.month}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.12}>
              <button className={styles.reserveCard} onClick={scrollToScenarios} type="button">
                <div className={styles.reserveTop}>
                  <div className={styles.reserveHeadline}>
                    <span>Хватит на</span>
                    <strong>{activeScenario.months} месяца</strong>
                  </div>
                  <Info aria-hidden size={21} strokeWidth={2} />
                </div>
                <p className={styles.reserveLabel}>Столько вы тратите в месяц</p>
                <div className={styles.reserveBottom}>
                  <div className={styles.reserveValue}>{formatCurrencyParts(activeScenario.avgSpend).whole} ₽</div>
                  <div className={styles.reserveBadge}>{activeScenario.tag}</div>
                </div>
              </button>
            </Reveal>

            <Reveal delay={0.16}>
              <section className={styles.scenarioSection} ref={scenarioSectionRef}>
                <div className={styles.sliderTrack}>
                  <div className={styles.sliderRail}>
                    {screenData.scenarios.map((scenario, index) => (
                      <button
                        aria-label={`Сценарий ${index + 1}`}
                        aria-pressed={index === activeIndex}
                        className={cn(styles.sliderDot, index === activeIndex && styles.sliderDotActive)}
                        key={scenario.id}
                        onClick={() => scrollToIndex(index, "smooth")}
                        style={{
                          left: `${scenarioCount > 1 ? (index / (scenarioCount - 1)) * 100 : 50}%`,
                        }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.scenarioViewport} ref={scenarioViewportRef}>
                  <motion.div
                    className={styles.scenarioRail}
                    initial={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    {screenData.scenarios.map((scenario, index) => {
                      const isActive = index === activeIndex;

                      return (
                        <motion.div
                          animate={{ opacity: isActive ? 1 : 0.22, y: isActive ? -14 : 0 }}
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
      </div>
    </main>
  );
}
