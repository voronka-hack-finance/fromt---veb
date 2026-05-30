"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import {
  useRecommendationsQuery,
  type RecommendationsResponse,
} from "@/shared/api/recommendations";
import { cn } from "@/shared/lib/cn";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./recommendations-screen.module.css";

type TabId = RecommendationsResponse["screen"]["tabs"][number]["id"];
type Agent = RecommendationsResponse["screen"]["agents"][number];

const imageWrapClassMap = {
  a: styles.agentImageWrapA,
  b: styles.agentImageWrapB,
  c: styles.agentImageWrapC,
  d: styles.agentImageWrapD,
} as const;

const imageRotatedClassMap = {
  a: styles.agentImageRotatedA,
  b: styles.agentImageRotatedB,
  c: styles.agentImageRotatedC,
  d: styles.agentImageRotatedD,
} as const;

const imageFrameClassMap = {
  a: styles.agentImageFrameA,
  b: styles.agentImageFrameB,
  c: styles.agentImageFrameC,
  d: styles.agentImageFrameD,
} as const;

function AgentCard({
  agent,
  assets,
  chatCta,
}: {
  agent: Agent;
  assets: RecommendationsResponse["assets"];
  chatCta: string;
}) {
  const imageVariant = agent.imageVariant;
  const agentImage = assets.agentImages[agent.imageKey];

  return (
    <article className={styles.agentCard}>
      <div className={[styles.agentImageWrap, imageWrapClassMap[imageVariant]].join(" ")}>
        <div className={imageRotatedClassMap[imageVariant]}>
          <div className={imageFrameClassMap[imageVariant]}>
            <img alt="" aria-hidden className={styles.agentImage} draggable={false} src={agentImage} />
          </div>
        </div>
      </div>

      <div className={styles.agentHeader}>
        <h2 className={styles.agentTitle}>{agent.title}</h2>
        <p className={styles.agentSubtitle}>{agent.subtitle}</p>
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightTop}>
          <div aria-hidden className={styles.insightIconWrap}>
            <img alt="" className={styles.insightIcon} draggable={false} src={assets.insightIcon} />
          </div>
          <p className={styles.insightLead}>{agent.insightLead}</p>
        </div>
        <p className={styles.insightRest}>{agent.insightRest}</p>
      </div>

      <div className={styles.actionRow}>
        <img alt="" aria-hidden className={styles.actionUnion} draggable={false} src={assets.actionUnion} />
        <button className={styles.chatButton} type="button">
          {chatCta}
        </button>
        <button aria-label="Открыть чат" className={styles.arrowButton} type="button">
          <img alt="" aria-hidden className={styles.arrowIcon} draggable={false} src={assets.actionArrow} />
        </button>
      </div>
    </article>
  );
}

export function RecommendationsScreenView() {
  const query = useRecommendationsQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка рекомендаций..." query={query}>
      {(data) => <RecommendationsScreenContent data={data} />}
    </QueryBoundary>
  );
}

function RecommendationsScreenContent({ data }: { data: RecommendationsResponse }) {
  const { assets, screen } = data;
  const [activeTab, setActiveTab] = useState<TabId>("recommendations");

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <div className={styles.headerBlock}>
            <Reveal delay={0.03}>
              <header className={styles.header}>
                <Link aria-label="Назад" className={styles.backButton} href="/">
                  <ArrowLeft size={24} strokeWidth={1.9} />
                </Link>
                <h1 className={styles.title}>{screen.title}</h1>
              </header>
            </Reveal>

            <div className={styles.topSection}>
              <Reveal delay={0.06}>
                <div className={styles.tabs} role="tablist">
                  {screen.tabs.map((tab) => (
                    <button
                      aria-selected={activeTab === tab.id}
                      className={cn(styles.tab, activeTab === tab.id && styles.tabActive)}
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Reveal>

              {activeTab === "recommendations" ? (
                <>
                  <Reveal delay={0.09}>
                    <section className={styles.summaryCard}>
                      <img
                        alt=""
                        aria-hidden
                        className={styles.summaryPattern}
                        draggable={false}
                        src={assets.summaryPattern}
                      />
                      <div className={styles.summaryRow}>
                        <div className={styles.summaryBadge}>
                          <p className={styles.summaryCount}>{screen.summary.agentsCount}</p>
                        </div>
                        <p className={styles.summaryText}>{screen.summary.text}</p>
                      </div>
                    </section>
                  </Reveal>

                  <div className={styles.agentsList}>
                    {screen.agents.map((agent, index) => (
                      <Reveal delay={0.12 + index * 0.04} key={agent.id}>
                        <AgentCard agent={agent} assets={assets} chatCta={screen.chatCta} />
                      </Reveal>
                    ))}
                  </div>
                </>
              ) : (
                <Reveal delay={0.09}>
                  <p className={styles.chatsPlaceholder}>{screen.chatsPlaceholder}</p>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}
