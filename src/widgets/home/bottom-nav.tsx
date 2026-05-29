"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

import styles from "./bottom-nav.module.css";

const navItems = [
  {
    id: "home",
    href: "/",
    label: "Главная",
    icon: "/dashboard/nav/home-active.svg",
    iconInactive: "/dashboard/nav/home-inactive.svg",
    match: (path: string) => path === "/",
  },
  {
    id: "history",
    href: "/operations/trends",
    label: "История",
    icon: "/dashboard/nav/graph.svg",
    match: (path: string) => path.startsWith("/operations/trends"),
  },
  {
    id: "goals",
    href: "/goals",
    label: "Мои цели",
    icon: "/dashboard/nav/clipboard.svg",
    match: (path: string) => path.startsWith("/goals"),
  },
  {
    id: "categories",
    href: "/categories",
    label: "Категории",
    icon: "/dashboard/nav/settings.svg",
    match: (path: string) => path.startsWith("/categories"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация" className={styles.bottomNav}>
      <div className={styles.navPill}>
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          const iconSrc =
            item.id === "home" && !isActive && "iconInactive" in item
              ? item.iconInactive
              : item.icon;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={cn(styles.navItem, isActive && styles.navItemActive)}
              href={item.href}
              key={item.id}
            >
              <img
                alt=""
                aria-hidden
                className={cn(
                  styles.navIcon,
                  isActive && item.id !== "home" && styles.navIconActive,
                )}
                draggable={false}
                src={iconSrc}
              />
            </Link>
          );
        })}
      </div>

      <div aria-hidden className={styles.homeIndicatorArea}>
        <div className={styles.homeIndicator} />
      </div>
    </nav>
  );
}
