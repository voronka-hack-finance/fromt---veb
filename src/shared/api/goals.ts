"use client";

import { useQuery } from "@tanstack/react-query";

import { goalsScreenData } from "@/shared/data/goals";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type GoalsResponse = typeof goalsScreenData;

export async function fetchGoals(): Promise<GoalsResponse> {
  await mockDelay();
  return goalsScreenData;
}

export function useGoalsQuery() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: fetchGoals,
  });
}
