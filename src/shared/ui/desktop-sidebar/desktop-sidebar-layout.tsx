"use client";

import { Bell, Settings2 } from "lucide-react";

import { AppBrand } from "@/shared/ui/app-brand/app-brand";
import { UserAvatar } from "@/shared/ui/user-avatar/user-avatar";

import { DesktopSidebar } from "./desktop-sidebar";
import styles from "./desktop-sidebar-layout.module.css";

export function DesktopSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.topBar}>
        <AppBrand />

        <div className={styles.topBarActions}>
          <button aria-label="Уведомления" className={styles.iconButton} type="button">
            <Bell size={18} strokeWidth={1.9} />
          </button>
          <button aria-label="Настройки" className={styles.iconButton} type="button">
            <Settings2 size={18} strokeWidth={1.9} />
          </button>
          <UserAvatar className={styles.desktopAvatar} />
        </div>
      </header>

      <div className={styles.shell}>
        <div className={styles.sidebarSlot}>
          <DesktopSidebar />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
