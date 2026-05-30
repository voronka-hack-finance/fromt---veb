"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./funds-runway-section.module.css";

const assets = {
  achievementIcon: "/desktop/achievements/achievement-icon.svg",
  infoIcon: "/desktop/achievements/info.svg",
} as const;

const runwayScenarios = [
  {
    id: "one",
    label: "Хорошо",
    months: 1,
    monthWord: "месяц",
    sideTone: "ghost" as const,
  },
  {
    id: "two",
    label: "Хорошо",
    months: 2,
    monthWord: "месяца",
    sideTone: "ghost" as const,
  },
  {
    id: "four",
    label: "Отлично",
    months: 4,
    monthWord: "месяца",
    sideTone: "success" as const,
  },
] as const;

const averageSpending = "≈ 10 230 ₽";
const totalOnAccounts = "≈ 60 230 ₽";

type RunwayScenario = (typeof runwayScenarios)[number];

function RunwayPanel({
  isActive,
  scenario,
  slot,
}: {
  isActive: boolean;
  scenario: RunwayScenario;
  slot: 0 | 1 | 2;
}) {
  return (
    <article
      className={cn(
        styles.panel,
        styles[`panelSlot${slot}`],
        isActive ? styles.panelActive : styles.panelInactive,
        !isActive && scenario.sideTone === "success" && styles.panelInactiveSuccess,
        !isActive && scenario.sideTone === "ghost" && styles.panelInactiveGhost,
      )}
    >
      <div className={styles.panelInner}>
        <span
          className={cn(
            styles.badge,
            isActive && styles.badgeActive,
            !isActive && scenario.sideTone === "success" && styles.badgeSuccessMuted,
            !isActive && scenario.sideTone === "ghost" && styles.badgeGhostMuted,
          )}
        >
          {scenario.label}
        </span>

        <p className={styles.monthsTitle}>
          На{" "}
          <strong className={isActive ? styles.monthsHighlightActive : styles.monthsHighlightMuted}>
            {scenario.months}
          </strong>{" "}
          {scenario.monthWord}
        </p>

        <div className={styles.metrics}>
          <div className={styles.metricBlock}>
            <span>Средние траты</span>
            <strong>{averageSpending}</strong>
          </div>
          <div className={styles.metricBlock}>
            <span>На всех счетах</span>
            <strong>{totalOnAccounts}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export function FundsRunwaySection() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <div className={styles.intro}>
            <div aria-hidden className={styles.iconWrap}>
              <img
                alt=""
                className={styles.achievementIcon}
                draggable={false}
                height={67}
                src={assets.achievementIcon}
                width={67}
              />
            </div>

            <div className={styles.introCopy}>
              <span className={styles.eyebrow}>Ваши достижения</span>
              <h2 className={styles.title}>На сколько хватит ваших средств</h2>
            </div>
          </div>

          <button className={styles.infoLink} type="button">
            <span>Как мы это считаем?</span>
            <img alt="" aria-hidden className={styles.infoIcon} draggable={false} src={assets.infoIcon} />
          </button>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.slider}>
            <div className={styles.sliderTrack} />
            <div className={styles.sliderDots}>
              {runwayScenarios.map((scenario, index) => (
                <button
                  aria-label={`Сценарий: ${scenario.months} ${scenario.monthWord}`}
                  aria-pressed={index === activeIndex}
                  className={index === activeIndex ? styles.sliderDotActive : styles.sliderDot}
                  key={scenario.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className={styles.carousel}>
            {runwayScenarios.map((scenario, index) => (
              <RunwayPanel
                isActive={index === activeIndex}
                key={scenario.id}
                scenario={scenario}
                slot={index as 0 | 1 | 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
