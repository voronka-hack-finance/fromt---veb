"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BanknoteArrowDown,
  Building2,
  Edit3,
  GraduationCap,
  PieChart,
  Share2,
  ShoppingBag,
  TrendingDown,
  BarChart3,
  Wifi,
} from "lucide-react";
import { useState } from "react";

import { operationsBarsData } from "@/shared/data/operations-bars";
import { operationsScreenData } from "@/shared/data/operations";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./operations-bars-screen.module.css";

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

export function OperationsBarsScreenView() {
  const [activePeriod, setActivePeriod] = useState<(typeof operationsBarsData.periodTabs)[number]>(
    operationsBarsData.activePeriod,
  );
  const [activeBarIndex, setActiveBarIndex] = useState(0);

  return (
    <main className={styles.stage}>
      <div className={styles.shell}>
        <Reveal delay={0.03}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <Link aria-label="Назад" className={styles.iconButton} href="/">
                <ArrowLeft size={22} strokeWidth={2} />
              </Link>
              <h1 className={styles.title}>{operationsBarsData.title}</h1>
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
                  {operationsBarsData.periodTabs.map((tab) => (
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
                  <Link className={styles.viewButton} href="/operations/trends">
                    <TrendingDown size={18} strokeWidth={2} />
                  </Link>
                  <button className={[styles.viewButton, styles.viewButtonActive].join(" ")} type="button">
                    <BarChart3 size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className={styles.barsWrap}>
                {operationsBarsData.bars.map((bar, index) => {
                  const isActive = index === activeBarIndex;

                  return (
                    <motion.button
                      className={cn(styles.barColumn, isActive && styles.barColumnActive)}
                      initial={{ opacity: 0, y: 12 }}
                      key={bar.label}
                      onClick={() => setActiveBarIndex(index)}
                      type="button"
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                    >
                      <motion.div
                        animate={{ height: bar.height }}
                        className={[
                          styles.bar,
                          bar.tone === "dark" ? styles.barDark : "",
                          bar.tone === "green-deep" ? styles.barGreenDeep : "",
                          bar.tone === "muted" ? styles.barMuted : "",
                          isActive ? styles.barSelected : "",
                        ].join(" ")}
                        initial={{ height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <span>{bar.label}</span>
                    </motion.button>
                  );
                })}
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
