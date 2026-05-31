"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  useNotificationsQuery,
  type NotificationsResponse,
} from "@/shared/api/notifications";
import type {
  NotificationIconKey,
  NotificationItem,
  NotificationSection,
} from "@/shared/data/notifications";
import { cn } from "@/shared/lib/cn";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./notifications-screen.module.css";

const assets: Record<NotificationIconKey, string> = {
  wallet: "/notifications/wallet-minus.svg",
  star: "/notifications/magic-star.svg",
  question: "/notifications/message-question.svg",
  trend: "/notifications/trend.svg",
  subscription: "/notifications/subscription.svg",
};

function NotificationCard({ item }: { item: NotificationItem }) {
  const isUnread = Boolean(item.unread);

  return (
    <article className={cn(styles.card, isUnread ? styles.cardUnread : styles.cardRead)}>
      <div className={cn(styles.cardContent, isUnread ? styles.cardContentUnread : "")}>
        <div className={cn(styles.cardHeader, isUnread ? styles.iconWrapUnread : "")}>
          <span className={cn(styles.iconWrap, isUnread ? styles.iconWrapUnread : "")}>
            <span className={cn(styles.iconButton, isUnread ? styles.iconButtonUnread : "")}>
              <img
                alt=""
                aria-hidden
                className={styles.iconImage}
                draggable={false}
                src={assets[item.icon]}
              />
            </span>
            {isUnread ? <span aria-hidden className={styles.unreadBadge} /> : null}
          </span>
          <h3 className={styles.cardTitle}>{item.title}</h3>
        </div>
        <p className={styles.cardBody}>{item.body}</p>
        <p className={styles.cardTime}>{item.time}</p>
      </div>
    </article>
  );
}

function NotificationSectionBlock({
  section,
  secondaryTitle,
}: {
  section: NotificationSection;
  secondaryTitle?: boolean;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionTitleWrap}>
        <h2
          className={cn(styles.sectionTitle, secondaryTitle ? styles.sectionTitleSecondary : "")}
        >
          {section.title}
        </h2>
      </div>
      <div className={styles.items}>
        {section.items.map((item) => (
          <NotificationCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

function NotificationsContent({ data }: { data: NotificationsResponse }) {
  const sections = data.sections.filter((section) => section.items.length > 0);

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{data.title}</h1>
              <span aria-hidden className={styles.backButton} style={{ visibility: "hidden" }} />
            </header>
          </Reveal>

          {sections.length > 0 ? (
            <div className={styles.sections}>
              {sections.map((section, index) => (
                <Reveal delay={0.06 + index * 0.04} key={section.id}>
                  <NotificationSectionBlock secondaryTitle={index > 0} section={section} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.06}>
              <section className={styles.emptyState}>
                <h2 className={styles.emptyTitle}>Пока уведомлений нет</h2>
                <p className={styles.emptyText}>
                  Когда появятся рекомендации, лимиты или важные события по финансам, они будут
                  собраны здесь.
                </p>
              </section>
            </Reveal>
          )}
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function NotificationsScreenView() {
  const query = useNotificationsQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка уведомлений..." query={query}>
      {(data) => <NotificationsContent data={data} />}
    </QueryBoundary>
  );
}
