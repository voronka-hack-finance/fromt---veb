"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, ChevronRight } from "lucide-react";

const metricAssets = {
  incomeIcon: "/desktop/metrics/income-course.svg",
  expenseIcon: "/desktop/metrics/expense-course.svg",
  chevronRight: "/desktop/metrics/chevron-right.svg",
} as const;

import { useDashboardData } from "@/shared/api/dashboard-context";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { GraphNewBoldIcon } from "@/shared/ui/icons/graph-new-bold-icon";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";

import { ForecastLineChart } from "./forecast-line-chart";
import { ReportActionButtons } from "./report-action-buttons";
import styles from "./desktop-home-dashboard.module.css";

const calendarGroups = [
  {
    date: "31 марта",
    total: "1 400 ₽",
    items: [
      { category: "Переводы", title: "Перевод между счетами", amount: "1 100 ₽", badge: "↔" },
      { category: "Переводы", title: "Арина Ш.", amount: "100 ₽", badge: "АШ" },
      { category: "Супермаркеты", title: "Продукты", amount: "200 ₽", badge: "🛒" },
    ],
  },
  {
    date: "30 марта",
    total: "2 150 ₽",
    items: [
      { category: "Подписки", title: "Яндекс Плюс", amount: "399 ₽", badge: "Я+" },
      { category: "Транспорт", title: "Такси", amount: "651 ₽", badge: "🚕" },
      { category: "Кафе", title: "Обед", amount: "1 100 ₽", badge: "☕" },
    ],
  },
] as const;

const recurringIcons = [
  "/dashboard/recurring/icon-1.png",
  "/dashboard/recurring/icon-2.png",
  "/dashboard/recurring/icon-3.png",
] as const;

const investmentsAssets = {
  ring: "/home/investments-ring.png",
} as const;

