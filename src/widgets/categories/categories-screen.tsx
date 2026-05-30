"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useCategoriesQuery, type CategoriesResponse } from "@/shared/api/categories";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";
import { AppTopBar } from "@/widgets/home/app-top-bar";

import { DesktopCategoriesScreen } from "./desktop-categories-screen";
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
      <div className={styles.desktopShell}>
        <DesktopCategoriesScreen data={data} />
      </div>

      <div className={styles.mobileShell}>
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

            <Reveal delay={0.1}>
              <Link className={styles.createCategoryCard} href="/categories/new">
                <span className={styles.createCategoryTitle}>Создайте новую категорию</span>
                <span className={styles.createCategoryAction}>Создать</span>
              </Link>
            </Reveal>

            <div className={styles.grid}>
              {categoriesScreenData.categories.map((category) => {
                const spent = formatCurrencyParts(category.spent).whole;
                const total = formatCurrencyParts(category.total).whole;
                const dark = category.tone === "dark";
                const darkBar = category.tone === "light-darkbar";

                return (
                  <Link
                    className={[styles.categoryCard, dark ? styles.categoryCardDark : ""].join(" ")}
                    href={`/categories/${category.id}`}
                    key={category.id}
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
                      <motion.div
                        animate={{ width: `${category.progress * 100}%` }}
                        className={[
                          styles.progressValue,
                          dark ? styles.progressValueLight : "",
                          darkBar ? styles.progressValueDark : "",
                        ].join(" ")}
                        initial={{ width: 0 }}
                        transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
