"use client";

import {
  ChevronRight,
  CircleDollarSign,
  Ellipsis,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";

import type { TotalBalanceResponse } from "@/shared/api/total-balance";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";

import styles from "./desktop-total-balance-screen.module.css";

function formatWholeCurrency(value: number) {
  return `${formatCurrencyParts(value).whole} ₽`;
}

function getToneBadge(tone: TotalBalanceResponse["desktop"]["banks"][number]["tone"]) {
  switch (tone) {
    case "blue":
      return "В";
    case "green":
      return "S";
    case "red":
      return "A";
    case "yellow":
      return "T";
    default:
      return "•";
  }
}

function AccountCard({
  bank,
}: {
  bank: TotalBalanceResponse["desktop"]["banks"][number];
}) {
  return (
    <article className={styles.accountCard}>
      <div className={styles.accountTop}>
        <div className={styles.accountMeta}>
          <div className={[styles.accountIcon, styles[`accountIcon${bank.tone[0].toUpperCase()}${bank.tone.slice(1)}`]].join(" ")}>
            <Wallet size={20} strokeWidth={2} />
          </div>

          <div className={styles.accountText}>
            <span>{bank.bank}</span>
            <strong>{formatWholeCurrency(bank.amount)}</strong>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button aria-label={`Редактировать ${bank.bank}`} className={styles.cardAction} type="button">
            <Pencil size={16} strokeWidth={1.8} />
          </button>
          <button aria-label={`Удалить ${bank.bank}`} className={styles.cardAction} type="button">
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className={styles.badgeRow}>
        {bank.accountBadges.map((badge) => (
          <div className={styles.accountBadge} key={badge}>
            <div className={[styles.badgeDot, styles[`badgeDot${bank.tone[0].toUpperCase()}${bank.tone.slice(1)}`]].join(" ")}>
              {getToneBadge(bank.tone)}
            </div>
            <span>{badge}</span>
          </div>
        ))}

        <button aria-label={`Ещё счета ${bank.bank}`} className={styles.moreBadge} type="button">
          <Ellipsis size={14} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}

export function DesktopTotalBalanceScreen({ screenData }: { screenData: TotalBalanceResponse }) {
  const { desktop } = screenData;

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.shell}>
        <DesktopSidebar />

        <section className={styles.content}>
          <h1 className={styles.pageTitle}>{desktop.title}</h1>

          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.cardsScroll}>
                <div className={styles.cardsGrid}>
                  {desktop.banks.map((bank) => (
                    <AccountCard bank={bank} key={bank.id} />
                  ))}

                  <section className={styles.addBankCard}>
                  <img
                    alt=""
                    aria-hidden
                    className={styles.addBankImage}
                    draggable={false}
                    src={desktop.addBank.image}
                  />

                  <div className={styles.addBankContent}>
                    <p>
                      Добавь <span>еще банков</span>, чтобы отслеживать свое финансовое состояние
                    </p>
                    <button className={styles.addBankButton} type="button">
                      {desktop.addBank.button}
                    </button>
                  </div>
                </section>
                </div>
              </div>
            </div>

            <div className={styles.rightColumn}>
              <section className={styles.protectionCard}>
                <div className={styles.protectionImageWrap}>
                  <img
                    alt=""
                    aria-hidden
                    className={styles.protectionImage}
                    draggable={false}
                    src={desktop.protection.image}
                  />
                </div>

                <div className={styles.protectionContent}>
                  <h2>
                    Защитите деньги
                    <br />
                    от мошенников
                  </h2>
                  <p>{desktop.protection.description}</p>
                  <button className={styles.protectionButton} type="button">
                    {desktop.protection.button}
                  </button>
                </div>
              </section>

              <section className={styles.topBanksCard}>
                <div className={styles.topBanksHeader}>
                  <div className={styles.topBanksTitle}>
                    <CircleDollarSign size={18} strokeWidth={1.8} />
                    <h2>Топ банков по тратам</h2>
                  </div>
                  <button
                    aria-label="Открыть топ банков по тратам"
                    className={styles.topBanksHeaderButton}
                    type="button"
                  >
                    <ChevronRight size={16} strokeWidth={2.2} />
                  </button>
                </div>

                <div className={styles.topBanksList}>
                  {desktop.topBanks.map((bank) => (
                    <article className={styles.topBankRow} key={bank.name}>
                      <div className={styles.topBankMeta}>
                        <div className={[styles.bankBadge, styles[`bankBadge${bank.tone[0].toUpperCase()}${bank.tone.slice(1)}`]].join(" ")}>
                          {bank.badge}
                        </div>
                        <span>{bank.name}</span>
                      </div>
                      <strong>{formatWholeCurrency(bank.amount)}</strong>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
