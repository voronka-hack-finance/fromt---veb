import {
  fetchTransactions,
  type TransactionResponse,
  type TransactionsQuery,
} from "./backend";

const DEFAULT_PAGE_SIZE = 500;
const MAX_PAGES = 30;

export function parseTransactionDecimal(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  const normalized = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
}

export function resolveTransactionType(transaction: TransactionResponse) {
  if (transaction.type === "income" || transaction.type === "expense") {
    return transaction.type;
  }

  return parseTransactionDecimal(transaction.operation_amount) < 0 ? "expense" : "income";
}

export function getTransactionAbsAmount(transaction: TransactionResponse) {
  return Math.abs(parseTransactionDecimal(transaction.operation_amount));
}

export function getTransactionSignedAmount(transaction: TransactionResponse) {
  const amount = getTransactionAbsAmount(transaction);
  return resolveTransactionType(transaction) === "income" ? amount : -amount;
}

export async function fetchTransactionPage(
  query: TransactionsQuery = {},
) {
  return fetchTransactions(query);
}

export async function fetchAllTransactions(
  query: Omit<TransactionsQuery, "page" | "page_size"> = {},
) {
  const firstPage = await fetchTransactionPage({
    ...query,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });

  const items = [...firstPage.items];
  const totalPages = Math.min(
    MAX_PAGES,
    Math.max(1, Math.ceil(firstPage.pagination.total / DEFAULT_PAGE_SIZE)),
  );

  if (totalPages === 1) {
    return items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchTransactionPage({
        ...query,
        page: index + 2,
        page_size: DEFAULT_PAGE_SIZE,
      }),
    ),
  );

  remainingPages.forEach((response) => {
    items.push(...response.items);
  });

  return items;
}
