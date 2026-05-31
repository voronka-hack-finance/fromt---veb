"use client";

import { useQuery } from "@tanstack/react-query";

import {
  operationDetails,
  type OperationDetail,
} from "@/shared/data/operation-details";

import { loadOperationDetailFromBackend } from "@/shared/lib/operation-detail";
import { tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type OperationDetailResponse = OperationDetail;

export async function fetchOperationDetail(
  operationId: string,
): Promise<OperationDetailResponse> {
  await mockDelay();

  return tryLoadScreenData(
    () => loadOperationDetailFromBackend(operationId),
    () => {
      const operation = operationDetails[operationId];

      if (!operation) {
        throw new Error(`Operation not found: ${operationId}`);
      }

      return operation;
    },
  );
}

export function useOperationDetailQuery(operationId: string) {
  return useQuery({
    queryKey: queryKeys.operations.detail(operationId),
    queryFn: () => fetchOperationDetail(operationId),
  });
}
