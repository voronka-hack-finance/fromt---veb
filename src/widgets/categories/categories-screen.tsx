"use client";

import Link from "next/link";
import { ArrowLeft, BellRing, BriefcaseBusiness, Coffee, PawPrint, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { categoriesScreenData } from "@/shared/data/categories";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./categories-screen.module.css";

function CategoryIcon({
  icon,
  dark,
}: {
  icon: (typeof categoriesScreenData.categories)[number]["icon"];
  dark?: boolean;
}) {
  const commonProps = { size: 18, strokeWidth: 2 };
  const className = [styles.categoryIconWrap, dark ? styles.categoryIconWrapDark : ""].join(" ");

  const node =
    icon === "coffee" ? (
      <Coffee {...commonProps} />
    ) : icon === "paw" ? (
      <PawPrint {...commonProps} />
    ) : icon === "cloche" ? (
      <BriefcaseBusiness {...commonProps} />
    ) : (
      <ShoppingBag {...commonProps} />
    );

  return <div className={className}>{node}</div>;
}

export function CategoriesScreenView() {
  return (
    <main className={styles.stage}>
      <div className={styles.shell}>
        <Reveal delay={0.03}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <Link aria-label="Назад" className={styles.iconButton} href="/">
                <ArrowLeft size={22} strokeWidth={2} />
              </Link>
              <h1 className={styles.title}>{categoriesScreenData.title}</h1>
            </div>
          </header>
        </Reveal>

        <div className={styles.content}>
          <Reveal delay={0.08}>
            <section className={styles.promoCard}>
              <div className={styles.promoTexture} />
              <div className={styles.promoBody}>
                <h2>{categoriesScreenData.promo.title}</h2>
                <p>{categoriesScreenData.promo.description}</p>
                <button className={styles.promoButton} type="button">
                  <BellRing size={16} strokeWidth={1.8} />
                  <span>{categoriesScreenData.promo.cta}</span>
                </button>
              </div>
            </section>
          </Reveal>

          <div className={styles.grid}>
            {categoriesScreenData.categories.map((category, index) => {
              const spent = formatCurrencyParts(category.spent).whole;
              const total = formatCurrencyParts(category.total).whole;
              const dark = category.tone === "dark";
              const darkBar = category.tone === "light-darkbar";

              return (
                <Reveal delay={0.1 + index * 0.03} key={category.id}>
                  <motion.button
                    className={[
                      styles.categoryCard,
                      dark ? styles.categoryCardDark : "",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 20 }}
                    type="button"
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.03 }}
                  >
                    <CategoryIcon dark={dark} icon={category.icon} />
                    <div className={styles.categoryTitle}>{category.title}</div>
                    <div className={styles.amountRow}>
                      <span className={styles.amountStrong}>{spent} ₽</span>
                      <span className={styles.amountMuted}>/{total} ₽</span>
                    </div>
                    <div className={[styles.progressTrack, dark ? styles.progressTrackDark : ""].join(" ")}>
                      <motion.div
                        className={[
                          styles.progressValue,
                          dark ? styles.progressValueLight : "",
                          darkBar ? styles.progressValueDark : "",
                        ].join(" ")}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${category.progress * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
