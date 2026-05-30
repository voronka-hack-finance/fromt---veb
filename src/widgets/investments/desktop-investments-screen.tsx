"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Plus } from "lucide-react";

import type { InvestmentsBalanceResponse } from "@/shared/api/investments-balance";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { GraphNewBoldIcon } from "@/shared/ui/icons/graph-new-bold-icon";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";
import { ReportActionButtons } from "@/widgets/home/report-action-buttons";

import styles from "./desktop-investments-screen.module.css";
import { InvestmentsAchievementsSection } from "./investments-achievements-section";
import { InvestmentsTransfersChart } from "./investments-transfers-chart";

const protectionAsset = "https://www.figma.com/api/mcp/asset/84ee048a-329e-4ec8-b00e-7f1f981c57fe";
const accentAsset = "https://www.figma.com/api/mcp/asset/e1649c50-620a-4f8a-a07d-94f2edae7930";

const transferChartPoints = [
  { label: "Янв", value: 0 },
  { label: "Фев", value: 0 },
  { label: "Мар", value: 0 },
  { label: "Апр", value: 3_200 },
  { label: "Май", value: 5_500 },
  { label: "Июн", value: 7_000 },
  { label: "Июл", value: 2_100 },
  { label: "Авг", value: 1_100 },
  { label: "Сен", value: 3_200 },
] as const;

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

function formatWholeCurrency(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole} ₽`;
}

export function DesktopInvestmentsScreen({
  screenData,
}: {
  screenData: InvestmentsBalanceResponse;
}) {
  const transferAmount = 20_346;

  const summaryTiles = [
    { key: "green", badge: "✓", value: "4 456 ₽", tone: "green" },
    { key: "black", badge: "Т", value: "15 856 ₽", tone: "black" },
  ] as const;

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.shell}>
        <DesktopSidebar />

        <section className={styles.content}>
          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <section className={styles.heroCard}>
                <div className={styles.heroLabel}>
                  <GraphNewBoldIcon size={24} />
                  <h1 className={styles.heroTitle}>Переводы в инвестиции</h1>
                </div>

                <div className={styles.heroMain}>
                  <div className={styles.heroValue}>{formatWholeCurrency(transferAmount)}</div>

                  <InvestmentsTransfersChart points={[...transferChartPoints]} />
                </div>

                <div className={styles.summaryRow}>
                  {summaryTiles.map((tile) => (
                    <div className={styles.summaryTile} key={tile.key}>
                      <span className={`${styles.summaryBadge} ${tile.tone === "green" ? styles.summaryBadgeGreen : styles.summaryBadgeBlack}`}>
                        {tile.badge}
                      </span>
                      <span className={styles.summaryValue}>{tile.value}</span>
                    </div>
                  ))}

                  <button aria-label="Добавить перевод" className={styles.addTile} type="button">
                    <Plus size={18} strokeWidth={2.4} />
                  </button>
                </div>
              </section>

              <div className={styles.metricsRow}>
                <section className={styles.metricCard}>
                  <span className={styles.metricLabel}>Инвестиций хватит на</span>
                  <strong className={styles.metricValueGood}>1 месяц</strong>
                  <span className={styles.metricCaption}>При ваших средних тратах 60 000 ₽</span>
                </section>

                <section className={styles.metricCard}>
                  <span className={styles.metricLabel}>Финансовое состояние</span>
                  <div className={styles.healthInline}>
                    <strong className={styles.metricValue}>{screenData.summary.remainPercent}%</strong>
                    <span className={styles.healthBadge}>Плохо</span>
                  </div>
                </section>

                <div className={styles.accentCard}>
                  <img alt="" aria-hidden className={styles.accentImage} draggable={false} src={accentAsset} />
                </div>
              </div>

              <InvestmentsAchievementsSection scenarios={screenData.scenarios} />
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
