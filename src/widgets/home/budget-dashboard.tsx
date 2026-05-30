"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Plus } from "lucide-react";

import { useDashboardData } from "@/shared/api/dashboard-context";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { GraphNewBoldIcon } from "@/shared/ui/icons/graph-new-bold-icon";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";

import { BalanceSparkline } from "./balance-sparkline";
import { FundsRunwaySection } from "./funds-runway-section";
import { ReportActionButtons } from "./report-action-buttons";
import styles from "./desktop-dashboard.module.css";

const protectionAsset = "/home/protection-card.png";
const accentAsset = "/home/accent-card.png";

const calendarGroups = [
  {
    date: "31 марта",
    total: "1 400 ₽",
    items: [
      { category: "Переводы", title: "Перевод между счетами", amount: "1 100 ₽", badge: "↔" },
      { category: "Переводы", title: "Арина Ш.", amount: "100 ₽", badge: "АШ" },
      { category: "Супермаркеты", title: "Продукты", amount: "200 ₽", badge: "●" },
    ],
  },
  {
    date: "30 марта",
    total: "1 400 ₽",
    items: [
      { category: "Переводы", title: "Перевод между счетами", amount: "1 100 ₽", badge: "↔" },
      { category: "Переводы", title: "Арина Ш.", amount: "100 ₽", badge: "АШ" },
    ],
  },
] as const;

const summaryTiles = [
  { key: "safe", badge: "✓", value: "134 456 ₽", tone: "green" },
  { key: "bank", badge: "Т", value: "125 856 ₽", tone: "black" },
  { key: "cash", badge: "A", value: "125 856 ₽", tone: "red" },
  { key: "reserve", badge: "ВТБ", value: "125 856 ₽", tone: "blue" },
] as const;

function formatWholeCurrency(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole} ₽`;
}

function SummaryTile({
  badge,
  tone,
  value,
}: {
  badge: string;
  tone: "green" | "black" | "red" | "blue";
  value: string;
}) {
  return (
    <div className={styles.summaryTile}>
      <span className={`${styles.summaryBadge} ${styles[`summaryBadge${tone[0].toUpperCase()}${tone.slice(1)}`]}`}>
        {badge}
      </span>
      <span className={styles.summaryValue}>{value}</span>
    </div>
  );
}

export function DesktopDashboard() {
  const { dashboard, desktopForecastPoints } = useDashboardData();

  const averageMonthlyExpenses = 60_000;
  const runwayMonths = Math.max(1, Math.floor(dashboard.receipts / averageMonthlyExpenses));
  const healthLabel = dashboard.forecastPercent >= 70 ? "Отлично" : "Хорошо";

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.shell}>
        <DesktopSidebar />

        <section className={styles.content}>
          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <section className={styles.heroSection}>
                <div className={styles.heroMain}>
                  <div className={styles.heroCopy}>
                    <div className={styles.heroLabel}>
                      <GraphNewBoldIcon size={24} />
                      <span>Всего средств</span>
                    </div>
                    <h1 className={styles.heroValue}>{formatWholeCurrency(dashboard.totalBalance)}</h1>
                  </div>

                  <BalanceSparkline defaultActiveIndex={4} points={desktopForecastPoints} />
                </div>
              </section>

              <div className={styles.summaryRow}>
                {summaryTiles.map((tile) => (
                  <SummaryTile badge={tile.badge} key={tile.key} tone={tile.tone} value={tile.value} />
                ))}

                <button aria-label="Добавить счет" className={styles.addTile} type="button">
                  <Plus size={18} strokeWidth={2.4} />
                </button>
              </div>

              <div className={styles.insightsRow}>
                <Link className={styles.runwayCard} href="/income">
                  <span className={styles.cardEyebrow}>Денег хватит на</span>
                  <strong className={styles.runwayMonths}>{runwayMonths} месяцев</strong>
                  <span className={styles.cardCaption}>
                    При ваших средних тратах {formatWholeCurrency(averageMonthlyExpenses)}
                  </span>
                </Link>

                <section className={styles.healthCard}>
                  <span className={styles.cardEyebrow}>Финансовое состояние</span>
                  <div className={styles.healthStats}>
                    <strong className={styles.healthValue}>{dashboard.forecastPercent}%</strong>
                    <span className={styles.healthPill}>{healthLabel}</span>
                  </div>
                </section>

                <div className={styles.accentCard}>
                  <img alt="" aria-hidden className={styles.accentImage} draggable={false} src={accentAsset} />
                </div>
              </div>

              <FundsRunwaySection />
            </div>

            <div className={styles.rightColumn}>
              <ReportActionButtons className={styles.rightPanelActions} variant="panel" />

              <section className={styles.calendarCard}>
                <div className={styles.calendarHeader}>
                  <div className={styles.calendarTitleWrap}>
                    <CalendarDays size={20} strokeWidth={1.9} />
                    <h2>Календарь трат</h2>
                  </div>
                  <ChevronRight size={18} strokeWidth={2} />
                </div>

                <div className={styles.calendarGroups}>
                  {calendarGroups.map((group) => (
                    <div className={styles.calendarGroup} key={`${group.date}-${group.total}`}>
                      <div className={styles.calendarGroupHeader}>
                        <strong>{group.date}</strong>
                        <div className={styles.calendarDivider} />
                        <span>{group.total}</span>
                      </div>

                      <div className={styles.calendarList}>
                        {group.items.map((item) => (
                          <div className={styles.calendarItem} key={`${group.date}-${item.title}`}>
                            <div className={styles.calendarItemMeta}>
                              <div className={styles.calendarBadge}>{item.badge}</div>
                              <div className={styles.calendarTextBlock}>
                                <span>{item.category}</span>
                                <strong>{item.title}</strong>
                              </div>
                            </div>
                            <strong className={styles.calendarAmount}>{item.amount}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.protectionCard}>
                <img alt="" aria-hidden className={styles.protectionImage} draggable={false} src={protectionAsset} />

                <div className={styles.protectionContent}>
                  <h2>Защитите деньги от мошенников</h2>
                  <p>Мы компенсируем украденные средства до 300 тыс. рублей</p>
                  <button className={styles.protectionButton} type="button">
                    Защитить
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
