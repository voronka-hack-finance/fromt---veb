"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { CategoriesResponse } from "@/shared/api/categories";
import { formatCurrencyParts } from "@/shared/lib/formatters";

import styles from "./category-card.module.css";

type CategoryCardTone = CategoriesResponse["screen"]["categories"][number]["tone"];

type CategoryCardProps = {
  assets: CategoriesResponse["assets"];
  category: CategoriesResponse["screen"]["categories"][number];
};

const toneStyles = {
  dark: {
    card: styles.cardDark,
    icon: styles.iconWrapDark,
    title: styles.titleDark,
    amountStrong: styles.amountStrongDark,
    amountMuted: styles.amountMutedDark,
    progressTrack: styles.progressTrackDark,
    progressValue: styles.progressValueWhite,
  },
  light: {
    card: styles.cardLight,
    icon: styles.iconWrapLight,
    title: styles.titleLight,
    amountStrong: styles.amountStrongLight,
    amountMuted: styles.amountMutedLight,
    progressTrack: styles.progressTrackLight,
    progressValue: styles.progressValueGreen,
  },
  "light-darkbar": {
    card: styles.cardLight,
    icon: styles.iconWrapLight,
    title: styles.titleLight,
    amountStrong: styles.amountStrongLight,
    amountMuted: styles.amountMutedLight,
    progressTrack: styles.progressTrackLight,
    progressValue: styles.progressValueGray,
  },
} satisfies Record<
  CategoryCardTone,
  {
    card: string;
    icon: string;
    title: string;
    amountStrong: string;
    amountMuted: string;
    progressTrack: string;
    progressValue: string;
  }
>;

export function CategoryCard({ assets, category }: CategoryCardProps) {
  const spent = formatCurrencyParts(category.spent).whole;
  const total = formatCurrencyParts(category.total).whole;
  const variant = toneStyles[category.tone];

  return (
    <Link
      className={[styles.card, variant.card].join(" ")}
      href={`/categories/${category.id}`}
    >
      <div className={styles.header}>
        <div className={[styles.iconWrap, variant.icon].join(" ")}>
          <img
            alt=""
            aria-hidden
            className={styles.iconImage}
            draggable={false}
            src={assets.icons[category.icon]}
          />
        </div>
        <p className={[styles.title, variant.title].join(" ")}>{category.title}</p>
      </div>

      <div className={styles.amountRow}>
        <span className={[styles.amountStrong, variant.amountStrong].join(" ")}>
          {spent} ₽
        </span>
        <span className={[styles.amountMuted, variant.amountMuted].join(" ")}>/{total} ₽</span>
      </div>

      <div className={[styles.progressTrack, variant.progressTrack].join(" ")}>
        <motion.div
          animate={{ width: `${category.progress * 100}%` }}
          className={[styles.progressValue, variant.progressValue].join(" ")}
          initial={{ width: 0 }}
          transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </Link>
  );
}
