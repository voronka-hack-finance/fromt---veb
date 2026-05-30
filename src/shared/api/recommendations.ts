"use client";

import { useQuery } from "@tanstack/react-query";

import { recommendationsAssets, recommendationsScreenData } from "@/shared/data/recommendations";

import {
  loadRecommendationsScreenData,
  tryLoadScreenData,
} from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type RecommendationsResponse = {
  assets: typeof recommendationsAssets;
  screen: {
    title: string;
    tabs: ReadonlyArray<{
      id: string;
      label: string;
    }>;
    summary: {
      agentsCount: number;
      text: string;
    };
    chatCta: string;
    chatsPlaceholder: string;
    agents: ReadonlyArray<{
      id: string;
      title: string;
      subtitle: string;
      imageKey: keyof typeof recommendationsAssets.agentImages;
      imageVariant: "a" | "b" | "c" | "d";
      insightLead: string;
      insightRest: string;
    }>;
  };
};

export async function fetchRecommendations(): Promise<RecommendationsResponse> {
  await mockDelay();
  return tryLoadScreenData(loadRecommendationsScreenData, () => ({
    assets: recommendationsAssets,
    screen: recommendationsScreenData,
  } as RecommendationsResponse)) as Promise<RecommendationsResponse>;
}

export function useRecommendationsQuery() {
  return useQuery({
    queryKey: queryKeys.recommendations,
    queryFn: fetchRecommendations,
  });
}
