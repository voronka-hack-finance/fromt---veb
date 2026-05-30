"use client";

import { useRouter } from "next/navigation";

import { useDashboardQuery } from "@/shared/api/dashboard";
import { useOptionalDashboardData } from "@/shared/api/dashboard-context";
import { cn } from "@/shared/lib/cn";
import { UserAvatar } from "@/shared/ui/user-avatar/user-avatar";

import styles from "./app-top-bar.module.css";

const assets = {
  notification: "/dashboard/nav/notification.svg",
} as const;

type AppTopBarProps = {
  lowercaseTitle?: boolean;
  notifications?: number;
  title?: string;
};

export function AppTopBar({ lowercaseTitle, notifications, title }: AppTopBarProps) {
  const router = useRouter();
  const dashboardQuery = useDashboardQuery();
  const dashboardFromContext = useOptionalDashboardData();

  const dashboard = dashboardFromContext?.dashboard ?? dashboardQuery.data?.dashboard;
  const resolvedTitle = title ?? dashboard?.title ?? "заначка";
  const resolvedNotifications = notifications ?? dashboard?.notifications;

  return (
    <header className={styles.header}>
      <div className={styles.notificationWrap}>
        <button
          aria-label="Уведомления"
          className={styles.iconButton}
          onClick={() => router.push("/notifications")}
          type="button"
        >
          <img alt="" aria-hidden className={styles.icon} draggable={false} src={assets.notification} />
        </button>
        {resolvedNotifications !== undefined ? (
          <span className={styles.badge}>{resolvedNotifications}</span>
        ) : null}
      </div>

      <h1 className={cn(styles.title, lowercaseTitle && styles.titleLowercase)}>{resolvedTitle}</h1>

      <UserAvatar onClick={() => router.push("/categories")} />
    </header>
  );
}
