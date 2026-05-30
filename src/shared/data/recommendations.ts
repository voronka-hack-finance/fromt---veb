export const recommendationsAssets = {
  summaryPattern:
    "https://www.figma.com/api/mcp/asset/0c9ba5c7-0c85-4acd-a56c-b5e70b794bf2",
  insightIcon:
    "https://www.figma.com/api/mcp/asset/d42b0f69-e8c0-4603-b672-edaee2d3341b",
  actionUnion:
    "https://www.figma.com/api/mcp/asset/eb9085e0-42ee-4e49-bb62-b5c57bee9191",
  actionArrow:
    "https://www.figma.com/api/mcp/asset/c8525ce0-f625-440b-bdae-1b58f2a8a923",
  agentImages: {
    pillowKeeper:
      "https://www.figma.com/api/mcp/asset/d2e1cfc3-765d-4000-9d00-eefaca89f377",
    expenseDetective:
      "https://www.figma.com/api/mcp/asset/52597a7c-7cd8-4e4e-a07a-bc5335e6435d",
    growthStrategist:
      "https://www.figma.com/api/mcp/asset/1a38b65f-9939-40b0-97ef-ab5344f922eb",
    balancer:
      "https://www.figma.com/api/mcp/asset/13479beb-ecfa-4794-829a-a846050b0c27",
    habitTrainer:
      "https://www.figma.com/api/mcp/asset/62fe70a6-aee7-494e-a6a3-aa1f8dd9bc90",
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
