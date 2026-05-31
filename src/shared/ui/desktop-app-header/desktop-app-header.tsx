"use client";

import Link from "next/link";
import { Bell, Settings2 } from "lucide-react";

import { AppBrand } from "@/shared/ui/app-brand/app-brand";
import { UserAvatar } from "@/shared/ui/user-avatar/user-avatar";

import styles from "./desktop-app-header.module.css";

export function DesktopAppHeader() {
  return (
    <header className={styles.topBar}>
      <AppBrand size="md" />

      <div className={styles.topBarActions}>
        <button aria-label="Уведомления" className={styles.iconButton} type="button">
          <Bell size={18} strokeWidth={1.9} />
        </button>
        <Link aria-label="Настройки" className={styles.iconButton} href="/settings">
          <Settings2 size={18} strokeWidth={1.9} />
        </Link>
        <UserAvatar className={styles.desktopAvatar} />
      </div>
    </header>
  );
}
