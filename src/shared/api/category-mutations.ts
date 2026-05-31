import {
  createCategory,
  createDebt,
  createLimit,
  updateDebt,
  type DebtCreateRequest,
  type DebtType,
  type DebtUpdateRequest,
} from "./backend";

function parseAmount(value: string) {
  const normalized = Number.parseInt(value.replace(/\s/g, ""), 10);
  return Number.isFinite(normalized) ? normalized : 0;
}

function normalizeDecimalString(value: string, fractionDigits = 2) {
  const normalized = value.replace(/\s/g, "").replace(",", ".");

  if (!normalized) {
    return null;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount.toFixed(fractionDigits) : null;
}

function parseDayOfMonth(value: string) {
  const day = Number.parseInt(value.replace(/[^\d]/g, ""), 10);

  if (!Number.isFinite(day)) {
    return null;
  }

  return Math.min(Math.max(day, 1), 31);
}

function mapDebtType(value: string): DebtType {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("кредит") && normalized.includes("карт")) {
    return "credit_card";
  }

  if (
    normalized.includes("ипот") ||
    normalized.includes("кредит") ||
    normalized.includes("авто") ||
    normalized.includes("loan")
  ) {
    return "loan";
  }

  return "other";
}

function frequencyToPeriodDays(frequency: string) {
  const normalized = frequency.toLowerCase();

  if (normalized.includes("недел") || normalized.includes("week")) {
    return 7;
  }

  if (normalized.includes("год") || normalized.includes("year")) {
    return 365;
  }

  return 30;
}

export type SaveCategoryInput = {
  description?: string;
  frequency: string;
  iconKey: string;
  limit: string;
  name: string;
};

export async function saveCategoryWithLimit(input: SaveCategoryInput) {
  const limitAmount = parseAmount(input.limit);
  const category = await createCategory({
    description: input.description?.trim() || null,
    icon_key: input.iconKey,
    name: input.name.trim(),
  });

  if (limitAmount > 0) {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    await createLimit({
      category_id: category.id,
      currency: "RUB",
      limit_amount: String(limitAmount),
      period_days: frequencyToPeriodDays(input.frequency),
      period_started_at: periodStart.toISOString(),
    });
  }

  return category;
}

export type SaveCreditInput = {
  bank: string;
  debtType: string;
  initialAmount: string;
  interestRate: string;
  linkedAccountId?: string | null;
  loanAmount: string;
  loanName: string;
  monthlyPayment: string;
  paymentDay: string;
  principalRemaining: string;
  remainingDebt: string;
};

function buildDebtPayload(input: SaveCreditInput): DebtCreateRequest | DebtUpdateRequest {
  const estimatedRemainingBalance = parseAmount(input.monthlyPayment) * 12;
  const remainingBalance =
    normalizeDecimalString(input.principalRemaining) ??
    normalizeDecimalString(input.remainingDebt) ??
    (estimatedRemainingBalance > 0
      ? normalizeDecimalString(String(estimatedRemainingBalance))
      : null) ??
    "100000.00";
  const monthlyPayment = normalizeDecimalString(input.monthlyPayment);
  const creditLimit =
    normalizeDecimalString(input.initialAmount) ??
    normalizeDecimalString(input.loanAmount) ??
    remainingBalance;
  const title = input.loanName.trim() || input.debtType.trim();
  const debtType = mapDebtType(input.debtType);

  return {
    account_id: input.linkedAccountId || null,
    credit_limit: debtType === "credit_card" ? creditLimit : null,
    currency: "RUB",
    debt_type: debtType,
    description: input.bank.trim() ? `Кредит (${input.bank.trim()})` : "Кредит",
    interest_rate: normalizeDecimalString(input.interestRate, 4),
    monthly_payment: monthlyPayment,
    overdue_days: 0,
    payment_day: parseDayOfMonth(input.paymentDay),
    remaining_balance: remainingBalance,
    status: "active",
    title,
  };
}

export async function saveCreditAsCategoryLimit(input: SaveCreditInput) {
  return createDebt(buildDebtPayload(input) as DebtCreateRequest);
}

export async function updateCreditDebt(debtId: string, input: SaveCreditInput) {
  return updateDebt(debtId, buildDebtPayload(input) as DebtUpdateRequest);
}
