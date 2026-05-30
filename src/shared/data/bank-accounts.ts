export const bankAccountsScreenData = {
  title: "Банковские счета",
  sections: [
    {
      id: "debit",
      title: "дебетовый счёт",
      accounts: [
        {
          id: "debit-sber-1521",
          bankIcon: "/bank-accounts/icons/sber.svg",
          cardLast4: "8982",
          balance: 1500,
          accountSuffix: "1521",
        },
        {
          id: "debit-alfa-4212",
          bankIcon: "/bank-accounts/icons/alfa.svg",
          cardLast4: "6332",
          balance: 100500,
          accountSuffix: "4212",
        },
        {
          id: "debit-alfa-4212-2",
          bankIcon: "/bank-accounts/icons/alfa.svg",
          cardLast4: "6332",
          balance: 100500,
          accountSuffix: "4212",
        },
      ],
    },
    {
      id: "deposit",
      title: "депозитный счёт",
      accounts: [
        {
          id: "deposit-sber-1521",
          bankIcon: "/bank-accounts/icons/sber.svg",
          balance: 1500,
          accountSuffix: "1521",
        },
        {
          id: "deposit-alfa-4212",
          bankIcon: "/bank-accounts/icons/alfa.svg",
          balance: 100500,
          accountSuffix: "4212",
        },
      ],
    },
    {
      id: "savings",
      title: "сберегательный счёт",
      accounts: [
        {
          id: "savings-tbank-1521",
          bankIcon: "/bank-accounts/icons/tbank.svg",
          balance: 1500,
          accountSuffix: "1521",
        },
      ],
    },
    {
      id: "accumulation",
      title: "накопительный счёт",
      accounts: [
        {
          id: "accumulation-alfa-4212",
          bankIcon: "/bank-accounts/icons/alfa.svg",
          balance: 1000500,
          accountSuffix: "4212",
          compactAmount: true,
        },
      ],
    },
  ],
} as const;
