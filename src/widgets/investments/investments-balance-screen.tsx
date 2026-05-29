"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";
import { useState } from "react";

import { investmentsBalanceScreenData } from "@/shared/data/investments-balance";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { useCenteredHorizontalScroll } from "@/shared/lib/use-centered-horizontal-scroll";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./investments-balance-screen.module.css";

const CHART_TRACK_HEIGHT = 128;
const CHART_MAX_VALUE = 144;

const { whole, fraction } = formatCurrencyParts(investmentsBalanceScreenData.amount);

function ScenarioCard({
  isActive,
  left,
  percentLabel,
  spent,
  tag,
  tone,
  totalIncome,
  onSelect,
}: (typeof investmentsBalanceScreenData.scenarios)[number] & {
  isActive: boolean;
  onSelect: () => void;
}) {
  const [percentValue = "", ...percentRest] = percentLabel.split(" ");
  const spentFormatted = formatCurrencyParts(spent).whole;
  const leftFormatted = left === 0 ? "0 ₽" : `${formatCurrencyParts(left).whole} ₽`;
  const totalFormatted = formatCurrencyParts(totalIncome).whole;

  return (
    <button
      className={[
        styles.scenarioCard,
        isActive ? styles.scenarioCardFocus : "",
        !isActive && tone === "good" ? styles.scenarioCardGood : "",
        !isActive && tone === "bad" ? styles.scenarioCardBad : "",
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <div
        className={[
          styles.scenarioTag,
          tone === "good" ? styles.scenarioTagGood : "",
          tone === "bad" ? styles.scenarioTagBad : "",
        ].join(" ")}
      >
        {tag}
      </div>
      <div className={styles.scenarioHeadline}>
        <strong>{percentValue}</strong>
        {percentRest.length > 0 ? <span> {percentRest.join(" ")}</span> : null}
      </div>
      <div className={styles.scenarioMetric}>
        <p>
          Потратили {spentFormatted}, осталось <span>{leftFormatted}</span> из {totalFormatted} ₽
        </p>
      </div>
    </button>
  );
}

export function InvestmentsBalanceScreen() {
  const { viewportRef: scenarioViewportRef, activeIndex, scrollToIndex } =
    useCenteredHorizontalScroll<HTMLDivElement>();
  const defaultColumnIndex = investmentsBalanceScreenData.chart.findIndex(
    (item) => "labelValue" in item && item.labelValue !== undefined,
  );
  const [activeColumnIndex, setActiveColumnIndex] = useState(
    defaultColumnIndex >= 0 ? defaultColumnIndex : 0,
  );
  const scenarioCount = investmentsBalanceScreenData.scenarios.length;
  const sliderHandlePosition = scenarioCount > 1 ? (activeIndex / (scenarioCount - 1)) * 100 : 50;

  return (
    <main className={styles.stage}>
      <div className={styles.shell}>
        <Reveal delay={0.03}>
          <header className={styles.header}>
            <Link aria-label="Назад" className={styles.backButton} href="/">
              <ArrowLeft size={22} strokeWidth={2} />
            </Link>
            <h1 className={styles.title}>{investmentsBalanceScreenData.title}</h1>
          </header>
        </Reveal>

        <div className={styles.content}>
          <Reveal delay={0.08}>
            <section className={styles.chartCard}>
              <div className={styles.amount}>
                {whole},{fraction} ₽
              </div>

              <div className={styles.columns}>
                {investmentsBalanceScreenData.chart.map((item, index) => {
                  const isActive = index === activeColumnIndex;
                  const activeLabel =
                    isActive && "labelValue" in item && item.labelValue !== undefined
                      ? formatCurrencyParts(item.labelValue)
                      : isActive
                        ? formatCurrencyParts(item.value * 100)
                        : null;
                  const fillHeight = Math.round((item.value / CHART_MAX_VALUE) * CHART_TRACK_HEIGHT);

                  return (
                    <button
                      aria-label={`${item.month}: ${item.value}`}
                      className={cn(styles.columnWrap, isActive && styles.columnWrapActive)}
                      key={item.month}
                      onClick={() => setActiveColumnIndex(index)}
                      type="button"
                    >
                      <div className={styles.columnBody}>
                        {activeLabel ? (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.activePill}
                            initial={{ opacity: 0, y: 6 }}
                            key={`pill-${index}`}
                            transition={{ duration: 0.25 }}
                          >
                            {`${activeLabel.whole},${activeLabel.fraction}`}
                          </motion.div>
                        ) : null}

                        <div
                          className={[
                            styles.columnTrack,
                            item.tone === "future" ? styles.columnTrackFuture : "",
                          ].join(" ")}
                        >
                          <motion.div
                            animate={{ height: fillHeight }}
                            className={cn(styles.columnFill, isActive && styles.columnFillActive)}
                            initial={{ height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>

                      <span className={cn(styles.month, isActive && styles.monthActive)}>{item.month}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <button className={styles.summaryCard} type="button">
              <div className={styles.summaryTop}>
                <div className={styles.summaryHeadline}>
                  <span>Осталось</span>
                  <span className={styles.summaryPercentPill}>
                    {investmentsBalanceScreenData.summary.remainPercent} % дохода
                  </span>
                </div>
                <Info size={21} strokeWidth={2} />
              </div>
              <div className={styles.summaryBottom}>
                <div className={styles.summaryValueGroup}>
                  <span>Потратили</span>
                  <strong>{formatCurrencyParts(investmentsBalanceScreenData.summary.spentAmount).whole} ₽</strong>
                </div>
                <div className={styles.summaryBadge}>{investmentsBalanceScreenData.summary.badge}</div>
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
                    className={styles.sliderHandleWrap}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className={styles.sliderHandle} />
                  </motion.span>
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
                  {investmentsBalanceScreenData.scenarios.map((scenario, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <motion.div
                        animate={{ y: isActive ? -14 : 0, opacity: isActive ? 1 : 0.16 }}
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

              <button className={styles.infoBar} type="button">
                <span>Как мы это считаем?</span>
                <Info size={19} strokeWidth={2} />
              </button>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
