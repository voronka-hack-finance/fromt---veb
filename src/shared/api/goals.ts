"use client";

import { useQuery } from "@tanstack/react-query";

import { goalsScreenData } from "@/shared/data/goals";

import { loadGoalsScreenData, tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type GoalsResponse = {
  desktop: typeof goalsScreenData.desktop;
  notifications: number;
  title: string;
  createCard: typeof goalsScreenData.createCard;
  avatar: string;
  goals: ReadonlyArray<{
    id: string;
    title: string;
    image: string;
    current: number;
    target: number;
    account: {
      label: string;
      suffix: string;
    };
  }>;
};

export async function fetchGoals(): Promise<GoalsResponse> {
  await mockDelay();
  return tryLoadScreenData(
    loadGoalsScreenData,
    () => goalsScreenData as GoalsResponse,
  ) as Promise<GoalsResponse>;
}

export function useGoalsQuery() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: fetchGoals,
  });
}
