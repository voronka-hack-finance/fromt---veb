"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import {
  useSubscriptionsQuery,
  type SubscriptionsResponse,
} from "@/shared/api/subscriptions";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./subscriptions-screen.module.css";

type TabId = SubscriptionsResponse["tabs"][number]["id"];

function formatRubles(value: number) {
  return `${formatCurrencyParts(value).whole}₽`;
}

function pluralizeMonths(months: number) {
  const mod10 = months % 10;
  const mod100 = months % 100;

  if (mod10 === 1 && mod100 !== 11) return "месяц";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "месяца";

  return "месяцев";
}

function SubscriptionItem({
  monthlyPrice,
  months,
  name,
  status,
  totalSpent,
  icon,
}: SubscriptionsResponse["subscriptions"][number]) {
  const isPaused = status === "paused";

  return (
    <article className={cn(styles.subscriptionRow, isPaused && styles.subscriptionRowPaused)}>
      <div className={styles.subscriptionMain}>
        <img alt="" aria-hidden className={styles.subscriptionIcon} draggable={false} src={icon} />

        <div className={styles.subscriptionMeta}>
          <h2 className={styles.subscriptionName}>{name}</h2>
          <p className={styles.subscriptionPeriod}>
            <span className={cn(styles.subscriptionMonths, isPaused && styles.subscriptionMonthsPaused)}>
              {months}
            </span>{" "}
            {pluralizeMonths(months)}
          </p>
        </div>
      </div>

      <div className={styles.subscriptionPriceBlock}>
        <p className={styles.subscriptionPrice}>
          <span className={cn(isPaused && styles.subscriptionPriceStrike)}>{formatRubles(monthlyPrice)}</span>
          <span className={styles.subscriptionPriceSuffix}>/месяц</span>
        </p>
        <p className={styles.subscriptionTotal}>Всего: {formatRubles(totalSpent)}</p>
      </div>
    </article>
  );
}

export function SubscriptionsScreenView() {
  const query = useSubscriptionsQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка подписок..." query={query}>
      {(screenData) => <SubscriptionsScreenContent screenData={screenData} />}
    </QueryBoundary>
  );
}

function SubscriptionsScreenContent({
  screenData,
}: {
  screenData: SubscriptionsResponse;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const visibleSubscriptions = screenData.subscriptions.filter((item) => {
    if (activeTab === "active") return item.status === "active";
    if (activeTab === "paused") return item.status === "paused";

    return true;
  });

  return (
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
          <Reveal delay={0.07}>
            <section className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <div>
                  <p className={styles.summaryLabel}>В месяц</p>
                  <p className={styles.summaryValue}>{formatRubles(screenData.summary.perMonth)}</p>
                </div>
                <div className={styles.summaryRight}>
                  <p className={styles.summaryLabel}>Всего потрачено</p>
                  <p className={styles.summaryValue}>{formatRubles(screenData.summary.totalSpent)}</p>
                </div>
              </div>

              <div className={styles.nextChargePill}>
                <span>{screenData.summary.nextChargeLabel}</span>
                <span>{screenData.summary.nextChargeDate}</span>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.11}>
            <div className={styles.tabs}>
              {screenData.tabs.map((tab) => (
                <button
                  className={cn(styles.tab, activeTab === tab.id && styles.tabActive)}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <span>{tab.label}</span>
                  <span>{tab.count}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <section className={styles.listCard}>
            {visibleSubscriptions.map((subscription, index) => (
              <Reveal delay={0.15 + index * 0.04} key={subscription.id}>
                <div className={styles.listRowWrap}>
                  <SubscriptionItem {...subscription} />
                  {index < visibleSubscriptions.length - 1 ? <div className={styles.divider} /> : null}
                </div>
              </Reveal>
            ))}
          </section>
        </div>

        <div aria-hidden className={styles.homeIndicatorArea}>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </main>
  );
}
