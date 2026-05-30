"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { ensureDemoAuth } from "@/shared/lib/auth/ensure-demo-auth";

type DemoAuthProviderProps = {
  children: ReactNode;
};

export function DemoAuthProvider({ children }: DemoAuthProviderProps) {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await ensureDemoAuth();

      if (cancelled) {
        return;
      }

      await queryClient.invalidateQueries();
      setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  if (!isReady) {
    return null;
  }

  return children;
}
