"use client";

import { Bell, Edit3 } from "lucide-react";

import { useGoalsQuery, type GoalsResponse } from "@/shared/api/goals";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import { DesktopGoalsScreen } from "./desktop-goals-screen";
import styles from "./goals-screen.module.css";

const assets = {
  sberIcon: "/dashboard/balance/icon-sber.svg",
  accountDot: "/dashboard/balance/divider-dot-sber.svg",
  createIllustration: "/goals/create-illustration.png",
  avatar: "/goals/avatar.png",
} as const;

function GoalCard({
  current,
  image,
  target,
  title,
  account,
}: GoalsResponse["goals"][number]) {
  const progress = Math.min(100, (current / target) * 100);
  const currentFormatted = formatCurrencyParts(current).whole;
  const targetFormatted = formatCurrencyParts(target).whole;

  return (
    <article className={styles.goalCard}>
      <div aria-hidden className={styles.goalCardBackground}>
        <img alt="" className={styles.goalCardImage} draggable={false} src={image} />
        <div className={styles.goalCardOverlay} />
      </div>

      <div className={styles.goalCardTop}>
        <div className={styles.goalCardTitleRow}>
          <h2 className={styles.goalCardTitle}>{title}</h2>
          <button aria-label={`Редактировать цель «${title}»`} className={styles.editButton} type="button">
            <Edit3 size={20} strokeWidth={1.8} />
          </button>
        </div>

        <div className={styles.accountChip}>
          <img alt="" aria-hidden className={styles.accountIcon} draggable={false} src={assets.sberIcon} />
          <span className={styles.accountText}>
            {account.label}
            <img alt="" aria-hidden className={styles.accountDot} draggable={false} src={assets.accountDot} />
            {account.suffix}
          </span>
        </div>
      </div>

      <div className={styles.goalCardBottom}>
        <p className={styles.amountRow}>
          <span className={styles.amountCurrent}>{currentFormatted} ₽ / </span>
          <span className={styles.amountTarget}>{targetFormatted} ₽</span>
        </p>

        <div aria-hidden className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}

export function GoalsScreenView() {
  const query = useGoalsQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка целей..." query={query}>
      {(goalsScreenData) => <GoalsScreenContent goalsScreenData={goalsScreenData} />}
    </QueryBoundary>
  );
}

function GoalsScreenContent({ goalsScreenData }: { goalsScreenData: GoalsResponse }) {
  return (
    <main className={styles.stage}>
      <div className={styles.desktopShell}>
        <DesktopGoalsScreen data={goalsScreenData} />
      </div>

      <div className={styles.mobileShell}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <div className={styles.notificationWrap}>
                <button aria-label="Уведомления" className={styles.iconButton} type="button">
                  <Bell size={24} strokeWidth={1.8} />
                </button>
                <span className={styles.badge}>{goalsScreenData.notifications}</span>
              </div>

              <h1 className={styles.title}>{goalsScreenData.title}</h1>

              <button aria-label="Профиль" className={styles.avatar} type="button">
                <img alt="" className={styles.avatarImage} draggable={false} src={assets.avatar} />
              </button>
            </header>
          </Reveal>

          <div className={styles.content}>
            <Reveal delay={0.08}>
              <section className={styles.createCard}>
                <div className={styles.createCardBody}>
                  <h2 className={styles.createCardTitle}>{goalsScreenData.createCard.title}</h2>
                  <p className={styles.createCardDescription}>{goalsScreenData.createCard.description}</p>
                  <button className={styles.createButton} type="button">
                    {goalsScreenData.createCard.cta}
                  </button>
                </div>

                <div aria-hidden className={styles.createIllustrationWrap}>
                  <div className={styles.createIllustrationRotated}>
                    <div className={styles.createIllustrationFrame}>
                      <img
                        alt=""
                        className={styles.createIllustration}
                        draggable={false}
                        src={assets.createIllustration}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <div className={styles.goalsList}>
              {goalsScreenData.goals.map((goal, index) => (
                <Reveal delay={0.12 + index * 0.04} key={goal.id}>
                  <GoalCard {...goal} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
