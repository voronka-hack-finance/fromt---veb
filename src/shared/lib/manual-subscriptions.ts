import { subscriptionCategoryIcon } from "@/shared/data/subscriptions";

const STORAGE_KEY = "zanachka.manual-subscriptions";

export type ManualSubscription = {
  id: string;
  name: string;
  months: number;
  monthlyPrice: number;
  totalSpent: number;
  status: "active" | "paused";
  icon: string;
};

function createSubscriptionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `manual-${crypto.randomUUID()}`;
  }

  return `manual-${Date.now()}`;
}

export function loadManualSubscriptions(): ManualSubscription[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ManualSubscription[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveManualSubscription(subscription: ManualSubscription) {
  const items = loadManualSubscriptions();
  items.unshift(subscription);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createManualSubscription(input: { name: string; monthlyPrice: number }): ManualSubscription {
  return {
    icon: subscriptionCategoryIcon,
    id: createSubscriptionId(),
    months: 1,
    monthlyPrice: input.monthlyPrice,
    name: input.name.trim(),
    status: "active",
    totalSpent: input.monthlyPrice,
  };
}
