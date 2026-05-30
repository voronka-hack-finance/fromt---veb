import { agentChatScreens, type AgentChatId, type AgentChatMessage } from "@/shared/data/agent-chat";
import { bankAccountsScreenData } from "@/shared/data/bank-accounts";
import {
  bankAccountDetails,
  type BankAccountDetail,
  type BankAccountOperation,
} from "@/shared/data/bank-account-detail";
import type { CreditLoadResponse } from "@/shared/api/credit-load";
import {
  creditLoadScreenData,
  type CreditLoadPaymentIcon,
  type CreditLoadUpcomingPayment,
} from "@/shared/data/credit-load";
import {
  creditLoadLoanDetails,
  type CreditLoadLoanDetail,
} from "@/shared/data/credit-load-loans";
import {
  operationDetails,
  type OperationDetail,
  type OperationDetailPastExpense,
} from "@/shared/data/operation-details";

import {
  createChat,
  createChatMessage,
  fetchAccounts,
  fetchAgentRecommendations,
  fetchAvailableBalance,
  fetchChatMessages,
  fetchChats,
  fetchExpectedExpenses,
  fetchFinancialHealthScore,
  fetchTransactions,
  type AccountResponse,
  type ChatMessageResponse,
  type TransactionResponse,
} from "./backend";

const AGENT_SLUG_TO_KEY: Record<AgentChatId, string> = {
  "pillow-keeper": "pillow_keeper",
  "expense-detective": "expense_detective",
  "growth-strategist": "growth_strategist",
  balancer: "balancer",
  "habit-trainer": "habit_trainer",
};

const BANK_ICONS: Record<string, string> = {
  sber: "/bank-accounts/icons/sber.svg",
  alfa: "/bank-accounts/icons/alfa.svg",
  tbank: "/bank-accounts/icons/tbank.svg",
  vtb: "/bank-accounts/icons/sber.svg",
  gpb: "/bank-accounts/icons/sber.svg",
  raif: "/bank-accounts/icons/alfa.svg",
  default: "/bank-accounts/icons/sber.svg",
};

const LOAN_DEFINITIONS = [
  {
    id: "mortgage",
    title: "Ипотека",
    pattern: /ипотек|mortgage/i,
    bankIcon: "/dashboard/balance/icon-sber.svg",
  },
  {
    id: "consumer",
    title: "Потребительский кредит",
    pattern: /потреб|consumer|кредит/i,
    bankIcon: "/dashboard/balance/icon-tbank.svg",
  },
  {
    id: "auto",
    title: "Автокредит",
    pattern: /авто|auto/i,
    bankIcon: "/credit-load/icon-alfa.svg",
  },
] as const;

const SECTION_ORDER = [
  { id: "debit", title: "дебетовый счёт", pattern: /(дебет|debit|current|расч)/i },
  { id: "deposit", title: "депозитный счёт", pattern: /(депозит|deposit)/i },
  { id: "savings", title: "сберегательный счёт", pattern: /(сберег|savings)/i },
  { id: "accumulation", title: "накопительный счёт", pattern: /(накоп|accum)/i },
] as const;

function parseDecimal(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  const normalized = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
}

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

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("ru-RU", options).format(date);
}

function formatDayMonthLong(date: Date) {
  return formatDate(date, { day: "numeric", month: "long" });
}

