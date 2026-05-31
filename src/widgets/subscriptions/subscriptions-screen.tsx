"use client";

import Link from "next/link";
import { ArrowLeft, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import {
  useSubscriptionsQuery,
  type SubscriptionsResponse,
} from "@/shared/api/subscriptions";
import { cn } from "@/shared/lib/cn";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import {
  deleteRegularExpenseOnBackend,
  updateRegularExpenseOnBackend,
} from "@/shared/lib/regular-expenses";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { CreateSubscriptionDialog } from "./create-subscription-dialog";
import { EditSubscriptionDialog } from "./edit-subscription-dialog";
import styles from "./subscriptions-screen.module.css";

type TabId = SubscriptionsResponse["tabs"][number]["id"];

function formatRubles(value: number) {
  return `${formatCurrencyParts(value).whole}₽`;
}

function pluralizeMonths(months: number) {
  const mod10 = months % 10;
  const mod100 = months % 100;

  if (mod10 === 1 && mod100 !== 11) return "месяц";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "месяца";

  return "месяцев";
}

function SubscriptionCategoryIcon() {
  return (
    <div aria-hidden className={styles.subscriptionIconWrap}>
      <div className={styles.subscriptionIconInner}>
        <img
          alt=""
          className={styles.subscriptionIconGlyph}
          draggable={false}
          src="/subscriptions/category-icon.svg"
        />
      </div>
    </div>
  );
}

function SubscriptionItem({
  monthlyPrice,
  months,
  name,
  status,
  totalSpent,
  onDelete,
  onEdit,
  onToggleStatus,
}: SubscriptionsResponse["subscriptions"][number] & {
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const isPaused = status === "paused";

  return (
    <article className={cn(styles.subscriptionRow, isPaused && styles.subscriptionRowPaused)}>
      <div className={styles.subscriptionMain}>
        <SubscriptionCategoryIcon />

        <div className={styles.subscriptionMeta}>
          <h2 className={styles.subscriptionName}>{name}</h2>
          <p className={styles.subscriptionPeriod}>
            <span className={cn(styles.subscriptionMonths, isPaused && styles.subscriptionMonthsPaused)}>
              {months}
            </span>{" "}
            {pluralizeMonths(months)}
          </p>
        </div>
      </div>

      <div className={styles.subscriptionPriceBlock}>
        <p className={styles.subscriptionPrice}>
          <span className={cn(isPaused && styles.subscriptionPriceStrike)}>{formatRubles(monthlyPrice)}</span>
          <span className={styles.subscriptionPriceSuffix}>/месяц</span>
        </p>
        <p className={styles.subscriptionTotal}>Всего: {formatRubles(totalSpent)}</p>
      </div>

      <div className={styles.subscriptionActions}>
        <button aria-label={`Редактировать ${name}`} className={styles.actionButton} onClick={onEdit} type="button">
          <Pencil size={18} strokeWidth={1.8} />
        </button>
        <button
          aria-label={isPaused ? `Возобновить ${name}` : `Поставить на паузу ${name}`}
          className={styles.actionButton}
          onClick={onToggleStatus}
          type="button"
        >
          {isPaused ? <Play size={18} strokeWidth={1.8} /> : <Pause size={18} strokeWidth={1.8} />}
        </button>
        <button aria-label={`Удалить ${name}`} className={styles.actionButtonDanger} onClick={onDelete} type="button">
          <Trash2 size={18} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}

export function SubscriptionsScreenView() {
  const query = useSubscriptionsQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка подписок..." query={query}>
      {(screenData) => <SubscriptionsScreenContent screenData={screenData} />}
    </QueryBoundary>
  );
}

function SubscriptionsScreenContent({
  screenData,
}: {
  screenData: SubscriptionsResponse;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<
    SubscriptionsResponse["subscriptions"][number] | null
  >(null);

  const mutation = useMutation({
    mutationFn: async ({
      expenseId,
      mode,
    }: {
      expenseId: string;
      mode: "delete" | "pause" | "resume";
    }) => {
      if (mode === "delete") {
        await deleteRegularExpenseOnBackend(expenseId);
        return;
      }

      await updateRegularExpenseOnBackend(expenseId, {
        status: mode === "pause" ? "paused" : "active",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });

  const visibleSubscriptions = screenData.subscriptions.filter((item) => {
    if (activeTab === "active") return item.status === "active";
    if (activeTab === "paused") return item.status === "paused";

    return true;
  });

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
      <CreateSubscriptionDialog onClose={() => setIsCreateOpen(false)} open={isCreateOpen} />
      <EditSubscriptionDialog
        onClose={() => setEditingSubscription(null)}
        open={Boolean(editingSubscription)}
        subscription={editingSubscription}
      />
      <div className={styles.shell}>
        <div className={styles.topSection}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{screenData.title}</h1>
            </header>
          </Reveal>

          <div className={styles.content}>
          <Reveal delay={0.07}>
            <section className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <div>
                  <p className={styles.summaryLabel}>В месяц</p>
                  <p className={styles.summaryValue}>{formatRubles(screenData.summary.perMonth)}</p>
                </div>
                <div className={styles.summaryRight}>
                  <p className={styles.summaryLabel}>Всего потрачено</p>
                  <p className={styles.summaryValue}>{formatRubles(screenData.summary.totalSpent)}</p>
                </div>
              </div>

              <div className={styles.nextChargePill}>
                <span>{screenData.summary.nextChargeLabel}</span>
                <span>{screenData.summary.nextChargeDate}</span>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.11}>
            <div className={styles.tabs}>
              {screenData.tabs.map((tab) => (
                <button
                  className={cn(styles.tab, activeTab === tab.id && styles.tabActive)}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <span>{tab.label}</span>
                  <span>{tab.count}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <section className={styles.listCard}>
            {visibleSubscriptions.length ? (
              visibleSubscriptions.map((subscription, index) => (
                <Reveal delay={0.15 + index * 0.04} key={subscription.id}>
                  <div className={styles.listRowWrap}>
                    <SubscriptionItem
                      {...subscription}
                      onDelete={() => {
                        if (window.confirm(`Удалить подписку «${subscription.name}»?`)) {
                          mutation.mutate({ expenseId: subscription.id, mode: "delete" });
                        }
                      }}
                      onEdit={() => setEditingSubscription(subscription)}
                      onToggleStatus={() =>
                        mutation.mutate({
                          expenseId: subscription.id,
                          mode: subscription.status === "paused" ? "resume" : "pause",
                        })
                      }
                    />
                    {index < visibleSubscriptions.length - 1 ? <div className={styles.divider} /> : null}
                  </div>
                </Reveal>
              ))
            ) : (
              <p className={styles.emptyState}>Пока нет регулярных затрат. Добавьте первую подписку.</p>
            )}
          </section>
          </div>
        </div>

        <Reveal delay={0.28}>
          <button className={styles.addButton} onClick={() => setIsCreateOpen(true)} type="button">
            <span>Добавить подписку</span>
            <Plus aria-hidden size={24} strokeWidth={1.9} />
          </button>
        </Reveal>

        <div aria-hidden className={styles.homeIndicatorArea}>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </main>
    </DesktopSidebarLayout>
  );
}
