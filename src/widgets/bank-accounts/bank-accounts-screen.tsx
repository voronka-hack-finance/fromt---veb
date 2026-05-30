"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  useBankAccountsQuery,
  type BankAccountItem,
  type BankAccountsResponse,
  type BankAccountsSection,
} from "@/shared/api/bank-accounts";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./bank-accounts-screen.module.css";

const assets = {
  cardChip: "/bank-accounts/card-chip.svg",
  cardContactless: "/bank-accounts/card-contactless.svg",
  accountDot: "/bank-accounts/account-dot.svg",
  plusIcon: "/bank-accounts/plus-icon.svg",
} as const;

const wholeRublesFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatRubles(value: number) {
  return `${wholeRublesFormatter.format(value)} ₽`;
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

function AccountCard({
  account,
  showDebitCard,
}: {
  account: BankAccountItem;
  showDebitCard: boolean;
}) {
  return (
    <Link className={styles.accountCard} href={`/bank-accounts/${account.id}`}>
      <div className={`${styles.cardTop} ${!showDebitCard ? styles.cardTopEnd : ""}`}>
        {showDebitCard && account.cardLast4 ? <MiniDebitCard last4={account.cardLast4} /> : null}
        <img alt="" aria-hidden className={styles.bankIcon} draggable={false} src={account.bankIcon} />
      </div>

      <div className={styles.cardBody}>
        <p className={`${styles.amount} ${account.compactAmount ? styles.amountCompact : ""}`}>
          {formatRubles(account.balance)}
        </p>
        <div className={styles.accountLabel}>
          <span className={styles.accountLabelText}>Счет</span>
          <img alt="" aria-hidden className={styles.accountDot} draggable={false} src={assets.accountDot} />
          <span className={styles.accountLabelText}>{account.accountSuffix}</span>
        </div>
      </div>
    </Link>
  );
}

function AccountSection({ section }: { section: BankAccountsSection }) {
  const router = useRouter();
  const showDebitCard = section.id === "debit";

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{section.title}</h2>
        <button
          aria-label={`Добавить ${section.title}`}
          className={styles.addButton}
          onClick={() => router.push("/bank-accounts/add")}
          type="button"
        >
          <img alt="" aria-hidden className={styles.addIcon} draggable={false} src={assets.plusIcon} />
        </button>
      </div>

      <div className={styles.cardsRow}>
        {section.accounts.map((account) => (
          <AccountCard account={account} key={account.id} showDebitCard={showDebitCard} />
        ))}
      </div>
    </section>
  );
}

export function BankAccountsScreenView() {
  const query = useBankAccountsQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка счетов..." query={query}>
      {(screenData) => <BankAccountsScreenContent screenData={screenData} />}
    </QueryBoundary>
  );
}

function BankAccountsScreenContent({ screenData }: { screenData: BankAccountsResponse }) {
  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{screenData.title}</h1>
            </header>
          </Reveal>

          <div className={styles.content}>
            {screenData.sections.map((section, index) => (
              <Reveal delay={0.07 + index * 0.04} key={section.id}>
                <AccountSection section={section} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}
