"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { useDashboardData } from "@/shared/api/dashboard-context";

import styles from "./credit-load-card.module.css";

const assets = {
  menuDots: "/dashboard/credit/menu-dots.svg",
  smiley: "/dashboard/credit/smiley.svg",
} as const;

const gaugeWidth = 288;
const gaugeHeight = 168;
const gaugeCenterX = 144;
const gaugeCenterY = 150;
const gaugeRadius = 120;
const gaugeStartX = gaugeCenterX - gaugeRadius;
const gaugeEndX = gaugeCenterX + gaugeRadius;
const gaugeArcPath = `M ${gaugeStartX} ${gaugeCenterY} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeEndX} ${gaugeCenterY}`;

export function CreditLoadCard() {
  const router = useRouter();
  const { dashboard } = useDashboardData();

  const creditRatio = dashboard.creditScore / dashboard.creditMax;
  const needleAngle = Math.PI * (1 - creditRatio);
  const needleInnerRadius = gaugeRadius - 10;
  const needleOuterRadius = gaugeRadius + 2;
  const needleX1 = gaugeCenterX + Math.cos(needleAngle) * needleInnerRadius;
  const needleY1 = gaugeCenterY - Math.sin(needleAngle) * needleInnerRadius;
  const needleX2 = gaugeCenterX + Math.cos(needleAngle) * needleOuterRadius;
  const needleY2 = gaugeCenterY - Math.sin(needleAngle) * needleOuterRadius;

  const gaugeStyle = useMemo(
    () => ({
      strokeDasharray: `${creditRatio * 100} 100`,
    }),
    [creditRatio],
  );

  return (
    <section className={styles.card}>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.tag}>Кредитная нагрузка</div>
          <button
            aria-label="Дополнительные действия"
            className={styles.menuButton}
            onClick={() => router.push("/credit-load")}
            type="button"
          >
            <img alt="" aria-hidden className={styles.menuIcon} draggable={false} src={assets.menuDots} />
          </button>
        </div>

        <button
          aria-label={`Кредитная нагрузка ${dashboard.creditScore} — ${dashboard.creditLabel}`}
          className={styles.gauge}
          onClick={() => router.push("/credit-load")}
          type="button"
        >
          <svg className={styles.gaugeSvg} viewBox={`0 0 ${gaugeWidth} ${gaugeHeight}`}>
            <path className={styles.gaugeTrackArc} d={gaugeArcPath} pathLength={100} />
            <path
              className={styles.gaugeProgressArc}
              d={gaugeArcPath}
              pathLength={100}
              style={gaugeStyle}
            />
            <line className={styles.gaugeNeedle} x1={needleX1} x2={needleX2} y1={needleY1} y2={needleY2} />
          </svg>

          <div className={styles.center}>
            <img alt="" aria-hidden className={styles.smiley} draggable={false} src={assets.smiley} />
            <div className={styles.scoreBlock}>
              <span className={styles.score}>{dashboard.creditScore}</span>
              <span className={styles.scoreLabel}>{dashboard.creditLabel}</span>
            </div>
          </div>
        </button>

        <button
          aria-label="Подробнее по кредитной нагрузке"
          className={styles.cta}
          onClick={() => router.push("/credit-load")}
          type="button"
        >
          Подробнее
        </button>
      </div>
    </section>
  );
}
