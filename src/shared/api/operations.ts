"use client";

import { useQuery } from "@tanstack/react-query";

import { operationsBarsData } from "@/shared/data/operations-bars";
import { operationsScreenData } from "@/shared/data/operations";
import { operationsTrendsData } from "@/shared/data/operations-trends";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type OperationsScreenResponse = typeof operationsScreenData;
export type OperationsTrendsResponse = typeof operationsTrendsData;
export type OperationsBarsResponse = typeof operationsBarsData;

export async function fetchOperationsScreen(): Promise<OperationsScreenResponse> {
  await mockDelay();
  return operationsScreenData;
}

export async function fetchOperationsTrends(): Promise<OperationsTrendsResponse> {
  await mockDelay();
  return operationsTrendsData;
}

export async function fetchOperationsBars(): Promise<OperationsBarsResponse> {
  await mockDelay();
  return operationsBarsData;
}

export function useOperationsScreenQuery() {
  return useQuery({
    queryKey: queryKeys.operations.screen,
    queryFn: fetchOperationsScreen,
  });
}

export function useOperationsTrendsQuery() {
  return useQuery({
    queryKey: queryKeys.operations.trends,
    queryFn: fetchOperationsTrends,
  });
}

export function useOperationsBarsQuery() {
  return useQuery({
    queryKey: queryKeys.operations.bars,
    queryFn: fetchOperationsBars,
  });
}