function formatWholeCurrency(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole} ₽`;
}

function formatPercent(value: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

const creditAssets = {
  menuDots: "/desktop/credit/menu-dots.svg",
  smiley: "/dashboard/credit/smiley.svg",
} as const;

const creditGaugeWidth = 288;
const creditGaugeHeight = 168;
const creditGaugeCenterX = 144;
const creditGaugeCenterY = 150;
const creditGaugeRadius = 120;
const creditGaugeStartX = creditGaugeCenterX - creditGaugeRadius;
const creditGaugeEndX = creditGaugeCenterX + creditGaugeRadius;
const creditGaugeArcPath = `M ${creditGaugeStartX} ${creditGaugeCenterY} A ${creditGaugeRadius} ${creditGaugeRadius} 0 0 1 ${creditGaugeEndX} ${creditGaugeCenterY}`;

function CreditGauge({ label, ratio, score }: { label: string; ratio: number; score: number }) {
  const needleAngle = Math.PI * (1 - ratio);
  const needleInnerRadius = creditGaugeRadius - 10;
  const needleOuterRadius = creditGaugeRadius + 2;
  const needleX1 = creditGaugeCenterX + Math.cos(needleAngle) * needleInnerRadius;
  const needleY1 = creditGaugeCenterY - Math.sin(needleAngle) * needleInnerRadius;
  const needleX2 = creditGaugeCenterX + Math.cos(needleAngle) * needleOuterRadius;
  const needleY2 = creditGaugeCenterY - Math.sin(needleAngle) * needleOuterRadius;

  return (
    <div className={styles.creditGaugeWrap}>
      <svg aria-hidden className={styles.creditGauge} viewBox={`0 0 ${creditGaugeWidth} ${creditGaugeHeight}`}>
        <path className={styles.creditTrack} d={creditGaugeArcPath} pathLength={100} />
        <path
          className={styles.creditProgress}
          d={creditGaugeArcPath}
          pathLength={100}
          strokeDasharray={`${ratio * 100} 100`}
        />
        <line className={styles.creditNeedle} x1={needleX1} x2={needleX2} y1={needleY1} y2={needleY2} />
      </svg>

      <div className={styles.creditCenter}>
        <img alt="" aria-hidden className={styles.creditSmiley} draggable={false} src={creditAssets.smiley} />
        <span className={styles.creditValue}>{score}</span>
        <span className={styles.creditLabel}>{label}</span>
      </div>
    </div>
  );
}

export function DesktopDashboard() {
  const { dashboard, desktopForecastPoints, forecastYearPoints } = useDashboardData();
  const [forecastPeriod, setForecastPeriod] = useState<"year" | "week">("week");
  const [forecastActiveIndex, setForecastActiveIndex] = useState(4);

  const forecastPoints =
    forecastPeriod === "week" ? desktopForecastPoints : forecastYearPoints;

  const handleForecastPeriodChange = (nextPeriod: "year" | "week") => {
    setForecastPeriod(nextPeriod);
    setForecastActiveIndex(nextPeriod === "week" ? 4 : 1);
  };

  const creditDisplayScore = Math.round(dashboard.creditScore / 10);
  const creditGaugeRatio = Math.min(1, creditDisplayScore / 100);
  const creditState =
    creditGaugeRatio >= 0.7 ? "Стабильно" : creditGaugeRatio >= 0.45 ? "Умеренно" : "Низкая";

  const breakdownItems = [
    { amount: "134 456 ₽", color: styles.legendGreen },
    { amount: "125 856 ₽", color: styles.legendDark },
    { amount: "125 856 ₽", color: styles.legendRed },
    { amount: "125 856 ₽", color: styles.legendBlue },
  ];

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.shell}>
        <DesktopSidebar />

        <section className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Дашборды</h1>

            <ReportActionButtons className={styles.headerButtons} />
          </div>

          <div className={styles.dashboardGrid}>
            <section className={styles.balanceCard}>
              <div className={styles.balanceContent}>
                <div className={styles.balanceHeaderBlock}>
                  <div className={styles.balanceTitleWrap}>
                    <GraphNewBoldIcon className={styles.balanceIcon} size={32} />
                    <span className={styles.balanceTitle}>Всего средств</span>
                  </div>
                  <strong className={styles.balanceValue}>
                    {formatWholeCurrency(Math.floor(dashboard.totalBalance))}
                  </strong>
                </div>

                <div className={styles.healthBlock}>
                  <div className={styles.healthLabel}>Финансовое состояние</div>
                  <div className={styles.healthStats}>
                    <div className={styles.healthPercent}>
                      <span className={styles.healthValue}>{dashboard.forecastPercent}</span>
                      <span className={styles.healthValueUnit}>%</span>
                    </div>
                    <span className={styles.healthPill}>Хорошо</span>
                  </div>
                </div>
              </div>

              <div className={styles.legendRow}>
                {breakdownItems.map((item) => (
                  <div className={styles.legendItem} key={item.color}>
                    <span className={`${styles.legendSwatch} ${item.color}`} />
                    <span>{item.amount}</span>
                  </div>
                ))}
                <ChevronRight aria-hidden className={styles.legendChevron} size={14} strokeWidth={2.2} />
              </div>
            </section>

            <Link className={styles.remainderCard} href="/income">
              <div className={styles.remainderHeader}>
                <span>Остаток доходов</span>
                <ChevronRight size={18} strokeWidth={2} />
              </div>
              <div className={styles.remainderValue}>+ {formatWholeCurrency(dashboard.incomeRemainder)}</div>
              <div className={styles.remainderTrack}>
                <div
                  className={styles.remainderFill}
                  style={{
                    width: `${Math.min(100, Math.round((dashboard.incomeRemainder / dashboard.receipts) * 100))}%`,
                  }}
                />
              </div>
              <div className={styles.remainderLevel}>Мастер</div>
            </Link>

            <section className={styles.calendarCard}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitleWrap}>
                  <CalendarDays size={18} strokeWidth={1.8} />
                  <h2>Календарь трат</h2>
                </div>
                <ChevronRight size={18} strokeWidth={2} />
              </div>

              <div className={styles.calendarGroups}>
                {calendarGroups.map((group) => (
                  <div className={styles.calendarGroup} key={group.date}>
                    <div className={styles.calendarGroupHeader}>
                      <span>{group.date}</span>
                      <div className={styles.calendarDivider} />
                      <strong>{group.total}</strong>
                    </div>

                    <div className={styles.calendarList}>
                      {group.items.map((item) => (
                        <div className={styles.calendarItem} key={`${group.date}-${item.title}`}>
                          <div className={styles.calendarItemMeta}>
                            <div className={styles.calendarBadge}>{item.badge}</div>
                            <div>
                              <div className={styles.calendarCategory}>{item.category}</div>
                              <div className={styles.calendarTitle}>{item.title}</div>
                            </div>
                          </div>
                          <strong>{item.amount}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.metricsRow}>
                <Link className={styles.metricCard} href="/income">
                  <div className={styles.metricHeader}>
                    <div className={styles.metricTitleWrap}>
                      <div className={styles.metricIconCircle}>
                        <img
                          alt=""
                          aria-hidden
                          className={styles.metricIcon}
                          draggable={false}
                          src={metricAssets.incomeIcon}
                        />
                      </div>
                      <span className={styles.metricTitle}>Доходы</span>
                    </div>
                    <img
                      alt=""
                      aria-hidden
                      className={styles.metricChevron}
                      draggable={false}
                      src={metricAssets.chevronRight}
                    />
                  </div>
                  <div className={styles.metricValue}>{formatWholeCurrency(dashboard.receipts)}</div>
                </Link>

                <Link className={styles.metricCard} href="/operations">
                  <div className={styles.metricHeader}>
                    <div className={styles.metricTitleWrap}>
                      <div className={styles.metricIconCircle}>
                        <img
                          alt=""
                          aria-hidden
                          className={styles.metricIcon}
                          draggable={false}
                          src={metricAssets.expenseIcon}
                        />
                      </div>
                      <span className={styles.metricTitle}>Расходы</span>
                    </div>
                    <img
                      alt=""
                      aria-hidden
                      className={styles.metricChevron}
                      draggable={false}
                      src={metricAssets.chevronRight}
                    />
                  </div>
                  <div className={styles.metricValue}>{formatWholeCurrency(dashboard.expenses)}</div>
                </Link>
            </div>

            <Link className={styles.investmentsCard} href="/investments">
              <div className={styles.investmentsHeader}>
                <span>Инвестиции</span>
                <ChevronRight size={18} strokeWidth={2} />
              </div>
              <div className={styles.investmentsBody}>
                <div>
                  <div className={styles.investmentsValue}>↑{formatPercent(dashboard.investmentPercent)}%</div>
                  <div className={styles.investmentsPill}>{dashboard.investmentGrowth}</div>
                </div>
                <img
                  alt=""
                  aria-hidden
                  className={styles.investmentsRingImage}
                  draggable={false}
                  src={investmentsAssets.ring}
                />
              </div>
            </Link>

            <section className={styles.forecastCard}>
              <div className={styles.forecastInner}>
                <div className={styles.forecastTop}>
                  <div className={styles.forecastHeading}>
                    <h2 className={styles.forecastTitle}>Прогнозы</h2>
                    <div className={styles.forecastLegend}>
                      <span className={styles.forecastLegendItem}>
                        <span className={styles.forecastDotLight} />
                        Доходы
                      </span>
                      <span className={styles.forecastLegendItem}>
                        <span className={styles.forecastDotDark} />
                        Расходы
                      </span>
                    </div>
                  </div>

                  <div className={styles.forecastRange}>
                    <button
                      className={cn(
                        styles.forecastRangeButton,
                        forecastPeriod === "year" && styles.forecastRangeActive,
                      )}
                      onClick={() => handleForecastPeriodChange("year")}
                      type="button"
                    >
                      Год
                    </button>
                    <button
                      className={cn(
                        styles.forecastRangeButton,
                        forecastPeriod === "week" && styles.forecastRangeActive,
                      )}
                      onClick={() => handleForecastPeriodChange("week")}
                      type="button"
                    >
                      Неделя
                    </button>
                  </div>
                </div>

                <div className={styles.forecastBody}>
                  <div className={styles.forecastScore}>
                    <span className={styles.forecastScoreValue}>{dashboard.forecastPercent}</span>
                    <span className={styles.forecastScoreUnit}>%</span>
                  </div>

                  <div className={styles.forecastChartWrap}>
                    <ForecastLineChart
                      activeIndex={forecastActiveIndex}
                      animateKey={forecastPeriod}
                      onActiveIndexChange={setForecastActiveIndex}
                      points={forecastPoints}
                      variant="wide"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.creditCard}>
              <div className={styles.creditTag}>Кредитная нагрузка</div>
              <button aria-label="Дополнительные действия" className={styles.creditMenu} type="button">
                <img
                  alt=""
                  aria-hidden
                  className={styles.creditMenuIcon}
                  draggable={false}
                  src={creditAssets.menuDots}
                />
              </button>

              <CreditGauge label={creditState} ratio={creditGaugeRatio} score={creditDisplayScore} />

              <Link className={styles.creditButton} href="/total">
                Подробнее
              </Link>
            </section>

            <div className={styles.tertiaryBottomStack}>
              <Link className={styles.recurringCard} href="/subscriptions">
                <div className={styles.cardTitleRow}>
                  <h2>Постоянные расходы</h2>
                  <ChevronRight size={18} strokeWidth={2} />
                </div>

                <div className={styles.recurringBottom}>
                  <div className={styles.recurringMeta}>
                    <div className={styles.recurringIcons}>
                      {recurringIcons.map((src) => (
                        <img alt="" key={src} src={src} />
                      ))}
                    </div>
                    <span>{dashboard.recurringExpenses.categories}</span>
                  </div>
                  <strong>{dashboard.recurringExpenses.total}</strong>
                </div>
              </Link>

              <section className={styles.assistantCard}>
                <div aria-hidden className={styles.assistantOrbWrap}>
                  <div className={styles.assistantOrbRotated}>
                    <div className={styles.assistantOrbFrame}>
                      <img
                        alt=""
                        className={styles.assistantOrbImage}
                        draggable={false}
                        src="/dashboard/assistant/orb-texture.png"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.assistantContent}>
                  <div>
                    <h2>Твой ИИ помощник</h2>
                    <p>
                      Получайте советы: куда лучше потратить, что отложить и как снизить финансовые
                      риски.
                    </p>
                  </div>
                  <Link className={styles.assistantButton} href="/recommendations">
                    Подробнее
                    <ArrowRight size={16} strokeWidth={1.9} />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
