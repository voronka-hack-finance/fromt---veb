"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/shared/api/dashboard-context";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./balance-card.module.css";

const assets = {
  cardBg: "/dashboard/balance/card-bg.svg",
  dividerSber: "/dashboard/balance/divider-dot-sber.svg",
  dividerTbank: "/dashboard/balance/divider-dot-tbank.svg",
  iconArrow: "/dashboard/balance/icon-arrow-up-right.svg",
  iconMore: "/dashboard/balance/icon-more-figma.svg",
  iconSber: "/dashboard/balance/icon-sber.svg",
  iconTbank: "/dashboard/balance/icon-tbank.svg",
  iconWallet: "/dashboard/balance/icon-wallet.svg",
} as const;

const bankMeta: Record<string, { divider: string; icon: string; textColor: string }> = {
  sber: {
    divider: assets.dividerSber,
    icon: assets.iconSber,
    textColor: "#1f1f1f",
  },
  tbank: {
    divider: assets.dividerTbank,
    icon: assets.iconTbank,
    textColor: "#3a3a3a",
  },
};

export function BalanceCard() {
  const router = useRouter();
  const { bankAccounts, dashboard } = useDashboardData();
  const { whole, fraction } = formatCurrencyParts(dashboard.totalBalance);

  return (
    <section className={styles.card}>
      <img alt="" aria-hidden className={styles.cardBg} draggable={false} src={assets.cardBg} />

      <div className={styles.topRow}>
        <div aria-hidden className={styles.walletButton}>
          <img alt="" className={styles.icon24} draggable={false} src={assets.iconWallet} />
        </div>

        <div className={styles.titleRow}>
          <h2 className={styles.title}>Всего средств</h2>
          <Link aria-label="Открыть остаток от доходов" className={styles.actionButton} href="/income">
            <img alt="" aria-hidden className={styles.icon24} draggable={false} src={assets.iconArrow} />
          </Link>
        </div>
      </div>

      <button
        aria-label={`Общий баланс ${whole},${fraction} ₽`}
        className={styles.amountButton}
        onClick={() => router.push("/income")}
        type="button"
      >
        <span className={styles.amountWhole}>{whole}</span>
        <span className={styles.amountFraction}>, {fraction} ₽</span>
      </button>

      <div className={styles.bankSection}>
        <p className={styles.bankSectionTitle}>Ваши счета в банках</p>

        <div className={styles.bankList}>
          {bankAccounts.map((account) => {
            const meta = bankMeta[account.id];

            return (
              <button
                className={styles.bankChip}
                key={account.id}
                onClick={() => router.push(`/total?account=${account.id}`)}
                type="button"
              >
                <img alt="" aria-hidden className={styles.bankIcon} draggable={false} src={meta.icon} />
                <span className={styles.bankChipText} style={{ color: meta.textColor }}>
                  <span>{account.label}</span>
                  <img alt="" aria-hidden className={styles.dividerDot} draggable={false} src={meta.divider} />
                  <span>{account.suffix}</span>
                </span>
              </button>
            );
          })}

          <button
            aria-label="Еще счета"
            className={styles.moreChip}
            onClick={() => router.push("/bank-accounts")}
            type="button"
          >
            <img alt="" aria-hidden className={styles.bankIcon} draggable={false} src={assets.iconMore} />
          </button>
        </div>
      </div>
    </section>
  );
}
