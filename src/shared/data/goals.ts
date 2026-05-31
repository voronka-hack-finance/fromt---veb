export const goalsScreenData = {
  desktop: {
    assistant: {
      button: "Подробнее",
      description:
        "Получайте советы: куда лучше потратить, что отложить и как снизить финансовые риски.",
      image: "/goals/assistant-card.png",
      title: "Твой ИИ помощник",
    },
    createCard: {
      cta: "Создать",
      image: "/goals/create-card.png",
      title: "Выберите новую цель и отслеживайте свои накопления",
    },
    protection: {
      button: "Защитить",
      description: "Мы компенсируем украденные средства до 300 тыс. рублей",
      image: "/goals/protection-card.png",
      title: "Защитите деньги от мошенников",
    },
    searchPlaceholder: "Поиск по целям",
    title: "Ваши цели",
  },
  notifications: 9,
  title: "Мои цели",
  createCard: {
    title: "Создай цель накопления",
    description: "Создай новую цель и отслеживайте\n свои накопления",
    cta: "Создать цель",
    illustration: "/goals/create-illustration.png",
  },
  avatar: "/goals/avatar.png",
  goals: [
    {
      id: "bali",
      title: "Отпуск на бали",
      image: "/goals/bali-goal.png",
      current: 25000,
      target: 400000,
      account: {
        bankIcon: "/dashboard/balance/icon-sber.svg",
        label: "Счёт",
        suffix: "1521",
      },
    },
    {
      id: "car",
      title: "Подушка безопасности",
      image: "/goals/safety-cushion-goal.png",
      current: 50000,
      target: 100000,
      account: {
        bankIcon: "/dashboard/balance/icon-sber.svg",
        label: "Счёт",
        suffix: "1521",
      },
    },
  ],
} as const;
