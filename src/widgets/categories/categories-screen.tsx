"use client";

import Link from "next/link";

import { useCategoriesQuery, type CategoriesResponse } from "@/shared/api/categories";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";
import { AppTopBar } from "@/widgets/home/app-top-bar";

import { CategoryCard } from "./category-card";
import { DesktopCategoriesScreen } from "./desktop-categories-screen";
import styles from "./categories-screen.module.css";

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
              {categoriesScreenData.categories.map((category) => (
                <CategoryCard assets={assets} category={category} key={category.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
