"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Search, Settings2, X } from "lucide-react";

import type { GoalsResponse } from "@/shared/api/goals";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopAppHeader } from "@/shared/ui/desktop-app-header/desktop-app-header";
import { DesktopSidebar } from "@/shared/ui/desktop-sidebar/desktop-sidebar";

import styles from "./desktop-goals-screen.module.css";

function formatGoalAmount(value: number) {
  return `${formatCurrencyParts(value).whole} ₽`;
}

function filterGoals(goals: GoalsResponse["goals"], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return goals;
  }

  return goals.filter((goal) => {
    const searchableText = [
      goal.title,
      goal.account.label,
      goal.account.suffix,
      formatGoalAmount(goal.current),
      formatGoalAmount(goal.target),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

function GoalDesktopCard({ goal }: { goal: GoalsResponse["goals"][number] }) {
  const progress = Math.min(100, (goal.current / goal.target) * 100);

  return (
    <Link className={styles.goalCardLink} href={`/goals/${goal.id}`}>
      <article className={styles.goalCard}>
      <div aria-hidden className={styles.goalBackground}>
        <img alt="" className={styles.goalImage} draggable={false} src={goal.image} />
        <div className={styles.goalOverlay} />
      </div>

      <div className={styles.goalContent}>
        <div className={styles.goalHeader}>
          <h2>{goal.title}</h2>
          <button aria-label={`Настроить цель ${goal.title}`} className={styles.goalSettings} type="button">
            <Settings2 size={18} strokeWidth={1.8} />
          </button>
        </div>

        <p className={styles.goalAmount}>
          <span>{formatGoalAmount(goal.current)}</span>
          <span> / {formatGoalAmount(goal.target)}</span>
        </p>

        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
    </Link>
  );
}

export function DesktopGoalsScreen({
  data,
  onCreateGoal,
}: {
  data: GoalsResponse;
  onCreateGoal?: () => void;
}) {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredGoals = useMemo(
    () => filterGoals(data.goals, searchQuery),
    [data.goals, searchQuery],
  );
  const hasActiveSearch = searchQuery.trim().length > 0;

  return (
    <main className={styles.desktopViewport}>
      <DesktopAppHeader />

      <div className={styles.shell}>
        <DesktopSidebar />

        <section className={styles.content}>
          <h1 className={styles.pageTitle}>{data.desktop.title}</h1>

          <div className={styles.contentGrid}>
            <form className={styles.searchBar} onSubmit={(event) => event.preventDefault()} role="search">
              <Search aria-hidden size={24} strokeWidth={1.9} />
              <label className={styles.searchLabel} htmlFor={searchInputId}>
                {data.desktop.searchPlaceholder}
              </label>
              <input
                autoComplete="off"
                id={searchInputId}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={data.desktop.searchPlaceholder}
                type="search"
                value={searchQuery}
              />
              {hasActiveSearch ? (
                <button
                  aria-label="Очистить поиск"
                  className={styles.clearSearchButton}
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              ) : null}
            </form>

            <div className={styles.leftColumn}>
              <div className={styles.cardsGrid}>
                <section className={styles.createCard}>
                  <div className={styles.createText}>
                    <h2>
                      Выберите <span>новую цель</span>
                      <br />
                      и отслеживайте свои
                      <br />
                      накопления
                    </h2>
                    <button className={styles.createButton} onClick={onCreateGoal} type="button">
                      {data.desktop.createCard.cta}
                    </button>
                  </div>

                  <div className={styles.createImageWrap}>
                    <img
                      alt=""
                      aria-hidden
                      className={styles.createImage}
                      draggable={false}
                      src={data.desktop.createCard.image}
                    />
                  </div>
                </section>

                {filteredGoals.map((goal) => (
                  <GoalDesktopCard goal={goal} key={goal.id} />
                ))}

                {hasActiveSearch && filteredGoals.length === 0 ? (
                  <p className={styles.emptySearch}>По запросу «{searchQuery.trim()}» цели не найдены</p>
                ) : null}
              </div>
            </div>

            <div className={styles.rightColumn}>
              <section className={styles.protectionCard}>
                <div className={styles.protectionImageWrap}>
                  <img
                    alt=""
                    aria-hidden
                    className={styles.protectionImage}
                    draggable={false}
                    src={data.desktop.protection.image}
                  />
                </div>

                <div className={styles.protectionContent}>
                  <h2>{data.desktop.protection.title}</h2>
                  <p>{data.desktop.protection.description}</p>
                  <button className={styles.protectionButton} type="button">
                    {data.desktop.protection.button}
                  </button>
                </div>
              </section>

              <section className={styles.assistantCard}>
                <div className={styles.assistantImageWrap}>
                  <img
                    alt=""
                    aria-hidden
                    className={styles.assistantImage}
                    draggable={false}
                    src={data.desktop.assistant.image}
                  />
                </div>

                <div className={styles.assistantContent}>
                  <h2>{data.desktop.assistant.title}</h2>
                  <p>{data.desktop.assistant.description}</p>
                  <button className={styles.assistantButton} type="button">
                    {data.desktop.assistant.button}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
