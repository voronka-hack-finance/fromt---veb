import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import { BrandCoinIcon } from "./brand-coin-icon";
import styles from "./app-brand.module.css";

type AppBrandProps = {
  className?: string;
  size?: "md" | "lg";
};

export function AppBrand({ className, size = "md" }: AppBrandProps) {
  return (
    <Link
      className={cn(styles.brand, size === "lg" && styles.brandLg, className)}
      href="/"
    >
      <span aria-hidden className={cn(styles.mark, size === "lg" && styles.markLg)}>
        <BrandCoinIcon className={styles.coin} />
      </span>
      <span className={cn(styles.text, size === "lg" && styles.textLg)}>Заначка</span>
    </Link>
  );
}
