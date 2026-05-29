"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Edit3,
  GraduationCap,
  PieChart,
  Share2,
  ShoppingBag,
  TrendingDown,
  BarChart3,
  Wifi,
  BanknoteArrowDown,
} from "lucide-react";
import { useMemo, useState } from "react";

import { operationsScreenData } from "@/shared/data/operations";
import { operationsTrendsData } from "@/shared/data/operations-trends";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./operations-trends-screen.module.css";

function formatSignedAmount(value: number) {
  const sign = value > 0 ? "+" : "−";
  const amount = formatCurrencyParts(Math.abs(value));
  return `${sign}${amount.whole} ₽`;
}

function OperationIcon({
  icon,
  tone,
}: {
  icon: (typeof operationsScreenData.operations)[number]["icon"];
  tone: (typeof operationsScreenData.operations)[number]["iconTone"];
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
  bank: (typeof operationsScreenData.operations)[number]["bank"];
  tone: (typeof operationsScreenData.operations)[number]["bankTone"];
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
  const [activePeriod, setActivePeriod] = useState<(typeof operationsTrendsData.periodTabs)[number]>(
    operationsTrendsData.activePeriod,
  );
  const [activeBarIndex, setActiveBarIndex] = useState(
    operationsTrendsData.bars.findIndex((bar) => bar.tone === "active"),
  );

  const maxBarValue = Math.max(...operationsTrendsData.bars.map((bar) => bar.value));
  const activeBar = operationsTrendsData.bars[activeBarIndex] ?? operationsTrendsData.bars[0];

  const linePoints = useMemo(
    () =>
      operationsTrendsData.line
        .map((value, index) => {
          const x = 12 + index * 26.4;
          const y = 110 - (value / maxBarValue) * 58;
          return `${x},${y}`;
        })
        .join(" "),
    [maxBarValue],
  );

  return (
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
              <div className={styles.cardTop}>
                <div className={styles.periodToggle}>
                  {operationsTrendsData.periodTabs.map((tab) => (
                    <button
                      className={cn(
                        styles.periodButton,
                        tab === activePeriod && styles.periodButtonActive,
                      )}
                      key={tab}
                      onClick={() => setActivePeriod(tab)}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className={styles.viewControls}>
                  <Link className={styles.viewButton} href="/operations">
                    <PieChart size={18} strokeWidth={2} />
                  </Link>
                  <button className={[styles.viewButton, styles.viewButtonActive].join(" ")} type="button">
                    <TrendingDown size={18} strokeWidth={2} />
                  </button>
                  <Link className={styles.viewButton} href="/operations/bars">
                    <BarChart3 size={18} strokeWidth={2} />
                  </Link>
                </div>
              </div>

              <div className={styles.chartWrap}>
                <div className={styles.scaleLabels}>
                  {operationsTrendsData.spendScale.map((label) => (
                    <span key={label}>{formatCurrencyParts(label).whole} ₽</span>
                  ))}
                </div>

                <svg className={styles.chart} viewBox="0 0 286 154" role="img" aria-label="Тренд трат за месяц">
                  {[16, 79, 142].map((y) => (
                    <line className={styles.gridLine} key={y} x1="0" x2="286" y1={y} y2={y} />
                  ))}

                  {operationsTrendsData.bars.map((bar, index) => {
                    const x = 18 + index * 26.4;
                    const height = (bar.value / maxBarValue) * 87;
                    const y = 141 - height;
                    const isActive = index === activeBarIndex;

                    return (
                      <motion.rect
                        className={isActive ? styles.barActive : styles.barMuted}
                        height={height}
                        initial={{ height: 0, y: 141 }}
                        key={bar.day}
                        onClick={() => setActiveBarIndex(index)}
                        rx="3"
                        style={{ cursor: "pointer" }}
                        viewport={{ once: true }}
                        whileInView={{ height, y }}
                        width="16"
                        x={x}
                        transition={{ duration: 0.6, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
                      />
                    );
                  })}

                  <motion.polyline
                    className={styles.trendLine}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    points={linePoints}
                    strokeDasharray="3 0"
                    viewport={{ once: true }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {operationsTrendsData.line.map((value, index) => {
                    const x = 12 + index * 26.4;
                    const y = 110 - (value / maxBarValue) * 58;
                    const isActive = index === activeBarIndex;

                    return (
                      <circle
                        className={cn(styles.point, isActive && styles.pointActive)}
                        cx={x}
                        cy={y}
                        key={`${value}-${index}`}
                        onClick={() => setActiveBarIndex(index)}
                        r={isActive ? 4 : 2.5}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  })}
                </svg>

                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.insightBubble}
                  initial={{ opacity: 0, y: 8 }}
                  key={activeBar?.day}
                  transition={{ duration: 0.25 }}
                >
                  <div className={styles.bubbleIcon}>
                    <TrendingDown size={16} strokeWidth={2.2} />
                  </div>
                  <div>
                    <strong>{formatCurrencyParts(activeBar?.value ?? 0).whole} ₽</strong>
                    <span>{activeBar?.day}</span>
                  </div>
                </motion.div>
              </div>

              <div className={styles.chartFooter}>
                <strong>{operationsTrendsData.insight.percent}%</strong>
                <p>{operationsTrendsData.insight.text}</p>
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
  );
}
