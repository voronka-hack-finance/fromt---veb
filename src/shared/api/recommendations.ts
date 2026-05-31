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
    chats: ReadonlyArray<{
      agentId?: string;
      id: string;
      title: string;
      preview: string;
      timestamp: string;
      imageKey: keyof typeof recommendationsAssets.agentImages;
      imageVariant: "a" | "b" | "c" | "d" | "e";
    }>;
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
    screen: {
      ...recommendationsScreenData,
      chats: recommendationsScreenData.chats.map((chat) => ({
        ...chat,
        agentId:
          chat.id.includes("expense-detective")
            ? "expense-detective"
            : chat.id.includes("growth-strategist")
              ? "growth-strategist"
              : chat.id.includes("balancer")
                ? "balancer"
                : chat.id.includes("habit-trainer")
                  ? "habit-trainer"
                  : "pillow-keeper",
      })),
    },
  } as RecommendationsResponse)) as Promise<RecommendationsResponse>;
}

export function useRecommendationsQuery() {
  return useQuery({
    queryKey: queryKeys.recommendations,
    queryFn: fetchRecommendations,
  });
}
