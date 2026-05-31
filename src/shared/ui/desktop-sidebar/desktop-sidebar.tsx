"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

import {
  getActiveMainNavId,
  homeSubmenuItems,
  isHomeSectionExpanded,
  isHomeSubmenuItemActive,
  mainNavItems,
  type MainNavId,
} from "./desktop-sidebar-config";
import { DesktopNavIcon } from "./desktop-nav-icon";
import styles from "./desktop-sidebar.module.css";

const mainNavIconIds: Record<MainNavId, "categories" | "goals" | "accounts" | "ai"> = {
  categories: "categories",
  goals: "goals",
  accounts: "accounts",
  ai: "ai",
};

function NavLink({
  active,
  children,
  className,
  href,
}: {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <Link className={cn(active ? styles.sidebarLinkActive : styles.sidebarLink, className)} href={href}>
      {children}
    </Link>
  );
}

export function DesktopSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const homeExpanded = isHomeSectionExpanded(pathname);
  const activeMainNavId = getActiveMainNavId(pathname);

  return (
    <aside aria-label="Основная навигация" className={cn(styles.sidebar, className)}>
      <div className={styles.sidebarGroups}>
        {homeExpanded ? (
          <section className={styles.sidebarGroupActive}>
            <Link className={styles.sidebarGroupHeader} href="/">
              <DesktopNavIcon active id="home" />
              <span>Главная</span>
            </Link>

            <div className={styles.sidebarSubmenu}>
              {homeSubmenuItems.map((item) => (
                <Link
                  className={
                    isHomeSubmenuItemActive(pathname, item.href)
                      ? styles.sidebarSubLinkActive
                      : styles.sidebarSubLink
                  }
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <NavLink href="/">
            <DesktopNavIcon id="home" />
            <span>Главная</span>
          </NavLink>
        )}

        {mainNavItems.map((item) => {
          const isActive = activeMainNavId === item.id;

          return (
            <NavLink active={isActive} href={item.href} key={item.id}>
              <DesktopNavIcon active={isActive} id={mainNavIconIds[item.id]} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className={styles.sidebarFooter}>
        <NavLink href="/settings">
          <DesktopNavIcon id="settings" />
          <span>Настройки</span>
        </NavLink>
        <button className={styles.sidebarLink} type="button">
          <DesktopNavIcon id="logout" />
          <span>Выход</span>
        </button>
      </div>
    </aside>
  );
}
