"use client";

import Link from "next/link";
import { useId, useMemo } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { motion } from "framer-motion";

import { useGoalDetailQuery, type GoalDetailResponse } from "@/shared/api/goal-detail";
import { buildLineChartPaths } from "@/shared/lib/charts";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./goal-detail-screen.module.css";

const assets = {
  accountDot: "/dashboard/balance/divider-dot-sber.svg",
} as const;

const CHART_WIDTH = 300;
const CHART_HEIGHT = 107;
const CHART_PADDING = 24;

function formatAmount(value: number) {
  return `${formatCurrencyParts(value).whole} ₽`;
}

function SavingsChart({ chart }: { chart: GoalDetailResponse["chart"] }) {
  const gradientId = useId();
  const trendPath = useMemo(
    () =>
      buildLineChartPaths(
        chart.values.map((value) => ({ value })),
        CHART_WIDTH,
        CHART_HEIGHT,
        CHART_PADDING,
      ),
    [chart.values],
  );

  return (
    <section className={styles.chartCard}>
      <h2 className={styles.chartTitle}>{chart.title}</h2>

      <div className={styles.chartWrap}>
        <div className={styles.chartYAxis}>
          {chart.yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className={styles.chartPlot}>
          <svg
            aria-label={chart.title}
            className={styles.chartSvg}
            role="img"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          >
            {chart.xLabels.map((_, index) => {
              const x =
                CHART_PADDING +
                ((CHART_WIDTH - CHART_PADDING * 2) / Math.max(chart.xLabels.length - 1, 1)) *
                  index;

              return (
                <line
                  className={styles.chartGridLine}
                  key={`grid-${index}`}
                  x1={x}
                  x2={x}
                  y1={CHART_PADDING}
                  y2={CHART_HEIGHT - CHART_PADDING}
                />
              );
            })}

            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(95, 226, 116, 0.55)" />
                <stop offset="100%" stopColor="rgba(95, 226, 116, 0.02)" />
              </linearGradient>
            </defs>

            <motion.path
              animate={{ opacity: 1 }}
              className={styles.chartArea}
              d={trendPath.areaPath}
              fill={`url(#${gradientId})`}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.path
              animate={{ pathLength: 1 }}
              className={styles.chartLine}
              d={trendPath.linePath}
              fill="none"
              initial={{ pathLength: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <div className={styles.chartXAxis}>
            {chart.xLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GoalDetailContent({ goal }: { goal: GoalDetailResponse }) {
  const progress = Math.min(100, (goal.current / goal.target) * 100);
  const progressPercent = Math.round(progress);

  return (
    <main className={styles.viewport}>
      <div className={styles.shell}>
        <div className={styles.content}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/goals">
                <ArrowLeft size={24} strokeWidth={2} />
              </Link>
              <h1 className={styles.title}>Цель</h1>
              <button aria-label="Редактировать цель" className={styles.editButton} type="button">
                <Pencil size={20} strokeWidth={1.8} />
              </button>
            </header>
          </Reveal>

          <Reveal delay={0.06}>
            <section className={styles.heroCard}>
              <div aria-hidden className={styles.heroBackground}>
                <img alt="" className={styles.heroImage} draggable={false} src={goal.image} />
                <div className={styles.heroOverlay} />
              </div>

              <div className={styles.heroContent}>
                <div className={styles.heroTopRow}>
                  <h2 className={styles.heroTitle}>{goal.title}</h2>

                  <div className={styles.accountChip}>
                    <img
                      alt=""
                      aria-hidden
                      className={styles.accountIcon}
                      draggable={false}
                      src={goal.account.bankIcon}
                    />
                    <span className={styles.accountText}>
                      {goal.account.label}
                      <img
                        alt=""
                        aria-hidden
                        className={styles.accountDot}
                        draggable={false}
                        src={assets.accountDot}
                      />
                      {goal.account.suffix}
                    </span>
                  </div>
                </div>

                <div className={styles.heroProgressBlock}>
                  <p className={styles.amountRow}>
                    <span className={styles.amountCurrent}>{formatAmount(goal.current)} / </span>
                    <span className={styles.amountTarget}>{formatAmount(goal.target)}</span>
                  </p>

                  <div aria-hidden className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>

                  <p className={styles.progressLabel}>{progressPercent}% накоплено</p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.09}>
            <section className={styles.detailsCard}>
              <div className={styles.detailsRow}>
                <span>Цель</span>
                <strong>{formatAmount(goal.target)}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Накоплено</span>
                <strong>{formatAmount(goal.current)}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Срок</span>
                <strong className={styles.deadlineValue}>{goal.deadline}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Не хватает</span>
                <strong>{formatAmount(goal.remaining)}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Нужно в месяц</span>
                <strong>{formatAmount(goal.monthlyNeeded)}</strong>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <SavingsChart chart={goal.chart} />
          </Reveal>
        </div>
      </div>
    </main>
  );
}

export function GoalDetailScreenView({ goalId }: { goalId: string }) {
  const query = useGoalDetailQuery(goalId);

  return (
    <QueryBoundary loadingLabel="Загрузка цели..." query={query}>
      {(goal) => <GoalDetailContent goal={goal} />}
    </QueryBoundary>
  );
}
