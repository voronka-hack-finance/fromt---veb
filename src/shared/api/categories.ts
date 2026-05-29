"use client";

import { useQuery } from "@tanstack/react-query";

import { categoriesAssets } from "@/shared/data/assets";
import { categoriesScreenData } from "@/shared/data/categories";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type CategoriesResponse = {
  assets: typeof categoriesAssets;
  screen: typeof categoriesScreenData;
};

export async function fetchCategories(): Promise<CategoriesResponse> {
  await mockDelay();

  return {
    assets: categoriesAssets,
    screen: categoriesScreenData,
  };
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}
