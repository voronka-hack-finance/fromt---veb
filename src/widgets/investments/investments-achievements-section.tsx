"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";

import type { InvestmentsBalanceResponse } from "@/shared/api/investments-balance";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./investments-achievements-section.module.css";

const assets = {
  achievementIcon: "/desktop/achievements/achievement-icon.svg",
} as const;

type Scenario = InvestmentsBalanceResponse["scenarios"][number];

function ScenarioCard({
  isActive,
  onSelect,
  scenario,
}: {
  isActive: boolean;
  onSelect: () => void;
  scenario: Scenario;
}) {
  const [percentValue = "", ...percentRest] = scenario.percentLabel.split(" ");
  const spentFormatted = formatCurrencyParts(scenario.spent).whole;
  const leftFormatted =
    scenario.left === 0 ? "0 ₽" : `${formatCurrencyParts(scenario.left).whole} ₽`;
  const totalFormatted = formatCurrencyParts(scenario.totalIncome).whole;

  return (
    <motion.button
      animate={{ opacity: isActive ? 1 : 0.56, y: isActive ? -10 : 0 }}
      className={cn(
        styles.scenarioCard,
        scenario.tone === "bad" && styles.scenarioCardBad,
        scenario.tone === "default" && styles.scenarioCardNeutral,
        scenario.tone === "good" && styles.scenarioCardGood,
        isActive && styles.scenarioCardActive,
      )}
      initial={false}
      onClick={onSelect}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      type="button"
    >
      <span
        className={cn(
          styles.scenarioTag,
          scenario.tone === "bad" && styles.scenarioTagBad,
          scenario.tone === "default" && styles.scenarioTagNeutral,
          scenario.tone === "good" && styles.scenarioTagGood,
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
    </motion.button>
  );
}

export function InvestmentsAchievementsSection({
  scenarios,
}: {
  scenarios: InvestmentsBalanceResponse["scenarios"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

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

          <div className={styles.scenariosViewport}>
            <div className={styles.scenariosRow}>
              {scenarios.map((scenario, index) => (
                <ScenarioCard
                  isActive={index === activeIndex}
                  key={scenario.id}
                  onSelect={() => setActiveIndex(index)}
                  scenario={scenario}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
