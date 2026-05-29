"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./query-state.module.css";

type QueryStateProps = {
  compact?: boolean;
  label?: string;
  message?: string;
  onRetry?: () => void;
};

export function QueryLoading({ compact, label = "Загрузка..." }: QueryStateProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(styles.queryState, compact && styles.queryStateCompact)}
      role="status"
    >
      <span aria-hidden className={styles.queryStateSpinner} />
      <p className={styles.queryStateMessage}>{label}</p>
    </div>
  );
}

export function QueryError({
  compact,
  message = "Не удалось загрузить данные",
  onRetry,
}: QueryStateProps) {
  return (
    <div
      className={cn(styles.queryState, compact && styles.queryStateCompact)}
      role="alert"
    >
      <p className={styles.queryStateMessage}>{message}</p>
      {onRetry ? (
        <button className={styles.queryStateRetry} onClick={onRetry} type="button">
          Повторить
        </button>
      ) : null}
    </div>
  );
}

type QueryBoundaryProps<T> = {
  compact?: boolean;
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
  loadingLabel?: string;
};

export function QueryBoundary<T>({
  compact,
  query,
  children,
  loadingLabel,
}: QueryBoundaryProps<T>) {
  if (query.isLoading) {
    return <QueryLoading compact={compact} label={loadingLabel} />;
  }

  if (query.isError || !query.data) {
    return <QueryError compact={compact} onRetry={() => query.refetch()} />;
  }

  return children(query.data);
}
