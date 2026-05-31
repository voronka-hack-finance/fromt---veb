"use client";

import { useQuery } from "@tanstack/react-query";

import { goalDetails, type GoalDetail } from "@/shared/data/goal-details";
import { loadGoalDetailFromBackend } from "@/shared/lib/goal-detail";

import { tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type GoalDetailResponse = GoalDetail;

export async function fetchGoalDetail(goalId: string): Promise<GoalDetailResponse> {
  await mockDelay();

  return tryLoadScreenData(
    () => loadGoalDetailFromBackend(goalId),
    () => {
      const goal = goalDetails[goalId];

      if (!goal) {
        throw new Error(`Goal not found: ${goalId}`);
      }

      return goal;
    },
  );
}

export function useGoalDetailQuery(goalId: string) {
  return useQuery({
    queryKey: queryKeys.goalDetail(goalId),
    queryFn: () => fetchGoalDetail(goalId),
  });
}
