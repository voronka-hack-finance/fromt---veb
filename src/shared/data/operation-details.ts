export type OperationDetailPastExpense = {
  category: string;
  title: string;
  amount: number;
  icon: "education" | "gym" | "bag";
};

export type OperationDetail = {
  id: string;
  dateTime: string;
  accountLabel: string;
  accountSuffix: string;
  merchant: string;
  category: string;
  mcc: string;
  amount: number;
  direction: "income" | "outcome";
  icon: "education" | "bag" | "bank" | "wifi" | "income";
  taxDeduction?: {
    amount: number;
    pastExpenses: OperationDetailPastExpense[];
  };
  protection: {
    title: string;
    description: string[];
    buttonLabel: string;
  };
  transaction: {
    sbpId: string;
  };
};

export const operationDetails: Record<string, OperationDetail> = {
  education: {
    id: "education",
    dateTime: "06 декабря, 10:56",
    accountLabel: "Операция со счета",
    accountSuffix: "*0920",
    merchant: "ФГБОУ ВО КубГУ",
    category: "Образование",
    mcc: "8220",
    amount: -189600,
    direction: "outcome",
    icon: "education",
    taxDeduction: {
      amount: 24648,
      pastExpenses: [
        {
          category: "Образование",
          title: "ФГБОУ ВО КубГУ",
          amount: 184800,
          icon: "education",
        },
        {
          category: "Спорт и спортивные товары",
          title: "SUPERGYM",
          amount: 261000,
          icon: "gym",
        },
      ],
    },
    protection: {
      title: "Защитите деньги от мошенников",
      description: [
        "Мы защищаем вас от мошенников",
        "и блокируем подозрительные звонки.",
        "Но средства всё же украдут —",
        "вернём до 300 тыс. ₽.",
      ],
      buttonLabel: "Подключить",
    },
    transaction: {
      sbpId: "B3910004600367040000120048932175",
    },
  },
};

export const operationDetailIds = Object.keys(operationDetails);
