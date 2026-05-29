export const goalsScreenData = {
  notifications: 9,
  title: "Мои Цели",
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
      image: "/goals/goal-bali.jpg",
      current: 25000,
      target: 400000,
      account: { label: "Счет", suffix: "1521" },
    },
    {
      id: "car",
      title: "Покупка машины",
      image: "/goals/goal-car.jpg",
      current: 1000,
      target: 1500000,
      account: { label: "Счет", suffix: "1521" },
    },
  ],
} as const;
