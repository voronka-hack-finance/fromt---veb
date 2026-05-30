export const agentChatIds = [
  "pillow-keeper",
  "expense-detective",
  "growth-strategist",
  "balancer",
  "habit-trainer",
] as const;

export type AgentChatId = (typeof agentChatIds)[number];

export type AgentChatStep = {
  number: number;
  title: string;
  body: string;
};

export type AgentChatMessage =
  | { id: string; type: "date-separator"; label: string }
  | { id: string; type: "steps"; steps: AgentChatStep[]; timestamp: string }
  | { id: string; type: "user"; text: string; timestamp: string }
  | { id: string; type: "bot"; text: string; timestamp: string }
  | { id: string; type: "suggestions"; options: string[] };

export type AgentChatScreenData = {
  agentId: AgentChatId;
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  messages: AgentChatMessage[];
  autoReplies: Record<string, string>;
  defaultReply: string;
};

function createChat(data: Omit<AgentChatScreenData, "agentId"> & { agentId: AgentChatId }) {
  return data;
}

const pillowKeeperChat = createChat({
  agentId: "pillow-keeper",
  title: "Хранитель подушки",
  subtitle: "Безопасность и накопления",
  inputPlaceholder: "Напишите сообщение...",
  autoReplies: {
    "Какие подписки поставить на паузу?":
      "PlayPass и FitnessPro — первые кандидаты: редкое использование при 1 398 ₽/мес. Поставьте их на паузу на месяц и перенаправьте сумму в копилку.",
    "Как настроить автосбережения?":
      "Создайте отдельный счёт «Подушка» и включите автоперевод 5 000 ₽ в день зарплаты. Так резерв растёт без ручного контроля.",
  },
  defaultReply:
    "Понял вас. Главное сейчас — стабилизировать бюджет и начать с маленького резерва. Могу подсказать, какие подписки поставить на паузу.",
  messages: [
    { id: "date-today", type: "date-separator", label: "Сегодня" },
    {
      id: "steps-intro",
      type: "steps",
      timestamp: "10:41",
      steps: [
        {
          number: 1,
          title: "Выйти в ноль",
          body: "Сейчас расходы выше доходов на 103 296 ₽. Первый шаг — снизить расходы на 30 000–40 000 ₽ и вернуть контроль над денежным потоком.",
        },
        {
          number: 2,
          title: "Собрать первый резерв",
          body: "Когда бюджет выйдет в плюс, начни с маленькой суммы — 5 000 ₽. Не нужно сразу копить много. Главное — запустить привычку и создать первый запас.",
        },
        {
          number: 3,
          title: "Выбрать цель роста",
          body: "После стабилизации бюджета выбери одну финансовую цель: подушка, отпуск, обучение, крупная покупка или капитал. Так свободные деньги будут работать на понятный результат, а не просто исчезать из месяца в месяц.",
        },
      ],
    },
    {
      id: "user-cushion-size",
      type: "user",
      text: "Небольшая — примерно на 2–3 месяца",
      timestamp: "10:42",
    },
    {
      id: "bot-fitness-advice",
      type: "bot",
      text: "Хорошая база! По классике нужно 3–6 месяцев расходов. Вот конкретный шаг: переходите на бесплатный план FitnessPro или отмените — сэкономленные 899 ₽ уходят автоматом в копилку. Через год это почти 11 000 ₽ дополнительно к подушке ",
      timestamp: "10:42",
    },
    {
      id: "suggestions",
      type: "suggestions",
      options: [
        "Какие подписки поставить на паузу?",
        "Как настроить автосбережения?",
      ],
    },
  ],
});

