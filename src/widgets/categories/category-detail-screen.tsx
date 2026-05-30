"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowLeft,
  ChevronRight,
  CircleDollarSign,
  Pencil,
  Settings2,
  Star,
  Trash2,
} from "lucide-react";

import { useCategoriesQuery, type CategoriesResponse } from "@/shared/api/categories";
import { getCategoryDetailData } from "@/shared/data/category-details";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { AppTopBar } from "@/widgets/home/app-top-bar";

import styles from "./category-detail-screen.module.css";

function formatAmount(value: number) {
  return `${formatCurrencyParts(value).whole} ₽`;
}

function DesktopCategoryDetailContent({
  categoryId,
  data,
}: {
  categoryId: string;
  data: CategoriesResponse;
}) {
  const category = data.screen.categories.find((item) => item.id === categoryId) ?? data.screen.categories[0];
  const details = getCategoryDetailData(category);
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
                    <CircleDollarSign size={18} strokeWidth={1.8} />
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
  const details = getCategoryDetailData(category);
  const progress = details.limit.spent / details.limit.total;
  const chartStyle = { "--progress-angle": `${progress * 360}deg` } as CSSProperties;

  return (
    <main className={styles.mobileViewport}>
      <div className={styles.mobileShell}>
        <AppTopBar title={category.title} />

        <div className={styles.mobileContent}>
          <Link className={styles.backLink} href="/categories">
            <ArrowLeft size={16} strokeWidth={1.9} />
            <span>Назад к категориям</span>
          </Link>

          <section className={styles.mobileHero}>
            <div className={styles.mobileHeroMain}>
              <div className={styles.mobileHeroIcon}>
                <img alt="" aria-hidden className={styles.categoryHeroImage} draggable={false} src={data.assets.icons[category.icon]} />
              </div>

              <div className={styles.mobileHeroText}>
                <span className={styles.overline}>Название категории</span>
                <h2>{category.title}</h2>
              </div>
            </div>

            <div className={styles.mobileActionRow}>
              <button aria-label="Редактировать категорию" className={styles.actionButtonPrimary} type="button">
                <Pencil size={18} strokeWidth={2} />
              </button>
              <button aria-label="Удалить категорию" className={styles.actionButtonDanger} type="button">
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>
          </section>

          <section className={styles.mobileLimitCard}>
            <div className={styles.mobileLimitChart} style={chartStyle} />
            <div className={styles.mobileLimitInfo}>
              <div className={styles.limitBlock}>
                <span>Лимит</span>
                <strong>
                  {formatAmount(details.limit.spent)}
                  <em>/{formatAmount(details.limit.total)}</em>
                </strong>
              </div>
              <div className={styles.limitBlock}>
                <span>Период</span>
                <div className={styles.periodColumn}>
                  <span>{details.limit.periodStart}</span>
                  <span>{details.limit.periodEnd}</span>
                </div>
              </div>
              <div className={styles.limitBlock}>
                <span>Потрачено</span>
                <strong>{Math.round(progress * 100)}% от лимита</strong>
              </div>
            </div>
          </section>

          <div className={styles.mobileScrollBody}>
            <section className={[styles.mobileCard, styles.mobileHistoryCard].join(" ")}>
              <div className={styles.mobileCardHeader}>
                <h3>История трат</h3>
              </div>

              <div className={styles.mobileGroups}>
                {details.groups.map((group) => (
                  <div className={styles.mobileGroup} key={group.date}>
                    <div className={styles.mobileGroupHeader}>
                      <span>{group.date}</span>
                      <strong>{formatAmount(group.total)}</strong>
                    </div>

                    {group.items.map((item, index) => (
                      <article className={styles.mobileOperationRow} key={`${group.date}-${index}`}>
                        <div className={styles.mobileOperationMeta}>
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

                        <span className={styles.mobileOperationAmount}>{formatAmount(item.amount)}</span>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className={[styles.mobileCard, styles.mobileBanksCard].join(" ")}>
              <div className={styles.mobileCardHeader}>
                <h3>Топ банков по тратам</h3>
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
