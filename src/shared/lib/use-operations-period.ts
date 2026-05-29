"use client";

import { useCallback, useEffect, useState } from "react";

import {
  type OperationsPeriod,
  persistOperationsPeriod,
  readStoredPeriod,
  subscribeOperationsPeriod,
} from "./operations-period";

export function useOperationsPeriod(defaultPeriod: OperationsPeriod = "Мес") {
  const [period, setPeriodState] = useState<OperationsPeriod>(defaultPeriod);

  useEffect(() => {
    setPeriodState(readStoredPeriod(defaultPeriod));

    return subscribeOperationsPeriod(setPeriodState);
  }, [defaultPeriod]);

  const setPeriod = useCallback((next: OperationsPeriod) => {
    setPeriodState(next);
    persistOperationsPeriod(next);
  }, []);

  return [period, setPeriod] as const;
}
