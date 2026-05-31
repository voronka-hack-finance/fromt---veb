"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

import { ensureDemoAuth } from "@/shared/lib/auth/ensure-demo-auth";

type DemoAuthProviderProps = {
  children: ReactNode;
};

export function DemoAuthProvider({ children }: DemoAuthProviderProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const isAuthenticated = await ensureDemoAuth();

      if (cancelled) {
        return;
      }

      if (isAuthenticated) {
        await queryClient.invalidateQueries();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  return children;
}
