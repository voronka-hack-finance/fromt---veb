export const OPERATIONS_PERIODS = ["Нед", "Мес", "Год"] as const;

export type OperationsPeriod = (typeof OPERATIONS_PERIODS)[number];

const STORAGE_KEY = "operations:active-period";
const EVENT_NAME = "operations-period-change";

export function isOperationsPeriod(value: string | null | undefined): value is OperationsPeriod {
  return OPERATIONS_PERIODS.includes(value as OperationsPeriod);
}

function readStoredPeriod(fallback: OperationsPeriod): OperationsPeriod {
  if (typeof window === "undefined") {
    return fallback;
  }

  const params = new URLSearchParams(window.location.search);
  const urlPeriod = params.get("period");

  if (isOperationsPeriod(urlPeriod)) {
    return urlPeriod;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);

  if (isOperationsPeriod(stored)) {
    return stored;
  }

  return fallback;
}

export function operationsChartHref(path: string, period: OperationsPeriod) {
  return `${path}?period=${encodeURIComponent(period)}`;
}

export function persistOperationsPeriod(period: OperationsPeriod) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, period);

  const url = new URL(window.location.href);
  url.searchParams.set("period", period);
  window.history.replaceState(null, "", url.toString());

  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: period }));
}

export function subscribeOperationsPeriod(onChange: (period: OperationsPeriod) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<OperationsPeriod>).detail;

    if (isOperationsPeriod(detail)) {
      onChange(detail);
    }
  };

  window.addEventListener(EVENT_NAME, handler);

  return () => window.removeEventListener(EVENT_NAME, handler);
}

export { readStoredPeriod };
