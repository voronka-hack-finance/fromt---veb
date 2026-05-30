"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BanknoteArrowDown,
  Building2,
  GraduationCap,
  ShoppingBag,
  Wifi,
} from "lucide-react";

import {
  useBankAccountDetailQuery,
  type BankAccountDetailResponse,
} from "@/shared/api/bank-account-detail";
import { operationDetailIds } from "@/shared/data/operation-details";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./bank-account-detail-screen.module.css";

const assets = {
  cardChip: "/bank-accounts/card-chip.svg",
  cardContactless: "/bank-accounts/card-contactless.svg",
  accountDot: "/bank-accounts/account-dot.svg",
} as const;

function formatRubles(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole} ₽`;
}

function formatSignedAmount(value: number) {
  const sign = value > 0 ? "+" : "−";
  const amount = formatCurrencyParts(Math.abs(value));
  return `${sign}${amount.whole} ₽`;
}

function MiniDebitCard({ last4 }: { last4: string }) {
  return (
    <div className={styles.debitCardWrap}>
      <div className={styles.miniCard}>
        <div className={styles.miniCardShape}>
          <img alt="" aria-hidden className={styles.miniCardChip} draggable={false} src={assets.cardChip} />
          <img
            alt=""
            aria-hidden
            className={styles.miniCardContactless}
            draggable={false}
            src={assets.cardContactless}
          />
          <span aria-hidden className={styles.miniCardBrandLeft} />
          <span aria-hidden className={styles.miniCardBrandRight} />
        </div>
      </div>
      <p className={styles.cardLast4}>{last4}</p>
    </div>
  );
}

function OperationIcon({
  icon,
  tone,
}: {
  icon: BankAccountDetailResponse["sections"][number]["operations"][number]["icon"];
  tone: BankAccountDetailResponse["sections"][number]["operations"][number]["iconTone"];
}) {
  const commonProps = { size: 16, strokeWidth: 1.9 };
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

function AccountDetailContent({ account }: { account: BankAccountDetailResponse }) {
  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/bank-accounts">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>
                <span>Счёт</span>
                <img alt="" aria-hidden className={styles.accountDot} draggable={false} src={assets.accountDot} />
                <span className={styles.titleSuffix}>{account.accountSuffix}</span>
              </h1>
            </header>
          </Reveal>

          <Reveal delay={0.07}>
            <section className={styles.accountCard}>
              <div className={styles.cardTop}>
                {account.cardLast4 ? <MiniDebitCard last4={account.cardLast4} /> : <span aria-hidden />}
                <img
                  alt=""
                  aria-hidden
                  className={styles.bankLogo}
                  draggable={false}
                  height={account.bankLogoHeight}
                  src={account.bankLogo}
                  width={account.bankLogoWidth}
                />
              </div>

              <div className={styles.cardBottom}>
                <div className={styles.balanceBlock}>
                  <p className={styles.balance}>{formatRubles(account.balance)}</p>
                  <div className={styles.accountLabel}>
                    <span className={styles.accountLabelText}>Счет</span>
                    <img
                      alt=""
                      aria-hidden
                      className={styles.accountLabelDot}
                      draggable={false}
                      src={assets.accountDot}
                    />
                    <span className={styles.accountLabelText}>{account.accountSuffix}</span>
                  </div>
                </div>
                <button className={styles.addExpenseButton} type="button">
                  Добавить трату
                </button>
              </div>
            </section>
          </Reveal>

          {account.sections.map((section, sectionIndex) => (
            <Reveal delay={0.11 + sectionIndex * 0.04} key={section.label}>
              <section className={styles.transactions}>
                <div className={styles.sectionHeader}>
                  <span>{section.label}</span>
                  <div className={styles.sectionDivider} />
                  <strong>{formatSignedAmount(section.total)}</strong>
                </div>

                <div className={styles.operationsList}>
                  {section.operations.map((operation) => {
                    const hasDetail = operationDetailIds.includes(operation.id);
                    const cardContent = (
                      <div className={styles.operationRow}>
                        <OperationIcon icon={operation.icon} tone={operation.iconTone} />

                        <div className={styles.operationText}>
                          <span>{operation.category}</span>
                          <p>{operation.title}</p>
                        </div>

                        <strong
                          className={[
                            styles.operationAmount,
                            operation.direction === "income" ? styles.amountIncome : styles.amountOutcome,
                          ].join(" ")}
                        >
                          {formatSignedAmount(operation.amount)}
                        </strong>
                      </div>
                    );

                    if (hasDetail) {
                      return (
                        <Link
                          className={styles.operationCard}
                          href={`/operations/${operation.id}`}
                          key={operation.id}
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    return (
                      <button className={styles.operationCard} key={operation.id} type="button">
                        {cardContent}
                      </button>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function BankAccountDetailScreenView({ accountId }: { accountId: string }) {
  const query = useBankAccountDetailQuery(accountId);

  return (
    <QueryBoundary loadingLabel="Загрузка счёта..." query={query}>
      {(account) => <AccountDetailContent account={account} />}
    </QueryBoundary>
  );
}
