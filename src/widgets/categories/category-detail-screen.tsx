"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Coffee,
  Pencil,
  Trash2,
} from "lucide-react";
import { RubleBoldDuotoneIcon } from "@/shared/ui/icons/ruble-bold-duotone-icon";

import { useCategoriesQuery, type CategoriesResponse } from "@/shared/api/categories";
import { getCategoryDetailData, type CategoryDetailData } from "@/shared/data/category-details";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import styles from "./category-detail-screen.module.css";

const bankIcons = {
  sber: "/dashboard/balance/icon-sber.svg",
} as const;

function formatAmount(value: number) {
  return `${formatCurrencyParts(value).whole} ₽`;
}

function formatExpenseAmount(value: number) {
  const amount = formatCurrencyParts(Math.abs(value));
  return `−${amount.whole} ₽`;
}

function CategoryOperationIcon({
  categoryIcon,
  iconSrc,
}: {
  categoryIcon: string;
  iconSrc: string;
}) {
  if (categoryIcon === "coffee") {
    return (
      <div className={styles.mobileOperationIcon}>
        <Coffee size={16} strokeWidth={1.9} />
      </div>
    );
  }

  return (
    <div className={styles.mobileOperationIcon}>
      <img alt="" aria-hidden className={styles.operationIconImage} draggable={false} src={iconSrc} />
    </div>
  );
}

function CategoryBankChip({
  bank,
  bankId,
}: {
  bank?: string;
  bankId?: DetailItem["bankId"];
}) {
  if (!bank) {
    return null;
  }

  const bankIcon = bankId && bankId in bankIcons ? bankIcons[bankId as keyof typeof bankIcons] : null;

  return (
    <div className={styles.mobileBankChip}>
      {bankIcon ? (
        <img alt="" aria-hidden className={styles.mobileBankIcon} draggable={false} src={bankIcon} />
      ) : (
        <span className={styles.mobileBankMark}>{bank.slice(0, 1)}</span>
      )}
      <span>{bank}</span>
    </div>
  );
}

type DetailItem = CategoryDetailData["groups"][number]["items"][number];

