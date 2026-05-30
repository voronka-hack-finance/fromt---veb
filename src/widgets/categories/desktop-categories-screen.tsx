"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  ChevronRight,
  Search,
  Settings2,
} from "lucide-react";

import type { CategoriesResponse } from "@/shared/api/categories";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";

import styles from "./desktop-categories-screen.module.css";

const protectionAsset =
  "https://www.figma.com/api/mcp/asset/82f4c4d9-de96-432b-a907-c065f7049b99";
const funnelLeft = ["16 230 ₽", "136 430 ₽", "10 220 ₽", "34 320 ₽", "126 230 ₽"] as const;
const funnelCenter = "323 430 ₽";
const funnelRight = ["12 230 ₽", "116 430 ₽", "10 220 ₽", "34 320 ₽", "126 230 ₽"] as const;

function SpendingFunnelChart() {
  const bridgeGradientId = useId();

  return (
    <div className={styles.funnelChart}>
      <div className={styles.funnelColumn}>
        <span className={styles.funnelColumnLabel}>Поступило по категориям</span>
        <div className={styles.funnelColumnBodyLeft}>
          {funnelLeft.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      </div>

      <div className={styles.funnelBridge}>
        <span className={styles.funnelColumnLabel}>Поступило всего</span>
        <div className={styles.funnelBridgeShape}>
          <svg aria-hidden className={styles.funnelBridgeSvg} viewBox="0 0 130 340">
            <path
              d="M0 0Q65 46 130 0L130 340Q65 294 0 340Z"
              fill={`url(#${bridgeGradientId})`}
            />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id={bridgeGradientId} x1="0" x2="130" y1="0" y2="340">
                <stop offset="0%" stopColor="#e6f6d8" />
                <stop offset="100%" stopColor="#c8e9b4" />
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.funnelCenterValue}>{funnelCenter}</span>
        </div>
      </div>

      <div className={styles.funnelColumn}>
        <span className={styles.funnelColumnLabel}>Потрачено по категориям</span>
        <div className={styles.funnelColumnBodyRight}>
          {funnelRight.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  assets,
  category,
}: {
  assets: CategoriesResponse["assets"];
  category: CategoriesResponse["screen"]["categories"][number];
}) {
  const spent = formatCurrencyParts(category.spent).whole;
  const total = formatCurrencyParts(category.total).whole;

  return (
    <Link className={styles.categoryCard} href={`/categories/${category.id}`}>
      <div className={styles.categoryCardTop}>
        <div className={styles.categoryIconWrap}>
          <img
            alt=""
            aria-hidden
            className={styles.categoryIconImage}
            draggable={false}
            src={assets.icons[category.icon]}
          />
        </div>
        <span aria-hidden className={styles.categoryAction}>
          <Settings2 size={18} strokeWidth={1.8} />
        </span>
      </div>

      <div className={styles.categoryTitle}>{category.title}</div>

      <div className={styles.amountRow}>
        <span className={styles.amountStrong}>{spent} ₽</span>
        <span className={styles.amountMuted}>/{total} ₽</span>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressValue} style={{ width: `${category.progress * 100}%` }} />
      </div>
    </Link>
  );
}

export function DesktopCategoriesScreen({ data }: { data: CategoriesResponse }) {
  const { assets, screen } = data;
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const categories = screen.categories.slice(1);
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => category.title.toLowerCase().includes(query));
  }, [screen.categories, searchQuery]);

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.shell}>
        <DesktopSidebar />

        <section className={styles.content}>
          <div className={styles.pageTitle}>Категории</div>

          <div className={styles.contentGrid}>
            <form
              className={styles.searchBar}
              onSubmit={(event) => event.preventDefault()}
              role="search"
            >
              <Search aria-hidden size={24} strokeWidth={1.9} />
              <label className={styles.searchLabel} htmlFor={searchInputId}>
                Поиск по категориям
              </label>
              <input
                autoComplete="off"
                id={searchInputId}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Поиск по категориям"
                type="search"
                value={searchQuery}
              />
            </form>

            <div className={styles.leftColumn}>
              <div className={styles.cardsScroll}>
                <div className={styles.cardsGrid}>
                <section className={styles.createCard}>
                  <div className={styles.createText}>
                    <h2>
                      Создайте <span>новую категорию</span>
                      <br />
                      и отслеживайте
                      <br />
                      свои траты
                    </h2>
                    <Link className={styles.createButton} href="/categories/new">
                      Создать
                    </Link>
                  </div>

                  <div className={styles.createImageWrap}>
                    <img
                      alt=""
                      aria-hidden
                      className={styles.createImage}
                      draggable={false}
                      src={assets.promoImage}
                    />
                  </div>
                </section>

                {filteredCategories.map((category) => (
                  <CategoryCard assets={assets} category={category} key={category.id} />
                ))}
              </div>

              {filteredCategories.length === 0 ? (
                <p className={styles.searchEmpty}>Категории не найдены</p>
              ) : null}
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
                    src={protectionAsset}
                  />
                </div>

                <div className={styles.protectionContent}>
                  <h2>
                    Защитите деньги
                    <br />
                    от мошенников
                  </h2>
                  <p>Мы компенсируем украденные средства до 300 тыс. рублей</p>
                  <button className={styles.protectionButton} type="button">
                    Защитить
                  </button>
                </div>
              </section>

              <section className={styles.funnelCard}>
                <div className={styles.funnelHeader}>
                  <h2>Категоризатор трат</h2>
                  <button
                    aria-label="Открыть категоризатор трат"
                    className={styles.funnelHeaderButton}
                    type="button"
                  >
                    <ChevronRight size={16} strokeWidth={2.2} />
                  </button>
                </div>

                <SpendingFunnelChart />
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
