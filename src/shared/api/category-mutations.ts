import { createCategory, createLimit } from "./backend";

function parseAmount(value: string) {
  const normalized = Number.parseInt(value.replace(/\s/g, ""), 10);
  return Number.isFinite(normalized) ? normalized : 0;
}

function frequencyToPeriodDays(frequency: string) {
  if (frequency.includes("недел")) {
    return 7;
  }

  if (frequency.includes("год")) {
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
  loanName: string;
  monthlyPayment: string;
  principalRemaining: string;
};

export async function saveCreditAsCategoryLimit(input: SaveCreditInput) {
  const limitAmount =
    parseAmount(input.principalRemaining) || parseAmount(input.monthlyPayment) * 12;
  const title = input.loanName.trim() || input.debtType;

  return saveCategoryWithLimit({
    description: `Кредит (${input.bank})`,
    frequency: "Раз в месяц",
    iconKey: "bank",
    limit: String(limitAmount || 100_000),
    name: title,
  });
}
