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
        <Link aria-label="Уведомления" className={styles.iconButton} href="/notifications">
          <Bell size={18} strokeWidth={1.9} />
        </Link>
        <Link aria-label="Настройки" className={styles.iconButton} href="/settings">
          <Settings2 size={18} strokeWidth={1.9} />
        </Link>
        <UserAvatar className={styles.desktopAvatar} />
      </div>
    </header>
  );
}
