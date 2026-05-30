const sharedMonths = ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль"] as const;

function buildTrend(values: number[]) {
  return sharedMonths.map((month, index) => ({
    month,
    value: values[index] ?? values.at(-1) ?? 0,
  }));
}

export const totalBalanceScreenData = {
  title: "Всего средств",
  defaultFilterId: "reserve",
  defaultChartIndex: 4,
  filters: [
    {
      id: "all",
      label: "Все",
      amount: 18_753.85,
      subtitle: "Без кредитки",
      trend: buildTrend([8600, 15400, 10900, 12900, 9400, 17800, 16400]),
    },
    {
      id: "primary",
      label: "21 000 ₽",
      amount: 21_000,
      subtitle: "Основной счёт",
      trend: buildTrend([10200, 18200, 12800, 15200, 11100, 21000, 19300]),
    },
    {
      id: "reserve",
      label: "5 521 ₽",
      amount: 5_521,
      subtitle: "Накопительный счёт",
      trend: buildTrend([2400, 4300, 3100, 3600, 2700, 5100, 4700]),
    },
    {
      id: "backup",
      label: "2 521 ₽",
      amount: 2_521,
      subtitle: "Резервный счёт",
      trend: buildTrend([1100, 2000, 1400, 1700, 1200, 2400, 2200]),
    },
  ],
  reserveCard: {
    badge: "Неплохо",
  },
  scenarios: [
    {
      id: "soft",
      tone: "muted",
      tag: "Хорошо",
      months: 2,
      avgSpend: 10_230,
      allAccounts: 60_230,
    },
    {
      id: "focus",
      tone: "default",
      tag: "Хорошо",
      months: 2,
      avgSpend: 10_230,
      allAccounts: 60_230,
    },
    {
      id: "great",
      tone: "green",
      tag: "Отлично",
      months: 4,
      avgSpend: 10_230,
      allAccounts: 60_230,
    },
  ] as const,
  desktop: {
    title: "Ваши счета и банки",
    addBank: {
      button: "Добавить",
      image: "/total/add-bank.png",
      title: "Добавь еще банков, чтобы отслеживать свое финансовое состояние",
    },
    assistant: {
      button: "Подробнее",
      description:
        "Получайте советы: куда лучше потратить, что отложить и как снизить финансовые риски.",
      image: "/total/assistant-card.png",
      title: "Твой ИИ помощник",
    },
    banks: [
      {
        accountBadges: ["Счет • 1521", "Счет • 1221", "Счет • 2421"],
        amount: 134_567,
        bank: "Сбербанк",
        id: "sber",
        tone: "green",
      },
      {
        accountBadges: ["Счет • 0418", "Счет • 0578"],
        amount: 196_957,
        bank: "Т-Банк",
        id: "tbank",
        tone: "yellow",
      },
      {
        accountBadges: ["Счет • 5421", "Счет • 1241"],
        amount: 134_567,
        bank: "АльфаБанк",
        id: "alfa",
        tone: "red",
      },
      {
        accountBadges: ["Счет • 1671"],
        amount: 134_567,
        bank: "ВТБ",
        id: "vtb",
        tone: "blue",
      },
      {
        accountBadges: ["Счет • 8812", "Счет • 8820"],
        amount: 89_320,
        bank: "Газпромбанк",
        id: "gpb",
        tone: "blue",
      },
      {
        accountBadges: ["Счет • 3310"],
        amount: 45_120,
        bank: "Райффайзен",
        id: "raif",
        tone: "green",
      },
    ] as const,
    protection: {
      button: "Защитить",
      description: "Мы компенсируем украденные средства до 300 тыс. рублей",
      image: "/shared/protection-card.png",
      title: "Защитите деньги от мошенников",
    },
    topBanks: [
      { amount: 158_945, badge: "S", name: "Сбербанк", tone: "green" },
      { amount: 128_945, badge: "ВТБ", name: "ВТБ", tone: "blue" },
      { amount: 58_445, badge: "T", name: "Т-Банк", tone: "yellow" },
      { amount: 38_945, badge: "A", name: "Альфа Банк", tone: "red" },
    ] as const,
  },
};

export type TotalBalanceFilter = (typeof totalBalanceScreenData.filters)[number];
