"use client";

import { Info } from "lucide-react";
import { useMemo, useState } from "react";

import type { InvestmentsBalanceResponse } from "@/shared/api/investments-balance";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./investments-achievements-section.module.css";

const assets = {
  achievementIcon: "/desktop/achievements/achievement-icon.svg",
} as const;

type Scenario = InvestmentsBalanceResponse["scenarios"][number];

function ScenarioPanel({
  isActive,
  offset,
  onSelect,
  scenario,
}: {
  isActive: boolean;
  offset: -1 | 0 | 1;
  onSelect: () => void;
  scenario: Scenario;
}) {
  const [percentValue = "", ...percentRest] = scenario.percentLabel.split(" ");
  const spentFormatted = formatCurrencyParts(scenario.spent).whole;
  const leftFormatted =
    scenario.left === 0 ? "0 ₽" : `${formatCurrencyParts(scenario.left).whole} ₽`;
  const totalFormatted = formatCurrencyParts(scenario.totalIncome).whole;

  return (
    <article
      aria-label={`${scenario.tag}: ${scenario.percentLabel}`}
      className={cn(
        styles.panel,
        isActive ? styles.panelActive : styles.panelInactive,
        scenario.tone === "bad" && !isActive && styles.panelInactiveBad,
        scenario.tone === "default" && !isActive && styles.panelInactiveNeutral,
        scenario.tone === "good" && !isActive && styles.panelInactiveGood,
      )}
      data-offset={offset}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.panelInner}>
        <span
          className={cn(
            styles.scenarioTag,
            scenario.tone === "bad" && styles.scenarioTagBad,
            scenario.tone === "default" && styles.scenarioTagNeutral,
            scenario.tone === "good" && styles.scenarioTagGood,
            isActive && styles.scenarioTagActive,
          )}
        >
          {scenario.tag}
        </span>

        <p className={styles.scenarioHeadline}>
          <strong>{percentValue}</strong>
          {percentRest.length > 0 ? <span> {percentRest.join(" ")}</span> : null}
        </p>

        <div className={styles.scenarioMetric}>
          <p>
            Потратили {spentFormatted}, осталось <strong>{leftFormatted}</strong> из {totalFormatted}{" "}
            ₽
          </p>
        </div>
      </div>
    </article>
  );
}

export function InvestmentsAchievementsSection({
  scenarios,
}: {
  scenarios: InvestmentsBalanceResponse["scenarios"];
}) {
  const [activeIndex, setActiveIndex] = useState(1);

  const carouselItems = useMemo(
    () =>
      ([-1, 0, 1] as const).map((offset) => {
        const index = (activeIndex + offset + scenarios.length) % scenarios.length;

        return { index, offset };
      }),
    [activeIndex, scenarios.length],
  );

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
            <Info size={20} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.slider}>
            <div className={styles.sliderTrack} />
            <div className={styles.sliderDots}>
              {scenarios.map((scenario, index) => (
                <button
                  aria-label={`Сценарий: ${scenario.tag}`}
                  aria-pressed={index === activeIndex}
                  className={index === activeIndex ? styles.sliderDotActive : styles.sliderDot}
                  key={scenario.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div aria-live="polite" className={styles.carousel}>
            {carouselItems.map(({ index, offset }) => (
              <ScenarioPanel
                isActive={offset === 0}
                key={`${offset}-${scenarios[index].id}`}
                offset={offset}
                onSelect={() => setActiveIndex(index)}
                scenario={scenarios[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
