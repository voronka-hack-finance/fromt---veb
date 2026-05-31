"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Dumbbell,
  EyeOff,
  FileText,
  GraduationCap,
  Info,
  MessageCircle,
  Pencil,
  Share2,
  Shield,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import {
  useOperationDetailQuery,
  type OperationDetailResponse,
} from "@/shared/api/operation-detail";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./operation-detail-screen.module.css";

function formatAmount(value: number) {
  const sign = value > 0 ? "+" : "−";
  const amount = formatCurrencyParts(Math.abs(value));
  return `${sign}${amount.whole} ₽`;
}

function CategoryIcon({
  icon,
  className,
  size = 20,
}: {
  icon: OperationDetailResponse["icon"] | "gym";
  className?: string;
  size?: number;
}) {
  const props = { size, strokeWidth: 1.9 };

  if (icon === "education") {
    return (
      <div className={className}>
        <GraduationCap {...props} />
      </div>
    );
  }

  if (icon === "gym") {
    return (
      <div className={className}>
        <Dumbbell {...props} />
      </div>
    );
  }

  if (icon === "bag") {
    return (
      <div className={className}>
        <ShoppingBag {...props} />
      </div>
    );
  }

  if (icon === "wifi") {
    return (
      <div className={className}>
        <Sparkles {...props} />
      </div>
    );
  }

  if (icon === "bank" || icon === "income") {
    return (
      <div className={className}>
        <CreditCard {...props} />
      </div>
    );
  }

  return (
    <div className={className}>
      <GraduationCap {...props} />
    </div>
  );
}

function OperationDetailContent({ operation }: { operation: OperationDetailResponse }) {
  const amountClass =
    operation.direction === "income" ? `${styles.amount} ${styles.amountIncome}` : styles.amount;

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.iconButton} href="/operations">
                <ArrowLeft size={20} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.headerDate}>{operation.dateTime}</h1>
            </header>
          </Reveal>

          <Reveal delay={0.06}>
            <section className={styles.accountCard}>
              <p className={styles.accountLabel}>{operation.accountLabel}</p>
              <div className={styles.accountChip}>
                <CreditCard size={16} strokeWidth={1.9} />
                <span>{operation.accountSuffix}</span>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.09}>
            <section className={styles.mainCard}>
              <div className={styles.mainHeader}>
                <div className={styles.mainInfo}>
                  <h2 className={styles.merchant}>{operation.merchant}</h2>
                  <div className={styles.subInfo}>
                    <span>{operation.category}</span>
                    <span>•</span>
                    <span>МСС {operation.mcc}</span>
                  </div>
                </div>
                <CategoryIcon className={styles.categoryIcon} icon={operation.icon} />
              </div>
              <div className={styles.amountRow}>
                <p className={amountClass}>{formatAmount(operation.amount)}</p>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <div className={styles.actionRow}>
              <button className={styles.actionButton} type="button">
                <span className={styles.actionIconWrap}>
                  <EyeOff size={16} strokeWidth={1.9} />
                </span>
                Скрыть
              </button>
              <button className={styles.actionButton} type="button">
                <span className={styles.actionIconWrap}>
                  <Pencil size={16} strokeWidth={1.9} />
                </span>
                Категория
              </button>
            </div>
          </Reveal>

          {operation.taxDeduction ? (
            <Reveal delay={0.15}>
              <section className={styles.taxCard}>
                <img
                  alt=""
                  aria-hidden
                  className={styles.taxBg}
                  draggable={false}
                  src="/operations/detail/tax-deduction-bg.png"
                />

                <div className={styles.taxHeader}>
                  <div className={styles.taxTitleRow}>
                    <h3 className={styles.taxTitle}>Налоговый вычет</h3>
                    <button aria-label="Подробнее о налоговом вычете" className={styles.infoButton} type="button">
                      <Info size={12} strokeWidth={2} />
                    </button>
                  </div>
                  <p className={styles.taxAmount}>
                    <span>{formatCurrencyParts(operation.taxDeduction.amount).whole}</span>
                    <span>₽</span>
                  </p>
                </div>

                <div className={styles.taxBanner}>
                  <span className={styles.taxBannerIcon}>
                    <Sparkles size={13} strokeWidth={2} />
                  </span>
                  <p className={styles.taxBannerText}>
                    Вы можете вернуть от государства часть средств за этот платеж
                  </p>
                </div>

                <div className={styles.pastExpensesCard}>
                  <p className={styles.pastExpensesTitle}>В прошлом году вы потратили:</p>
                  <div className={styles.pastExpensesList}>
                    {operation.taxDeduction.pastExpenses.map((expense) => (
                      <div className={styles.pastExpenseItem} key={`${expense.title}-${expense.amount}`}>
                        <CategoryIcon className={styles.pastExpenseIcon} icon={expense.icon} size={16} />
                        <div className={styles.pastExpenseInfo}>
                          <p className={styles.pastExpenseCategory}>{expense.category}</p>
                          <p className={styles.pastExpenseTitle}>{expense.title}</p>
                        </div>
                        <p className={styles.pastExpenseAmount}>
                          {formatCurrencyParts(expense.amount).whole} ₽
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button className={styles.howToButton} type="button">
                  <MessageCircle size={16} strokeWidth={1.9} />
                  Как это сделать?
                </button>
              </section>
            </Reveal>
          ) : null}

          <Reveal delay={0.18}>
            <section className={styles.protectionCard}>
              <img
                alt=""
                aria-hidden
                className={styles.protectionPlush}
                draggable={false}
                src="/operations/detail/protection-plush.png"
              />
              <div className={styles.protectionContent}>
                <h3 className={styles.protectionTitle}>{operation.protection.title}</h3>
                <p className={styles.protectionText}>{operation.protection.description.join("\n")}</p>
              </div>
              <button className={styles.connectButton} type="button">
                <Shield size={16} strokeWidth={1.9} />
                {operation.protection.buttonLabel}
              </button>
            </section>
          </Reveal>

          <Reveal delay={0.21}>
            <section className={styles.detailsCard}>
              <h3 className={styles.detailsTitle}>Реквизиты транзакции</h3>
              <div className={styles.detailsActions}>
                <button className={styles.detailsActionButton} type="button">
                  <FileText size={16} strokeWidth={1.9} />
                  Справка
                </button>
                <button className={styles.detailsActionButton} type="button">
                  <Share2 size={16} strokeWidth={1.9} />
                  Поделиться
                </button>
              </div>
              <div className={styles.sbpBlock}>
                <p className={styles.sbpLabel}>Идентификатор операции СБП</p>
                <p className={styles.sbpValue}>{operation.transaction.sbpId}</p>
              </div>
            </section>
          </Reveal>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function OperationDetailScreenView({ operationId }: { operationId: string }) {
  const query = useOperationDetailQuery(operationId);

  return (
    <QueryBoundary loadingLabel="Загрузка операции..." query={query}>
      {(operation) => <OperationDetailContent operation={operation} />}
    </QueryBoundary>
  );
}
