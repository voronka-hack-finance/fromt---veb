const decimalFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number) {
  return `${decimalFormatter.format(value)} ₽`;
}

export function formatCurrencyParts(value: number) {
  const [whole = "0", fraction = "00"] = decimalFormatter.format(value).split(",");

  return { whole, fraction };
}