const expenseDetectiveChat = createChat({
  agentId: "expense-detective",
  title: "Детектив расходов",
  subtitle: "Лишние траты и утечки",
  inputPlaceholder: "Напишите сообщение...",
  autoReplies: {
    "Что ещё можно сократить?":
      "CloudAI (399 ₽) и MTS Premium (299 ₽) — второй приоритет. Проверьте, пользуетесь ли вы облаком и мобильными бонусами хотя бы раз в неделю.",
    "Есть бесплатные альтернативы?":
      "Да: YouTube для тренировок вместо FitnessPro, VK Музыка (бесплатный тариф) вместо части подписок, Google Drive 15 ГБ вместо CloudAI для документов.",
  },
  defaultReply:
    "Продолжаю расследование. Если пришлёте список подписок — найду следующие «утечки» с максимальной экономией.",
  messages: [
    { id: "date-today", type: "date-separator", label: "Сегодня" },
    {
      id: "bot-intro",
      type: "bot",
      text: "🔍 Расследование завершено. Главный подозреваемый — FitnessPro: 899 ₽/мес, итого утекло 7 192 ₽ за 8 месяцев. Как часто реально открываете это приложение?",
      timestamp: "10:38",
    },
    {
      id: "user-reply",
      type: "user",
      text: "Честно — раза два в месяц, не больше",
      timestamp: "10:39",
    },
    {
      id: "bot-analysis",
      type: "bot",
      text: "Именно то, что я и предполагал. Цена одной «тренировки» выходит 449 ₽ — дороже, чем день в фитнес-клубе! А ещё PlayPass: 499 ₽/мес всего за 6 месяцев — 2 994 ₽. Итого потенциальная утечка: 1 398 ₽/мес или 16 776 ₽ в год",
      timestamp: "10:39",
    },
    {
      id: "suggestions",
      type: "suggestions",
      options: ["Что ещё можно сократить?", "Есть бесплатные альтернативы?"],
    },
  ],
});

const growthStrategistChat = createChat({
  agentId: "growth-strategist",
  title: "Стратег роста",
  subtitle: "Рост дохода и возможностей",
  inputPlaceholder: "Напишите сообщение...",
  autoReplies: {
    "Какие курсы посоветуешь?":
      "Для старта: «Python для анализа данных» на Stepik или «Продуктовый маркетинг» на Яндекс Практикуме. Оба укладываются в 499 ₽/мес, если перераспределить PlayPass.",
    "Как оценить ROI подписки?":
      "Спросите: «Это приближает меня к доходу или навыку за 12 месяцев?» Если нет — ROI отрицательный. Bookmate и курсы обычно проходят этот тест.",
  },
  defaultReply:
    "Хороший вопрос. Давайте оценим подписку через призму роста дохода — что из вашего списка реально инвестиция, а что развлечение.",
  messages: [
    { id: "date-today", type: "date-separator", label: "Сегодня" },
    {
      id: "bot-intro",
      type: "bot",
      text: "Смотрю на ваш портфель подписок через призму роста. Bookmate за 299 ₽/мес — это ваш лучший актив: знания = доход. А PlayPass за 499 ₽/мес с точки зрения роста — сомнительная инвестиция. Что думаете?",
      timestamp: "10:45",
    },
    {
      id: "user-reply",
      type: "user",
      text: "Согласен. Что посоветуешь вместо PlayPass?",
      timestamp: "10:46",
    },
    {
      id: "bot-advice",
      type: "bot",
      text: "Перенаправьте 499 ₽/мес в образование. За год — 5 988 ₽. На платформах вроде Яндекс Практикума или Stepik этого хватит на курс по востребованному навыку. ROI несопоставимо выше игр 🚀 Какая область вам интересна?",
      timestamp: "10:46",
    },
    {
      id: "suggestions",
      type: "suggestions",
      options: ["Какие курсы посоветуешь?", "Как оценить ROI подписки?"],
    },
  ],
});

