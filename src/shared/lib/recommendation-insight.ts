import { formatCurrency } from "@/shared/lib/formatters";

const PERIOD_BALANCE_INSIGHT_PATTERN =
  /recent\s+period\s+balance\s+is\s+([\d.]+)\s*(?:rub|₽)?\s*;\s*income\s+total\s+([\d.-]+)\s*,\s*expense\s+total\s+([\d.-]+)\s*\.?/i;

function parseInsightAmount(value: string) {
  const normalized = Number.parseFloat(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
}

export function formatRecommendationInsightContent(content: string) {
  const match = content.match(PERIOD_BALANCE_INSIGHT_PATTERN);
  if (!match) {
    return content;
  }

  const balance = parseInsightAmount(match[1] ?? "0");
  const income = Math.abs(parseInsightAmount(match[2] ?? "0"));
  const expense = Math.abs(parseInsightAmount(match[3] ?? "0"));

  return `Баланс: ${formatCurrency(balance)}; доход: ${formatCurrency(income)}; расход: ${formatCurrency(expense)}.`;
}
