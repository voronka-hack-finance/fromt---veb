export const goalsScreenData = {
  desktop: {
    assistant: {
      button: "Подробнее",
      description:
        "Получайте советы: куда лучше потратить, что отложить и как снизить финансовые риски.",
      image: "https://www.figma.com/api/mcp/asset/33c0e61e-24d7-42bd-b494-3ecf4f8bbb98",
      title: "Твой ИИ помощник",
    },
    createCard: {
      cta: "Создать",
      image: "https://www.figma.com/api/mcp/asset/a17f2349-e7b2-4bf5-997e-bc7c357a2535",
      title: "Выберите новую цель и отслеживайте свои накопления",
    },
    protection: {
      button: "Защитить",
      description: "Мы компенсируем украденные средства до 300 тыс. рублей",
      image: "https://www.figma.com/api/mcp/asset/c10bf099-2b5b-4a16-b9a0-b3861ddc4bc1",
      title: "Защитите деньги от мошенников",
    },
    searchPlaceholder: "Поиск по категориям",
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
      title: "Отпуск в Банкоке",
      image: "https://www.figma.com/api/mcp/asset/131aa01e-b018-4792-b06c-4b253ea561b7",
      current: 100000,
      target: 250000,
      account: { label: "Счёт", suffix: "1521" },
    },
    {
      id: "car",
      title: "Подушка безопасности",
      image: "https://www.figma.com/api/mcp/asset/d54cbe70-4ed0-4d84-a45f-0a950b203e55",
      current: 50000,
      target: 100000,
      account: { label: "Счёт", suffix: "1521" },
    },
  ],
} as const;
