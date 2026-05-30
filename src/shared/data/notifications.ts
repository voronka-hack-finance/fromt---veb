export type NotificationIconKey = "wallet" | "star" | "question" | "trend" | "subscription";

export type NotificationItem = {
  id: string;
  icon: NotificationIconKey;
  unread?: boolean;
  title: string;
  body: string;
  time: string;
};

export type NotificationSection = {
  id: string;
  title: string;
  items: NotificationItem[];
};

export type NotificationsScreenData = {
  title: string;
  sections: NotificationSection[];
};

export const notificationsScreenData: NotificationsScreenData = {
  title: "Уведомления",
  sections: [
    {
      id: "today",
      title: "Сегодня",
      items: [
        {
          id: "limit-marketplaces",
          icon: "wallet",
          unread: true,
          title: "Почти достигнут лимит",
          body: "Вы приближаетесь к личному лимиту на категорию «Маркетплейсы». Осталось 1 070 ₽.",
          time: "19:10",
        },
        {
          id: "flight-suggestion",
          icon: "star",
          unread: true,
          title: "Подбор авиабилетов",
          body: "Вы чаще покупаете билеты в конце месяца — хотите, напомню о лучших датах заранее?",
          time: "16:55",
        },
        {
          id: "unusual-purchase",
          icon: "question",
          title: "Необычная покупка",
          body: "Эта трата не похожа на ваши обычные. Посмотреть, к какой категории её отнести?",
          time: "19:10",
        },
      ],
    },
    {
      id: "yesterday",
      title: "Вчера",
      items: [
        {
          id: "delivery-trend",
          icon: "trend",
          title: "Новый тренд",
          body: "Доставка стала дороже. Расходы на доставки выросли на 15% за две недели.",
          time: "19:10",
        },
        {
          id: "subscription-detected",
          icon: "subscription",
          title: "Обнаружена подписка",
          body: "Новое регулярное списание. Проверим, нужна ли она?",
          time: "16:55",
        },
      ],
    },
  ],
};
