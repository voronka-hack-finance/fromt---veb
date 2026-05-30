export type AddBankAccountOption = {
  id: string;
  logo: string;
  name?: string;
  nameImage?: string;
  searchTerms: string[];
};

export const addBankAccountScreenData = {
  title: "Новый счёт",
  searchPlaceholder: "Поиск по банкам",
  bankLabel: "Название банка",
  cta: {
    prefix: "Не нашли ",
    highlight: "нужный банк?",
    suffix: " Оставьте заявку и мы добавим его!",
    button: "Оставить заявку",
    image: "/bank-accounts/add/cta-plush.png",
  },
  banks: [
    {
      id: "gazprombank",
      logo: "/bank-accounts/add/gazprombank.svg",
      nameImage: "/bank-accounts/add/gazprombank-name.svg",
      searchTerms: ["газпром", "газпромбанк", "gazprom"],
    },
    {
      id: "rshb",
      logo: "/bank-accounts/add/rshb.svg",
      nameImage: "/bank-accounts/add/rshb-name.svg",
      searchTerms: ["рсхб", "россельхоз", "rshb"],
    },
    {
      id: "ozon",
      logo: "/bank-accounts/add/ozon.svg",
      name: "ОзонБанк",
      searchTerms: ["озон", "ozon"],
    },
    {
      id: "yandex",
      logo: "/bank-accounts/add/yandex.svg",
      name: "Яндекс Банк",
      searchTerms: ["яндекс", "yandex"],
    },
    {
      id: "sovcombank",
      logo: "/bank-accounts/add/sovcombank.svg",
      nameImage: "/bank-accounts/add/sovcombank-name.svg",
      searchTerms: ["совком", "совкомбанк", "sovcom"],
    },
  ] satisfies AddBankAccountOption[],
} as const;
