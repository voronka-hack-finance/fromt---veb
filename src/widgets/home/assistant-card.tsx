"use client";

import { useRouter } from "next/navigation";

import styles from "./assistant-card.module.css";

const assets = {
  ctaArrow: "/dashboard/assistant/cta-arrow.svg",
  orbTexture: "/dashboard/assistant/orb-texture.png",
} as const;

export function AssistantCard() {
  const router = useRouter();

  return (
    <section className={styles.card}>
      <div aria-hidden className={styles.orbWrap}>
        <div className={styles.orbRotated}>
          <div className={styles.orbFrame}>
            <img alt="" className={styles.orbImage} draggable={false} src={assets.orbTexture} />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Твой ИИ помощник</h2>
        <p className={styles.text}>Анализирует траты и помогает управлять бюджетом</p>
      </div>

      <div className={styles.ctaRow}>
        <button
          aria-label="Открыть ИИ помощника"
          className={styles.ctaPrimary}
          onClick={() => router.push("/recommendations")}
          type="button"
        >
          Подробнее
        </button>
        <button
          aria-label="Открыть ИИ помощника"
          className={styles.ctaIcon}
          onClick={() => router.push("/recommendations")}
          type="button"
        >
          <img alt="" aria-hidden className={styles.ctaIconImage} draggable={false} src={assets.ctaArrow} />
        </button>
      </div>
    </section>
  );
}
