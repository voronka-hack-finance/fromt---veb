export type BankAccountOperationIcon = "education" | "bag" | "bank" | "wifi" | "income";

export type BankAccountOperation = {
  id: string;
  category: string;
  title: string;
  amount: number;
  direction: "income" | "outcome";
  icon: BankAccountOperationIcon;
  iconTone: "neutral" | "accent" | "success";
};

export type BankAccountOperationsSection = {
  label: string;
  total: number;
  operations: ReadonlyArray<BankAccountOperation>;
};

export type BankAccountDetail = {
  id: string;
  accountSuffix: string;
  cardLast4?: string;
  balance: number;
  bankLogo: string;
  bankLogoWidth: number;
  bankLogoHeight: number;
  sections: ReadonlyArray<BankAccountOperationsSection>;
};

const yesterdayOperations: ReadonlyArray<BankAccountOperation> = [
  {
    id: "education",
    category: "Образование",
    title: "Оплата за обучение в университете",
    amount: -189600,
    direction: "outcome",
    iconTone: "neutral",
    icon: "education",
  },
  {
    id: "kids",
    category: "Детские товары",
    title: "ПАО “ДЕТСКИЙ МИР”",
    amount: -13409,
    direction: "outcome",
    iconTone: "neutral",
    icon: "bag",
  },
  {
    id: "mortgage",
    category: "Платежи и переводы",
    title: "Ипотечный платеж",
    amount: -97992,
    direction: "outcome",
    iconTone: "accent",
    icon: "bank",
  },
  {
    id: "internet",
    category: "Домашний интернет и связь",
    title: "ПАО “КУБАНЬКОМ”",
    amount: -830,
    direction: "outcome",
    iconTone: "neutral",
    icon: "wifi",
  },
  {
    id: "salary",
    category: "Переводы и зачисления",
    title: "Зачисление заработной платы ООО “Рога и копыта”",
    amount: 270000,
    direction: "income",
    iconTone: "success",
    icon: "income",
  },
  {
    id: "dividends",
    category: "Переводы и зачисления",
    title: "Выплата дивидендов по акциям ПАО “ГазпромНефть”",
    amount: 509919,
    direction: "income",
    iconTone: "success",
    icon: "income",
  },
];

export const bankAccountDetails: Record<string, BankAccountDetail> = {
  "debit-sber-1521": {
    id: "debit-sber-1521",
    accountSuffix: "1521",
    cardLast4: "8982",
    balance: 1500,
    bankLogo: "/credit-load/sberbank-logo.png",
    bankLogoWidth: 180,
    bankLogoHeight: 28,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
  "debit-alfa-4212": {
    id: "debit-alfa-4212",
    accountSuffix: "4212",
    cardLast4: "6332",
    balance: 100500,
    bankLogo: "/bank-accounts/icons/alfa.svg",
    bankLogoWidth: 24,
    bankLogoHeight: 24,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
  "debit-alfa-4212-2": {
    id: "debit-alfa-4212-2",
    accountSuffix: "4212",
    cardLast4: "6332",
    balance: 100500,
    bankLogo: "/bank-accounts/icons/alfa.svg",
    bankLogoWidth: 24,
    bankLogoHeight: 24,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
  "deposit-sber-1521": {
    id: "deposit-sber-1521",
    accountSuffix: "1521",
    balance: 1500,
    bankLogo: "/bank-accounts/icons/sber.svg",
    bankLogoWidth: 180,
    bankLogoHeight: 28,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
  "deposit-alfa-4212": {
    id: "deposit-alfa-4212",
    accountSuffix: "4212",
    balance: 100500,
    bankLogo: "/credit-load/icon-alfa.svg",
    bankLogoWidth: 120,
    bankLogoHeight: 28,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
  "savings-tbank-1521": {
    id: "savings-tbank-1521",
    accountSuffix: "1521",
    balance: 1500,
    bankLogo: "/dashboard/balance/icon-tbank.svg",
    bankLogoWidth: 120,
    bankLogoHeight: 28,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
  "accumulation-alfa-4212": {
    id: "accumulation-alfa-4212",
    accountSuffix: "4212",
    balance: 1000500,
    bankLogo: "/credit-load/icon-alfa.svg",
    bankLogoWidth: 120,
    bankLogoHeight: 28,
    sections: [
      {
        label: "Вчера",
        total: 407088,
        operations: yesterdayOperations,
      },
    ],
  },
};

export const bankAccountDetailIds = Object.keys(bankAccountDetails);
