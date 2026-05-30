"use client";

import { useQuery } from "@tanstack/react-query";

import { recommendationsAssets, recommendationsScreenData } from "@/shared/data/recommendations";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type RecommendationsResponse = {
  assets: typeof recommendationsAssets;
  screen: typeof recommendationsScreenData;
};

export async function fetchRecommendations(): Promise<RecommendationsResponse> {
  await mockDelay();

  return {
    assets: recommendationsAssets,
    screen: recommendationsScreenData,
  };
}

export function useRecommendationsQuery() {
  return useQuery({
    queryKey: queryKeys.recommendations,
    queryFn: fetchRecommendations,
  });
}
