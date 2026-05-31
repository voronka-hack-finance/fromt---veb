import type { categoriesAssets } from "@/shared/data/assets";

export type CategoryIconKey = keyof typeof categoriesAssets.icons;

export const createCategoryIconOptions = [
  "paw",
  "bag",
  "dindon",
  "coffee",
  "weight",
  "study",
  "arrow",
  "bank",
  "wifi",
  "car",
  "monitor",
  "airplane",
  "cloche",
  "xz",
] as const satisfies readonly CategoryIconKey[];

export const createCategoryScreenData = {
  title: "Новая категория",
  sections: {
    basic: {
      title: "Базовые настройки",
      iconPickerLabel: "Выберите иконку",
    },
    description: {
      title: "Описание категории",
      placeholder:
        "Опишите категорию для более точной и/или автоматической классификации подходящих операций",
    },
    limit: {
      title: "Укажите порог лимита",
    },
    frequency: {
      title: "Частота обновления",
      options: ["Раз в месяц", "Раз в неделю", "Раз в год"] as const,
    },
    period: {
      title: "Период действия",
    },
  },
  defaults: {
    name: "Путешествия",
    icon: "airplane" as CategoryIconKey,
    limit: "10 000",
    frequency: "Раз в месяц",
    periodStart: "12.05.2022",
    periodEnd: "12.05.2022",
  },
  actions: {
    save: "Сохранить лимит",
  },
} as const;
