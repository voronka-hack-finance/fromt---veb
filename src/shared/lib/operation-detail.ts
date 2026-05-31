import {
  fetchAccounts,
  fetchTransactions,
  type AccountResponse,
  type TransactionResponse,
} from "@/shared/api/backend";
import { fetchAllTransactions, getTransactionAbsAmount, getTransactionSignedAmount, resolveTransactionType } from "@/shared/api/transaction-utils";
import {
  operationDetails,
  type OperationDetail,
  type OperationDetailPastExpense,
} from "@/shared/data/operation-details";

const DEFAULT_PROTECTION = operationDetails.education.protection;
const TRANSACTION_LOOKUP_PAGE_SIZE = 100;
const TRANSACTION_LOOKUP_MAX_PAGES = 50;

function normalizeLabel(value: string | null | undefined) {
  return value?.trim() || "";
}

function toDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatOperationDateTime(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
  }).format(date);
}

function getPayloadValue(
  payload: TransactionResponse["raw_payload"] | undefined,
  keys: string[],
) {
  if (!payload) {
    return "";
  }

  for (const key of keys) {
    const value = payload[key];
    if (value) {
      return String(value).trim();
    }
  }

  return "";
}

function getBankLabel(account: AccountResponse) {
  return account.bank_source || account.display_name || "Счет";
}

export function getOperationDetailIcon(
  categoryName: string,
  description: string,
  type: ReturnType<typeof resolveTransactionType>,
): OperationDetail["icon"] {
  if (type === "income") {
    return "income";
  }

  const haystack = `${categoryName} ${description}`.toLowerCase();

  if (haystack.includes("образ") || haystack.includes("edu")) {
    return "education";
  }

  if (haystack.includes("wifi") || haystack.includes("internet") || haystack.includes("связ")) {
    return "wifi";
  }

  if (haystack.includes("ипот") || haystack.includes("loan")) {
    return "bank";
  }

  if (
    haystack.includes("магаз") ||
    haystack.includes("market") ||
    haystack.includes("маркет") ||
    haystack.includes("wild") ||
    haystack.includes("wb")
  ) {
    return "bag";
  }

  return "bag";
}

export async function fetchTransactionById(transactionId: string) {
  let totalPages = 1;

  for (let page = 1; page <= totalPages && page <= TRANSACTION_LOOKUP_MAX_PAGES; page += 1) {
    const response = await fetchTransactions({
      page,
      page_size: TRANSACTION_LOOKUP_PAGE_SIZE,
    });
    const transaction = response.items.find((item) => item.id === transactionId);

    if (transaction) {
      return transaction;
    }

    totalPages = Math.max(
      1,
      Math.ceil(response.pagination.total / TRANSACTION_LOOKUP_PAGE_SIZE),
    );
  }

  const cachedTransactions = await fetchAllTransactions();
  const cachedTransaction = cachedTransactions.find((item) => item.id === transactionId);

  if (cachedTransaction) {
    return cachedTransaction;
  }

  throw new Error(`Transaction not found: ${transactionId}`);
}

function mapRelatedPastExpenses(
  transactions: TransactionResponse[],
  currentTransactionId: string,
) {
  return transactions
    .filter(
      (item) =>
        item.id !== currentTransactionId &&
        resolveTransactionType(item) === "expense" &&
        /(образ|edu|8220)/i.test(
          `${item.category_name ?? ""} ${item.description ?? ""} ${item.mcc ?? ""}`,
        ),
    )
    .slice(0, 2)
    .map(
      (item) =>
        ({
          amount: getTransactionAbsAmount(item),
          category: item.category_name || "Образование",
          icon: /спорт|gym/i.test(`${item.category_name ?? ""} ${item.description ?? ""}`)
            ? "gym"
            : "education",
          title: item.description || item.category_name || "Операция",
        }) satisfies OperationDetailPastExpense,
    );
}

export function mapTransactionToOperationDetail(
  transaction: TransactionResponse,
  account: AccountResponse | undefined,
  relatedTransactions: TransactionResponse[] = [],
): OperationDetail {
  const type = resolveTransactionType(transaction);
  const categoryName =
    transaction.category_name || (type === "income" ? "Доходы" : "Расходы");
  const description =
    normalizeLabel(transaction.description) || categoryName || "Операция";
  const signedAmount = getTransactionSignedAmount(transaction);
  const operationDate =
    toDate(transaction.operation_at) ?? toDate(transaction.payment_at) ?? new Date();
  const pastExpenses = mapRelatedPastExpenses(relatedTransactions, transaction.id);
  const mcc =
    normalizeLabel(transaction.mcc) ||
    getPayloadValue(transaction.raw_payload, ["MCC", "mcc", "МСС"]) ||
    "—";
  const sbpId =
    getPayloadValue(transaction.raw_payload, [
      "sbp_id",
      "Идентификатор операции СБП",
      "Идентификатор СБП",
    ]) || transaction.dedupe_key;

  return {
    accountLabel: account ? `Операция со счета ${getBankLabel(account)}` : "Операция со счета",
    accountSuffix: transaction.card_last4
      ? `*${transaction.card_last4}`
      : transaction.card_mask
        ? transaction.card_mask
        : account?.card_last4
          ? `*${account.card_last4}`
          : "*0000",
    amount: signedAmount,
    category: categoryName,
    dateTime: formatOperationDateTime(operationDate),
    direction: type === "income" ? "income" : "outcome",
    icon: getOperationDetailIcon(categoryName, description, type),
    id: transaction.id,
    mcc,
    merchant: description,
    protection: DEFAULT_PROTECTION,
    taxDeduction:
      pastExpenses.length && type === "expense"
        ? {
            amount: Math.round(getTransactionAbsAmount(transaction) * 0.13),
            pastExpenses,
          }
        : undefined,
    transaction: {
      sbpId,
    },
  };
}

export async function loadOperationDetailFromBackend(
  operationId: string,
): Promise<OperationDetail> {
  const [transaction, accountsResponse, relatedTransactions] = await Promise.all([
    fetchTransactionById(operationId),
    fetchAccounts({ page_size: 100 }),
    fetchAllTransactions(),
  ]);

  const account = transaction.account_id
    ? accountsResponse.items.find((item) => item.id === transaction.account_id)
    : undefined;

  return mapTransactionToOperationDetail(transaction, account, relatedTransactions);
}
