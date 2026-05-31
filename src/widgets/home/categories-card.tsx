"use client";

import { useState } from "react";

import type { DashboardResponse } from "@/shared/api/dashboard";
import { useDashboardData } from "@/shared/api/dashboard-context";

import styles from "./categories-card.module.css";

const assets = {
  cardBg: "/dashboard/categories/card-bg.svg",
  icon: "/dashboard/categories/icon-presentation-chart.svg",
  radarGrid1: "/dashboard/categories/radar-grid-1.svg",
  radarGrid2: "/dashboard/categories/radar-grid-2.svg",
  radarGrid3: "/dashboard/categories/radar-grid-3.svg",
  radarDataFill: "/dashboard/categories/radar-outer.svg",
  radarDataStroke: "/dashboard/categories/radar-data.svg",
  radarDot: "/dashboard/categories/radar-dot.svg",
  radarDotAlt: "/dashboard/categories/radar-dot-alt.svg",
} as const;

type MetricId = DashboardResponse["categoryRadarMetrics"][number]["id"];

const hitAreaStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  height: 32,
  padding: 0,
  pointerEvents: "auto" as const,
  transform: "translate(-50%, -50%)",
  width: 32,
  zIndex: 5,
} as const;

const labeledMetrics = {
  expenses: {
    tagClass: styles.tagExpenses,
    labelClass: styles.labelExpenses,
    dotClass: styles.radarDotLeftTop,
    dotSrc: assets.radarDot,
  },
  reserve: {
    tagClass: styles.tagReserve,
    labelClass: styles.labelReserve,
    dotClass: styles.radarDotRightTop,
    dotSrc: assets.radarDot,
  },
  protection: {
    tagClass: styles.tagProtection,
    labelClass: styles.labelProtection,
    dotClass: styles.radarDotLeftBottom,
    dotSrc: assets.radarDot,
  },
} as const;

const unlabeledDots = [
  { id: "income" as const, dotClass: styles.radarDotRightMid, dotSrc: assets.radarDot },
  { id: "investments" as const, dotClass: styles.radarDotLeftMid, dotSrc: assets.radarDotAlt },
  { id: "credit" as const, dotClass: styles.radarDotBottom, dotSrc: assets.radarDot },
] as const;

function ChartLayer({ className, src }: { className: string; src: string }) {
  return (
    <div className={className}>
      <img alt="" aria-hidden className={styles.chartImage} draggable={false} src={src} />
    </div>
  );
}

function getActiveTagStyle(isActive: boolean) {
  return {
    background: isActive ? "#40a93d" : "#1f1f1f",
    border: "none",
    cursor: "pointer",
  } as const;
}

function getActiveLabelStyle(isActive: boolean) {
  return {
    border: "none",
    color: isActive ? "#1f1f1f" : "#666",
    cursor: "pointer",
    fontWeight: isActive ? 700 : 600,
    opacity: isActive ? 1 : 0.75,
  } as const;
}

export function CategoriesCard() {
  const { categoryRadarMetrics, dashboard } = useDashboardData();
  const [activeMetricId, setActiveMetricId] = useState<MetricId>("reserve");

  const allDots = [
    ...unlabeledDots,
    ...(["expenses", "reserve", "protection"] as const).map((metricId) => ({
      id: metricId,
      dotClass: labeledMetrics[metricId].dotClass,
      dotSrc: labeledMetrics[metricId].dotSrc,
    })),
  ];

  const activeMetric =
    categoryRadarMetrics.find((metric) => metric.id === activeMetricId) ?? categoryRadarMetrics[1];

  const handleSelect = (metricId: MetricId) => {
    setActiveMetricId(metricId);
  };

  return (
    <section className={styles.card}>
      <img alt="" aria-hidden className={styles.cardBg} draggable={false} src={assets.cardBg} />

      <div className={styles.header}>
        <div className={styles.iconButton}>
          <img alt="" aria-hidden className={styles.icon} draggable={false} src={assets.icon} />
        </div>
        <h2 className={styles.title}>Ваши категории</h2>
      </div>

      <div className={styles.chart}>
        <ChartLayer className={`${styles.chartLayer} ${styles.radarGrid1}`} src={assets.radarGrid1} />
        <ChartLayer className={`${styles.chartLayer} ${styles.radarGrid2}`} src={assets.radarGrid2} />
        <ChartLayer className={`${styles.chartLayer} ${styles.radarGrid3}`} src={assets.radarGrid3} />
        <ChartLayer className={`${styles.chartLayer} ${styles.radarDataFill}`} src={assets.radarDataFill} />
        <ChartLayer className={`${styles.chartLayer} ${styles.radarDataStroke}`} src={assets.radarDataStroke} />

        {allDots.map((dot) => (
          <ChartLayer
            className={`${styles.chartLayer} ${dot.dotClass}`}
            key={`visual-${dot.id}`}
            src={dot.dotSrc}
          />
        ))}

        {allDots.map((dot) => {
          const metric = categoryRadarMetrics.find((item) => item.id === dot.id);

          return (
            <button
              aria-label={`${metric?.label ?? dot.id}: ${metric?.percent ?? 0}%`}
              aria-pressed={activeMetricId === dot.id}
              className={`${styles.chartLayer} ${dot.dotClass}`}
              key={`hit-${dot.id}`}
              onClick={() => handleSelect(dot.id)}
              style={hitAreaStyle}
              type="button"
            />
          );
        })}

        {(["expenses", "reserve", "protection"] as const).map((metricId) => {
          const metric = categoryRadarMetrics.find((item) => item.id === metricId);
          const ui = labeledMetrics[metricId];
          const isActive = activeMetricId === metricId;

          if (!metric || !ui) {
            return null;
          }

          return (
            <button
              aria-label={`${metric.label}: ${metric.percent}%`}
              aria-pressed={isActive}
              className={`${styles.tag} ${ui.tagClass}`}
              key={`tag-${metricId}`}
              onClick={() => handleSelect(metricId)}
              style={getActiveTagStyle(isActive)}
              type="button"
            >
              {metric.percent}%
            </button>
          );
        })}

        {(["expenses", "reserve", "protection"] as const).map((metricId) => {
          const metric = categoryRadarMetrics.find((item) => item.id === metricId);
          const ui = labeledMetrics[metricId];
          const isActive = activeMetricId === metricId;

          if (!metric || !ui) {
            return null;
          }

          return (
            <button
              aria-label={metric.label}
              aria-pressed={isActive}
              className={`${styles.label} ${ui.labelClass}`}
              key={`label-${metricId}`}
              onClick={() => handleSelect(metricId)}
              style={getActiveLabelStyle(isActive)}
              type="button"
            >
              {metric.label}
            </button>
          );
        })}
      </div>

      <button aria-label="Сводка по категориям" className={styles.summary} type="button">
        <div className={styles.summaryValue} key={activeMetric.id}>
          {activeMetric.percent} %
        </div>
        <p className={styles.summaryText} key={`text-${activeMetric.id}`}>
          Вы грамотно распределяете
          <br />
          финансы и делаете это лучше
          <br />
          {dashboard.betterThanUsers}% пользователей
        </p>
      </button>
    </section>
  );
}
