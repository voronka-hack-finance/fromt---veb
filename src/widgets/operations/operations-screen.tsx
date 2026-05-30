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

import { useOperationsScreenQuery, type OperationsScreenResponse } from "@/shared/api/operations";
import { operationDetailIds } from "@/shared/data/operation-details";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { OperationsBreakdownCard } from "./operations-breakdown-card";
import styles from "./operations-screen.module.css";

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

export function OperationsScreenView() {
  const screenQuery = useOperationsScreenQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка операций..." query={screenQuery}>
      {(operationsScreenData) => (
        <OperationsScreenContent operationsScreenData={operationsScreenData} />
      )}
    </QueryBoundary>
  );
}

function OperationsScreenContent({
  operationsScreenData,
}: {
  operationsScreenData: OperationsScreenResponse;
}) {
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
              <h1 className={styles.title}>{operationsScreenData.title}</h1>
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
            <OperationsBreakdownCard />
          </Reveal>

          <Reveal delay={0.12}>
            <section className={styles.listSection}>
              <div className={styles.yesterdayHeader}>
                <span>{operationsScreenData.yesterday.label}</span>
                <div className={styles.headerDivider} />
                <strong>+{formatCurrencyParts(operationsScreenData.yesterday.total).whole} ₽</strong>
              </div>

              <div className={styles.operationsList}>
                {operationsScreenData.operations.map((operation, index) => {
                  const hasDetail = operationDetailIds.includes(operation.id);
                  const cardClassName = styles.operationCard;
                  const cardContent = (
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
                  );

                  if (hasDetail) {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        key={operation.id}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.04 * index }}
                      >
                        <Link className={cardClassName} href={`/operations/${operation.id}`}>
                          {cardContent}
                        </Link>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.button
                      className={cardClassName}
                      initial={{ opacity: 0, y: 18 }}
                      key={operation.id}
                      type="button"
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.04 * index }}
                    >
                      {cardContent}
                    </motion.button>
                  );
                })}
              </div>

              <Link className={styles.categoriesLink} href="/categories">
                Мои категории
              </Link>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
    </DesktopSidebarLayout>
  );
}
