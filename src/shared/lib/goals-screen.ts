import {
  createGoal,
  fetchAccounts,
  fetchGoalsPage,
  type AccountResponse,
  type GoalResponse,
} from "@/shared/api/backend";
import { parseTransactionDecimal } from "@/shared/api/transaction-utils";
import { goalsScreenData } from "@/shared/data/goals";

const GOAL_IMAGES = [
  "/goals/bali-goal.png",
  "/goals/safety-cushion-goal.png",
] as const;

const BANK_ICONS: Record<string, string> = {
  sber: "/dashboard/balance/icon-sber.svg",
  tbank: "/dashboard/balance/icon-tbank.svg",
};

export type GoalsScreenGoal = {
  id: string;
  title: string;
  image: string;
  current: number;
  target: number;
  account: {
    label: string;
    suffix: string;
    bankIcon: string;
  };
};

function normalizeLabel(value: string | null | undefined) {
  return value?.trim() || "";
}

function getBankId(account: AccountResponse) {
  const source = `${account.bank_source ?? ""} ${account.display_name}`.toLowerCase();

  if (source.includes("sber") || source.includes("сбер")) return "sber";
  if (source.includes("t-bank") || source.includes("тин") || source.includes("tink")) return "tbank";
  if (source.includes("альф") || source.includes("alfa")) return "alfa";

  return "default";
}

function getBankLabel(account: AccountResponse) {
  return account.bank_source || account.display_name || "Счёт";
}

function getAccountSuffix(account: AccountResponse) {
  const last4 = normalizeLabel(account.card_last4);

  if (last4) {
    return last4;
  }

  const display = normalizeLabel(account.display_name).replace(/^\*/, "");

  return display || account.id.slice(-4);
}

function getAccountBankIcon(account: AccountResponse | undefined) {
  if (!account) {
    return BANK_ICONS.sber;
  }

  const bankId = getBankId(account);

  return BANK_ICONS[bankId] ?? "/dashboard/balance/icon-wallet.svg";
}

function getGoalImage(goal: GoalResponse, index: number) {
  const haystack = `${goal.title} ${goal.description ?? ""}`.toLowerCase();

  if (
    haystack.includes("отпуск") ||
    haystack.includes("бали") ||
    haystack.includes("банкок") ||
    haystack.includes("путеш")
  ) {
    return GOAL_IMAGES[0];
  }

  if (
    haystack.includes("подуш") ||
    haystack.includes("резерв") ||
    haystack.includes("safety") ||
    haystack.includes("накоп")
  ) {
    return GOAL_IMAGES[1];
  }

  return GOAL_IMAGES[index % GOAL_IMAGES.length]!;
}

export function mapGoalToCard(
  goal: GoalResponse,
  account: AccountResponse | undefined,
  index: number,
): GoalsScreenGoal {
  return {
    account: {
      bankIcon: getAccountBankIcon(account),
      label: account ? getBankLabel(account) : "Счёт",
      suffix: account ? getAccountSuffix(account) : "0000",
    },
    current: Math.round(parseTransactionDecimal(goal.current_amount)),
    id: goal.id,
    image: getGoalImage(goal, index),
    target: Math.max(Math.round(parseTransactionDecimal(goal.target_amount)), 1),
    title: goal.title,
  };
}

export async function loadGoalsFromBackend() {
  const [goalsResponse, accountsResponse] = await Promise.all([
    fetchGoalsPage({ page_size: 100 }),
    fetchAccounts({ page_size: 100 }),
  ]);

  const accountsById = new Map(
    accountsResponse.items.map((account) => [account.id, account]),
  );

  const goals = goalsResponse.items.map((goal, index) => {
    const account = goal.account_id ? accountsById.get(goal.account_id) : undefined;

    return mapGoalToCard(goal, account, index);
  });

  return {
    ...goalsScreenData,
    goals,
    notifications: goals.length,
  };
}

export async function createGoalOnBackend(input: {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  accountId?: string | null;
  description?: string | null;
}) {
  const trimmedTitle = input.title.trim();

  if (!trimmedTitle) {
    throw new Error("Goal title is required");
  }

  let accountId = input.accountId ?? null;

  if (!accountId) {
    const accountsResponse = await fetchAccounts({ page_size: 1 });
    accountId = accountsResponse.items[0]?.id ?? null;
  }

  return createGoal({
    account_id: accountId,
    current_amount: String(Math.max(0, input.currentAmount ?? 0)),
    currency: "RUB",
    description: input.description ?? null,
    target_amount: String(Math.max(1, input.targetAmount)),
    title: trimmedTitle,
  });
}
