export const recommendationsAssets = {
  summaryPattern:
    "/recommendations/summary-pattern.svg",
  insightIcon:
    "/recommendations/insight-icon.svg",
  actionUnion:
    "/recommendations/action-union.svg",
  actionArrow:
    "/recommendations/action-arrow.svg",
  agentImages: {
    pillowKeeper:
      "/recommendations/agents/pillow-keeper.png",
    expenseDetective:
      "/recommendations/agents/expense-detective.png",
    growthStrategist:
      "/recommendations/agents/growth-strategist.png",
    balancer:
      "/recommendations/agents/balancer.png",
    habitTrainer:
      "/recommendations/agents/habit-trainer.png",
  },
} as const;

export const recommendationsScreenData = {
  title: "ИИ-Рекомендации",
  tabs: [
    { id: "recommendations", label: "Рекомендации" },
    { id: "chats", label: "Чаты" },
  ] as const,
  summary: {
    agentsCount: 5,
    text: "Агентов анализируют ваши траты",
  },
  chatCta: "Обсудить в чате",
  chatsPlaceholder: "Чаты с агентами скоро появятся здесь",
  agents: [
    {
      id: "pillow-keeper",
      title: "Хранитель подушки",
      subtitle: "Безопасность и накопления",
      imageKey: "pillowKeeper",
      imageVariant: "a",
      insightLead:
        "Ваши подписки обходятся в 2 564 ₽/мес — расходы стабильны и предсказуемы,",
      insightRest:
        "это хорошо. Но финансовая подушка требует пополнения: пауза на одну подписку +5 000 ₽ к резерву за год.",
    },
    {
      id: "expense-detective",
      title: "Детектив расходов",
      subtitle: "Лишние траты и утечки",
      imageKey: "expenseDetective",
      imageVariant: "a",
      insightLead: "FitnessPro — главный подозреваемый: 899 ₽/мес при редком использовании.",
      insightRest:
        "За 8 месяцев утекло 7 192 ₽. На YouTube есть бесплатные программы от топ-тренеров. Потенциальная экономия: 10 788 ₽/год.",
    },
    {
      id: "growth-strategist",
      title: "Стратег роста",
      subtitle: "Рост дохода и возможностей",
      imageKey: "growthStrategist",
      imageVariant: "b",
      insightLead:
        "Bookmate за 299 ₽/мес — лучшая инвестиция в списке: знания прямо",
      insightRest:
        "конвертируются в доход. Перенаправьте PlayPass 499 ₽/мес в онлайн-курс — за год это полноценный навык с реальным ROI.",
    },
    {
      id: "balancer",
      title: "Балансировщик",
      subtitle: "Бюджет без стресса",
      imageKey: "balancer",
      imageVariant: "c",
      insightLead:
        "6 подписок на 2 564 ₽/мес. Комфортный порог — 3% дохода. При зарплате",
      insightRest:
        "от 85 000 ₽ вы в зелёной зоне. Небольшая правка: пересмотрите PlayPass (6 мес, 2 994 ₽) — ощущения от его паузы почти незаметны.",
    },
    {
      id: "habit-trainer",
      title: "Тренер привычек",
      subtitle: "Конкретные действия на 7 дней",
      imageKey: "habitTrainer",
      imageVariant: "d",
      insightLead:
        "3 конкретных действия на эту неделю, которые займут меньше 10 минут: отключить",
      insightRest:
        "автопродление PlayPass, настроить уведомление за 3 дня до списания Netflix, проверить активность FitnessPro за месяц.",
    },
  ] as const,
} as const;