const balancerChat = createChat({
  agentId: "balancer",
  title: "Балансировщик",
  subtitle: "Бюджет без стресса",
  inputPlaceholder: "Напишите сообщение...",
  autoReplies: {
    "Как поставить на паузу?":
      "FitnessPro → Профиль → Управление подпиской → Приостановить. Большинство сервисов сохраняют историю — можно вернуться без потери данных.",
    "Какой у меня тип расходов?":
      "У вас «комфортный оптимизатор»: подписки в норме, но есть 1–2 эмоциональные траты (FitnessPro). Достаточно мягкой паузы, без жёсткой экономии.",
  },
  defaultReply:
    "Понимаю. Давайте найдём баланс — без резких отмен, но с небольшими шагами, которые не создают стресс.",
  messages: [
    { id: "date-today", type: "date-separator", label: "Сегодня" },
    {
      id: "bot-intro",
      type: "bot",
      text: "Ваш бюджет на подписки — 2 564 ₽/мес. По моей модели, комфортный порог — 3% от ежемесячного дохода. Если зарабатываете 85 000+ ₽ — вы в зелёной зоне без жёсткой экономии. Как вам ощущается текущий уровень?",
      timestamp: "10:50",
    },
    {
      id: "user-reply",
      type: "user",
      text: "Иногда кажется, что FitnessPro лишний, но жалко отказываться",
      timestamp: "10:51",
    },
    {
      id: "bot-advice",
      type: "bot",
      text: "Это нормальное чувство — я называю его «эффект принадлежности». Попробуйте не отменять, а заморозить на 1 месяц. Если не заметите разницы в жизни — это ваш ответ. Потеря ощущения vs. 899 ₽ в кармане ",
      timestamp: "10:51",
    },
    {
      id: "suggestions",
      type: "suggestions",
      options: ["Как поставить на паузу?", "Какой у меня тип расходов?"],
    },
  ],
});

const habitTrainerChat = createChat({
  agentId: "habit-trainer",
  title: "Тренер привычек",
  subtitle: "Конкретные действия на 7 дней",
  inputPlaceholder: "Напишите сообщение...",
  autoReplies: {
    "Сделал шаг 1!":
      "Отлично! 🎯 Завтра — шаг 2: настройте уведомление за 3 дня до списания Netflix. Это займёт 3 минуты в настройках банка или приложения.",
    "Как настроить уведомления?":
      "В приложении банка: Уведомления → Расходы → За 3 дня до списания. Или добавьте напоминание в календарь на 17-е число каждого месяца.",
  },
  defaultReply:
    "Записал! Отмечайте каждый выполненный шаг — так привычка закрепляется быстрее.",
  messages: [
    { id: "date-today", type: "date-separator", label: "Сегодня" },
    {
      id: "bot-intro",
      type: "bot",
      text: "У меня есть 3 конкретных задачи на эту неделю — каждая займёт меньше 5 минут, но даст реальный результат. Готовы начать прямо сейчас? ",
      timestamp: "10:55",
    },
    {
      id: "user-reply",
      type: "user",
      text: "Да, давай!",
      timestamp: "10:55",
    },
    {
      id: "bot-plan",
      type: "bot",
      text: "Отлично! Вот ваш план:\n\nСегодня (2 мин): FitnessPro → Настройки → Отключить автопродление\n\nЗавтра (3 мин): настройте уведомление за 3 дня до списания Netflix (20 числа)\n\nНа этой неделе: откройте PlayPass и проверьте — когда заходили последний раз?\n\nОтметьте, когда выполните первый шаг!",
      timestamp: "10:56",
    },
    {
      id: "suggestions",
      type: "suggestions",
      options: ["Сделал шаг 1!", "Как настроить уведомления?"],
    },
  ],
});

export const agentChatScreens: Record<AgentChatId, AgentChatScreenData> = {
  "pillow-keeper": pillowKeeperChat,
  "expense-detective": expenseDetectiveChat,
  "growth-strategist": growthStrategistChat,
  balancer: balancerChat,
  "habit-trainer": habitTrainerChat,
};

export function resolveAgentIdFromChatId(chatId: string): AgentChatId | null {
  if (chatId.includes("pillow-keeper")) return "pillow-keeper";
  if (chatId.includes("expense-detective")) return "expense-detective";
  if (chatId.includes("growth-strategist")) return "growth-strategist";
  if (chatId.includes("balancer")) return "balancer";
  if (chatId.includes("habit-trainer")) return "habit-trainer";
  return null;
}

export function formatChatTime(date = new Date()) {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createUserMessage(text: string): AgentChatMessage {
  return {
    id: `user-${Date.now()}`,
    type: "user",
    text,
    timestamp: formatChatTime(),
  };
}

export function createBotMessage(text: string): AgentChatMessage {
  return {
    id: `bot-${Date.now()}`,
    type: "bot",
    text,
    timestamp: formatChatTime(),
  };
}

export function resolveBotReply(chat: AgentChatScreenData, userText: string) {
  return chat.autoReplies[userText.trim()] ?? chat.defaultReply;
}
