export type CreditLoadPaymentIcon = "education" | "yandex" | "vk" | "mts" | "generic";

export type CreditLoadUpcomingPayment = {
  id: string;
  dateLabel: string;
  title: string;
  amount: number;
  icon: CreditLoadPaymentIcon;
  paymentDay: number;
};

export const creditLoadScreenData = {
  title: "Кредитная нагрузка",
  calendar: {
    year: 2026,
    month: 5,
    selectedDay: 1,
    paymentDays: [2, 8, 13, 18],
  },
  upcomingPayments: [
    {
      id: "kubgu",
      dateLabel: "2 июня",
      title: "Оплата за обучение в КубГУ",
      amount: 189600,
      icon: "education",
      paymentDay: 2,
    },
    {
      id: "yandex-plus",
      dateLabel: "8 июня",
      title: "Яндекс.Плюс",
      amount: 299,
      icon: "yandex",
      paymentDay: 8,
    },
    {
      id: "vk-music",
      dateLabel: "13 июня",
      title: "ВК музыка",
      amount: 299,
      icon: "vk",
      paymentDay: 13,
    },
    {
      id: "mts-premium",
      dateLabel: "18 июня",
      title: "МТС премиум",
      amount: 199,
      icon: "mts",
      paymentDay: 18,
    },
  ],
} as const;
