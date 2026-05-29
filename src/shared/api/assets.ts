"use client";

import { useQuery } from "@tanstack/react-query";

import { categoriesAssets, userAvatarSrc } from "@/shared/data/assets";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type AssetsResponse = {
  categoriesAssets: typeof categoriesAssets;
  userAvatarSrc: typeof userAvatarSrc;
};

export async function fetchAssets(): Promise<AssetsResponse> {
  await mockDelay();

  return {
    categoriesAssets,
    userAvatarSrc,
  };
}

export function useAssetsQuery() {
  return useQuery({
    queryKey: queryKeys.assets,
    queryFn: fetchAssets,
  });
}
