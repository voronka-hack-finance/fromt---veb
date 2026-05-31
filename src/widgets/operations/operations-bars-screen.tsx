"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BanknoteArrowDown,
  Building2,
  Edit3,
  GraduationCap,
  Share2,
  ShoppingBag,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  useOperationsBarsQuery,
  useOperationsScreenQuery,
  type OperationsBarsResponse,
  type OperationsScreenResponse,
} from "@/shared/api/operations";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { useOperationsPeriod } from "@/shared/lib/use-operations-period";
import { QueryError, QueryLoading } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { OperationsChartCardHeader } from "./operations-chart-card-header";
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
  icon: OperationsScreenResponse["operations"][number]["icon"];
  tone: OperationsScreenResponse["operations"][number]["iconTone"];
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
  bank: OperationsScreenResponse["operations"][number]["bank"];
  tone: OperationsScreenResponse["operations"][number]["bankTone"];
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
  const screenQuery = useOperationsScreenQuery();
  const barsQuery = useOperationsBarsQuery();

  if (screenQuery.isLoading || barsQuery.isLoading) {
    return (
      <main className={styles.stage}>
        <QueryLoading label="Загрузка графика..." />
      </main>
    );
  }

  if (screenQuery.isError || barsQuery.isError || !screenQuery.data || !barsQuery.data) {
    return (
      <main className={styles.stage}>
        <QueryError
          onRetry={() => {
            void screenQuery.refetch();
            void barsQuery.refetch();
          }}
        />
      </main>
    );
  }

  return (
    <OperationsBarsScreenContent
      operationsBarsData={barsQuery.data}
      operationsScreenData={screenQuery.data}
    />
  );
}

function OperationsBarsScreenContent({
  operationsBarsData,
  operationsScreenData,
}: {
  operationsBarsData: OperationsBarsResponse;
  operationsScreenData: OperationsScreenResponse;
}) {
  const [activePeriod, setActivePeriod] = useOperationsPeriod(operationsBarsData.activePeriod);
  const bars = operationsBarsData.byPeriod[activePeriod];
  const [activeBarIndex, setActiveBarIndex] = useState(0);
  const barColumnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barsScrollRef = useRef<HTMLDivElement>(null);

  const handlePeriodChange = (period: typeof activePeriod) => {
    setActivePeriod(period);
    setActiveBarIndex(0);
  };

  useEffect(() => {
    setActiveBarIndex(0);
    barsScrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activePeriod]);

  useEffect(() => {
    barColumnRefs.current = barColumnRefs.current.slice(0, bars.length);
  }, [bars.length]);

  useEffect(() => {
    const activeColumn = barColumnRefs.current[activeBarIndex];

    activeColumn?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeBarIndex, activePeriod]);

  return (
    <DesktopSidebarLayout>
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
              <div className={styles.cardInner}>
              <OperationsChartCardHeader
                activePeriod={activePeriod}
                activeView="bars"
                onPeriodChange={handlePeriodChange}
                periodTabs={operationsBarsData.periodTabs}
              />

              <div className={styles.chartSection}>
                <div className={styles.chartBlock}>
              <div
                aria-label="График расходов по периодам"
                className={styles.barsScroll}
                ref={barsScrollRef}
                role="region"
              >
                <div className={styles.barsWrap}>
                {bars.map((bar, index) => {
                  const isActive = index === activeBarIndex;

                  return (
                    <motion.button
                      className={cn(styles.barColumn, isActive && styles.barColumnActive)}
                      initial={{ opacity: 0, y: 12 }}
                      key={`${activePeriod}-${bar.label}`}
                      onClick={() => setActiveBarIndex(index)}
                      ref={(node) => {
                        barColumnRefs.current[index] = node;
                      }}
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
              </div>
                </div>
              </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12} immediate>
            <section className={styles.listSection}>
              <div className={styles.yesterdayHeader}>
                <span>{operationsScreenData.yesterday.label}</span>
                <div className={styles.headerDivider} />
                <strong>+{formatCurrencyParts(operationsScreenData.yesterday.total).whole} ₽</strong>
              </div>

              <div className={styles.operationsList}>
                {operationsScreenData.operations.map((operation, index) => (
                  <motion.button
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.operationCard}
                    initial={{ opacity: 0, y: 18 }}
                    key={operation.id}
                    type="button"
                    transition={{ duration: 0.45, delay: 0.12 + 0.04 * index }}
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
    </DesktopSidebarLayout>
  );
}
