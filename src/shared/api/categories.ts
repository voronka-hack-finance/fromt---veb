"use client";

import { useQuery } from "@tanstack/react-query";

import type { CategoryDetailData } from "@/shared/data/category-details";
import { categoriesAssets } from "@/shared/data/assets";
import { categoriesScreenData } from "@/shared/data/categories";

import { loadCategoriesScreenData, tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type CategoriesResponse = {
  assets: typeof categoriesAssets;
  detailsById?: Record<string, CategoryDetailData>;
  screen: {
    title: string;
    promo: {
      title: string;
      description: string[];
      cta: string;
    };
    categories: ReadonlyArray<{
      id: string;
      title: string;
      spent: number;
      total: number;
      tone: "dark" | "light" | "light-darkbar";
      icon: keyof typeof categoriesAssets.icons;
      progress: number;
    }>;
  };
};

export async function fetchCategories(): Promise<CategoriesResponse> {
  await mockDelay();
  return tryLoadScreenData(loadCategoriesScreenData, () => ({
    assets: categoriesAssets,
    detailsById: undefined,
    screen: categoriesScreenData,
  } as CategoriesResponse)) as Promise<CategoriesResponse>;
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}