function DesktopCategoryDetailContent({
  categoryId,
  data,
}: {
  categoryId: string;
  data: CategoriesResponse;
}) {
  const category = data.screen.categories.find((item) => item.id === categoryId) ?? data.screen.categories[0];
  const details = data.detailsById?.[category.id] ?? getCategoryDetailData(category);
  const progress = details.limit.spent / details.limit.total;
  const chartStyle = { "--progress-angle": `${progress * 360}deg` } as CSSProperties;

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.desktopShell}>
        <DesktopSidebar />

        <section className={styles.desktopContent}>
          <div className={styles.desktopHeaderRow}>
            <div className={styles.categoryHero}>
              <div className={styles.categoryHeroIcon}>
                <img alt="" aria-hidden className={styles.categoryHeroImage} draggable={false} src={data.assets.icons[category.icon]} />
              </div>
              <div className={styles.categoryHeroText}>
                <span className={styles.overline}>Название категории</span>
                <h1>{category.title}</h1>
              </div>
            </div>

            <div className={styles.desktopActions}>
              <button aria-label="Редактировать категорию" className={styles.actionButtonPrimary} type="button">
                <Pencil size={22} strokeWidth={2} />
              </button>
              <button aria-label="Удалить категорию" className={styles.actionButtonDanger} type="button">
                <Trash2 size={22} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className={styles.desktopGrid}>
            <section className={styles.historyCard}>
              <div className={styles.historyScroller}>
                {details.groups.map((group) => (
                  <div className={styles.historyGroup} key={group.date}>
                    <div className={styles.groupHeader}>
                      <span className={styles.groupDate}>{group.date}</span>
                      <span className={styles.groupDivider} />
                      <span className={styles.groupTotal}>{formatAmount(group.total)}</span>
                    </div>

                    <div className={styles.groupItems}>
                      {group.items.map((item, index) => (
                        <article className={styles.operationRow} key={`${group.date}-${index}`}>
                          <div className={styles.operationMeta}>
                            <div className={styles.operationIcon}>
                              <img
                                alt=""
                                aria-hidden
                                className={styles.operationIconImage}
                                draggable={false}
                                src={data.assets.icons[category.icon]}
                              />
                            </div>

                            <div className={styles.operationText}>
                              <span>{item.label}</span>
                              <strong>{item.title}</strong>
                            </div>
                          </div>

                          <span className={styles.operationAmount}>{formatAmount(item.amount)}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.desktopAside}>
              <section className={styles.limitCard}>
                <div className={styles.limitChart} style={chartStyle} />

                <div className={styles.limitInfo}>
                  <div className={styles.limitBlock}>
                    <span>Лимит</span>
                    <strong>
                      {formatAmount(details.limit.spent)}
                      <em>/{formatAmount(details.limit.total)}</em>
                    </strong>
                  </div>

                  <div className={styles.limitBlock}>
                    <span>Период</span>
                    <div className={styles.periodRow}>
                      <span>{details.limit.periodStart}</span>
                      <span>–</span>
                      <span>{details.limit.periodEnd}</span>
                    </div>
                  </div>

                  <div className={styles.limitBlock}>
                    <span>Потрачено</span>
                    <strong>{Math.round(progress * 100)}% от лимита</strong>
                  </div>
                </div>
              </section>

              <section className={styles.banksCard}>
                <div className={styles.banksHeader}>
                  <div className={styles.banksTitle}>
                    <RubleBoldDuotoneIcon size={18} />
                    <h2>Топ банков по тратам</h2>
                  </div>
                  <ChevronRight size={18} strokeWidth={1.8} />
                </div>

                <div className={styles.banksList}>
                  {details.banks.map((bank) => (
                    <article className={styles.bankRow} key={bank.name}>
                      <div className={styles.bankMeta}>
                        <div className={[styles.bankBadge, styles[`bankBadge${bank.tone[0].toUpperCase()}${bank.tone.slice(1)}`]].join(" ")}>
                          {bank.badge}
                        </div>
                        <span>{bank.name}</span>
                      </div>
                      <strong>{formatAmount(bank.amount)}</strong>
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

function MobileCategoryDetailContent({
  categoryId,
  data,
}: {
  categoryId: string;
  data: CategoriesResponse;
}) {
  const category = data.screen.categories.find((item) => item.id === categoryId) ?? data.screen.categories[0];
  const details = data.detailsById?.[category.id] ?? getCategoryDetailData(category);
  const progress = details.limit.spent / details.limit.total;
  const spentPercent = Math.round(progress * 100);
  const chartStyle = { "--progress-angle": `${progress * 360}deg` } as CSSProperties;
  const categoryIconSrc = data.assets.icons[category.icon];

  return (
    <main className={styles.mobileViewport}>
      <div className={styles.mobileShell}>
        <div className={styles.mobileContent}>
          <header className={styles.mobileHeader}>
            <Link aria-label="Назад" className={styles.mobileBackButton} href="/categories">
              <ArrowLeft size={24} strokeWidth={2} />
            </Link>
            <h1 className={styles.mobileTitle}>{category.title}</h1>
          </header>

          <div className={styles.mobileLimitChart} style={chartStyle} />

          <section className={styles.mobileLimitStats}>
            <div className={styles.mobileLimitRow}>
              <span>Лимит</span>
              <p className={styles.mobileLimitValue}>
                <strong>{formatAmount(details.limit.spent)}</strong>
                <em> / {formatAmount(details.limit.total)}</em>
              </p>
            </div>
            <div className={styles.mobileLimitRow}>
              <span>Период</span>
              <p className={styles.mobilePeriodValue}>
                <span>{details.limit.periodStart}</span>
                <span>–</span>
                <span>{details.limit.periodEnd}</span>
              </p>
            </div>
            <div className={styles.mobileLimitRow}>
              <span>Потрачено</span>
              <p className={styles.mobileSpentValue}>
                <strong>{spentPercent}%</strong> от лимита
              </p>
            </div>
          </section>

          <section className={styles.mobileTransactions}>
            {details.groups.map((group) => (
              <div className={styles.mobileTransactionGroup} key={group.date}>
                <div className={styles.mobileGroupHeader}>
                  <span>{group.date}</span>
                  <span className={styles.mobileGroupDivider} />
                  <strong>{formatExpenseAmount(group.total)}</strong>
                </div>

                <div className={styles.mobileOperationsList}>
                  {group.items.map((item, index) => (
                    <article className={styles.mobileOperationCard} key={`${group.date}-${index}`}>
                      <CategoryOperationIcon categoryIcon={category.icon} iconSrc={categoryIconSrc} />
                      <div className={styles.operationText}>
                        <span>{item.label}</span>
                        <strong>{item.title}</strong>
                      </div>
                      <div className={styles.mobileOperationAside}>
                        <CategoryBankChip bank={item.bank} bankId={item.bankId} />
                        <span className={styles.mobileOperationAmount}>{formatExpenseAmount(item.amount)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}

export function CategoryDetailScreenView({ categoryId }: { categoryId: string }) {
  const query = useCategoriesQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка категории..." query={query}>
      {(data) => (
        <>
          <div className={styles.desktopOnly}>
            <DesktopCategoryDetailContent categoryId={categoryId} data={data} />
          </div>
          <div className={styles.mobileOnly}>
            <MobileCategoryDetailContent categoryId={categoryId} data={data} />
          </div>
        </>
      )}
    </QueryBoundary>
  );
}
