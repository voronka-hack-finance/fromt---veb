"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Pencil,
  Save,
  Type,
  X,
} from "lucide-react";

import { useCategoriesQuery, type CategoriesResponse } from "@/shared/api/categories";
import {
  createCategoryIconOptions,
  createCategoryScreenData,
  type CategoryIconKey,
} from "@/shared/data/create-category";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";

import styles from "./create-category-screen.module.css";

export function CreateCategoryScreenView() {
  const query = useCategoriesQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка формы..." query={query}>
      {(data) => <CreateCategoryScreenContent assets={data.assets} />}
    </QueryBoundary>
  );
}

function CreateCategoryScreenContent({ assets }: { assets: CategoriesResponse["assets"] }) {
  const { sections, defaults, actions, title } = createCategoryScreenData;
  const [name, setName] = useState<string>(defaults.name);
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconKey>(defaults.icon);
  const [description, setDescription] = useState("");
  const [limit, setLimit] = useState<string>(defaults.limit);
  const [frequency, setFrequency] = useState<(typeof sections.frequency.options)[number]>(
    defaults.frequency,
  );

  return (
    <main className={styles.createCategoryStage}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link aria-label="Назад к категориям" className={styles.backButton} href="/categories">
            <ArrowLeft size={20} strokeWidth={1.9} />
          </Link>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <section className={[styles.card, styles.cardWideGap].join(" ")}>
            <h2 className={styles.cardTitle}>{sections.basic.title}</h2>

            <div className={styles.nameRow}>
              <span aria-hidden className={styles.nameIconButton}>
                <Type size={16} strokeWidth={1.8} />
              </span>
              <input
                aria-label="Название категории"
                className={styles.nameInput}
                onChange={(event) => setName(event.target.value)}
                type="text"
                value={name}
              />
              {name ? (
                <button
                  aria-label="Очистить название"
                  className={styles.clearButton}
                  onClick={() => setName("")}
                  type="button"
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              ) : null}
            </div>

            <div className={styles.iconSection}>
              <p className={styles.iconSectionLabel}>{sections.basic.iconPickerLabel}</p>
              <div className={styles.iconGrid}>
                {createCategoryIconOptions.map((iconKey) => {
                  const selected = iconKey === selectedIcon;

                  return (
                    <button
                      aria-label={`Выбрать иконку ${iconKey}`}
                      aria-pressed={selected}
                      className={[styles.iconOption, selected ? styles.iconOptionSelected : ""].join(" ")}
                      key={iconKey}
                      onClick={() => setSelectedIcon(iconKey)}
                      type="button"
                    >
                      <img
                        alt=""
                        aria-hidden
                        className={styles.iconOptionImage}
                        draggable={false}
                        src={assets.icons[iconKey]}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{sections.description.title}</h2>
            <div className={styles.textAreaWrap}>
              <textarea
                className={styles.textArea}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={sections.description.placeholder}
                value={description}
              />
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{sections.limit.title}</h2>
            <div className={styles.fieldWrap}>
              <input
                aria-label="Порог лимита"
                className={styles.limitInput}
                inputMode="numeric"
                onChange={(event) => setLimit(event.target.value)}
                placeholder={defaults.limit}
                type="text"
                value={limit}
              />
              <span className={styles.currency}>₽</span>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{sections.frequency.title}</h2>
            <div className={styles.selectWrap}>
              <div className={styles.selectButton}>
                <span className={styles.selectLabel}>{frequency}</span>
                <span aria-hidden className={styles.selectIcon}>
                  <ChevronDown size={14} strokeWidth={1.8} />
                </span>
              </div>
              <select
                aria-label={sections.frequency.title}
                className={styles.selectNative}
                onChange={(event) =>
                  setFrequency(event.target.value as (typeof sections.frequency.options)[number])
                }
                value={frequency}
              >
                {sections.frequency.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{sections.period.title}</h2>
            <div className={styles.periodButton} role="group" aria-label={sections.period.title}>
              <span aria-hidden className={styles.periodIconButton}>
                <Calendar size={16} strokeWidth={1.8} />
              </span>
              <div className={styles.periodDates}>
                <span>{defaults.periodStart}</span>
                <span>–</span>
                <span>{defaults.periodEnd}</span>
              </div>
            </div>
          </section>
        </form>

        <div className={styles.actions}>
          <button className={styles.saveButton} type="button">
            <Save size={20} strokeWidth={1.8} />
            <span>{actions.save}</span>
          </button>
          <button aria-label="Редактировать" className={styles.editButton} type="button">
            <Pencil size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </main>
  );
}