function formatOperationDateTime(date: Date) {
  return formatDate(date, { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
}

function getBankId(account: AccountResponse) {
  const source = `${account.bank_source ?? ""} ${account.display_name}`.toLowerCase();

  if (source.includes("sber") || source.includes("сбер")) return "sber";
  if (source.includes("t-bank") || source.includes("тин") || source.includes("tink")) return "tbank";
  if (source.includes("альф") || source.includes("alfa")) return "alfa";
  if (source.includes("vtb") || source.includes("втб")) return "vtb";
  if (source.includes("газпр")) return "gpb";
  if (source.includes("райф")) return "raif";

  return account.id;
}

function getBankLabel(account: AccountResponse) {
  return account.bank_source || account.display_name || "Счет";
}

function getBankIcon(bankId: string) {
  return BANK_ICONS[bankId] ?? BANK_ICONS.default;
}

function getBankLogoMeta(bankId: string) {
  if (bankId === "sber") {
    return { bankLogo: "/credit-load/sberbank-logo.png", bankLogoWidth: 180, bankLogoHeight: 28 };
  }

  if (bankId === "tbank") {
    return { bankLogo: "/credit-load/tbank.png", bankLogoWidth: 120, bankLogoHeight: 28 };
  }

  if (bankId === "alfa") {
    return { bankLogo: "/credit-load/icon-alfa.svg", bankLogoWidth: 120, bankLogoHeight: 28 };
  }

  return {
    bankLogo: getBankIcon(bankId),
    bankLogoWidth: 24,
    bankLogoHeight: 24,
  };
}

function resolveAccountSection(account: AccountResponse) {
  const haystack = `${account.account_type} ${account.display_name}`.toLowerCase();
  const match =
    SECTION_ORDER.find((section) => section.pattern.test(haystack)) ??
    SECTION_ORDER[0];

  return match;
}

function getOperationIcon(
  categoryName: string,
  description: string,
  type: TransactionResponse["type"],
): BankAccountOperation["icon"] {
  if (type === "income") return "income";

  const haystack = `${categoryName} ${description}`.toLowerCase();

  if (haystack.includes("образ") || haystack.includes("edu")) return "education";
  if (haystack.includes("wifi") || haystack.includes("internet") || haystack.includes("связ")) {
    return "wifi";
  }

  if (haystack.includes("ипот") || haystack.includes("банк") || haystack.includes("loan")) {
    return "bank";
  }

  return "bag";
}

function mapTransactionToBankOperation(transaction: TransactionResponse): BankAccountOperation {
  const categoryName =
    transaction.category_name || (transaction.type === "income" ? "Доходы" : "Расходы");
  const description =
    normalizeLabel(transaction.description) || categoryName || "Операция";
  const amount = parseDecimal(transaction.operation_amount);

  return {
    amount: transaction.type === "income" ? amount : -Math.abs(amount),
    category: categoryName,
    direction: transaction.type === "income" ? "income" : "outcome",
    icon: getOperationIcon(categoryName, description, transaction.type),
    iconTone: transaction.type === "income" ? "success" : "neutral",
    id: transaction.id,
    title: description,
  };
}

function groupTransactionsByDayLabel(transactions: TransactionResponse[]) {
  const groups = new Map<string, BankAccountOperation[]>();

  transactions.forEach((transaction) => {
    const date = toDate(transaction.operation_at);
    const label = date ? formatDayMonthLong(date) : "Без даты";
    const group = groups.get(label) ?? [];
    group.push(mapTransactionToBankOperation(transaction));
    groups.set(label, group);
  });

  return [...groups.entries()].map(([label, operations]) => ({
    label,
    operations,
    total: Math.round(
      operations.reduce((sum, operation) => sum + Math.abs(operation.amount), 0),
    ),
  }));
}

function sortTransactionsDesc(transactions: TransactionResponse[]) {
  return [...transactions].sort((left, right) => {
    const leftDate = toDate(left.operation_at)?.getTime() ?? 0;
    const rightDate = toDate(right.operation_at)?.getTime() ?? 0;
    return rightDate - leftDate;
  });
}

function buildLoanTransactions(transactions: TransactionResponse[]) {
  const loans = LOAN_DEFINITIONS.map((definition) => {
    const related = transactions.filter((transaction) => {
      if (transaction.type !== "expense") return false;
      const haystack = `${transaction.category_name ?? ""} ${transaction.description ?? ""}`;
      return definition.pattern.test(haystack);
    });

    if (!related.length) {
      return null;
    }

    const monthlyValues = related.map((transaction) =>
      Math.abs(parseDecimal(transaction.operation_amount)),
    );
    const perMonth = Math.round(
      monthlyValues.reduce((sum, value) => sum + value, 0) / monthlyValues.length,
    );
    const remaining = Math.round(monthlyValues.reduce((sum, value) => sum + value, 0) * 24);
    const paidPercent = clamp(Math.round((perMonth / Math.max(remaining, 1)) * 100), 5, 95);

    return {
      bank: "Счет",
      bankIcon: definition.bankIcon,
      id: definition.id,
      paidPercent,
      perMonth,
      rate: "—",
      remaining,
      title: definition.title,
    };
  }).filter((loan): loan is NonNullable<typeof loan> => loan !== null);

  return loans;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatChatTimestamp(date: Date) {
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function mapBackendMessages(messages: ChatMessageResponse[]): AgentChatMessage[] {
  const mapped = messages.map((message) => {
    const timestamp = formatChatTimestamp(new Date(message.created_at));
    const role = message.role.toLowerCase();

    if (role === "user") {
      return {
        id: message.id,
        text: message.content,
        timestamp,
        type: "user",
      } satisfies AgentChatMessage;
    }

    return {
      id: message.id,
      text: message.content,
      timestamp,
      type: "bot",
    } satisfies AgentChatMessage;
  });

  if (!mapped.length) {
    return [];
  }

  return [{ id: "date-today", label: "Сегодня", type: "date-separator" }, ...mapped];
}

async function resolveChatIdForAgent(agentId: AgentChatId) {
  const agentKey = AGENT_SLUG_TO_KEY[agentId];
  const fallbackChat = agentChatScreens[agentId];
  const [recommendationsResponse, chatsResponse] = await Promise.all([
    fetchAgentRecommendations(),
    fetchChats({ page_size: 100 }),
  ]);

  const linkedRecommendation = recommendationsResponse.items.find(
    (item) => item.agent_key === agentKey && item.chat_id,
  );

  if (linkedRecommendation?.chat_id) {
    return linkedRecommendation.chat_id;
  }

  const existingChat = chatsResponse.items.find(
    (chat) => chat.title.trim() === fallbackChat.title.trim(),
  );

  if (existingChat) {
    return existingChat.id;
  }

  const createdChat = await createChat({ title: fallbackChat.title });
  return createdChat.id;
}

export async function loadBankAccountsScreenData(): Promise<{
  title: string;
  sections: Array<{
    id: string;
    title: string;
    accounts: Array<{
      id: string;
      bankIcon: string;
      cardLast4?: string;
      balance: number;
      accountSuffix: string;
      compactAmount?: boolean;
    }>;
  }>;
}> {
  const accountsResponse = await fetchAccounts({ page_size: 100 });
  const accounts = accountsResponse.items.filter((account) => !account.is_archived);

  if (!accounts.length) {
    return {
      title: bankAccountsScreenData.title,
      sections: bankAccountsScreenData.sections.map((section) => ({
        ...section,
        accounts: [...section.accounts],
      })),
    };
  }

  const sectionsMap = new Map<
    string,
    { id: string; title: string; accounts: Array<{
      id: string;
      bankIcon: string;
      cardLast4?: string;
      balance: number;
      accountSuffix: string;
      compactAmount?: boolean;
    }> }
  >();

  accounts.forEach((account) => {
    const section = resolveAccountSection(account);
    const bankId = getBankId(account);
    const suffix = normalizeLabel(account.card_last4) || account.id.slice(-4);
    const balance = Math.round(parseDecimal(account.current_balance));
    const sectionEntry = sectionsMap.get(section.id) ?? {
      accounts: [],
      id: section.id,
      title: section.title,
    };

    sectionEntry.accounts.push({
      accountSuffix: suffix,
      balance,
      bankIcon: getBankIcon(bankId),
      cardLast4: normalizeLabel(account.card_last4) || undefined,
      compactAmount: balance >= 1_000_000,
      id: account.id,
    });

    sectionsMap.set(section.id, sectionEntry);
  });

  const sections = SECTION_ORDER.map((section) => sectionsMap.get(section.id))
    .filter((section): section is NonNullable<typeof section> => Boolean(section?.accounts.length));

  if (!sections.length) {
    return {
      title: bankAccountsScreenData.title,
      sections: bankAccountsScreenData.sections.map((section) => ({
        ...section,
        accounts: [...section.accounts],
      })),
    };
  }

  return {
    sections,
    title: bankAccountsScreenData.title,
  };
}

export async function loadBankAccountDetailScreenData(accountId: string) {
  const [accountsResponse, transactionsResponse] = await Promise.all([
    fetchAccounts({ page_size: 100 }),
    fetchTransactions({ page_size: 500, account_id: accountId }),
  ]);

  const account = accountsResponse.items.find((item) => item.id === accountId);

  if (!account) {
    return (
      bankAccountDetails[accountId] ??
      Object.values(bankAccountDetails)[0]!
    );
  }

  const bankId = getBankId(account);
  const logo = getBankLogoMeta(bankId);
  const accountTransactions = sortTransactionsDesc(
    transactionsResponse.items.filter((transaction) => transaction.account_id === account.id),
  ).slice(0, 12);
  const sections = groupTransactionsByDayLabel(accountTransactions);

  const detail: BankAccountDetail = {
    accountSuffix: normalizeLabel(account.card_last4) || account.id.slice(-4),
    balance: Math.round(parseDecimal(account.current_balance)),
    bankLogo: logo.bankLogo,
    bankLogoHeight: logo.bankLogoHeight,
    bankLogoWidth: logo.bankLogoWidth,
    cardLast4: normalizeLabel(account.card_last4) || undefined,
    id: account.id,
    sections: sections.length
      ? sections
      : bankAccountDetails[accountId]?.sections ?? [
          { label: "Операции", operations: [], total: 0 },
        ],
  };

  return detail;
}

export async function loadOperationDetailScreenData(operationId: string) {
  const transactionsResponse = await fetchTransactions({ page_size: 500 });
  const transaction = transactionsResponse.items.find((item) => item.id === operationId);

  if (!transaction) {
    const fallback = operationDetails[operationId];
    if (!fallback) {
      throw new Error(`Operation not found: ${operationId}`);
    }
    return fallback;
  }

  const accountsResponse = await fetchAccounts({ page_size: 100 });
  const account = transaction.account_id
    ? accountsResponse.items.find((item) => item.id === transaction.account_id)
    : undefined;
  const operationDate = toDate(transaction.operation_at) ?? new Date();
  const categoryName =
    transaction.category_name || (transaction.type === "income" ? "Доходы" : "Расходы");
  const description =
    normalizeLabel(transaction.description) || categoryName || "Операция";
  const amount = parseDecimal(transaction.operation_amount);
  const signedAmount =
    transaction.type === "income" ? amount : -Math.abs(amount);
  const mockFallback = Object.values(operationDetails)[0]!;
  const educationExpenses = transactionsResponse.items
    .filter(
      (item) =>
        item.id !== transaction.id &&
        item.type === "expense" &&
        /(образ|edu|8220)/i.test(`${item.category_name ?? ""} ${item.description ?? ""} ${item.mcc ?? ""}`),
    )
    .slice(0, 2)
    .map(
      (item) =>
        ({
          amount: Math.abs(parseDecimal(item.operation_amount)),
          category: item.category_name || "Образование",
          icon: /спорт|gym/i.test(`${item.category_name ?? ""} ${item.description ?? ""}`)
            ? "gym"
            : "education",
          title: item.description || item.category_name || "Операция",
        }) satisfies OperationDetailPastExpense,
    );

  const detail: OperationDetail = {
    accountLabel: account ? `Операция со счета ${getBankLabel(account)}` : "Операция со счета",
    accountSuffix: account?.card_last4 ? `*${account.card_last4}` : "*0000",
    amount: signedAmount,
    category: categoryName,
    dateTime: formatOperationDateTime(operationDate),
    direction: transaction.type === "income" ? "income" : "outcome",
    icon: getOperationIcon(categoryName, description, transaction.type),
    id: transaction.id,
    mcc: transaction.mcc || "—",
    merchant: description,
    protection: mockFallback.protection,
    taxDeduction:
      educationExpenses.length && transaction.type === "expense"
        ? {
            amount: Math.round(Math.abs(signedAmount) * 0.13),
            pastExpenses: educationExpenses,
          }
        : undefined,
    transaction: {
      sbpId:
        (typeof transaction.raw_payload?.sbp_id === "string" &&
          transaction.raw_payload.sbp_id) ||
        transaction.dedupe_key,
    },
  };

  return detail;
}

async function fetchFinancialHealthScoreSafe() {
  try {
    return await fetchFinancialHealthScore();
  } catch {
    return null;
  }
}

const CREDIT_LOAD_ZONE_LABELS: Record<string, string> = {
  green: "Низкая",
  orange: "Повышенная",
  red: "Высокая",
  yellow: "Умеренная",
};

function resolveCreditLoadPaymentIcon(title: string): CreditLoadPaymentIcon {
  const haystack = title.toLowerCase();

  if (haystack.includes("обуч") || haystack.includes("куб") || haystack.includes("edu")) {
    return "education";
  }

  if (haystack.includes("янд") || haystack.includes("yandex")) {
    return "yandex";
  }

  if (haystack.includes("вк") || haystack.includes("vk")) {
    return "vk";
  }

  if (haystack.includes("мтс") || haystack.includes("mts")) {
    return "mts";
  }

  return "generic";
}

function mapExpectedExpenseToPayment(
  item: Awaited<ReturnType<typeof fetchExpectedExpenses>>["items"][number],
  index: number,
): CreditLoadUpcomingPayment | null {
  const date = toDate(item.expected_at);

  if (!date) {
    return null;
  }

  const title = "Предстоящий платёж";

  return {
    amount: Math.round(parseDecimal(item.expected_amount)),
    dateLabel: formatDayMonthLong(date),
    icon: resolveCreditLoadPaymentIcon(title),
    id: item.id ?? `${date.getTime()}-${index}`,
    paymentDay: date.getDate(),
    title,
  };
}

export async function loadCreditLoadScreenData(): Promise<CreditLoadResponse> {
  const expectedExpenses = await fetchExpectedExpenses({ page_size: 100 });

  const upcomingPayments = expectedExpenses.items
    .map(mapExpectedExpenseToPayment)
    .filter((payment): payment is CreditLoadUpcomingPayment => payment !== null)
    .sort((left, right) => left.paymentDay - right.paymentDay);

  if (!upcomingPayments.length) {
    return {
      calendar: {
        month: creditLoadScreenData.calendar.month,
        paymentDays: [...creditLoadScreenData.calendar.paymentDays],
        selectedDay: creditLoadScreenData.calendar.selectedDay,
        year: creditLoadScreenData.calendar.year,
      },
      title: creditLoadScreenData.title,
      upcomingPayments: creditLoadScreenData.upcomingPayments.map((payment) => ({ ...payment })),
    };
  }

  const referenceDate = new Date(
    expectedExpenses.items
      .map((item) => toDate(item.expected_at))
      .find((date): date is Date => date !== null)?.getTime() ??
      Date.UTC(creditLoadScreenData.calendar.year, creditLoadScreenData.calendar.month, 1),
  );

  return {
    calendar: {
      month: referenceDate.getMonth(),
      paymentDays: [...new Set(upcomingPayments.map((payment) => payment.paymentDay))],
      selectedDay: creditLoadScreenData.calendar.selectedDay,
      year: referenceDate.getFullYear(),
    },
    title: creditLoadScreenData.title,
    upcomingPayments,
  };
}

export async function loadCreditLoadLoanDetailScreenData(loanId: string) {
  const transactionsResponse = await fetchTransactions({ page_size: 500, type: "expense" });
  const loans = buildLoanTransactions(transactionsResponse.items);
  const loan = loans.find((item) => item.id === loanId);

  if (!loan) {
    const fallback = creditLoadLoanDetails[loanId];
    if (!fallback) {
      throw new Error(`Loan not found: ${loanId}`);
    }
    return fallback;
  }

  const logo =
    loan.id === "mortgage"
      ? { bankLogo: "/credit-load/sberbank-logo.png", bankLogoWidth: 180, bankLogoHeight: 28 }
      : loan.id === "consumer"
        ? { bankLogo: "/credit-load/tbank.png", bankLogoWidth: 120, bankLogoHeight: 28 }
        : { bankLogo: "/credit-load/alfa.png", bankLogoWidth: 120, bankLogoHeight: 28 };

  const detail: CreditLoadLoanDetail = {
    annualRate: loan.rate,
    bankLogo: logo.bankLogo,
    bankLogoHeight: logo.bankLogoHeight,
    bankLogoWidth: logo.bankLogoWidth,
    id: loan.id,
    monthlyPayment: loan.perMonth,
    paidPercent: loan.paidPercent,
    remainingBalance: loan.remaining,
    remainingDuration: "—",
    title: loan.title,
  };

  return detail;
}

export async function loadAgentChatScreenData(agentId: string) {
  const typedAgentId = agentId as AgentChatId;
  const fallback = agentChatScreens[typedAgentId];

  if (!fallback) {
    throw new Error(`Agent chat not found: ${agentId}`);
  }

  const chatId = await resolveChatIdForAgent(typedAgentId);
  const messagesResponse = await fetchChatMessages(chatId, { page_size: 100 });
  const backendMessages = mapBackendMessages(messagesResponse.items);

  return {
    ...fallback,
    agentId: typedAgentId,
    chatId,
    messages: backendMessages.length ? backendMessages : fallback.messages,
  };
}

export async function sendAgentChatMessage(chatId: string, content: string) {
  await createChatMessage(chatId, { content });
  const messagesResponse = await fetchChatMessages(chatId, { page_size: 100 });
  return mapBackendMessages(messagesResponse.items);
}
