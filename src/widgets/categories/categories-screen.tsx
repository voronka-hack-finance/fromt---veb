"use client";

import Link from "next/link";

import { useCategoriesQuery, type CategoriesResponse } from "@/shared/api/categories";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";
import { AppTopBar } from "@/widgets/home/app-top-bar";

import styles from "./categories-screen.module.css";

function CategoryIcon({
  assets,
  icon,
}: {
  assets: CategoriesResponse["assets"];
  icon: CategoriesResponse["screen"]["categories"][number]["icon"];
}) {
  return (
    <div className={styles.categoryIconWrap}>
      <img
        alt=""
        aria-hidden
        className={styles.categoryIconImage}
        draggable={false}
        src={assets.icons[icon]}
      />
    </div>
  );
}

export function CategoriesScreenView() {
  const query = useCategoriesQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка категорий..." query={query}>
      {(data) => <CategoriesScreenContent data={data} />}
    </QueryBoundary>
  );
}

function CategoriesScreenContent({ data }: { data: CategoriesResponse }) {
  const { assets, screen: categoriesScreenData } = data;

  return (
    <main className={styles.stage}>
      <div className={styles.shell}>
        <Reveal delay={0.03}>
          <AppTopBar title={categoriesScreenData.title} />
        </Reveal>

        <div className={styles.content}>
          <Reveal delay={0.08}>
            <section className={styles.promoCard}>
              <div className={styles.promoImageWrap}>
                <div className={styles.promoImageRotated}>
                  <img
                    alt=""
                    aria-hidden
                    className={styles.promoImage}
                    draggable={false}
                    src={assets.promoImage}
                  />
                </div>
              </div>

              <div className={styles.promoBody}>
                <h2>{categoriesScreenData.promo.title}</h2>
                <div className={styles.promoDescription}>
                  {categoriesScreenData.promo.description.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <button className={styles.promoButton} type="button">
                  <img
                    alt=""
                    aria-hidden
                    className={styles.promoButtonIcon}
                    draggable={false}
                    src={assets.promoButtonIcon}
                  />
                  <span>{categoriesScreenData.promo.cta}</span>
                </button>
              </div>
            </section>
          </Reveal>

          <div className={styles.grid}>
            {categoriesScreenData.categories.map((category) => {
              const spent = formatCurrencyParts(category.spent).whole;
              const total = formatCurrencyParts(category.total).whole;
              const dark = category.tone === "dark";
              const darkBar = category.tone === "light-darkbar";

              return (
                <button
                  className={[styles.categoryCard, dark ? styles.categoryCardDark : ""].join(" ")}
                  key={category.id}
                  type="button"
                >
                  <div className={styles.categoryTop}>
                    <CategoryIcon assets={assets} icon={category.icon} />
                    <div className={styles.categoryTitle}>{category.title}</div>
                  </div>

                  <div className={styles.amountRow}>
                    <span className={styles.amountStrong}>{spent} ₽</span>
                    <span className={styles.amountMuted}>/{total} ₽</span>
                  </div>

                  <div className={[styles.progressTrack, dark ? styles.progressTrackDark : ""].join(" ")}>
                    <div
                      className={[
                        styles.progressValue,
                        dark ? styles.progressValueLight : "",
                        darkBar ? styles.progressValueDark : "",
                      ].join(" ")}
                      style={{ width: `${category.progress * 100}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <Link className={styles.goalsLink} href="/goals">
            Мои цели
          </Link>
        </div>
      </div>
    </main>
  );
}
